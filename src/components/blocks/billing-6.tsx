import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Lock } from "lucide-react"

export default function BillingBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add payment method</CardTitle>
          <CardDescription>
            Add a card to keep your subscription active.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name on card</FieldLabel>
                <Input id="name" placeholder="Ada Lovelace" />
              </Field>
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
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select defaultValue="us">
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="horizontal" className="justify-between">
                <FieldLabel
                  htmlFor="default"
                  className="font-normal text-muted-foreground"
                >
                  Set as default payment method
                </FieldLabel>
                <Switch id="default" defaultChecked />
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full">
              Save card
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" />
              Secured with 256-bit encryption
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
