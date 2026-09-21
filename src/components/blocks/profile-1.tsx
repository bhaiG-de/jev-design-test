import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Link, Calendar, Heart, MessageCircle } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const stats = [
  { label: "Posts", value: "128" },
  { label: "Followers", value: "12.4k" },
  { label: "Following", value: "312" },
]

const posts = [
  {
    title: "Designing tokens that scale",
    excerpt:
      "How we restructured our design tokens into three tiers and cut theme work to almost nothing.",
    date: "Jun 14, 2026",
    likes: 184,
    comments: 23,
  },
  {
    title: "The case for boring infrastructure",
    excerpt:
      "Reliability is a feature. A look at why we chose the least exciting option at every layer.",
    date: "May 28, 2026",
    likes: 142,
    comments: 17,
  },
  {
    title: "Shipping fewer, better features",
    excerpt:
      "Why we started saying no more often, and how that changed the shape of our roadmap for the better.",
    date: "May 2, 2026",
    likes: 96,
    comments: 11,
  },
]

const info = [
  {
    icon: (p: IconProps) => (
      <MapPin {...p} />
    ),
    label: "Berlin, Germany",
  },
  {
    icon: (p: IconProps) => (
      <Link {...p} />
    ),
    label: "priyanair.design",
  },
  {
    icon: (p: IconProps) => (
      <Calendar {...p} />
    ),
    label: "Joined March 2021",
  },
]

export default function ProfileBlock() {
  const [following, setFollowing] = React.useState(false)

  return (
    <section className="flex min-h-svh w-full justify-center bg-muted/30 px-6 py-16 text-foreground">
      <div className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-background">
        <div
          className="h-32 w-full rounded-t-xl bg-linear-to-br from-primary/25 via-primary/10 to-background"
          aria-hidden="true"
        />

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between gap-4">
            <Avatar className="-mt-10 size-20 border-4 border-background">
              <AvatarImage
                src="/pravatar/160?img=32"
                alt="Priya Nair"
                className=""
              />
              <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" size="sm">
                Message
              </Button>
              <Button
                size="sm"
                aria-pressed={following}
                variant={following ? "outline" : "default"}
                onClick={() => setFollowing((v) => !v)}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold tracking-tight">
              Priya Nair
            </h1>
            <Badge variant="secondary">Pro</Badge>
          </div>
          <p className="text-sm text-muted-foreground">@priyanair</p>
          <p className="mt-3 text-sm/relaxed text-foreground/80">
            Staff product designer. Writing about design systems, tokens, and
            the craft of shipping calm software.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {stats.map((stat) => (
              <span key={stat.label} className="flex items-baseline gap-1.5">
                <span className="font-semibold tabular-nums">{stat.value}</span>
                <span className="text-muted-foreground">{stat.label}</span>
              </span>
            ))}
          </div>

          <Tabs defaultValue="posts" className="mt-6 gap-4">
            <TabsList className="w-full">
              <TabsTrigger value="posts" className="flex-1">
                Posts
              </TabsTrigger>
              <TabsTrigger value="about" className="flex-1">
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="posts"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:[&>*:last-child]:col-span-2"
            >
              {posts.map((post) => (
                <article
                  key={post.title}
                  className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4"
                >
                  <h2 className="font-heading text-sm font-semibold">
                    {post.title}
                  </h2>
                  <p className="text-xs/relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="tabular-nums">{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3.5" aria-hidden="true" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      {post.comments}
                    </span>
                  </div>
                </article>
              ))}
            </TabsContent>

            <TabsContent value="about" className="flex flex-col gap-4">
              <p className="text-sm/relaxed text-foreground/80">
                Designer and writer focused on the systems behind good products.
                Previously at Acme and Northwind, now building tools for design
                teams.
              </p>
              <Separator />
              <ul className="flex flex-col gap-2.5">
                {info.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
