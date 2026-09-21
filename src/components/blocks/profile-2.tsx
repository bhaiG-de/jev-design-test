"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const stats = [
  { label: "Projects", value: "48" },
  { label: "Followers", value: "2.1k" },
  { label: "Rating", value: "4.9" },
]

export default function ProfileBlock() {
  const [following, setFollowing] = React.useState(false)

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar className="size-20 border border-border">
              <AvatarImage
                src="/pravatar/160?img=12"
                alt="Marcus Trent"
                className=""
              />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-base font-semibold">
                  Marcus Trent
                </h1>
                <Badge variant="secondary">Pro</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Product Designer</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />
                San Francisco, CA
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5 py-3"
              >
                <span className="text-sm font-semibold tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Button
            className="flex-1"
            aria-pressed={following}
            variant={following ? "outline" : "default"}
            onClick={() => setFollowing((v) => !v)}
          >
            {following ? "Following" : "Follow"}
          </Button>
          <Button variant="outline" className="flex-1">
            Message
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
