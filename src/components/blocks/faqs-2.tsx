import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "How do I invite teammates to my workspace?",
    a: "Open Settings, navigate to the Members tab, and enter your teammate's email address. They will receive an invitation link valid for 72 hours. You can resend or revoke invitations at any time.",
  },
  {
    q: "Which authentication methods are supported?",
    a: "Acme supports email and password, magic-link sign-in, Google OAuth, and SAML SSO for enterprise plans. Two-factor authentication is available on all tiers.",
  },
  {
    q: "Can I export my data at any time?",
    a: "Yes. From your account settings you can request a full JSON export of all your projects, assets, and activity logs. Exports are processed within minutes and delivered to your registered email.",
  },
  {
    q: "What happens when I reach my storage limit?",
    a: "You will receive email alerts at 80% and 95% usage. Once the limit is reached, uploads are paused until you upgrade your plan or remove existing files.",
  },
  {
    q: "Is there a sandbox environment for testing?",
    a: "Every workspace includes a Sandbox environment that mirrors production but never affects live data. API calls made in Sandbox are free and excluded from your usage quota.",
  },
  {
    q: "How are API rate limits enforced?",
    a: "Requests are metered per minute and per day at the workspace level. Exceeding either threshold returns a 429 response with a Retry-After header indicating when capacity resets.",
  },
  {
    q: "Do you offer SLA guarantees?",
    a: "Business and Enterprise plans include a 99.9% monthly uptime SLA backed by financial credits. Our status page at status.acme.io provides real-time incident updates.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach our team through the in-app chat, by emailing support@acme.io, or by opening a ticket in your dashboard. Enterprise customers also have access to a dedicated Slack channel.",
  },
]

const half = Math.ceil(faqs.length / 2)
const columns = [faqs.slice(0, half), faqs.slice(half)]

export default function FaqsBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="container">
        <div className="flex flex-col gap-2 border-b border-border pb-8">
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            FAQ
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Common questions, straight answers
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-12 pt-2 md:grid-cols-2">
          {columns.map((column, columnIndex) => (
            <Accordion
              key={columnIndex}
              defaultValue={columnIndex === 0 ? [column[0].q] : []}
            >
              {column.map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="py-5 text-base font-semibold">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}
