import type { ReactNode } from "react"
import {
  Book,
  Dice4,
  House,
  Settings,
  UsersRound,
  Workflow,
} from "lucide-react"
import {
  HQ_DOMAINS,
  HQ_PAGES,
  chromeForPage,
  type HqDomain,
} from "@/lib/hq-chrome"
import { cn } from "@/lib/utils"

const DOMAIN_ICONS: Record<HqDomain, typeof House> = {
  home: House,
  loans: Book,
  pools: Dice4,
  workflows: Workflow,
  users: UsersRound,
  settings: Settings,
}

const ASSETS = [
  { symbol: "BTC", price: "$83,245" },
  { symbol: "ETH", price: "$1,612" },
  { symbol: "SOL", price: "$119.48" },
]

function IconRail({ active }: { active: HqDomain }) {
  return (
    <div className="relative flex w-[45px] shrink-0 flex-col items-center gap-2 border-r border-border bg-background p-2">
      {HQ_DOMAINS.map((section) => {
        const Icon = DOMAIN_ICONS[section.id]
        const isActive = section.id === active
        return (
          <div key={section.id} className="relative">
            <div
              className={cn(
                "absolute -left-2 top-1/2 w-1 -translate-y-1/2 rounded-r-full transition-all",
                section.color,
                isActive ? "h-5 opacity-100" : "h-0 opacity-0",
              )}
            />
            <span
              aria-label={section.label}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-white",
                section.color,
                isActive ? "opacity-100" : "opacity-40",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PagesSidebar({
  domain,
  pageTitle,
}: {
  domain: HqDomain
  pageTitle: string
}) {
  const items = HQ_PAGES[domain]
  return (
    <div className="flex w-52 shrink-0 flex-col border-r border-border bg-background">
      <div className="px-3 py-3 text-xs font-medium text-muted-foreground">{HQ_DOMAINS.find((d) => d.id === domain)?.label}</div>
      <nav className="flex flex-col gap-0.5 px-2">
        {items.map((item) => {
          const active = item.title === pageTitle
          return (
            <span
              key={item.title}
              className={cn(
                "rounded-md px-2 py-1.5 text-[13px]",
                active ? "bg-sidebar-accent font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {item.title}
            </span>
          )
        })}
      </nav>
    </div>
  )
}

function TopBar() {
  return (
    <div className="flex h-10 shrink-0 items-center border-b bg-background px-3">
      <span className="mr-4 text-xs font-semibold">Maple</span>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {ASSETS.map((asset) => (
          <div key={asset.symbol} className="flex items-center gap-1.5">
            <span className="text-xs font-medium">{asset.symbol}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs tabular-nums text-muted-foreground">{asset.price}</span>
          </div>
        ))}
        <div className="h-4 w-px bg-border" aria-hidden />
        <div className="flex items-center gap-1">
          <span className="relative mr-0.5 flex size-1.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-orange-500 opacity-60" />
            <span className="relative block size-1.5 rounded-full bg-orange-500" />
          </span>
          <span className="text-xs font-medium text-foreground">2</span>
          <span className="text-xs text-muted-foreground">Margin calls</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-0.5 block size-1.5 rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-foreground">6</span>
          <span className="text-xs text-muted-foreground">At risk</span>
        </div>
      </div>
    </div>
  )
}

function PageBar({ title }: { title: string }) {
  return (
    <div className="flex h-14 shrink-0 items-center border-b bg-background px-4">
      <span className="text-sm font-medium">{title}</span>
    </div>
  )
}

export function HqAppFrame({
  nav,
  pageId,
  pageTitle: pageTitleOverride,
  children,
}: {
  nav?: string
  pageId?: string
  pageTitle?: string
  children: ReactNode
}) {
  const chrome = chromeForPage(pageId ?? "")
  const pageTitle = pageTitleOverride ?? chrome.pageTitle
  const collapsed = nav === "collapsed"
  return (
    <div className="flex h-full min-h-full flex-col bg-background">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <IconRail active={chrome.domain} />
        {!collapsed && <PagesSidebar domain={chrome.domain} pageTitle={pageTitle} />}
        <div className="flex min-w-0 flex-1 flex-col">
          <PageBar title={pageTitle} />
          <div className="@container/main flex min-h-0 flex-1 flex-col overflow-auto">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
