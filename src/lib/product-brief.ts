// Static Maple HQ context Jev evaluates against, alongside the user query.
// Framework-free: vite.config.ts and the browser can both import this.

export const PRODUCT_BRIEF = {
  company: "Maple Finance",
  product: "Maple HQ — internal ops for loans, collateral, pools, borrowers, wallets",
  chrome:
    "Icon rail + pages sidebar + top bar + page bar. Sentence case. Flat, border-defined tables. No page-title heading inside content.",
  metrics: ["AUM", "Active loans", "Utilization", "Pending approvals"],
  language:
    "Loan, borrower, organization, entity, pool, collateral, wallet. Loan Health is market risk; State is lifecycle.",
} as const
