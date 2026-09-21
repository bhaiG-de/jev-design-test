import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    description: "For side projects and getting started.",
    features: ["Up to 3 projects", "Community support", "1 GB storage"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    monthly: 29,
    annual: 23,
    description: "For growing teams that ship every day.",
    features: [
      "Unlimited projects",
      "Priority support",
      "50 GB storage",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: 99,
    annual: 79,
    description: "For organizations with advanced needs.",
    features: [
      "Everything In Pro",
      "Dedicated support",
      "Unlimited storage",
      "SSO and audit logs",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

type Billing = "monthly" | "annual"

export default function PricingBlock() {
  const [billing, setBilling] = React.useState<Billing>("monthly")

  return (
    <section className="flex w-full items-center justify-center bg-background py-16 text-foreground">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Pricing that scales with you
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start for free, then pick a plan when you&apos;re ready to grow.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted p-1"
          >
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
              className={cn(
                "px-4 py-1.5 text-sm font-medium transition-colors",
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
                "flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors",
                billing === "annual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <Badge className="px-1.5 text-[10px] font-semibold">-20%</Badge>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(tier.featured && "bg-muted ring-2 ring-primary")}
            >
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {tier.name}
                </CardTitle>
                {tier.featured && (
                  <CardAction>
                    <Badge>Most Popular</Badge>
                  </CardAction>
                )}
                <CardDescription className="text-sm sm:min-h-10">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-6">
                <p className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    ${billing === "annual" ? tier.annual : tier.monthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/Month</span>
                </p>
                <ul className="flex flex-1 flex-col gap-3 text-sm text-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  nativeButton={false}
                  variant={tier.featured ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                  render={<a href="#" />}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
