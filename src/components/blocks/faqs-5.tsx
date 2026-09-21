"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { HelpCircle, CreditCard, ShieldCheck, Search, X } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

/** An icon held in data and rendered later, e.g. `<item.icon className="size-4" />`. */
type IconRenderer = (props: IconProps) => React.ReactNode

type Faq = {
  q: string
  a: string
}

type FaqCategory = {
  id: string
  label: string
  icon: IconRenderer
  items: Faq[]
}

const categories: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    icon: (p: IconProps) => (
      <HelpCircle {...p} />
    ),
    items: [
      {
        q: "How do I get started with Acme?",
        a: "Create a free account, set up your first workspace, and follow the onboarding checklist. Most teams are up and running in under five minutes.",
      },
      {
        q: "Can I use Acme across multiple projects?",
        a: "Yes. Every account supports unlimited projects, organised into separate workspaces with per-workspace access controls.",
      },
      {
        q: "Do you offer a free plan?",
        a: "Acme is free for up to three members. You can upgrade at any time as your team grows, with no migration required.",
      },
      {
        q: "Which integrations are available?",
        a: "Acme connects with Slack, GitHub, Linear, and over 40 other tools. You can also build custom workflows with our public API and webhooks.",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: (p: IconProps) => (
      <CreditCard {...p} />
    ),
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, plus ACH bank transfers for annual plans. Invoiced billing is available for Enterprise customers.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Cancel any time from Billing in your account settings. Your plan stays active until the end of the current period and will not renew.",
      },
      {
        q: "Can I get a refund?",
        a: "Annual plans include a 30-day money-back guarantee. Reach out to support within 30 days of purchase for a full, no-questions-asked refund.",
      },
      {
        q: "Do you offer discounts for non-profits?",
        a: "We provide a 40% discount for verified non-profits. Send us your registration documents and our team will apply the credit to your account.",
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: (p: IconProps) => (
      <ShieldCheck {...p} />
    ),
    items: [
      {
        q: "How is my data protected?",
        a: "All data is encrypted in transit with TLS 1.3 and at rest with AES-256. We run continuous monitoring and undergo regular third-party audits.",
      },
      {
        q: "Are you SOC 2 compliant?",
        a: "Yes. Acme maintains SOC 2 Type II certification and is GDPR compliant. You can request our latest reports from the Trust Center.",
      },
      {
        q: "Do you support single sign-on?",
        a: "SAML and OIDC single sign-on are available on Business and Enterprise plans, alongside SCIM provisioning for automated user management.",
      },
      {
        q: "Is my data portable?",
        a: "Absolutely. Export all of your data as JSON or CSV from Settings at any time, with no restrictions and no exit fees.",
      },
    ],
  },
]

export default function FaqsBlock() {
  const [query, setQuery] = useState("")
  const normalized = query.trim().toLowerCase()

  const filterItems = (items: Faq[]) =>
    normalized.length === 0
      ? items
      : items.filter(
          ({ q, a }) =>
            q.toLowerCase().includes(normalized) ||
            a.toLowerCase().includes(normalized)
        )

  return (
    <section className="flex w-full items-start justify-center bg-muted/30 px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Help center
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How can we help?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Search across every topic or browse by category to find answers
            about Acme.
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            aria-label="Search frequently asked questions"
            className="pl-9 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-1">
            {categories.map(({ id, label, icon: Icon, items }) => {
              const count = filterItems(items).length
              return (
                <TabsTrigger key={id} value={id} className="gap-1.5">
                  <Icon data-icon="inline-start" className="size-4" />
                  {label}
                  <span
                    className={cn(
                      "ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums",
                      count === 0
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {count}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {categories.map(({ id, items }) => {
            const filtered = filterItems(items)
            return (
              <TabsContent key={id} value={id} className="mt-4">
                {filtered.length > 0 ? (
                  <Accordion
                    key={filtered[0].q}
                    defaultValue={[filtered[0].q]}
                    className="rounded-lg border border-border bg-card px-4"
                  >
                    {filtered.map(({ q, a }) => (
                      <AccordionItem key={q} value={q}>
                        <AccordionTrigger className="py-4 text-sm font-medium">
                          {q}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                          {a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Empty className="rounded-lg border border-dashed border-border bg-card py-12">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search className="size-5" />
                      </EmptyMedia>
                      <EmptyTitle>No matching questions</EmptyTitle>
                      <EmptyDescription>
                        Nothing in this category matches &ldquo;{query}&rdquo;.
                        Try a different search term.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
