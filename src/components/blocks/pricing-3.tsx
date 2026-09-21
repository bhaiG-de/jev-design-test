import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ShieldCheck, Check, ArrowRight } from "lucide-react"

const PLAN = {
  name: "Acme Pro",
  tagline: "Everything you need to ship faster.",
  monthly: 49,
  annual: 39,
  period: "Per Seat / Month",
  trialNote: "14-day free trial, no credit card required.",
  features: [
    "Unlimited projects and workspaces",
    "Up to 25 team members",
    "100 GB asset storage",
    "Priority support with 4-hour SLA",
    "Advanced analytics and reports",
    "Custom domain and branding",
    "SSO and role-based access control",
    "Audit logs and compliance exports",
  ],
  cta: "Start Free Trial",
}

type Billing = "monthly" | "annual"

export default function PricingBlock() {
  const [billing, setBilling] = React.useState<Billing>("monthly")
  const price = billing === "annual" ? PLAN.annual : PLAN.monthly

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="size-3" aria-hidden="true" />
            One plan. Full access.
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-sm text-muted-foreground">
            No tiers, no surprises. One plan that gives your whole team
            everything.
          </p>
        </div>

        <Card className="w-full ring-primary">
          <CardHeader className="gap-4 pb-0">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-semibold">
                {PLAN.name}
              </CardTitle>
              <CardDescription>{PLAN.tagline}</CardDescription>
            </div>

            <div
              role="group"
              aria-label="Billing period"
              className="flex w-full items-center gap-1 rounded-lg border border-border bg-muted p-1"
            >
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className={cn(
                  "flex-1 px-3 py-1.5 text-sm font-medium transition-colors",
                  billing === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                aria-pressed={billing === "annual"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors",
                  billing === "annual"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annual
                <Badge className="px-1.5 text-[10px] font-semibold">-20%</Badge>
              </button>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                ${price}
              </span>
              <span className="text-sm text-muted-foreground">
                {PLAN.period}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 pt-4">
            <Separator />

            <ul className="flex flex-col gap-3">
              {PLAN.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t bg-muted/30">
            <Button
              nativeButton={false}
              size="lg"
              className="w-full"
              render={<a href="#" />}
            >
              {PLAN.cta}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {PLAN.trialNote}
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Trusted by <span className="font-medium text-foreground">2,400+</span>{" "}
          teams worldwide. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
