"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AtSign, MessageCircle, UserPlus, GitPullRequest, Star, Heart, ShieldCheck, CheckCheck } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

type NotificationKind =
  | "mention"
  | "comment"
  | "follow"
  | "review"
  | "star"
  | "like"
  | "security"

type Day = "Today" | "Yesterday" | "Earlier"

type Notification = {
  id: string
  kind: NotificationKind
  day: Day
  actor: string
  initials: string
  avatar?: string
  title: string
  snippet: string
  timestamp: string
  unread: boolean
  mention: boolean
}

const iconByKind: Record<
  NotificationKind,
  React.ComponentType<{ className?: string }>
> = {
  mention: (p: IconProps) => (
    <AtSign {...p} />
  ),
  comment: (p: IconProps) => (
    <MessageCircle {...p} />
  ),
  follow: (p: IconProps) => (
    <UserPlus {...p} />
  ),
  review: (p: IconProps) => (
    <GitPullRequest {...p} />
  ),
  star: (p: IconProps) => (
    <Star {...p} />
  ),
  like: (p: IconProps) => (
    <Heart {...p} />
  ),
  security: (p: IconProps) => (
    <ShieldCheck {...p} />
  ),
}

const accentByKind: Record<NotificationKind, string> = {
  mention: "text-primary",
  comment: "text-foreground",
  follow: "text-foreground",
  review: "text-primary",
  star: "text-foreground",
  like: "text-foreground",
  security: "text-destructive",
}

const dayOrder: Day[] = ["Today", "Yesterday", "Earlier"]

const initialNotifications: Notification[] = [
  {
    id: "n1",
    kind: "mention",
    day: "Today",
    actor: "Mara Ellis",
    initials: "ME",
    avatar: "/pravatar/150?img=44",
    title: "Mara Ellis mentioned you",
    snippet:
      "@you can you take a look at the new pricing copy before we ship the Acme launch page?",
    timestamp: "2 Min Ago",
    unread: true,
    mention: true,
  },
  {
    id: "n2",
    kind: "review",
    day: "Today",
    actor: "Devon Park",
    initials: "DP",
    avatar: "/pravatar/150?img=33",
    title: "Review requested on acme/web#482",
    snippet:
      "Refactor checkout flow to use the new payment intents API. 14 files changed.",
    timestamp: "18 Min Ago",
    unread: true,
    mention: false,
  },
  {
    id: "n3",
    kind: "comment",
    day: "Today",
    actor: "Priya Nair",
    initials: "PN",
    avatar: "/pravatar/150?img=45",
    title: "New comment on “Q3 Roadmap”",
    snippet:
      "Left a few notes on the onboarding milestone. Think we can pull it forward a sprint.",
    timestamp: "1 Hour Ago",
    unread: true,
    mention: false,
  },
  {
    id: "n4",
    kind: "mention",
    day: "Today",
    actor: "Leo Tanaka",
    initials: "LT",
    avatar: "/pravatar/150?img=51",
    title: "Leo Tanaka mentioned you in #design",
    snippet:
      "thanks @you, pushed the updated tokens, dark mode contrast is fixed now.",
    timestamp: "3 Hours Ago",
    unread: false,
    mention: true,
  },
  {
    id: "n5",
    kind: "follow",
    day: "Yesterday",
    actor: "Sasha Kim",
    initials: "SK",
    avatar: "/pravatar/150?img=32",
    title: "Sasha Kim started following you",
    snippet: "You now share 12 workspaces across the Acme organization.",
    timestamp: "5 Hours Ago",
    unread: false,
    mention: false,
  },
  {
    id: "n6",
    kind: "security",
    day: "Yesterday",
    actor: "Acme Security",
    initials: "AS",
    title: "New sign-in from a new device",
    snippet:
      "MacBook Pro • San Francisco, CA. If this wasn’t you, review your active sessions.",
    timestamp: "Yesterday",
    unread: false,
    mention: false,
  },
  {
    id: "n7",
    kind: "comment",
    day: "Yesterday",
    actor: "Ravi Chandran",
    initials: "RC",
    avatar: "/pravatar/150?img=12",
    title: "New comment on “Pricing page copy”",
    snippet: "Swapped the hero line, can you sanity check the tone?",
    timestamp: "Yesterday",
    unread: false,
    mention: false,
  },
  {
    id: "n8",
    kind: "star",
    day: "Earlier",
    actor: "Community",
    initials: "AC",
    title: "Your project hit 1,000 stars",
    snippet: "acme/ui-kit just crossed 1k stars on the registry. Nice work.",
    timestamp: "2 Days Ago",
    unread: false,
    mention: false,
  },
  {
    id: "n9",
    kind: "follow",
    day: "Earlier",
    actor: "Nadia Osei",
    initials: "NO",
    avatar: "/pravatar/150?img=25",
    title: "Nadia Osei started following you",
    snippet: "You now share 4 workspaces across the Acme organization.",
    timestamp: "3 Days Ago",
    unread: false,
    mention: false,
  },
  {
    id: "n10",
    kind: "review",
    day: "Earlier",
    actor: "Devon Park",
    initials: "DP",
    avatar: "/pravatar/150?img=33",
    title: "Review approved on acme/web#471",
    snippet: "Ship it — nice cleanup on the settings form validation.",
    timestamp: "4 Days Ago",
    unread: false,
    mention: false,
  },
  {
    id: "n11",
    kind: "like",
    day: "Earlier",
    actor: "Priya Nair",
    initials: "PN",
    avatar: "/pravatar/150?img=45",
    title: "Priya Nair liked your update",
    snippet: "“Shipped the new empty states across the app” got a like.",
    timestamp: "5 Days Ago",
    unread: false,
    mention: false,
  },
  {
    id: "n12",
    kind: "mention",
    day: "Earlier",
    actor: "Leo Tanaka",
    initials: "LT",
    avatar: "/pravatar/150?img=51",
    title: "Leo Tanaka mentioned you in #general",
    snippet: "@you heads up, the design review moved to Thursday.",
    timestamp: "6 Days Ago",
    unread: false,
    mention: false,
  },
]

const inboxPrefs = [
  { id: "mentions", label: "Mentions", description: "@mentions across channels." },
  { id: "comments", label: "Comments", description: "Replies on your work." },
  { id: "reviews", label: "Reviews", description: "Pull request review requests." },
  { id: "digest", label: "Weekly digest", description: "A Monday activity summary." },
]

type Filter = "all" | "unread" | "mentions"

export default function NotificationsBlock() {
  const [items, setItems] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<Filter>("all")
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    mentions: true,
    comments: true,
    reviews: true,
    digest: false,
  })

  const unreadCount = useMemo(
    () => items.filter((item) => item.unread).length,
    [items]
  )
  const mentionsCount = useMemo(
    () => items.filter((item) => item.mention).length,
    [items]
  )

  const visible = useMemo(() => {
    if (filter === "unread") return items.filter((item) => item.unread)
    if (filter === "mentions") return items.filter((item) => item.mention)
    return items
  }, [items, filter])

  const grouped = useMemo(
    () =>
      dayOrder
        .map((day) => ({ day, entries: visible.filter((item) => item.day === day) }))
        .filter((group) => group.entries.length > 0),
    [visible]
  )

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    )
  }

  function markAllRead() {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })))
  }

  return (
    <section className="flex w-full items-start justify-center bg-muted/30 px-6 py-16 text-foreground">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Notifications
              {unreadCount > 0 ? (
                <Badge variant="secondary" className="tabular-nums">
                  {unreadCount} New
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription>Activity across your Acme workspace</CardDescription>
            <CardAction>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck data-icon="inline-start" />
                Mark All Read
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as Filter)}
            >
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1 gap-1.5">
                  Unread
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary tabular-nums">
                      {unreadCount}
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="mentions" className="flex-1 gap-1.5">
                  Mentions
                  {mentionsCount > 0 ? (
                    <span className="rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground tabular-nums">
                      {mentionsCount}
                    </span>
                  ) : null}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="mt-4">
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-14 text-center">
                    <CheckCheck className="size-6 text-muted-foreground" />
                    <p className="text-sm font-medium">You’re all caught up</p>
                    <p className="text-sm text-muted-foreground">
                      No notifications in this view.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[560px] [&_[data-slot=scroll-area-viewport]]:scroll-fade-y">
                    <ul className="-mx-2 pr-2">
                      {grouped.map((group, groupIndex) => (
                        <li key={group.day}>
                          <p
                            className={cn(
                              "px-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase",
                              groupIndex > 0 && "pt-4"
                            )}
                          >
                            {group.day}
                          </p>
                          <ul>
                            {group.entries.map((item, index) => {
                              const Icon = iconByKind[item.kind]
                              return (
                                <li key={item.id}>
                                  {index > 0 ? (
                                    <Separator className="opacity-60" />
                                  ) : null}
                                  <button
                                    type="button"
                                    onClick={() => markRead(item.id)}
                                    className={cn(
                                      "group flex w-full items-start gap-3 rounded-md px-2 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                      item.unread && "bg-muted/30"
                                    )}
                                  >
                                    <div className="relative shrink-0">
                                      <Avatar className="size-9">
                                        {item.avatar ? (
                                          <AvatarImage
                                            src={item.avatar}
                                            alt={item.actor}
                                            className=""
                                          />
                                        ) : null}
                                        <AvatarFallback
                                          className={cn(
                                            "text-xs font-medium",
                                            !item.avatar && accentByKind[item.kind]
                                          )}
                                        >
                                          {item.avatar ? (
                                            item.initials
                                          ) : (
                                            <Icon
                                              className="size-4"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </AvatarFallback>
                                      </Avatar>
                                      {item.avatar ? (
                                        <span
                                          className={cn(
                                            "absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-muted ring-2 ring-card",
                                            accentByKind[item.kind]
                                          )}
                                        >
                                          <Icon className="size-3" />
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p
                                          className={cn(
                                            "truncate text-sm",
                                            item.unread
                                              ? "font-semibold text-foreground"
                                              : "font-medium text-foreground"
                                          )}
                                        >
                                          {item.title}
                                        </p>
                                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                          {item.timestamp}
                                        </span>
                                      </div>
                                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                        {item.snippet}
                                      </p>
                                    </div>

                                    <span
                                      className={cn(
                                        "mt-1.5 size-2 shrink-0 rounded-full",
                                        item.unread ? "bg-primary" : "bg-transparent"
                                      )}
                                      aria-hidden
                                    />
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex w-full flex-col gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inbox preferences</CardTitle>
              <CardDescription>Choose what lands in this inbox.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {inboxPrefs.map((pref, index) => (
                <div key={pref.id}>
                  {index > 0 ? <Separator className="mb-4 opacity-60" /> : null}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{pref.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {pref.description}
                      </span>
                    </div>
                    <Switch
                      checked={prefs[pref.id]}
                      onCheckedChange={(checked) =>
                        setPrefs((prev) => ({ ...prev, [pref.id]: checked }))
                      }
                      aria-label={pref.label}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>This week</CardTitle>
              <CardDescription>A quick read on your activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-2xl font-semibold tracking-tight tabular-nums">
                    {unreadCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-2xl font-semibold tracking-tight tabular-nums">
                    {mentionsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Mentions</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-2xl font-semibold tracking-tight tabular-nums">
                    {items.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Total this week</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-2xl font-semibold tracking-tight tabular-nums">4</p>
                  <p className="text-xs text-muted-foreground">Active workspaces</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
