"use client"

import * as React from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Toaster } from "@/components/ui/sonner"
import { Upload, User, Mail, Briefcase, ShieldCheck } from "lucide-react"

const profile = {
  name: "Marcus Trent",
  email: "marcus.trent@acme.com",
  role: "Product Designer",
  initials: "MT",
  avatar: "/pravatar/150?img=13",
  twoFactor: true,
}

const TIMEZONES = [
  { value: "pst", label: "Pacific (UTC−8)" },
  { value: "est", label: "Eastern (UTC−5)" },
  { value: "gmt", label: "London (UTC+0)" },
  { value: "cet", label: "Central Europe (UTC+1)" },
  { value: "jst", label: "Tokyo (UTC+9)" },
]

const DENSITIES = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

const NOTIFICATION_PREFS = [
  { id: "email-digest", label: "Weekly email digest" },
  { id: "mentions", label: "Mentions and replies" },
  { id: "product-news", label: "Product news" },
]

export default function SettingsBlock() {
  const [name, setName] = React.useState(profile.name)
  const [email, setEmail] = React.useState(profile.email)
  const [role, setRole] = React.useState(profile.role)
  const [twoFactor, setTwoFactor] = React.useState(profile.twoFactor)
  const [timezone, setTimezone] = React.useState("pst")
  const [density, setDensity] = React.useState("comfortable")
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({
    "email-digest": true,
    mentions: true,
    "product-news": false,
  })
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const avatarInputRef = React.useRef<HTMLInputElement>(null)

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      toast.success("Photo updated", {
        id: "photo-updated",
        description: file.name,
      })
    }
  }

  function handleSave() {
    toast.success("Profile updated", {
      id: "profile-updated",
      description: "Your changes have been saved.",
    })
  }

  function handleDelete() {
    setDeleteOpen(false)
    toast.error("Account scheduled for deletion", {
      id: "account-deletion",
      description: "You can undo this within 30 days from your inbox.",
    })
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      {/* Two nested wrappers: the shell's `.block-reset` strips max-width off
          this section's direct child and its grandchild (so the block fills
          the content area like other app pages) — one level deeper, this
          div's own max-width survives, so the card centers at a real width
          instead of either hugging the shell's edges or the original
          484px-narrow-card default. */}
      <div className="flex w-full justify-center">
        <div className="w-full max-w-2xl">
      <Card className="w-full border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Profile
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            Update your personal details and preferences.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-0 p-0">
          <div className="flex items-center gap-4 border-y border-border bg-muted px-6 py-4">
            <div className="relative shrink-0">
              <Avatar className="size-14 border border-border">
                <AvatarImage
                  src={profile.avatar}
                  alt={profile.name}
                  className=""
                />
                <AvatarFallback className="bg-muted text-sm font-medium text-foreground">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute right-0.5 bottom-0.5 size-2.5 border-2 border-card bg-primary" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm leading-tight font-semibold">
                {name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {role}
              </span>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
              onChange={handleAvatarChange}
            />
            <Button
              variant="outline"
              size="xs"
              className="shrink-0 gap-1.5 text-xs"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              Upload
            </Button>
          </div>

          <div className="px-6 py-5">
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="full-name"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <User className="size-3.5" />
                  Full name
                </FieldLabel>
                <Input
                  id="full-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 h-8 text-sm transition-shadow focus-visible:shadow-sm"
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="email-address"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Mail className="size-3.5" />
                  Email address
                </FieldLabel>
                <Input
                  id="email-address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@acme.com"
                  className="mt-1.5 h-8 text-sm transition-shadow focus-visible:shadow-sm"
                />
                <FieldDescription className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  Changing your email will require re-verification.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="job-title"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Briefcase className="size-3.5" />
                  Job title
                </FieldLabel>
                <Input
                  id="job-title"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Engineer"
                  className="mt-1.5 h-8 text-sm transition-shadow focus-visible:shadow-sm"
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="timezone"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Timezone
                </FieldLabel>
                <Select
                  items={TIMEZONES}
                  value={timezone}
                  onValueChange={(v) => v && setTimezone(v)}
                >
                  <SelectTrigger
                    id="timezone"
                    className="mt-1.5 h-8 w-full text-sm"
                  >
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
            </FieldGroup>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-6 px-6 py-5 sm:grid-cols-2">
            <FieldSet>
              <FieldLegend variant="label">Interface density</FieldLegend>
              <RadioGroup
                value={density}
                onValueChange={(value) => setDensity(String(value))}
              >
                {DENSITIES.map((option) => (
                  <Field
                    key={option.value}
                    orientation="horizontal"
                    className="gap-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`density-${option.value}`}
                    />
                    <FieldLabel
                      htmlFor={`density-${option.value}`}
                      className="text-xs font-normal"
                    >
                      {option.label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend variant="label">Email notifications</FieldLegend>
              <div data-slot="checkbox-group" className="flex flex-col gap-3">
                {NOTIFICATION_PREFS.map((pref) => (
                  <Field
                    key={pref.id}
                    orientation="horizontal"
                    className="gap-2"
                  >
                    <Checkbox
                      id={pref.id}
                      checked={prefs[pref.id]}
                      onCheckedChange={(checked) =>
                        setPrefs((prev) => ({
                          ...prev,
                          [pref.id]: checked === true,
                        }))
                      }
                    />
                    <FieldLabel
                      htmlFor={pref.id}
                      className="text-xs font-normal"
                    >
                      {pref.label}
                    </FieldLabel>
                  </Field>
                ))}
              </div>
            </FieldSet>
          </div>

          <Separator />

          <div className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    Two-factor authentication
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Require a verification code on every sign-in.
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
                className="mt-0.5 shrink-0"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 px-6 py-3">
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Delete Account
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your profile and all associated data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="sm" className="gap-1.5 text-xs" onClick={handleSave}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
        </div>
      </div>
      <Toaster />
    </section>
  )
}
