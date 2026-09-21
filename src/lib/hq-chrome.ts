// HQ chrome labels and which domain a page type highlights.
// Framework-free so pages.ts-adjacent code can import it.

export type HqDomain = "home" | "loans" | "pools" | "workflows" | "users" | "settings"

export const HQ_DOMAINS: { id: HqDomain; label: string; color: string }[] = [
  { id: "home", label: "Home", color: "bg-orange-600" },
  { id: "loans", label: "Loans", color: "bg-blue-600" },
  { id: "pools", label: "Pools", color: "bg-teal-600" },
  { id: "workflows", label: "Workflows", color: "bg-emerald-600" },
  { id: "users", label: "Users", color: "bg-pink-600" },
  { id: "settings", label: "Settings", color: "bg-fuchsia-600" },
]

export const HQ_PAGES: Record<HqDomain, { title: string }[]> = {
  home: [{ title: "Home" }, { title: "My tasks" }],
  loans: [
    { title: "Loanbook" },
    { title: "CeFi" },
    { title: "Risk dashboard" },
    { title: "Collateral management" },
    { title: "Collateral deposit" },
  ],
  pools: [
    { title: "Operational wallets" },
    { title: "Pools" },
    { title: "Native assets" },
    { title: "Delegates" },
  ],
  workflows: [
    { title: "All workflows" },
    { title: "Collateral deposit" },
    { title: "Transactions" },
  ],
  users: [
    { title: "Organizations" },
    { title: "Entities" },
    { title: "Users" },
    { title: "Wallets" },
  ],
  settings: [{ title: "Pools" }, { title: "Strategies" }, { title: "Bot settings" }],
}

export const PAGE_CHROME: Record<string, { domain: HqDomain; pageTitle: string }> = {
  dashboard: { domain: "loans", pageTitle: "Loanbook" },
  loanbook: { domain: "loans", pageTitle: "Loanbook" },
  collateral: { domain: "loans", pageTitle: "Collateral management" },
  borrowers: { domain: "users", pageTitle: "Organizations" },
  charts: { domain: "loans", pageTitle: "Charts & reports" },
  settings: { domain: "settings", pageTitle: "Settings" },
  notifications: { domain: "home", pageTitle: "Notifications" },
  billing: { domain: "settings", pageTitle: "Billing" },
  "ai-chat": { domain: "home", pageTitle: "Assistant" },
  messaging: { domain: "home", pageTitle: "Messages" },
  calendar: { domain: "home", pageTitle: "Calendar" },
  kanban: { domain: "home", pageTitle: "Tasks" },
  profile: { domain: "users", pageTitle: "Users" },
  "empty-state": { domain: "loans", pageTitle: "Loanbook" },
}

export function chromeForPage(pageId: string): { domain: HqDomain; pageTitle: string } {
  return PAGE_CHROME[pageId] ?? { domain: "loans", pageTitle: "Overview" }
}
