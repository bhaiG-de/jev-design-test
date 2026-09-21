import type { ComponentType, CSSProperties, ReactNode } from "react";
import { AppFrame, ContentFrame, MarketingChrome } from "@/components/pages/AppShell";
import { getPage } from "@/lib/pages";
import { ShaderBackdrop } from "@/components/ShaderBackdrop";
import Activity1 from "@/components/blocks/activity-1";
import Billing1 from "@/components/blocks/billing-1";
import Billing5 from "@/components/blocks/billing-5";
import Kanban2 from "@/components/blocks/kanban-2";
import Onboarding6 from "@/components/blocks/onboarding-6";
import Profile2 from "@/components/blocks/profile-2";
import AiChat1 from "@/components/blocks/ai-chat-1";
import AiChat2 from "@/components/blocks/ai-chat-2";
import AiChat3 from "@/components/blocks/ai-chat-3";
import Auth1 from "@/components/blocks/auth-1";
import Auth2 from "@/components/blocks/auth-2";
import Auth3 from "@/components/blocks/auth-3";
import Auth4 from "@/components/blocks/auth-4";
import Auth5 from "@/components/blocks/auth-5";
import Auth6 from "@/components/blocks/auth-6";
import Auth8 from "@/components/blocks/auth-8";
import Calendar1 from "@/components/blocks/calendar-1";
import Calendar2 from "@/components/blocks/calendar-2";
import Calendar3 from "@/components/blocks/calendar-3";
import Chat1 from "@/components/blocks/chat-1";
import Chat2 from "@/components/blocks/chat-2";
import Chat4 from "@/components/blocks/chat-4";
import EmptyStates1 from "@/components/blocks/empty-states-1";
import EmptyStates2 from "@/components/blocks/empty-states-2";
import EmptyStates3 from "@/components/blocks/empty-states-3";
import EmptyStates4 from "@/components/blocks/empty-states-4";
import Error1 from "@/components/blocks/error-1";
import Error2 from "@/components/blocks/error-2";
import Error3 from "@/components/blocks/error-3";
import Faqs1 from "@/components/blocks/faqs-1";
import Faqs2 from "@/components/blocks/faqs-2";
import Faqs3 from "@/components/blocks/faqs-3";
import Faqs4 from "@/components/blocks/faqs-4";
import Faqs5 from "@/components/blocks/faqs-5";
import Kanban1 from "@/components/blocks/kanban-1";
import Kanban3 from "@/components/blocks/kanban-3";
import Notifications3 from "@/components/blocks/notifications-3";
import Notifications4 from "@/components/blocks/notifications-4";
import Onboarding1 from "@/components/blocks/onboarding-1";
import Onboarding2 from "@/components/blocks/onboarding-2";
import Onboarding3 from "@/components/blocks/onboarding-3";
import Onboarding4 from "@/components/blocks/onboarding-4";
import Onboarding5 from "@/components/blocks/onboarding-5";
import Pricing1 from "@/components/blocks/pricing-1";
import Pricing2 from "@/components/blocks/pricing-2";
import Pricing3 from "@/components/blocks/pricing-3";
import Pricing4 from "@/components/blocks/pricing-4";
import Pricing5 from "@/components/blocks/pricing-5";
import Profile1 from "@/components/blocks/profile-1";
import Settings1 from "@/components/blocks/settings-1";
import Settings2 from "@/components/blocks/settings-2";
import Settings3 from "@/components/blocks/settings-3";
import Settings4 from "@/components/blocks/settings-4";
import Team1 from "@/components/blocks/team-1";
import { AuthPage as EfferdAuth1 } from "@/components/efferd/auth-1";
import { AuthPage as EfferdAuth2 } from "@/components/efferd/auth-2";
import { AuthPage as EfferdAuth3 } from "@/components/efferd/auth-3";
import { AuthPage as EfferdAuth4 } from "@/components/efferd/auth-4";
import { AuthPage as EfferdAuth5 } from "@/components/efferd/auth-5";
import { FaqsSection as EfferdFaqs1 } from "@/components/efferd/faqs-1";
import { FaqsSection as EfferdFaqs2 } from "@/components/efferd/faqs-2";
import { FaqsSection as EfferdFaqs3 } from "@/components/efferd/faqs-3";
import { FaqsSection as EfferdFaqs4 } from "@/components/efferd/faqs-4";
import { FaqsSection as EfferdFaqs5 } from "@/components/efferd/faqs-5";
import { NotFoundPage as EfferdNotFound1 } from "@/components/efferd/not-found-1";
import { NotFoundPage as EfferdNotFound2 } from "@/components/efferd/not-found-2";
import { PricingSection as EfferdPricing1 } from "@/components/efferd/pricing-1";
import { PricingSection as EfferdPricing2 } from "@/components/efferd/pricing-2";
import { PricingSection as EfferdPricing3 } from "@/components/efferd/pricing-3";
import { PricingSection as EfferdPricing4 } from "@/components/efferd/pricing-4";

// Block-based page types: every `layout` option is a real, unmodified
// registry block (7ovr, Base UI like our preset). Option names must match
// the criteria keys in src/lib/pages.ts. `shell` pages also take the shared
// `nav` slot and render inside the app chrome so a settings frame is a full
// screen, not a floating card.
type Wrap = "shell" | "center" | "plain";

interface BlockPageDef {
  wrap: Wrap;
  options: Record<string, ComponentType>;
  /** Options that render their own h1 page title; the shell's page header is skipped for them. */
  ownHeader?: string[];
  /** Fixed-height panels (chat) get stretched to the page height. */
  fill?: boolean;
}

// `content` modes that add a page header fall back to their headerless twin
// when the block already has a title, so a screen never shows two h1s.
const WITHOUT_HEADER: Record<string, string> = { "with-page-header": "full", "header-and-aside": "with-aside" };

// Aside material per page type for the `with-aside` / `header-and-aside`
// content modes — drawn from the same product area so the same profile card
// doesn't show up on every screen.
const ASIDES: Record<string, ReactNode> = {
  settings: <Billing1 />,
  notifications: <Onboarding6 />,
  "ai-chat": <Activity1 />,
  messaging: <Profile2 />,
  calendar: <Kanban2 />,
  kanban: <Activity1 />,
  profile: <Onboarding6 />,
  "empty-state": <Billing5 />,
};

const DEFS: Record<string, BlockPageDef> = {
  settings: {
    wrap: "shell",
    options: { "grouped-cards": Settings1, "compact-card": Settings2, tabbed: Settings3, "section-nav": Settings4 },
    ownHeader: ["grouped-cards", "section-nav", "tabbed"],
  },
  notifications: {
    wrap: "shell",
    options: {
      "center-tabs": Notifications3,
      preferences: Notifications4,
      "caught-up-empty": EmptyStates1,
    },
  },
  "ai-chat": {
    wrap: "shell",
    options: { "bubbles-thread": AiChat1, "suggested-prompts-first": AiChat2, "live-typing": AiChat3 },
    fill: true,
  },
  messaging: {
    wrap: "shell",
    options: { "one-to-one": Chat1, "two-pane-inbox": Chat2, "group-chat": Chat4 },
    fill: true,
  },
  calendar: {
    wrap: "shell",
    options: { "month-grid": Calendar1, "week-agenda": Calendar2, "month-week-toggle": Calendar3 },
  },
  kanban: {
    wrap: "shell",
    options: { "three-column": Kanban1, "four-column": Kanban3 },
    ownHeader: ["three-column", "four-column"],
  },
  profile: {
    wrap: "shell",
    options: { "cover-banner": Profile1, "team-grid": Team1 },
    ownHeader: ["team-grid"],
  },
  "empty-state": {
    wrap: "shell",
    options: {
      "caught-up": EmptyStates1,
      "empty-inbox-create": EmptyStates2,
      "no-results": EmptyStates3,
      "load-error": EmptyStates4,
    },
  },
  login: {
    wrap: "center",
    options: {
      "centered-card": Auth1,
      "split-brand-panel": Auth2,
      "split-screen-grid": Auth4,
      "tabbed-signin-signup": Auth5,
      "forgot-password": Auth6,
      "particle-backdrop": EfferdAuth1,
      "split-social": EfferdAuth2,
      "minimal-logo-header": EfferdAuth3,
      "divider-social": EfferdAuth4,
    },
  },
  signup: {
    wrap: "center",
    options: {
      "centered-card": Auth8,
      "with-plan-sidebar": Auth3,
      "tabbed-signin-signup": Auth5,
      "testimonial-sidebar": EfferdAuth5,
    },
  },
  onboarding: {
    wrap: "center",
    options: {
      "welcome-checklist": Onboarding1,
      "three-step-cards": Onboarding2,
      wizard: Onboarding3,
      "first-run-empty": Onboarding4,
      "invite-teammates-step": Onboarding5,
    },
  },
  pricing: {
    wrap: "plain",
    options: {
      "three-tier-cards": Pricing1,
      "two-plan-split": Pricing2,
      "single-plan": Pricing3,
      "three-tier-yearly-total": Pricing4,
      "comparison-table": Pricing5,
      "monthly-yearly-side-by-side": EfferdPricing1,
      "divided-grid": EfferdPricing2,
      "three-card-icons": EfferdPricing3,
      "animated-toggle": EfferdPricing4,
    },
  },
  faq: {
    wrap: "plain",
    options: {
      accordion: Faqs1,
      "two-column": Faqs2,
      "with-contact-card": Faqs3,
      "sticky-support-sidebar": Faqs4,
      "help-center-search-tabs": Faqs5,
      "elegant-accordion-cta": EfferdFaqs1,
      "split-screen-cta-footer": EfferdFaqs2,
      "guide-line-two-column": EfferdFaqs3,
      "sidebar-category-filters": EfferdFaqs4,
      "search-filter-accordion": EfferdFaqs5,
    },
  },
  "error-page": {
    wrap: "center",
    options: {
      "404-minimal": Error1,
      "404-recovery-search": Error2,
      "500-server-error": Error3,
      "404-bold-typography": EfferdNotFound1,
      "404-masked-typography": EfferdNotFound2,
    },
  },
};

// `backdrop` slot for centered screens.
const BACKDROPS: Record<string, { className: string; style?: CSSProperties }> = {
  plain: { className: "bg-background" },
  muted: { className: "bg-muted" },
  "dot-grid": {
    className: "bg-background",
    style: { backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "20px 20px" },
  },
  gradient: {
    className: "bg-background",
    style: {
      backgroundImage:
        "radial-gradient(ellipse at top, color-mix(in oklch, var(--primary) 18%, transparent), transparent 60%)",
    },
  },
};

function Center({ backdrop, children }: { backdrop?: string; children: ReactNode }) {
  const b = BACKDROPS[backdrop ?? "plain"] ?? BACKDROPS.plain;
  return (
    <div className={`${b.className} shader-host relative isolate flex min-h-full items-center justify-center p-8`} style={b.style}>
      {/* Shader backdrops (mesh-gradient, waves) render behind; null for the CSS ones. */}
      <ShaderBackdrop kind={backdrop} />
      {children}
    </div>
  );
}

function makeBlockPage(id: string, def: BlockPageDef): ComponentType<{ schema: Record<string, string> }> {
  const fallback = Object.values(def.options)[0];
  const title = getPage(id)?.label ?? id;
  return function BlockPage({ schema }) {
    const Block = def.options[schema.layout] ?? fallback;
    if (def.wrap === "shell") {
      const mode = def.ownHeader?.includes(schema.layout) ? (WITHOUT_HEADER[schema.content] ?? schema.content) : schema.content;
      return (
        <AppFrame nav={schema.nav} pageId={id}>
          <ContentFrame mode={mode} title={title} fill={def.fill} aside={ASIDES[id]}>
            <Block />
          </ContentFrame>
        </AppFrame>
      );
    }
    if (def.wrap === "center") {
      return (
        <Center backdrop={schema.backdrop}>
          <Block />
        </Center>
      );
    }
    return (
      <MarketingChrome mode={schema.chrome}>
        <div className="shader-host relative isolate py-12">
          <ShaderBackdrop kind={schema.backdrop} />
          <Block />
        </div>
      </MarketingChrome>
    );
  };
}

export const blockPageRegistry: Record<string, ComponentType<{ schema: Record<string, string> }>> = Object.fromEntries(
  Object.entries(DEFS).map(([id, def]) => [id, makeBlockPage(id, def)]),
);
