# Jev Design Test

Type a one-line prompt, get back a canvas full of complete, real UI screens — dashboards, auth flows, pricing pages, settings screens — sampled by [Jev](https://typesafe.ai) (`@typesafe-ai/sdk`) and assembled entirely from real shadcn/Base UI component blocks.

There is no generative UI model here. Jev never writes JSX or copy — it only returns a probability distribution over a fixed, hand-built vocabulary of layouts. Code samples that distribution and renders the result with real components. That's why it's fast (~1-2s per generation) and why nothing ever comes out half-broken.

**[▶ Watch the demo](docs/demo.mp4)** — generating a dashboard, then a calendar, across different sampled layouts.

## What it is

You type something like *"metrics dashboard for a fitness app"* into the prompt bar. A batch of full-page frames appears on an infinite pannable/zoomable canvas — each one a live, real, 1440×1000 screen (not a screenshot, not a mockup) built from actual shadcn blocks. A theme sidebar can re-skin every frame at once (base color, accent, chart palette, radius, fonts) to see the same layouts under different brand tokens.

## How it works

**1. The vocabulary — [`src/lib/pages.ts`](src/lib/pages.ts)**
Eighteen page types are defined up front (the full list is below). Each page type is a set of named **slots** (`nav`, `content`, `layout`, `backdrop`, `chrome`, `hero`, …), and each slot has a handful of named options with a plain-English description. This file is framework-free and imported by both the server and the browser — it's the single source of truth Jev is asked about and the registry keys the renderers look up.

**2. One Jev call — [`vite.config.ts`](vite.config.ts) (`jevApi` dev middleware)**
A single `systemOne` call asks a page-routing question ("which page type fits this request?") plus *every* page type's slot questions at once — speculative fan-out in one round trip. The server keeps only the chosen page's answers and returns their probability distributions to the browser. `TYPESAFE_API_KEY` lives only in this dev-server process; the SDK requires `dangerouslyAllowBrowser` to even attempt a client-side call, which is a deliberate signal to never do that.

**3. Sampling — [`src/lib/sample.ts`](src/lib/sample.ts)**
Jev's raw distributions get turned into N concrete, distinct combinations: every option's probability is floored (Jev often assigns ~0 weight to perfectly reasonable options, which would otherwise never get drawn), then combos are drawn without replacement, picked greedily for maximum spread — so 12 generated frames read as 12 different ideas instead of the same top pick twelve times.

**4. Rendering — [`src/components/pages/`](src/components/pages) and [`src/components/canvas/`](src/components/canvas)**
Each sampled combo becomes one live page frame on the canvas (built on `@xyflow/react`). App-style screens render inside a shared `AppShell` (sidebar/rail/topbar nav + content frame); centered and marketing screens render standalone. Off-screen or small frames drop to a lightweight snapshot for performance, and promote back to live DOM on zoom.

**5. Theming — [`src/components/ThemeMenu.tsx`](src/components/ThemeMenu.tsx)**
A live sidebar restyles every frame's tokens at once — base color, accent, chart palette, radius, fonts — without touching the app's own chrome.

## Page types

Every row is a page type Jev can route a prompt to; the options are the exact, real layouts it samples from for that page type's main slot(s) — nothing here is a placeholder. All of it lives in [`src/lib/pages.ts`](src/lib/pages.ts).

| Page type | Options |
|---|---|
| **Dashboard** | *kpis:* four-cards, stat-strip, hero-number &nbsp;·&nbsp; *chart:* area-full, bar-full, line-full, split-two, three-small, four-grid, none &nbsp;·&nbsp; *table:* data-table, simple-list, none |
| **Charts & reports** | area-gallery, bar-gallery, line-gallery, pie-gallery, radar-radial-gallery, interactive-stack |
| **Settings & preferences** | grouped-cards, compact-card, tabbed, section-nav |
| **Notifications** | center-tabs, preferences, caught-up-empty |
| **Billing & payments** | *width:* full, contained &nbsp;·&nbsp; *layout:* overview, plan-and-cards, invoices-focus, payment-settings, add-card |
| **AI chat** | bubbles-thread, suggested-prompts-first, live-typing |
| **Messaging** | one-to-one, two-pane-inbox, group-chat |
| **Calendar** | month-grid, week-agenda, month-week-toggle |
| **Tasks & kanban** | three-column, four-column |
| **User profile** | cover-banner, team-grid |
| **Empty state** | caught-up, empty-inbox-create, no-results, load-error |
| **Login** | centered-card, split-brand-panel, split-screen-grid, tabbed-signin-signup, forgot-password, particle-backdrop, split-social, minimal-logo-header, divider-social |
| **Signup** | centered-card, with-plan-sidebar, tabbed-signin-signup, testimonial-sidebar |
| **Onboarding & account setup** | welcome-checklist, three-step-cards, wizard, first-run-empty, invite-teammates-step |
| **Pricing** | three-tier-cards, two-plan-split, single-plan, three-tier-yearly-total, comparison-table, monthly-yearly-side-by-side, divided-grid, three-card-icons, animated-toggle |
| **FAQ & help center** | accordion, two-column, with-contact-card, sticky-support-sidebar, help-center-search-tabs, elegant-accordion-cta, split-screen-cta-footer, guide-line-two-column, sidebar-category-filters, search-filter-accordion |
| **Error page** | 404-minimal, 404-recovery-search, 500-server-error, 404-bold-typography, 404-masked-typography |
| **Landing page** | *hero:* split-image, split-review-strip, centered-ratings, radial-logo-chip, muted-panel-bleed-image, wide-image-three-columns, handset-frame &nbsp;·&nbsp; *features:* two-column-image, split-row-dual-actions, icon-cards-footer-imagery, two-column-linked-cards, centered-intro-icon-tiles, three-pillar-cards, six-up-icon-grid, values-three-column, icon-reasons-cta, stacked-icon-tabs |

On top of its own options, every page type also independently samples one or more shared placement slots, which is what keeps two dashboards or two login screens from looking alike beyond just the block that's picked:

- **In-product screens** (dashboard, charts, settings, notifications, billing, ai-chat, messaging, calendar, kanban, profile, empty-state) sample **nav**: `sidebar`, `rail`, `topbar` — and (except dashboard/billing) **content**: `full`, `narrow`, `with-aside`, `with-page-header`, `header-and-aside`.
- **Centered screens** (login, signup, onboarding, error-page) sample **backdrop**: `plain`, `muted`, `dot-grid`, `gradient`, `mesh-gradient`, `grain-gradient`, `waves`, `dot-orbit`.
- **Marketing screens** (pricing, faq, landing) sample **chrome**: `none`, `header-inline-nav`, `header-centered-nav`, `header-sticky-cta` — and a shader **background** behind the hero/section: `none`, `mesh-gradient`, `grain-gradient`, `waves`, `dot-orbit`.

## Getting started

**Prerequisites:** Node 20+, and a Jev (TypeSafe) API key.

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

```
TYPESAFE_API_KEY=your-key-here
```

```bash
npm run dev
```

This opens at `http://localhost:5174` (a fixed port — `strictPort` in [`vite.config.ts`](vite.config.ts), matched by `.claude/launch.json` for the in-app preview). Type a request into the prompt bar at the bottom and hit enter; the canvas fills in with sampled full-page variants. Double-click a frame to zoom into it.

## Project structure

```
src/
  lib/
    pages.ts          # the vocabulary: page types, slots, named options
    sample.ts          # floor + weighted sampling w/o replacement
    page-client.ts      # calls the dev-only /api/generate-page route
  components/
    canvas/            # infinite canvas + per-frame node (@xyflow/react)
    pages/
      AppShell.tsx       # shared nav + content-frame chrome for app screens
      BlockPages.tsx      # slot option name -> real component, for simple page types
      registry.ts         # page type id -> renderer component
      DashboardPage.tsx, BillingPage.tsx, ChartsPage.tsx, LandingPage.tsx
                          # composed renderers for page types with multiple independent slots
    blocks/, efferd/, magicui/, shadcnblocks/, reui/, ui/
                          # vendored real component material, one dir per registry source
    PromptBar.tsx        # the input that kicks off a generation
    ThemeMenu.tsx        # live re-theming sidebar
    ShaderBackdrop.tsx   # Paper Shaders backdrops for marketing/auth screens
vite.config.ts          # dev-only Jev API middleware (jevApi)
components.json         # shadcn config: base-nova style, Base UI, registry URLs
```

## Extending

### Add a layout option to an existing page type

1. Find (or install) a real, complete component block for it — see **Where to get material** below. Never hand-roll a placeholder (a gray box standing in for a chart, a bare skeleton table); it reads as broken, not generated.
2. Add it to the relevant slot's `criteria` in [`src/lib/pages.ts`](src/lib/pages.ts) — a new option key plus a one-line description. That description is the *only* thing Jev sees when deciding whether to pick it, so make it specific.
3. Wire the option name to the component: for block-based page types, add an entry to that page's `options` map in [`src/components/pages/BlockPages.tsx`](src/components/pages/BlockPages.tsx); for composed pages (`dashboard`/`billing`/`charts`/`landing`), add it inside that page's own renderer file.
4. Generate against a prompt that should route there a few times and confirm the new option turns up — variance depends on it having a real (non-zero-floored) share of the distribution.

### Add a whole new page type

1. Add a `PageTypeDef` to the `PAGES` array in [`src/lib/pages.ts`](src/lib/pages.ts): an `id`, a `label`, a `routingDescription` (how Jev decides this page type applies), and one or more slots. Reuse `NAV_SLOT` / `CONTENT_SLOT` for app screens, `BACKDROP_SLOT` for centered screens, `CHROME_SLOT` for marketing sections — or define page-specific slots the way `DashboardPage` has its own `kpis`/`chart`/`table`.
2. Register a renderer: either add a row to `BlockPages.tsx`'s `DEFS` table (one real component per option — the pattern every simple page type like `settings` or `login` already follows), or write a small composed component for page types with several independent slots, then list it in [`src/components/pages/registry.ts`](src/components/pages/registry.ts).
3. Nothing else changes — the Jev call, sampling, canvas rendering, and theming are all generic over `PAGES` / `pageRegistry`.

### Where to get material

Only pull from registries that are actually free and compatible with this project's Base UI / `base-nova` preset (see `components.json` for the exact URLs already configured):

| Registry | Good for | Notes |
|---|---|---|
| `@7ovr` | most block material — auth, pricing, billing, settings, kanban, calendar, chat | Base UI, default-export `XBlock`; install straight into `src/components/blocks/` |
| `@shadcn` (official) | dashboard-01, sidebar variants, login/signup starters, core `ui/*` | already the base install |
| `@charts` | chart blocks | shadcn's new-york-v4 chart registry |
| `@magicui` | animated accents (particles, patterns, etc.) | no filename collisions |
| `@efferd` | extra auth/pricing/faq/dashboard variants | **don't `add` directly** — filenames collide with existing files; fetch the JSON with `npx shadcn view @efferd/<style>/<name>` and hand-write the component into `src/components/efferd/` |
| shadcnblocks **free tier** | marketing hero/feature sections | probe `https://www.shadcnblocks.com/r/<name>.json` before installing — `401` means Pro (skip it), `404` means it doesn't exist |

Skip anything paywalled at the item level — `@reui` blocks, `@tailark`, `@shadcnuikit`, `@beste-ui` — `view`/`add` will simply refuse mid-install.

### Ground rules

- **Real, complete blocks only.** Never a hand-rolled approximation of a component that already exists in a free registry.
- **Every option is a full page**, never a fragment — no dead padding, nothing floating in empty space.
- **One Jev call per generation.** Don't add a follow-up "polish" or "write copy" round trip in the critical path — that's what keeps generation near-instant.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | start the dev server (with the Jev API middleware) |
| `npm run build` | typecheck, then production build |
| `npm run typecheck` | `tsc -b` only |
| `npm run lint` | eslint |
| `npm run format` | prettier, writes in place |
| `npm run preview` | preview a production build |

## License

[MIT](LICENSE)
