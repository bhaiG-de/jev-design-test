import type { ComponentType } from "react"
import { MarketingChrome } from "@/components/pages/AppShell"
import { ShaderBackdrop } from "@/components/ShaderBackdrop"
import { Feature1 } from "@/components/shadcnblocks/feature1"
import { Feature13 } from "@/components/shadcnblocks/feature13"
import { Feature15 } from "@/components/shadcnblocks/feature15"
import { Feature16 } from "@/components/shadcnblocks/feature16"
import { Feature17 } from "@/components/shadcnblocks/feature17"
import { Feature2 } from "@/components/shadcnblocks/feature2"
import { Feature3 } from "@/components/shadcnblocks/feature3"
import { Feature42 } from "@/components/shadcnblocks/feature42"
import { Feature43 } from "@/components/shadcnblocks/feature43"
import { Feature51 } from "@/components/shadcnblocks/feature51"
import { Hero1 } from "@/components/shadcnblocks/hero1"
import { Hero12 } from "@/components/shadcnblocks/hero12"
import { Hero3 } from "@/components/shadcnblocks/hero3"
import { Hero34 } from "@/components/shadcnblocks/hero34"
import { Hero45 } from "@/components/shadcnblocks/hero45"
import { Hero47 } from "@/components/shadcnblocks/hero47"
import { Hero7 } from "@/components/shadcnblocks/hero7"

// Free-tier shadcnblocks (public /r/{name}.json; Pro blocks 401). Keys match
// the landing `hero` / `features` criteria in src/lib/pages.ts. Copy is the
// blocks' own placeholder content, identical across variants.
const HERO: Record<string, ComponentType> = {
  "split-image": Hero1,
  "split-review-strip": Hero3,
  "centered-ratings": Hero7,
  "radial-logo-chip": Hero12,
  "muted-panel-bleed-image": Hero34,
  "wide-image-three-columns": Hero45,
  "handset-frame": Hero47,
}

const FEATURES: Record<string, ComponentType> = {
  "two-column-image": Feature1,
  "split-row-dual-actions": Feature2,
  "icon-cards-footer-imagery": Feature3,
  "two-column-linked-cards": Feature13,
  "centered-intro-icon-tiles": Feature15,
  "three-pillar-cards": Feature16,
  "six-up-icon-grid": Feature17,
  "values-three-column": Feature42,
  "icon-reasons-cta": Feature43,
  "stacked-icon-tabs": Feature51,
}

export function LandingPage({ schema }: { schema: Record<string, string> }) {
  const Hero = HERO[schema.hero] ?? Hero1
  const Features = FEATURES[schema.features] ?? Feature16
  return (
    <MarketingChrome mode={schema.chrome}>
      {/* .sb-section (index.css) tightens the blocks' py-32 for a 1000px frame;
          .sb-hero/.sb-features give hero and features their own rhythm. */}
      <div className="sb-section sb-hero shader-host relative isolate">
        <ShaderBackdrop kind={schema["hero-bg"]} />
        <Hero />
      </div>
      <div className="sb-section sb-features">
        <Features />
      </div>
    </MarketingChrome>
  )
}
