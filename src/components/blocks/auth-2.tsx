"use client"

import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { Check, Mail, Lock } from "lucide-react"

const BRAND = "Acme"
const TAGLINE = "Collaborative work, simplified."
const FEATURES = [
  "Real-time project dashboards",
  "Role-based access control",
  "Audit logs & compliance reports",
]

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function AuthBlock() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = signInSchema.safeParse(data)
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
      loading: "Signing you in…",
      success: "Welcome back to Acme!",
      error: "Sign-in failed. Please try again.",
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
    <section className="flex w-full items-center justify-center bg-background text-foreground">
      <Toaster />
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl md:flex-row">
        <div className="flex flex-col justify-between gap-10 bg-primary px-10 py-12 text-primary-foreground md:w-1/2">
          <div>
            <span className="text-xl font-bold tracking-tight">{BRAND}</span>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-heading text-3xl leading-tight font-bold tracking-tight">
              {TAGLINE}
            </p>
            <ul className="flex flex-col gap-3">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-primary-foreground/80"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-primary-foreground/50">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            {BRAND} Inc. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-8 border border-border bg-card px-10 py-12 md:w-1/2">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-xl font-bold tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-8"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    onChange={() => clearError("email")}
                  />
                </div>
                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Button
                    variant="link"
                    size="xs"
                    className="h-auto p-0 text-xs"
                    render={<a href="#" />}
                    nativeButton={false}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-8"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    onChange={() => clearError("password")}
                  />
                </div>
                {errors.password ? (
                  <FieldError>{errors.password}</FieldError>
                ) : (
                  <FieldDescription>
                    Must be at least 8 characters.
                  </FieldDescription>
                )}
              </Field>

              <Field orientation="horizontal">
                <FieldLabel
                  htmlFor="remember"
                  className="font-normal text-muted-foreground"
                >
                  <Checkbox id="remember" name="remember" />
                  Keep me signed in
                </FieldLabel>
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              render={<a href="#" />}
              nativeButton={false}
            >
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              render={<a href="#" />}
              nativeButton={false}
            >
              Privacy Policy
            </Button>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
