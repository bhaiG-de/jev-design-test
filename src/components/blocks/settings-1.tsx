import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
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
import { Toaster } from "@/components/ui/sonner"

const VISIBILITY_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "team", label: "Only my team" },
  { value: "private", label: "Just me" },
]

const notificationRows = [
  {
    id: "product-updates",
    label: "Product updates",
    description: "News about features and improvements.",
    on: true,
  },
  {
    id: "weekly-digest",
    label: "Weekly digest",
    description: "A summary of your activity every Monday.",
    on: false,
  },
  {
    id: "mentions",
    label: "Mentions",
    description: "Get notified when someone mentions you.",
    on: true,
  },
] as const

export default function SettingsBlock() {
  const [displayName, setDisplayName] = React.useState("Ada Lovelace")
  const [email, setEmail] = React.useState("ada@acme.com")
  const [visibility, setVisibility] = React.useState("team")
  const [notifications, setNotifications] = React.useState<
    Record<string, boolean>
  >(() => Object.fromEntries(notificationRows.map((row) => [row.id, row.on])))

  function handleSave() {
    toast.success("Changes saved", {
      id: "changes-saved",
      description: "Your settings have been updated.",
    })
  }

  return (
    <section className="flex min-h-svh w-full justify-center bg-background px-4 py-10 text-foreground sm:py-16">
      {/* Extra wrapper: the shell's `.block-reset` strips max-width off this
          section's direct child and grandchild, so the real max-w-2xl column
          lives one level deeper where the reset doesn't reach — otherwise the
          cards stretch full width and the label/control rows end up with a
          huge dead gap between them. */}
      <div className="flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account preferences and how you receive updates.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="display-name">Display name</FieldLabel>
                <FieldDescription>
                  The name shown across your workspace.
                </FieldDescription>
              </FieldContent>
              <Input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-44"
              />
            </Field>

            <Separator />

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <FieldDescription>
                  Used for sign-in and account notices.
                </FieldDescription>
              </FieldContent>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-44"
              />
            </Field>

            <Separator />

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="profile-visibility">
                  Profile visibility
                </FieldLabel>
                <FieldDescription>
                  Choose who can view your activity.
                </FieldDescription>
              </FieldContent>
              <Select
                items={VISIBILITY_OPTIONS}
                value={visibility}
                onValueChange={(v) => v && setVisibility(v)}
              >
                <SelectTrigger id="profile-visibility" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {notificationRows.map((row, index) => (
              <div key={row.id} className="flex flex-col gap-4">
                {index > 0 && <Separator />}
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor={row.id}>{row.label}</FieldLabel>
                    <FieldDescription>{row.description}</FieldDescription>
                  </FieldContent>
                  <Switch
                    id={row.id}
                    checked={notifications[row.id]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [row.id]: checked,
                      }))
                    }
                  />
                </Field>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
      </div>
      <Toaster />
    </section>
  )
}
