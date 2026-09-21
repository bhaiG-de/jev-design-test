import type { ComponentType, CSSProperties, ReactNode } from "react"
import { CommandIcon, DownloadIcon, PlusIcon } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import Activity1 from "@/components/blocks/activity-1"
import Footer1 from "@/components/blocks/footer-1"
import Footer3 from "@/components/blocks/footer-3"
import Header1 from "@/components/blocks/header-1"
import Header2 from "@/components/blocks/header-2"
import Header3 from "@/components/blocks/header-3"
import Onboarding6 from "@/components/blocks/onboarding-6"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// App-screen chrome shared by every in-product page type: nav + header +
// content area, always in that structure. Which nav variant renders is the
// page's `nav` slot (Jev's pick); content-area layouts add the rest.

const shellStyle = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as CSSProperties

function Main({ children }: { children: ReactNode }) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {children}
      </div>
    </div>
  )
}

function SidebarShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider style={shellStyle}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Main>{children}</Main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function RailShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} style={shellStyle}>
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset>
        <SiteHeader />
        <Main>{children}</Main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function TopbarShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-8 border-b px-6">
        <div className="flex items-center gap-2 text-base font-semibold">
          <CommandIcon className="size-5" />
          Acme Inc.
        </div>
        <nav className="flex gap-5 text-sm text-muted-foreground">
          {["Dashboard", "Lifecycle", "Analytics", "Projects", "Team"].map(
            (t, i) => (
              <span
                key={t}
                className={i === 0 ? "font-medium text-foreground" : undefined}
              >
                {t}
              </span>
            )
          )}
        </nav>
        <span className="ml-auto text-sm text-muted-foreground">GitHub</span>
      </header>
      <Main>{children}</Main>
    </div>
  )
}

// Keys match NAV_SLOT in src/lib/pages.ts.
const SHELLS: Record<string, ComponentType<{ children: ReactNode }>> = {
  sidebar: SidebarShell,
  rail: RailShell,
  topbar: TopbarShell,
}

export function AppFrame({
  nav,
  children,
}: {
  nav?: string
  children: ReactNode
}) {
  const Shell = SHELLS[nav ?? "sidebar"] ?? SidebarShell
  return <Shell>{children}</Shell>
}

// Our own page header so the title is the page's real label (the registry
// page-header blocks hard-code "Projects" and ship demo placeholder cards).
export function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button>
          <PlusIcon data-icon="inline-start" />
          New
        </Button>
      </div>
    </div>
  )
}

// `content` slot: how the main block is laid out inside the content area.
// `.block-reset` (index.css) strips the blocks' standalone-page padding,
// min-height, tinted background and inner max-width so the frame owns
// spacing and width.
export function ContentFrame({
  mode,
  title = "Overview",
  description = "Everything in one place, kept up to date.",
  fill = false,
  aside,
  children,
}: {
  mode?: string
  title?: string
  description?: string
  /** Stretch a fixed-height block (chat panels) to the page instead of leaving the lower third empty. */
  fill?: boolean
  /** Page-specific aside material for the aside modes (so the same card isn't on every page type). */
  aside?: ReactNode
  children: ReactNode
}) {
  const body = (
    <div className={`block-reset min-w-0 ${fill ? "block-fill" : ""}`}>
      {children}
    </div>
  )
  switch (mode) {
    case "narrow":
      return <div className="mx-auto w-full max-w-4xl px-4 lg:px-6">{body}</div>
    case "with-aside":
      return (
        <div className="grid gap-6 px-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6">
          {body}
          <aside className="block-reset flex flex-col gap-4">{aside ?? <Onboarding6 />}</aside>
        </div>
      )
    case "with-page-header":
      return (
        <div className="flex flex-col gap-6 px-4 lg:px-6">
          <PageHeader title={title} description={description} />
          {body}
        </div>
      )
    case "header-and-aside":
      return (
        <div className="flex flex-col gap-6 px-4 lg:px-6">
          <PageHeader title={title} description={description} />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {body}
            <aside className="block-reset">{aside ?? <Activity1 />}</aside>
          </div>
        </div>
      )
    default:
      return <div className="px-4 lg:px-6">{body}</div>
  }
}

// `chrome` slot: site header/footer around a marketing section.
const CHROME: Record<
  string,
  { Header?: ComponentType; Footer?: ComponentType }
> = {
  none: {},
  "header-inline-nav": { Header: Header1 },
  "header-centered-nav": { Header: Header2, Footer: Footer1 },
  "header-sticky-cta": { Header: Header3, Footer: Footer3 },
}

export function MarketingChrome({
  mode,
  children,
}: {
  mode?: string
  children: ReactNode
}) {
  const { Header, Footer } = CHROME[mode ?? "none"] ?? {}
  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* .chrome-header (index.css) keeps only the <header> of the block; header-2 ships a skeleton demo body. */}
      {Header && (
        <div className="chrome-header">
          <Header />
        </div>
      )}
      <div className="flex-1">{children}</div>
      {/* .chrome-footer (index.css) strips the footer block's standalone-page
          min-height/centering so it hugs its own content. */}
      {Footer && (
        <div className="chrome-footer">
          <Footer />
        </div>
      )}
    </div>
  )
}
