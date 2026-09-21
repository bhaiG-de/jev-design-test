import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { TypeSafeClient, choice, type ChoiceQuestion } from "@typesafe-ai/sdk"
import { PAGES, getPage } from "./src/lib/pages.ts"

// One Jev round trip per request. Every question is independent and sees
// the same state, so the page-type routing question and every page type's
// slot questions all go in a single batched call (speculative fan-out);
// code then keeps only the chosen page type's answers. No generative model
// anywhere: content is fixed placeholder copy in the page components, and
// Jev only picks layouts from the vocabulary in src/lib/pages.ts.
//
// Runs server-side so TYPESAFE_API_KEY never reaches the browser bundle
// (the SDK requires dangerouslyAllowBrowser to even try that).
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

          const client = new TypeSafeClient()
          const result = await client.systemOne({ state: { query }, questions })

          const page = getPage(result.answers.page.choice)
          if (!page) throw new Error(`Unknown page id: ${result.answers.page.choice}`)

          const distributions = Object.fromEntries(
            Object.keys(page.slots).map((slotId) => [
              slotId,
              result.answers[`${page.id}.${slotId}`].probabilities,
            ]),
          )

          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ pageId: page.id, label: page.label, distributions }))
        } catch (err) {
          res.statusCode = 500
          res.end(err instanceof Error ? err.message : "Unknown error")
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  process.env.TYPESAFE_API_KEY ??= env.TYPESAFE_API_KEY

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
