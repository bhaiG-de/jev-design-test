import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Check, UserPlus, ArrowRight } from "lucide-react"

const BRAND = "Acme"
const PLANS = [
  { label: "Free", detail: "Up to 3 projects, 1 GB storage", popular: false },
  {
    label: "Pro",
    detail: "Unlimited projects, 50 GB storage",
    popular: true,
  },
  {
    label: "Team",
    detail: "Everything in Pro + admin controls",
    popular: false,
  },
]

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Include at least one number"),
})

export default function AuthBlock() {
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = signUpSchema.safeParse(data)
    if (!result.success) {
      const next: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (typeof key === "string" && !next[key]) {
          next[key] = issue.message
        }
      }
      setErrors(next)
      return
    }
    setErrors({})
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1400)), {
      loading: "Creating your account…",
      success: "Account created. Check your inbox to verify.",
      error: "Could not create account. Please try again.",
    })
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <Toaster />
      <div className="flex w-full max-w-3xl flex-col gap-0 overflow-hidden rounded-xl md:flex-row">
        <div className="flex flex-col gap-6 border border-border bg-muted px-8 py-10 md:w-2/5">
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold tracking-tight">{BRAND}</span>
            <p className="text-xs text-muted-foreground">
              One account. Every plan.
            </p>
          </div>

          <Separator />

          <ul className="flex flex-col gap-4">
            {PLANS.map((plan) => (
              <li key={plan.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {plan.label}
                    {plan.popular && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1 text-[9px] font-medium tracking-wide uppercase"
                      >
                        Popular
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {plan.detail}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Separator />

          <p className="text-xs text-muted-foreground">
            No credit card required to get started. Upgrade any time.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-8 border border-border bg-card px-8 py-10 md:border-l-0">
          <CardHeader className="p-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
                <UserPlus className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base font-bold">
                  Create your account
                </CardTitle>
                <CardDescription>
                  Get started with {BRAND}, free forever.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
              noValidate
            >
              <FieldGroup>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Field className="flex-1">
                    <FieldLabel htmlFor="first-name">First name</FieldLabel>
                    <Input
                      id="first-name"
                      name="firstName"
                      type="text"
                      placeholder="Jordan"
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      onChange={() => clearError("firstName")}
                    />
                    <FieldError>{errors.firstName}</FieldError>
                  </Field>
                  <Field className="flex-1">
                    <FieldLabel htmlFor="last-name">Last name</FieldLabel>
                    <Input
                      id="last-name"
                      name="lastName"
                      type="text"
                      placeholder="Blake"
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                      onChange={() => clearError("lastName")}
                    />
                    <FieldError>{errors.lastName}</FieldError>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Work email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jordan@company.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    onChange={() => clearError("email")}
                  />
                  <FieldError>{errors.email}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    onChange={() => clearError("password")}
                  />
                  {errors.password ? (
                    <FieldError>{errors.password}</FieldError>
                  ) : (
                    <FieldDescription>
                      Minimum 8 characters, at least one number.
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>

              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="terms"
                  name="terms"
                  className="mt-px"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <Label
                  htmlFor="terms"
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!agreed}
              >
                Create Account
                <ArrowRight data-icon="inline-end" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-none p-0 text-xs text-muted-foreground">
            Already have an account?
            <Button
              variant="link"
              className="px-1 text-xs"
              render={<a href="#" />}
              nativeButton={false}
            >
              Sign In
            </Button>
          </CardFooter>
        </div>
      </div>
    </section>
  )
}
