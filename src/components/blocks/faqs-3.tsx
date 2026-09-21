import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Mail, ArrowRight } from "lucide-react"

const faqs = [
  {
    q: "How do I get started with Acme?",
    a: "Sign up for a free account, create your first workspace, and follow the onboarding checklist. You will be up and running in under five minutes.",
  },
  {
    q: "Can I use Acme for multiple projects?",
    a: "Yes. Every account supports unlimited projects. You can organise them into separate workspaces and control access permissions per workspace.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards as well as ACH bank transfers for annual plans. Invoiced billing is available for Enterprise customers.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel at any time from Billing in your account settings. Your plan remains active until the end of the current billing period and will not renew.",
  },
  {
    q: "Is my data portable?",
    a: "Absolutely. You can export all your data as JSON or CSV from the Settings page at any time, with no restrictions or exit fees.",
  },
  {
    q: "Do you offer discounts for non-profits?",
    a: "We offer a 40% discount for verified non-profit organisations. Reach out to our team with your registration documents to apply.",
  },
]

export default function FaqsBlock() {
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOpen(false)
    toast.success("Message sent", {
      description: "Our support team typically replies within a few hours.",
    })
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <Toaster />
      <div className="container">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                FAQ
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Questions &amp; answers
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Browse the most common questions about Acme below. If you do not
                find what you are looking for, our support team is always happy
                to help.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-background">
                  <Mail className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    Still have questions?
                  </span>
                  <span className="text-xs text-muted-foreground">
                    We typically reply within a few hours.
                  </span>
                </div>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  render={<Button className="w-full justify-between" />}
                >
                  Contact Support
                  <ArrowRight data-icon="inline-end" />
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Contact support</DialogTitle>
                      <DialogDescription>
                        Tell us what is going on and we will get back to you,
                        usually within a few hours.
                      </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="my-4 gap-4">
                      <Field>
                        <FieldLabel htmlFor="support-email">Email</FieldLabel>
                        <Input
                          id="support-email"
                          type="email"
                          required
                          placeholder="jane@company.com"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="support-message">
                          How can we help?
                        </FieldLabel>
                        <Textarea
                          id="support-message"
                          required
                          rows={4}
                          className="min-h-24 resize-none"
                          placeholder="Describe your question or issue…"
                        />
                      </Field>
                    </FieldGroup>

                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <Button type="submit">Send Message</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Accordion defaultValue={[faqs[0].q]}>
            {faqs.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="py-3.5 text-sm font-medium">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-3.5 text-sm text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
