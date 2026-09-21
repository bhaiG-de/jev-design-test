import { Fragment } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, Minus } from "lucide-react"

type Cell = boolean | string

const plans = [
  { name: "Starter", price: "$0", note: "Free forever" },
  { name: "Pro", price: "$29", note: "Per month", featured: true },
  { name: "Enterprise", price: "Custom", note: "Contact us" },
]

const groups: { label: string; rows: { feature: string; values: Cell[] }[] }[] =
  [
    {
      label: "Usage",
      rows: [
        { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
        { feature: "Team members", values: ["1", "10", "Unlimited"] },
        { feature: "Storage", values: ["5 GB", "100 GB", "1 TB+"] },
      ],
    },
    {
      label: "Features",
      rows: [
        { feature: "Custom domains", values: [false, true, true] },
        { feature: "Advanced analytics", values: [false, true, true] },
        { feature: "Audit log", values: [false, false, true] },
        { feature: "SAML single sign-on", values: [false, false, true] },
      ],
    },
    {
      label: "Support",
      rows: [
        { feature: "Community", values: [true, true, true] },
        { feature: "Priority email", values: [false, true, true] },
        { feature: "Dedicated manager", values: [false, false, true] },
      ],
    },
  ]

function ValueCell({ value }: { value: Cell }) {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground tabular-nums">{value}</span>
  }
  return value ? (
    <Check className="mx-auto size-4 text-primary" aria-label="Included" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground/40" aria-label="Not included" />
  )
}

export default function PricingBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background py-20 text-foreground">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-md border border-border px-3 py-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Pricing
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Compare every plan
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Everything in one table, so you can pick the plan that fits without
            guessing.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[38%] align-bottom">
                  <span className="inline-block pb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Features
                  </span>
                </TableHead>
                {plans.map((plan) => (
                  <TableHead
                    key={plan.name}
                    className={
                      plan.featured ? "bg-muted/40 text-center" : "text-center"
                    }
                  >
                    <div className="flex flex-col items-center gap-1 py-3">
                      {plan.featured && (
                        <Badge className="mb-1">Most popular</Badge>
                      )}
                      <span className="text-sm font-semibold text-foreground">
                        {plan.name}
                      </span>
                      <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {plan.note}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <Fragment key={group.label}>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell
                      colSpan={4}
                      className="py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                    >
                      {group.label}
                    </TableCell>
                  </TableRow>
                  {group.rows.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="text-sm text-foreground">
                        {row.feature}
                      </TableCell>
                      {row.values.map((value, index) => (
                        <TableCell
                          key={index}
                          className={
                            plans[index].featured
                              ? "bg-muted/40 text-center"
                              : "text-center"
                          }
                        >
                          <ValueCell value={value} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </Fragment>
              ))}
              <TableRow className="hover:bg-transparent">
                <TableCell />
                {plans.map((plan) => (
                  <TableCell
                    key={plan.name}
                    className={
                      plan.featured
                        ? "bg-muted/40 py-4 text-center"
                        : "py-4 text-center"
                    }
                  >
                    <Button
                      render={<a href="#" />}
                      nativeButton={false}
                      variant={plan.featured ? "default" : "outline"}
                      size="sm"
                      className="w-full max-w-[10rem]"
                    >
                      {plan.price === "Custom"
                        ? "Contact sales"
                        : "Get started"}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
