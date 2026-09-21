import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Event = {
  id: string
  actor: string
  initials: string
  avatar: string
  action: string
  target: string
  time: string
}

const events: Event[] = [
  {
    id: "merge-main",
    actor: "Mara Ellis",
    initials: "ME",
    avatar: "/pravatar/80?img=47",
    action: "merged a pull request into",
    target: "main",
    time: "12 Min Ago",
  },
  {
    id: "deploy-v241",
    actor: "Leo Tanaka",
    initials: "LT",
    avatar: "/pravatar/80?img=12",
    action: "deployed",
    target: "v2.4.1 to production",
    time: "1 Hour Ago",
  },
  {
    id: "comment-roadmap",
    actor: "Priya Nair",
    initials: "PN",
    avatar: "/pravatar/80?img=32",
    action: "commented on",
    target: "Q3 Roadmap",
    time: "3 Hours Ago",
  },
  {
    id: "invite-members",
    actor: "Owen Brooks",
    initials: "OB",
    avatar: "/pravatar/80?img=53",
    action: "invited",
    target: "two new members",
    time: "5 Hours Ago",
  },
  {
    id: "close-482",
    actor: "Sasha Kim",
    initials: "SK",
    avatar: "/pravatar/80?img=48",
    action: "closed issue",
    target: "#482",
    time: "Yesterday",
  },
]

export default function ActivityBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            Recent actions across your workspace.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="flex flex-col divide-y divide-border">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Avatar className="size-8 border border-border">
                  <AvatarImage
                    src={event.avatar}
                    alt={event.actor}
                    className=""
                  />
                  <AvatarFallback className="text-xs">
                    {event.initials}
                  </AvatarFallback>
                </Avatar>
                <p className="flex-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {event.actor}
                  </span>{" "}
                  {event.action}{" "}
                  <span className="font-medium text-foreground">
                    {event.target}
                  </span>
                </p>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {event.time}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
