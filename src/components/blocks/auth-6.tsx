"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft } from "lucide-react"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthBlock() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address")
      return
    }
    setError("")
    setSent(true)
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <Card className="w-full max-w-md">
        {sent ? (
          <>
            <CardHeader className="items-center text-center">
              <span
                className="mx-auto flex size-11 items-center justify-center rounded-lg border border-border bg-muted/40"
                aria-hidden="true"
              >
                <Send className="size-5" />
              </span>
              <CardTitle className="mt-4 text-xl font-bold tracking-tight">
                Check your inbox
              </CardTitle>
              <CardDescription className="text-sm">
                If an account exists for{" "}
                <span className="font-medium text-foreground">{email}</span>,
                we&apos;ve sent a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSent(false)}
              >
                Use a different email
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold tracking-tight">
                Forgot your password?
              </CardTitle>
              <CardDescription className="text-sm">
                Enter your email and we&apos;ll send you a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    aria-invalid={!!error}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (error) setError("")
                    }}
                  />
                  <FieldError>{error}</FieldError>
                </Field>
                <Button type="submit" className="mt-4 w-full">
                  Send reset link
                </Button>
              </form>
            </CardContent>
          </>
        )}
        <CardFooter className="justify-center">
          <Button
            variant="link"
            size="sm"
            className="text-muted-foreground"
            render={<a href="#" />}
            nativeButton={false}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Back to sign in
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
