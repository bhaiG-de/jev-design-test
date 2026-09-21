"use client"

import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Sparkles } from "lucide-react"

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export default function AuthBlock() {
  const [remember, setRemember] = useState(true)
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

  function handleSocial(provider: string) {
    toast.info(`Continuing with ${provider}`, {
      description: "Redirecting you to authenticate…",
    })
  }

  return (
    <>
      <Toaster />
      <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="grid w-full max-w-[960px] grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-2">
        <div className="flex items-center justify-center p-8 sm:p-10">
          <Card className="w-full max-w-sm border-0 bg-transparent shadow-none ring-0">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Sign In To Acme
              </CardTitle>
              <CardDescription className="text-sm">
                Welcome back. Enter your details to continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 px-0">
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      onChange={() => clearError("email")}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </Field>
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Button
                        variant="link"
                        className="h-auto px-0 text-xs"
                        render={<a href="#" />}
                        nativeButton={false}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      onChange={() => clearError("password")}
                    />
                    <FieldError>{errors.password}</FieldError>
                  </Field>

                  <Field orientation="horizontal">
                    <FieldLabel
                      htmlFor="remember"
                      className="font-normal text-muted-foreground"
                    >
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(checked) =>
                          setRemember(checked === true)
                        }
                      />
                      Remember me
                    </FieldLabel>
                  </Field>

                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </FieldGroup>
              </form>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Separator className="flex-1" />
                Or
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSocial("Google")}
                >
                  <GoogleMark data-icon="inline-start" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSocial("GitHub")}
                >
                  <GithubMark data-icon="inline-start" />
                  GitHub
                </Button>
              </div>
            </CardContent>

            <CardFooter className="justify-center px-0 text-sm text-muted-foreground">
              Don&apos;t have an account?
              <Button
                variant="link"
                className="px-1"
                render={<a href="#" />}
                nativeButton={false}
              >
                Sign up
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="relative hidden overflow-hidden border-l border-border bg-primary text-primary-foreground md:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.07]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 size-80 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-16 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
          />

          <div className="relative flex h-full flex-col justify-between p-12">
            <div className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-6 shrink-0 text-primary-foreground"
              >
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  transform="rotate(-6 7 7)"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  transform="rotate(5 7 17)"
                />
                <rect
                  x="13"
                  y="13"
                  width="8"
                  height="8"
                  transform="rotate(-4 17 17)"
                />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  transform="rotate(15 17 7)"
                />
              </svg>
              <span className="text-lg font-semibold tracking-tight">Acme</span>
            </div>

            <div className="max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-2.5 py-1 text-xs font-medium">
                <Sparkles data-icon="inline-start" className="size-3.5" aria-hidden="true" />
                Trusted by 12,000+ teams
              </span>
              <h2 className="mt-6 font-heading text-4xl leading-tight font-bold tracking-tight">
                Build faster with blocks you can ship today.
              </h2>
              <p className="mt-4 text-base text-primary-foreground/80">
                Drop-in, production-ready UI for your next product. One
                workspace for your whole team to design, build, and launch.
              </p>
            </div>

            <p className="text-sm text-primary-foreground/70">
              &copy; 2026 Acme, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      </section>
    </>
  )
}

// Brand marks are inlined rather than imported from an icon library: the rest
// of this file uses IconPlaceholder, which resolves to whichever icon set the
// consumer already has, and one brand import would drag a whole extra package
// into their install for a handful of glyphs.
type MarkProps = React.ComponentProps<"svg"> & { size?: number | string }

function GithubMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
    </svg>
  )
}

function GoogleMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
    </svg>
  )
}
