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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowRight } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const BRAND = "Acme"

const SOCIALS = [
  {
    id: "google",
    label: "Google",
    icon: (p: IconProps) => <GoogleMark {...p} />,
  },
  {
    id: "github",
    label: "GitHub",
    icon: (p: IconProps) => <GithubMark {...p} />,
  },
  {
    id: "apple",
    label: "Apple",
    icon: (p: IconProps) => <AppleMark {...p} />,
  },
]

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

const signUpSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Include at least one number"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

export default function AuthBlock() {
  const [tab, setTab] = useState("signin")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isSignUp = tab === "signup"

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const result = (isSignUp ? signUpSchema : signInSchema).safeParse(data)
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
      loading: isSignUp ? "Creating your account…" : "Signing you in…",
      success: isSignUp
        ? `Welcome to ${BRAND}! Your account is ready.`
        : `Welcome back to ${BRAND}.`,
      error: isSignUp
        ? "Could not create account. Please try again."
        : "Sign-in failed. Please try again.",
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

  function handleSocial(label: string) {
    toast.info(`Continuing with ${label}`, {
      description: "Redirecting you to authenticate…",
    })
  }

  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Toaster />
      <Card className="w-full max-w-md gap-6">
        <CardHeader className="items-center gap-3 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
            <Shield className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold tracking-tight">
              {isSignUp ? `Join ${BRAND}` : `Welcome back to ${BRAND}`}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Create your account in under a minute."
                : "Sign in to pick up where you left off."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as string)
              setErrors({})
            }}
          >
            <TabsList className="grid h-9 w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="pt-5">
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
                noValidate
              >
                <Field>
                  <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                  <Input
                    id="signin-email"
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
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      render={<a href="#" />}
                      nativeButton={false}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    onChange={() => clearError("password")}
                  />
                  <FieldError>{errors.password}</FieldError>
                </Field>
                <Button type="submit" size="lg" className="w-full">
                  Sign in
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="pt-5">
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
                noValidate
              >
                <Field>
                  <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="Jordan Blake"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    onChange={() => clearError("name")}
                  />
                  <FieldError>{errors.name}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                  <Input
                    id="signup-email"
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
                  <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                  <Input
                    id="signup-password"
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
                <Field>
                  <FieldLabel htmlFor="signup-confirm">
                    Confirm password
                  </FieldLabel>
                  <Input
                    id="signup-confirm"
                    name="confirm"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirm}
                    onChange={() => clearError("confirm")}
                  />
                  <FieldError>{errors.confirm}</FieldError>
                </Field>
                <Button type="submit" size="lg" className="w-full">
                  Create account
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">Or</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {SOCIALS.map((social) => {
              const Icon = social.icon
              return (
                <Button
                  key={social.id}
                  variant="outline"
                  type="button"
                  className="w-full"
                  aria-label={`Continue with ${social.label}`}
                  onClick={() => handleSocial(social.label)}
                >
                  <Icon data-icon="inline-start" />
                  <span className="sr-only sm:not-sr-only">{social.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>

        <CardFooter className="justify-center text-xs text-muted-foreground">
          {isSignUp ? "Already have an account?" : "New to Acme?"}
          <Button
            variant="link"
            className="px-1 text-xs"
            type="button"
            onClick={() => setTab(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? "Sign in" : "Create one"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}

// Brand marks are inlined rather than imported from an icon library: the rest
// of this file uses IconPlaceholder, which resolves to whichever icon set the
// consumer already has, and one brand import would drag a whole extra package
// into their install for a handful of glyphs.
type MarkProps = React.ComponentProps<"svg"> & { size?: number | string }

function AppleMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M11.6734 7.22198C10.7974 7.22198 9.44138 6.22598 8.01338 6.26198C6.12938 6.28598 4.40138 7.35397 3.42938 9.04597C1.47338 12.442 2.92538 17.458 4.83338 20.218C5.76938 21.562 6.87338 23.074 8.33738 23.026C9.74138 22.966 10.2694 22.114 11.9734 22.114C13.6654 22.114 14.1454 23.026 15.6334 22.99C17.1454 22.966 18.1054 21.622 19.0294 20.266C20.0974 18.706 20.5414 17.194 20.5654 17.11C20.5294 17.098 17.6254 15.982 17.5894 12.622C17.5654 9.81397 19.8814 8.46998 19.9894 8.40998C18.6694 6.47798 16.6414 6.26198 15.9334 6.21398C14.0854 6.06998 12.5374 7.22198 11.6734 7.22198ZM14.7934 4.38998C15.5734 3.45398 16.0894 2.14598 15.9454 0.849976C14.8294 0.897976 13.4854 1.59398 12.6814 2.52998C11.9614 3.35798 11.3374 4.68998 11.5054 5.96198C12.7414 6.05798 14.0134 5.32598 14.7934 4.38998Z" />
    </svg>
  )
}

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
