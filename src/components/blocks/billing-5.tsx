"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, CreditCard } from "lucide-react"

type CardEntry = {
  id: string
  brand: string
  last4: string
  expiry: string
}

const initialCards: CardEntry[] = [
  { id: "c1", brand: "Visa", last4: "4242", expiry: "08/27" },
  { id: "c2", brand: "Mastercard", last4: "5100", expiry: "01/26" },
]

export default function BillingBlock() {
  const [cards, setCards] = useState(initialCards)
  const [defaultId, setDefaultId] = useState("c1")
  const [open, setOpen] = useState(false)

  return (
    <section className="flex h-full w-full items-start justify-center bg-background px-6 py-16 text-foreground">
      <div className="flex h-full w-full max-w-lg flex-col rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-heading text-sm font-semibold tracking-tight">
              Payment methods
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage the cards used to pay for your subscription.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" variant="outline" />}>
              <Plus data-icon="inline-start" aria-hidden="true" />
              Add
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add payment method</DialogTitle>
                <DialogDescription>
                  Your card is encrypted and stored securely.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="number">Card number</FieldLabel>
                  <Input id="number" placeholder="1234 1234 1234 1234" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="expiry">Expiry</FieldLabel>
                    <Input id="expiry" placeholder="MM/YY" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="cvc">CVC</FieldLabel>
                    <Input id="cvc" placeholder="123" />
                  </Field>
                </div>
              </FieldGroup>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Add card</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ul className="flex flex-1 flex-col divide-y divide-border">
          {cards.map((card) => (
            <li key={card.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border">
                <CreditCard className="size-4" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {card.brand} •••• {card.last4}
                  {card.id === defaultId && (
                    <Badge variant="secondary" className="text-[10px]">
                      Default
                    </Badge>
                  )}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  Expires {card.expiry}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {card.id !== defaultId && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setDefaultId(card.id)}
                  >
                    Set default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={card.id === defaultId}
                  onClick={() =>
                    setCards((prev) => prev.filter((c) => c.id !== card.id))
                  }
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <Separator />
        <p className="px-5 py-3 text-xs text-muted-foreground">
          Payments are processed securely. We never store your full card number.
        </p>
      </div>
    </section>
  )
}
