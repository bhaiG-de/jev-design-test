"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { UserPlus, GitMerge, CircleAlert, FileText, ShieldCheck, Megaphone, Check, Bell } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const initialNotifications = [
  {
    id: 1,
    icon: (p: IconProps) => (
      <UserPlus {...p} />
    ),
    title: "New team member joined",
    body: "Sarah Chen accepted your invitation and joined the workspace.",
    timestamp: "2 Min Ago",
    unread: true,
  },
  {
    id: 2,
    icon: (p: IconProps) => (
      <GitMerge {...p} />
    ),
    title: "Pull request merged",
    body: "feat/dashboard-v2 was merged into main by Jordan Lee.",
    timestamp: "14 Min Ago",
    unread: true,
  },
  {
    id: 3,
    icon: (p: IconProps) => (
      <CircleAlert {...p} />
    ),
    title: "Usage limit warning",
    body: "Your team has used 85% of the monthly API quota.",
    timestamp: "1 Hour Ago",
    unread: true,
  },
  {
    id: 4,
    icon: (p: IconProps) => (
      <FileText {...p} />
    ),
    title: "Invoice generated",
    body: "Invoice #INV-2024-0118 for $1,240.00 is ready to download.",
    timestamp: "3 Hours Ago",
    unread: false,
  },
  {
    id: 5,
    icon: (p: IconProps) => (
      <ShieldCheck {...p} />
    ),
    title: "Security scan complete",
    body: "Weekly vulnerability scan finished, no critical issues found.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 6,
    icon: (p: IconProps) => (
      <Megaphone {...p} />
    ),
    title: "Scheduled maintenance",
    body: "Planned downtime on Dec 22 from 02:00–04:00 UTC.",
    timestamp: "2 Days Ago",
    unread: false,
  },
  {
    id: 7,
    icon: (p: IconProps) => (
      <Check {...p} />
    ),
    title: "Deployment succeeded",
    body: "Production deploy v3.14.2 completed without errors.",
    timestamp: "3 Days Ago",
    unread: false,
  },
]

export default function NotificationsBlock() {
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <Sheet defaultOpen>
        <SheetTrigger
          render={<Button variant="outline" size="icon" />}
          aria-label="Open notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </SheetTrigger>

        <SheetContent side="right" className="w-full p-0 sm:max-w-md">
          <SheetHeader className="flex-row items-center gap-2 space-y-0 pr-12">
            <SheetTitle className="flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-4xl bg-primary text-[10px] font-semibold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <Separator />

          <ScrollArea className="flex-1 [&_[data-slot=scroll-area-viewport]]:scroll-fade-y">
            <ul className="flex flex-col">
              {notifications.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <div
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                        item.unread && "bg-muted/30"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
                          item.unread && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>

                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={cn(
                              "truncate text-xs font-medium",
                              item.unread
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs/relaxed text-muted-foreground">
                          {item.body}
                        </p>
                      </div>

                      {item.unread && (
                        <span
                          className="mt-1.5 size-1.5 shrink-0 bg-primary"
                          role="img"
                          aria-label="Unread"
                        />
                      )}
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>

          <Separator />

          <div className="flex gap-2 p-3">
            <SheetClose
              render={<Button variant="outline" size="sm" className="flex-1" />}
            >
              Close
            </SheetClose>
            <Button
              size="sm"
              className="flex-1"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <Check data-icon="inline-start" />
              Mark All Read
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}
