import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { TypeSafeClient, choice, type ChoiceQuestion } from "@typesafe-ai/sdk"
import { createGateway, experimental_evaluate as evaluate } from "ai"
import { PAGES, getPage } from "./src/lib/pages.ts"
import { PRODUCT_BRIEF } from "./src/lib/product-brief.ts"

// One Jev round trip per request. Every question is independent and sees
// the same state, so the page-type routing question and every page type's
// slot questions all go in a single batched call (speculative fan-out);
// code then keeps only the chosen page type's answers. No generative model
// anywhere: content is fixed placeholder copy in the page components, and
// Jev only picks layouts from the vocabulary in src/lib/pages.ts.
//
// Runs server-side so the API key never reaches the browser bundle.
// Auth is this repo's .env only — never vercel ai-gateway setup (that
// rewrites Claude / Cursor / Grok configs globally).
//
// Hardcoded: the only model this app ever calls is typesafe-ai/jev.
const JEV_MODEL = "typesafe-ai/jev"

type Answer = { choice: string; probabilities: Record<string, number> }

function asChoiceQuestions(questions: Record<string, ChoiceQuestion>) {
  return Object.fromEntries(
    Object.entries(questions).map(([id, q]) => [
      id,
      {
        type: "choice" as const,
        instructions: q.instructions as string,
        criteria: q.criteria as Record<string, string>,
      },
    ]),
  )
}

function withProbabilities(
  id: string,
  answer: { choice?: string; probabilities?: Record<string, number> },
  criteria: Record<string, string>,
): Answer {
  const chosen = answer.choice
  if (!chosen) throw new Error(`Jev returned no choice for ${id}`)
  return {
    choice: chosen,
    probabilities:
      answer.probabilities ??
      Object.fromEntries(Object.keys(criteria).map((k) => [k, k === chosen ? 1 : 0])),
  }
}

function isGatewayKey(key: string | undefined) {
  return !!key?.startsWith("vck_")
}

function gatewayErrorMessage(err: unknown) {
  if (!(err instanceof Error)) return "Unknown error"
  const nested =
    err.cause instanceof Error
      ? err.cause.message
      : typeof err.cause === "string"
        ? err.cause
        : ""
  const text = `${err.message}\n${nested}`
  if (text.includes("customer_verification_required") || text.includes("credit card")) {
    return "AI Gateway needs a credit card on the Vercel team before it will serve Jev. Add one at https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card then retry."
  }
  return err.message
}

async function askJevViaGateway(
  apiKey: string,
  state: { query: string },
  questions: Record<string, ChoiceQuestion>,
): Promise<Record<string, Answer>> {
  const payload = asChoiceQuestions(questions)
  const { answers, response } = await evaluate({
    model: createGateway({ apiKey }).evaluationModel(JEV_MODEL),
    state,
    questions: payload,
  })

  if (response.modelId !== JEV_MODEL) {
    throw new Error(`Expected ${JEV_MODEL}, gateway served ${response.modelId}`)
  }

  return Object.fromEntries(
    Object.entries(answers).map(([id, answer]) => [
      id,
      withProbabilities(id, answer as Answer, payload[id].criteria),
    ]),
  )
}

async function ask(
  state: { query: string },
  questions: Record<string, ChoiceQuestion>,
): Promise<Record<string, Answer>> {
  const gatewayKey = process.env.AI_GATEWAY_API_KEY
  const typesafeKey = process.env.TYPESAFE_API_KEY

  // A vck_ key is Vercel AI Gateway. Sending it to api.typesafe.ai 401s.
  if (isGatewayKey(gatewayKey) || isGatewayKey(typesafeKey)) {
    return askJevViaGateway((isGatewayKey(gatewayKey) ? gatewayKey : typesafeKey)!, state, questions)
  }

  if (typesafeKey) {
    const client = new TypeSafeClient({ apiKey: typesafeKey })
    const { answers } = await client.systemOne({ state, questions })
    return answers as Record<string, Answer>
  }

  throw new Error(
    "Set AI_GATEWAY_API_KEY in this repo's .env. Do not run `npx vercel ai-gateway setup` — that rewrites agent configs.",
  )
}

function jevApi(): Plugin {
  return {
    name: "jev-generate-page",
    configureServer(server) {
      server.middlewares.use("/api/generate-page", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405
          res.end("Method not allowed")
          return
        }
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const { query } = JSON.parse(Buffer.concat(chunks).toString("utf-8"))

          const questions: Record<string, ChoiceQuestion> = {
            page: choice(
              "Which kind of page is this request asking for?",
              Object.fromEntries(PAGES.map((p) => [p.id, p.routingDescription])),
            ),
            ...Object.fromEntries(
              PAGES.flatMap((p) =>
                Object.entries(p.slots).map(([slotId, slot]) => [
                  `${p.id}.${slotId}`,
                  choice(slot.instructions, slot.criteria),
                ]),
              ),
            ),
          }

          const answers = await ask({ query, ...PRODUCT_BRIEF }, questions)

          const page = getPage(answers.page.choice)
          if (!page) throw new Error(`Unknown page id: ${answers.page.choice}`)

          const distributions = Object.fromEntries(
            Object.keys(page.slots).map((slotId) => [
              slotId,
              answers[`${page.id}.${slotId}`].probabilities,
            ]),
          )

          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ pageId: page.id, label: page.label, distributions }))
        } catch (err) {
          const status =
            err && typeof err === "object" && "statusCode" in err && typeof err.statusCode === "number"
              ? err.statusCode
              : 500
          res.statusCode = status >= 400 && status < 600 ? status : 500
          res.end(gatewayErrorMessage(err))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  // .env wins. Leftover shell vars from `vercel ai-gateway setup` must not
  // send a vck_ key to TypeSafe (that 401s as "Cannot authenticate").
  if (env.AI_GATEWAY_API_KEY) process.env.AI_GATEWAY_API_KEY = env.AI_GATEWAY_API_KEY
  if (env.TYPESAFE_API_KEY) process.env.TYPESAFE_API_KEY = env.TYPESAFE_API_KEY
  else delete process.env.TYPESAFE_API_KEY

  return {
    plugins: [react(), tailwindcss(), jevApi()],
    server: {
      // .claude/launch.json opens the preview at this exact port; leaving it
      // unset relied on 5173 being busy elsewhere to auto-increment here,
      // which silently broke as soon as it wasn't.
      port: 5174,
      strictPort: true,
      // pravatar.cc sends no CORS headers, which blanks avatars in frame
      // snapshots (DOM → bitmap). Same-origin via proxy fixes that.
      proxy: { "/pravatar": { target: "https://i.pravatar.cc", changeOrigin: true, rewrite: (p) => p.replace(/^\/pravatar/, "") } },
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  }
})
