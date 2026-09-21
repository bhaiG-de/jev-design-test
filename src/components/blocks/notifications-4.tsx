"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

type Channels = { email: boolean; push: boolean }

const categories = [
  {
    id: "comments",
    label: "Comments",
    description: "When someone comments on your work.",
  },
  {
    id: "mentions",
    label: "Mentions",
    description: "When someone @mentions you.",
  },
  {
    id: "follows",
    label: "New followers",
    description: "When someone starts following you.",
  },
  {
    id: "reviews",
    label: "Review requests",
    description: "When you’re added as a reviewer.",
  },
  {
    id: "deploys",
    label: "Deployments",
    description: "When a deploy succeeds or fails.",
  },
  {
    id: "security",
    label: "Security alerts",
    description: "New sign-ins and account changes.",
  },
  {
    id: "digest",
    label: "Weekly digest",
    description: "A summary of activity every Monday.",
  },
]

const initial: Record<string, Channels> = {
  comments: { email: true, push: true },
  mentions: { email: true, push: true },
  follows: { email: false, push: true },
  reviews: { email: true, push: true },
  deploys: { email: false, push: true },
  security: { email: true, push: true },
  digest: { email: true, push: false },
}

export default function NotificationsBlock() {
  const [prefs, setPrefs] = useState(initial)

  const toggle = (id: string, channel: keyof Channels) =>
    setPrefs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [channel]: !prev[id][channel] },
    }))

  return (
    <section className="flex w-full items-start justify-center bg-background px-6 py-16 text-foreground">
      {/* Intermediate wrapper: `.block-reset` (index.css) strips the max-width
          off its direct child so the frame owns full-bleed width; nesting the
          capped Card one level down keeps this a column, not a 1440px form. */}
      <div className="w-full">
        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Notification preferences</CardTitle>
            <CardDescription>
              Choose how you want to hear from us for each type of activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 gap-y-1">
              <span />
              <span className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Email
              </span>
              <span className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Push
              </span>
              {categories.map((category, index) => (
                <div key={category.id} className="contents">
                  {index > 0 && <Separator className="col-span-3 my-2.5" />}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{category.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {category.description}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={prefs[category.id].email}
                      onCheckedChange={() => toggle(category.id, "email")}
                      aria-label={`${category.label} email`}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={prefs[category.id].push}
                      onCheckedChange={() => toggle(category.id, "push")}
                      aria-label={`${category.label} push`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
