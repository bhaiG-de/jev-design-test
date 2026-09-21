// One-time vocabulary: each page type is a full screen composed of slots,
// and each slot has a few named, pre-built layout options. Jev's only job is
// to return a probability distribution over each slot's options for a given
// request; code samples combos and renders them. Content is fixed placeholder
// copy inside the block components (the way shadcn's own blocks do it) —
// nothing here is generated.
//
// Framework-free on purpose: vite.config.ts (server) and the browser bundle
// both import this file. Option names are the registry keys in
// src/components/pages/*.

export interface SlotDef {
  /** The Jev Choice question asked about this slot's layout. */
  instructions: string;
  /** Named layout options -> description; used as Jev criteria and as registry keys. */
  criteria: Record<string, string>;
}

export interface PageTypeDef {
  id: string;
  label: string;
  /** Helps Jev route a free-text request to this page type. */
  routingDescription: string;
  slots: Record<string, SlotDef>;
  /** Partial schemas that must never be sampled together (e.g. no chart AND no table). */
  exclude?: Record<string, string>[];
}

// Shared by every in-product screen so Jev is asked the same navigation
// question with the same option names everywhere.
export const NAV_SLOT: SlotDef = {
  instructions: "Which app navigation structure best fits this request?",
  criteria: {
    sidebar: "A full left sidebar with grouped navigation links and a user footer; a slim header above the content.",
    rail: "A narrow icon-only left rail (labels on hover) to maximise content width; slim header above the content.",
    topbar: "No sidebar; a single horizontal top bar carrying the brand and navigation links.",
  },
};

// How the main block sits inside the app shell — this is what moves the
// content around on screen, independent of which block it is. Every app
// screen shares the same shell structure (nav + header + content area);
// which nav variant is Jev's pick via NAV_SLOT.
export const CONTENT_SLOT: SlotDef = {
  instructions: "How should the main content be laid out inside the content area?",
  criteria: {
    full: "Content stretches the full width of the content area.",
    narrow: "Content centered in a narrower column with generous side margins.",
    "with-aside": "Content beside a right-hand aside column holding a compact profile card and a getting-started checklist.",
    "with-page-header": "A page header (title, description, primary action, tabs) above full-width content.",
    "header-and-aside": "A page header above content that sits beside a right-hand activity feed.",
  },
};

export const BACKDROP_SLOT: SlotDef = {
  instructions: "What backdrop should sit behind this centered screen?",
  criteria: {
    plain: "A plain page background.",
    muted: "A soft muted panel background.",
    "dot-grid": "A subtle dot-grid pattern background.",
    gradient: "A soft radial brand gradient glowing behind the content.",
    "mesh-gradient": "A slowly flowing mesh gradient in brand tones filling the whole backdrop.",
    "grain-gradient": "A soft grainy gradient wash in brand tones across the backdrop.",
    waves: "Thin wave lines in the brand color across the backdrop.",
    "dot-orbit": "A subtle orbiting dot-field pattern in brand tones across the backdrop.",
  },
};

// Shader backdrops (Paper Shaders) behind a marketing section or hero.
export const SHADER_BG_SLOT: SlotDef = {
  instructions: "What should sit behind this section?",
  criteria: {
    none: "A plain page background.",
    "mesh-gradient": "A slowly flowing mesh gradient in brand tones behind the section.",
    "grain-gradient": "A soft grainy gradient wash behind the section.",
    waves: "Thin wave lines in the brand color behind the section.",
    "dot-orbit": "A subtle orbiting dot-field pattern behind the section.",
  },
};

export const CHROME_SLOT: SlotDef = {
  instructions: "What site chrome should frame this marketing section?",
  criteria: {
    none: "The section alone, no site header or footer.",
    "header-inline-nav": "A site header with logo and inline navigation links above the section, no footer.",
    "header-centered-nav": "A header with the logo left and navigation centered above; a footer with grouped link columns below.",
    "header-sticky-cta": "A sticky header with logo, navigation, sign-in link and a primary CTA above; a newsletter footer below.",
  },
};

function appScreen(
  id: string,
  label: string,
  routingDescription: string,
  instructions: string,
  criteria: Record<string, string>,
): PageTypeDef {
  return {
    id,
    label,
    routingDescription,
    slots: { nav: NAV_SLOT, content: CONTENT_SLOT, layout: { instructions, criteria } },
  };
}

function centered(
  id: string,
  label: string,
  routingDescription: string,
  instructions: string,
  criteria: Record<string, string>,
): PageTypeDef {
  return { id, label, routingDescription, slots: { backdrop: BACKDROP_SLOT, layout: { instructions, criteria } } };
}

function marketing(
  id: string,
  label: string,
  routingDescription: string,
  instructions: string,
  criteria: Record<string, string>,
): PageTypeDef {
  return {
    id,
    label,
    routingDescription,
    slots: { chrome: CHROME_SLOT, backdrop: SHADER_BG_SLOT, layout: { instructions, criteria } },
  };
}

export const PAGES: PageTypeDef[] = [
  // ---- in-product screens (nav × layout) --------------------------------
  {
    id: "dashboard",
    label: "Dashboard",
    exclude: [{ chart: "none", table: "none" }],
    routingDescription: "An analytics or metrics overview dashboard: headline KPIs, charts and a records table for operating a product or team.",
    slots: {
      nav: NAV_SLOT,
      kpis: {
        instructions: "How should the headline metrics be presented?",
        criteria: {
          "four-cards": "A row of four equal stat cards, each with a label, big number, trend badge and a one-line note.",
          "stat-strip": "One compact card with all stats inline, separated by dividers; small and dense.",
          "hero-number": "One large primary stat card beside a stack of three smaller supporting stats.",
        },
      },
      chart: {
        instructions: "How much space should charts take on this screen?",
        criteria: {
          "area-full": "One full-width interactive area chart card with a time-range switcher.",
          "bar-full": "One full-width interactive bar chart card with a series toggle.",
          "line-full": "One full-width interactive line chart card with a series toggle.",
          "split-two": "Two half-width chart cards side by side: an area chart and a bar chart.",
          "three-small": "A row of three compact chart cards: a donut with a center total, a radar and a radial gauge.",
          "four-grid": "A 2×2 grid of small chart cards: gradient area, grouped bars, dotted line and a donut.",
          none: "No standalone chart; the numbers and the table carry the page.",
        },
      },
      table: {
        instructions: "How should the detailed records be shown?",
        criteria: {
          "data-table": "A full tabbed data table with row selection, drag handles, column controls and pagination.",
          "simple-list": "A single card with a plain compact table of the most recent records, no controls.",
          none: "No table; the page is a summary view only.",
        },
      },
    },
  },
  appScreen(
    "charts",
    "Charts & reports",
    "A charts, graphs, data-visualization or analytics report screen where the graphs themselves are the content.",
    "Which family of charts should this report lead with?",
    {
      "area-gallery": "A grid of six area charts: plain, linear, step, stacked, gradient-filled and with legend.",
      "bar-gallery": "A grid of six bar charts: vertical, horizontal, grouped, stacked, negative values and mixed.",
      "line-gallery": "A grid of six line charts: plain, linear, step, multi-series, dotted and labeled.",
      "pie-gallery": "A grid of six pie charts: simple, donut, donut with center total, legend, labels and stacked rings.",
      "radar-radial-gallery": "A grid of three radar charts and three radial gauges.",
      "interactive-stack": "Three full-width interactive charts stacked: area, bar and line, each with a range or series toggle.",
    },
  ),
  appScreen(
    "settings",
    "Settings & preferences",
    "An account settings or preferences screen: profile fields, notification toggles, security, workspace configuration.",
    "Which settings page structure best fits this request?",
    {
      "grouped-cards": "Stacked cards: a Profile card (name, email, visibility) above a Notifications card of labeled switches, saved with a toast.",
      "compact-card": "One compact centered card: avatar upload, name and email, timezone, density radios, notification checkboxes, two-factor switch, delete-account.",
      tabbed: "Tabs splitting Account fields, a Billing plan and payment card, and a Team members table with roles.",
      "section-nav": "A left section nav (Profile, Account, Notifications, Billing) that swaps the active section's form cards beside it.",
    },
  ),
  appScreen(
    "notifications",
    "Notifications",
    "A notifications, inbox or activity alerts screen, or notification preference controls.",
    "How should notifications be surfaced?",
    {
      "center-tabs": "A full notification center with All, Unread and Mentions tabs, per-row read toggling and a caught-up empty state.",
      preferences: "A notification preferences panel: one row per activity type with separate email and push switches.",
      "caught-up-empty": "The empty state after clearing: inbox icon, all-caught-up message and a view-all link.",
    },
  ),
  // Billing is composed (like dashboard): the registry's billing blocks are
  // widget cards, so the page arranges them rather than showing one alone.
  {
    id: "billing",
    label: "Billing & payments",
    routingDescription:
      "A billing, subscription, invoices or payment-method screen inside an app (plans, cards on file, invoice history).",
    slots: {
      nav: NAV_SLOT,
      width: {
        instructions: "How wide should the billing content run?",
        criteria: {
          full: "Cards stretch the full width of the content area.",
          contained: "Cards sit in a centered column with generous side margins, like a settings page.",
        },
      },
      layout: {
        instructions: "Which billing page composition best fits this request?",
        criteria: {
          overview: "One integrated billing page: plan summary with storage bar, payment method card, and a paginated invoice table.",
          "plan-and-cards": "Page header, then the current-plan card beside the saved-cards list, with the invoice table below.",
          "invoices-focus": "Page header, then a wide invoice history table with the current-plan card as a side column.",
          "payment-settings": "Page header, then saved payment methods beside an add-card form; no invoices.",
          "add-card": "Page header, then a single narrow column: the add-card form followed by the saved-cards list.",
        },
      },
    },
  },
  appScreen(
    "ai-chat",
    "AI chat",
    "A conversational AI assistant or chatbot screen: message thread with an assistant, prompt composer, suggestions.",
    "Which AI chat thread structure best fits this request?",
    {
      "bubbles-thread": "A message thread of user and assistant bubbles with avatars and timestamps, auto-following scroll, single-line composer.",
      "suggested-prompts-first": "Opens on a suggested-prompt empty state, switching to a thread once a prompt is sent; multi-line composer.",
      "live-typing": "Assistant replies stream live with a shimmering typing indicator, suggestion chips and a textarea composer with shortcut hints.",
    },
  ),
  appScreen(
    "messaging",
    "Messaging",
    "Human-to-human chat or messaging: direct messages, a conversation inbox, group chat, or a customer support chat widget.",
    "Which messaging layout best fits this request?",
    {
      "one-to-one": "A single conversation: contact header, sender-aligned bubbles, date marker and a working composer.",
      "two-pane-inbox": "A two-pane messenger: selectable conversation list beside the active thread, each keeping its own messages.",
      "group-chat": "A group conversation with a member avatar stack header and messages from multiple named senders.",
    },
  ),
  appScreen(
    "calendar",
    "Calendar",
    "A calendar, schedule, agenda or events screen.",
    "Which calendar view best fits this request?",
    {
      "month-grid": "A month grid with prev/next navigation, a Today shortcut, selectable days and a detail panel for the chosen day.",
      "week-agenda": "A weekly agenda listing Monday to Sunday with time-slotted event rows and status colors.",
      "month-week-toggle": "A calendar with a month/week view toggle, event chips on days and an inline day panel.",
    },
  ),
  appScreen(
    "kanban",
    "Tasks & kanban",
    "A task board, kanban, project tracker or to-do management screen.",
    "Which board structure best fits this request?",
    {
      "three-column": "To Do, In Progress and Done columns with drag and drop and cards that open a task detail dialog.",
      "four-column": "To Do, In Progress, Review and Done columns with per-column counts and cross-column drag and drop.",
    },
  ),
  appScreen(
    "profile",
    "User profile",
    "A user or team profile screen: avatar, bio, stats, follow actions, or a directory of team members.",
    "Which profile presentation best fits this request?",
    {
      "cover-banner": "A public profile with cover banner, overlapping avatar, follower stats, Follow and Message actions, posts/about tabs.",
      "team-grid": "A grid of six member cards with avatar, name, role, short bio and social links.",
    },
  ),
  appScreen(
    "empty-state",
    "Empty state",
    "An in-app empty state: nothing here yet, no results, cleared inbox, or data that failed to load.",
    "Which empty state best fits this request?",
    {
      "caught-up": "Cleared notifications: inbox icon, all-caught-up message and a view-all link.",
      "empty-inbox-create": "An empty inbox panel with an illustration, a create-workspace dialog, a Learn More link and support footer.",
      "no-results": "No results for a filtered search: magnifier icon, guidance copy and a Clear Filters action.",
      "load-error": "Data failed to load: destructive alert icon with Try Again and contact-support actions.",
    },
  ),

  // ---- standalone screens (layout only) ---------------------------------
  centered(
    "login",
    "Login",
    "A sign-in / login screen, including forgot-password and passwordless entry.",
    "Which sign-in layout best fits this request?",
    {
      "centered-card": "A centered sign-in card: email, password, remember-me, forgot-password link, Google and GitHub buttons.",
      "split-brand-panel": "Two columns: a dark brand panel listing product features beside a plain email/password form, no social login.",
      "split-screen-grid": "Full-height split screen: form with social buttons beside a dark marketing panel on a grid backdrop.",
      "tabbed-signin-signup": "One card with tabs swapping between sign-in and sign-up forms plus Google, GitHub and Apple buttons.",
      "forgot-password": "A forgot-password card that validates an email then switches to a check-your-inbox confirmation.",
      "particle-backdrop": "A modern sign-in page over an animated particle background with social sign-in buttons.",
      "split-social": "A split sign-in layout: social buttons and an email form on one side, visual panel on the other.",
      "minimal-logo-header": "A minimal sign-in page with a logo header and a single focused form.",
      "divider-social": "A clean sign-in screen with a full-width divider separating social actions from the form.",
    },
  ),
  centered(
    "signup",
    "Signup",
    "A sign-up / registration / create-account screen.",
    "Which sign-up layout best fits this request?",
    {
      "centered-card": "A centered sign-up card: full name, email, password, terms checkbox, Google and GitHub buttons.",
      "with-plan-sidebar": "A sign-up form paired with a plan sidebar listing Free, Pro and Team tiers and a terms checkbox gating submit.",
      "tabbed-signin-signup": "One card with tabs swapping between sign-in and sign-up forms plus social buttons.",
      "testimonial-sidebar": "A modern sign-up page with a customer testimonial sidebar beside the form and social sign-in.",
    },
  ),
  centered(
    "onboarding",
    "Onboarding & account setup",
    "A first-run onboarding, account setup, guided tour, getting-started checklist or invite-teammates step.",
    "Which onboarding structure best fits this request?",
    {
      "welcome-checklist": "A welcome card with a setup progress bar and three checkbox steps.",
      "three-step-cards": "Three numbered step cards (import data, invite teammates, customize) each toggling to complete.",
      wizard: "A multi-step wizard card (profile, workspace, invites, summary) with progress bar and step indicator.",
      "first-run-empty": "A first-run empty state with an illustration, welcome badge, create-project and take-the-tour actions.",
      "invite-teammates-step": "An invite-teammates step (3 of 4) with add/remove email rows, a role select per invite, skip or send.",
    },
  ),
  marketing(
    "pricing",
    "Pricing",
    "A public pricing page or plans comparison: tiers, billing toggle, feature checklists, paywall.",
    "Which pricing layout best fits this request?",
    {
      "three-tier-cards": "Starter, Pro and Enterprise cards with a monthly/annual toggle and a highlighted Most Popular plan.",
      "two-plan-split": "Two plans in one split panel: a filled Pro side beside a plain Starter side, each with checklist and CTA.",
      "single-plan": "One centered plan card with a large price, billing toggle, eight-item checklist, trial note and social proof.",
      "three-tier-yearly-total": "A three-tier grid whose toggle also shows the yearly billed total under each price.",
      "comparison-table": "A static comparison table with plans as columns, grouped feature rows, check/dash cells and a CTA row.",
      "monthly-yearly-side-by-side": "Side-by-side monthly and yearly pricing cards with discount badges.",
      "divided-grid": "A grid pricing layout with full-width dividers between plans and feature lists.",
      "three-card-icons": "Three pricing cards with plan icons and an inline feature comparison.",
      "animated-toggle": "Interactive pricing with a billing-frequency toggle and animated numeric price changes.",
    },
  ),
  marketing(
    "faq",
    "FAQ & help center",
    "A frequently-asked-questions, help center or support articles page.",
    "Which FAQ layout best fits this request?",
    {
      accordion: "A centered accordion under a heading with five collapsible questions.",
      "two-column": "Eight questions split into two balanced accordion columns under a bordered header.",
      "with-contact-card": "An accordion beside an intro column holding a contact-support card that opens a dialog.",
      "sticky-support-sidebar": "An accordion with a sticky sidebar card offering contact support and a documentation link.",
      "help-center-search-tabs": "A help center with live search and General, Billing and Security tabs showing match counts.",
      "elegant-accordion-cta": "An elegant accordion FAQ with smooth transitions and a clear support call-to-action.",
      "split-screen-cta-footer": "A split-screen FAQ with bordered sections, an interactive accordion and a call-to-action footer.",
      "guide-line-two-column": "A two-column FAQ with a bordered layout and a vertical guide line beside the accordion.",
      "sidebar-category-filters": "A multi-category FAQ with sidebar filters and an adaptive accordion layout.",
      "search-filter-accordion": "A responsive FAQ with search, filters and accordions for quick answers.",
    },
  ),
  centered(
    "error-page",
    "Error page",
    "A full-page error: 404 not found, 500 server error, maintenance.",
    "Which error page best fits this request?",
    {
      "404-minimal": "A centered 404 led by a monospace numeral with a short explanation and Go Home / Go Back buttons.",
      "404-recovery-search": "A 404 built for recovery: a docs search form plus a bordered list of popular pages.",
      "500-server-error": "A 500 page with an alert icon, Try Again and Contact Support actions and a reference code.",
      "404-bold-typography": "A minimal 404 with bold typography, subtle borders and clear navigation actions.",
      "404-masked-typography": "A minimalist 404 with large masked typography and clear navigation actions.",
    },
  ),
  {
    id: "landing",
    label: "Landing page",
    routingDescription: "A public marketing homepage or landing page: hero, features, product story.",
    slots: {
      chrome: CHROME_SLOT,
      hero: {
        instructions: "Which hero section layout best fits this request?",
        criteria: {
          "split-image": "Announcement badge, headline, subhead and two CTAs on the left; a product screenshot on the right.",
          "split-review-strip": "Split hero with a row of reviewer avatars and star rating under the copy, beside tall photography.",
          "centered-ratings": "Centered headline and subhead with a single CTA and a ratings row of avatars under it; no imagery.",
          "radial-logo-chip": "Centered hero on a radial glow with a frosted logo chip and a row of tech-stack icon buttons.",
          "muted-panel-bleed-image": "Two-column hero on a muted panel with the image bleeding off the panel edge.",
          "wide-image-three-columns": "Headline over a wide full-width image, followed by three short feature columns.",
          "handset-frame": "Split hero with a phone handset frame on one side and a two-line split headline.",
        },
      },
      "hero-bg": SHADER_BG_SLOT,
      features: {
        instructions: "Which features section layout best fits this request?",
        criteria: {
          "two-column-image": "Two columns: a square image beside a heading, paragraph and one button.",
          "split-row-dual-actions": "A split feature row: image on one side, copy with two action buttons on the other.",
          "icon-cards-footer-imagery": "Icon-led feature cards, each with an image in its footer.",
          "two-column-linked-cards": "Two columns of feature cards with linked titles and imagery.",
          "centered-intro-icon-tiles": "A centered intro paragraph above paired icon tiles.",
          "three-pillar-cards": "Three pillar cards with outlined icons, one per core benefit.",
          "six-up-icon-grid": "A centered intro over a 2×3 grid of six icon features with a CTA.",
          "values-three-column": "A values heading spanning a three-column grid of short points.",
          "icon-reasons-cta": "A list of icon-led reasons ending in a centered call to action.",
          "stacked-icon-tabs": "Stacked icon tabs on one side that swap feature imagery on the other.",
        },
      },
    },
  },
];

export function getPage(id: string): PageTypeDef | undefined {
  return PAGES.find((p) => p.id === id);
}
