"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { UserPlus, MessageSquare, Copy, Settings, Bell } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const initialNotifications = [
  {
    id: 1,
    icon: (p: IconProps) => (
      <UserPlus {...p} />
    ),
    initials: "MK",
    name: "Marco K.",
    avatar: "/pravatar/150?img=14",
    title: "Marco K. started following you",
    time: "Just Now",
    unread: true,
  },
  {
    id: 2,
    icon: (p: IconProps) => (
      <MessageSquare {...p} />
    ),
    initials: "AL",
    name: "Amy L.",
    avatar: "/pravatar/150?img=32",
    title: "Amy L. left a comment on your report",
    time: "5 Min Ago",
    unread: true,
  },
  {
    id: 3,
    icon: (p: IconProps) => (
      <Copy {...p} />
    ),
    initials: "DS",
    name: "David S.",
    avatar: "/pravatar/150?img=51",
    title: "David S. shared a document with you",
    time: "42 Min Ago",
    unread: false,
  },
  {
    id: 4,
    icon: (p: IconProps) => (
      <Settings {...p} />
    ),
    initials: "AC",
    name: "Acme",
    avatar: "/pravatar/150?img=60",
    title: "Acme workspace settings were updated",
    time: "2 Hours Ago",
    unread: false,
  },
]

export default function NotificationsBlock() {
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <Popover defaultOpen>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="relative shadow-sm transition-shadow hover:shadow-md"
            />
          }
          aria-label="Open notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-4xl bg-primary text-[9px] leading-none font-bold text-primary-foreground ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-[340px] gap-0 p-0"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge
                  variant="default"
                  className="h-5 px-1.5 text-[10px] font-semibold"
                >
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="xs"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
          </div>

          <Separator />

          <ScrollArea className="max-h-72 [&_[data-slot=scroll-area-viewport]]:scroll-fade-b">
            <ul className="flex flex-col">
              {notifications.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className={[
                        "group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                        item.unread ? "bg-muted/30" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <Avatar size="sm" className="border border-border">
                          <AvatarImage
                            src={item.avatar}
                            alt={item.name}
                            className=""
                          />
                          <AvatarFallback className="text-[10px] font-medium">
                            {item.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-md border border-border bg-card shadow-sm">
                          <Icon className="size-2.5 text-muted-foreground" />
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p
                          className={[
                            "truncate text-xs leading-snug",
                            item.unread
                              ? "font-medium text-foreground"
                              : "text-foreground/80",
                          ].join(" ")}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {item.time}
                        </span>
                      </div>

                      <div className="mt-1.5 flex size-4 shrink-0 items-center justify-center">
                        {item.unread && (
                          <span
                            className="size-2 bg-primary"
                            role="img"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                    </button>
                    {index < notifications.length - 1 && <Separator />}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>

          <Separator />

          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[10px] text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} Unread` : "All Caught Up"}
            </span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
              render={<a href="#" />}
              nativeButton={false}
            >
              View All
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </section>
  )
}
