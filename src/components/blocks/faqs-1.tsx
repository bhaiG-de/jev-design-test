import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "What is included in each plan?",
    a: "Every plan includes the core platform, unlimited projects, and access to the component library. Higher tiers add advanced analytics, priority support, and SSO.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. You can upgrade or downgrade at any time from your billing settings, and changes are prorated automatically.",
  },
  {
    q: "Do you offer a free trial?",
    a: "All paid plans come with a 14-day free trial. No credit card is required to get started.",
  },
  {
    q: "How does billing work?",
    a: "We bill monthly or annually, and annual plans save you two months. You can cancel anytime with no hidden fees.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted in transit and at rest, and we run regular third-party security audits to keep it safe.",
  },
]

export default function FaqsBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Answers to the questions we hear most often.
          </p>
        </div>

        <Accordion defaultValue={[faqs[0].q]} className="mt-10">
          {faqs.map(({ q, a }) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="py-4 text-base font-medium">
                {q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
