"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { User, Shield, Bell, CreditCard } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const TIMEZONES = [
  { value: "pst", label: "Pacific (UTC−8)" },
  { value: "est", label: "Eastern (UTC−5)" },
  { value: "gmt", label: "London (UTC+0)" },
  { value: "cet", label: "Central Europe (UTC+1)" },
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
]

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: (p: IconProps) => (
      <User {...p} />
    ),
  },
  {
    id: "account",
    label: "Account",
    icon: (p: IconProps) => (
      <Shield {...p} />
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (p: IconProps) => (
      <Bell {...p} />
    ),
  },
  {
    id: "billing",
    label: "Billing",
    icon: (p: IconProps) => (
      <CreditCard {...p} />
    ),
  },
]

export default function SettingsBlock() {
  const [active, setActive] = useState("profile")
  const [timezone, setTimezone] = useState("pst")
  const [language, setLanguage] = useState("en")

  return (
    <section className="flex min-h-svh w-full items-start justify-center bg-background px-6 py-12 text-foreground">
      {/* Extra wrapper: the shell's `.block-reset` strips max-width off this
          section's direct child and grandchild, so the real max-w-3xl column
          lives one level deeper, where the reset doesn't reach. */}
      <div className="flex w-full justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and workspace preferences.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[12rem_1fr]">
          <nav className="flex flex-col gap-1 rounded-lg bg-muted p-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActive(section.id)}
                  aria-current={active === section.id}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    active === section.id
                      ? "bg-card font-medium text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {section.label}
                </button>
              )
            })}
          </nav>

          <div className="min-w-0">
            {active === "profile" && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 border border-border">
                      <AvatarImage
                        src="/pravatar/80?img=45"
                        alt="Elena Duarte"
                        className=""
                      />
                      <AvatarFallback>ED</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change avatar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="name">Full name</FieldLabel>
                      <Input id="name" defaultValue="Elena Duarte" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="elena@acme.com"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="job-title">Job title</FieldLabel>
                      <Input id="job-title" defaultValue="Product Designer" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                      <Select
                        items={TIMEZONES}
                        value={timezone}
                        onValueChange={(v) => v && setTimezone(v)}
                      >
                        <SelectTrigger id="timezone" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="language">Language</FieldLabel>
                      <Select
                        items={LANGUAGES}
                        value={language}
                        onValueChange={(v) => v && setLanguage(v)}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <Textarea
                      id="bio"
                      rows={3}
                      defaultValue="Product designer focused on clean, accessible interfaces."
                    />
                  </Field>
                </div>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Danger zone
                    </CardTitle>
                    <CardDescription>
                      Deleting your account removes all of your data. This
                      can&apos;t be undone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" size="sm">
                      Delete account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {active === "notifications" && (
              <div className="flex flex-col gap-4">
                {["Product updates", "Weekly digest", "Security alerts"].map(
                  (label, index) => (
                    <div key={label} className="flex flex-col gap-4">
                      {index > 0 && <Separator />}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{label}</span>
                        <Switch
                          defaultChecked={index !== 1}
                          aria-label={label}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {active === "account" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h2 className="font-heading text-sm font-semibold tracking-tight">
                    Password
                  </h2>
                  <Field>
                    <FieldLabel htmlFor="current">Current password</FieldLabel>
                    <Input
                      id="current"
                      type="password"
                      placeholder="••••••••"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </Field>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      Two-factor authentication
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account.
                    </span>
                  </div>
                  <Switch aria-label="Two-factor authentication" />
                </div>
              </div>
            )}

            {active === "billing" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Pro plan</span>
                    <span className="text-xs text-muted-foreground">
                      $29 / month, renews Aug 1, 2026
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change plan
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Payment method</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      Visa •••• 4242, expires 08/27
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-2 border-t border-border pt-5">
              <Button variant="outline">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
