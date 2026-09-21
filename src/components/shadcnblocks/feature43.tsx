import {
  Blocks,
  ChartLine,
  Globe,
  Layers,
  Lock,
  Palette,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FeatureIconListItem {
  title: string
  description: string
  icon?: React.ReactNode
  href?: string
}
interface Button {
  text: string
  url: string
  icon?: React.ReactNode
}
interface Buttons {
  primary?: Button
  secondary?: Button
}

interface FeatureIconListProps {
  heading: string
  features?: FeatureIconListItem[]
  buttons?: Buttons
  className?: string
}

interface Feature43Props extends FeatureIconListProps {}
type Props = Partial<Feature43Props>

const defaultProps: Feature43Props = {
  heading: "Build faster with production ready features",
  features: [
    {
      icon: <Zap className="size-5" />,
      title: "Full Source Code",
      description:
        "Every block ships as plain React you own. No runtime dependency, no SDK lock-in, just copy and customize.",
    },
    {
      icon: <Palette className="size-5" />,
      title: "Responsive Design",
      description:
        "Every block adapts seamlessly from mobile to desktop with Tailwind's mobile-first utility classes.",
    },
    {
      icon: <Shield className="size-5" />,
      title: "Accessibility & Usability",
      description:
        "Built on Radix UI primitives with proper ARIA attributes, keyboard navigation, and focus management.",
    },
    {
      icon: <Settings className="size-5" />,
      title: "TypeScript Native",
      description:
        "Fully typed props and interfaces so your editor catches issues before they reach production.",
    },
    {
      icon: <Layers className="size-5" />,
      title: "Customizable",
      description:
        "Override any prop, swap icons, adjust spacing — every block is designed to be extended, not locked down.",
    },
    {
      icon: <Rocket className="size-5" />,
      title: "Production Ready",
      description:
        "Battle-tested in real projects. No placeholder hacks, no lorem ipsum — clean code you can ship today.",
    },
    {
      icon: <Blocks className="size-5" />,
      title: "Registry Compatible",
      description:
        "Install blocks directly with the shadcn CLI. Dependencies and registry items are listed in every block's MDX.",
    },
    {
      icon: <Globe className="size-5" />,
      title: "Framework Agnostic",
      description:
        "Plain ESM + React that works with Next.js, Vite, Remix, and Astro without any Shadcnblocks SDK.",
    },
    {
      icon: <ChartLine className="size-5" />,
      title: "Consistent Spacing",
      description:
        "Shared section padding, container widths, and gap scales so blocks stack into cohesive pages.",
    },
    {
      icon: <Sparkles className="size-5" />,
      title: "Theme Tokens",
      description:
        "All colors come from your shadcn/ui theme — foreground, muted, primary, card — no hardcoded values.",
    },
    {
      icon: <Workflow className="size-5" />,
      title: "Copy Paste Workflow",
      description:
        "Browse the explorer, preview with your theme, then copy the code directly into your project.",
    },
    {
      icon: <Lock className="size-5" />,
      title: "Open Source",
      description:
        "MIT-licensed source code you own completely. Fork it, modify it, sell products built with it.",
    },
  ],
  buttons: {
    primary: {
      text: "Browse Components",
      url: "https://www.shadcnblocks.com",
    },
  },
}

const MAX_FEATURES = 6

const Feature43 = (props: Props) => {
  const { heading, buttons, features, className } = {
    ...defaultProps,
    ...props,
  }
  const items = (features ?? []).slice(0, MAX_FEATURES)

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        {heading && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        {buttons?.primary?.url && (
          <div className="mt-16 flex justify-center">
            <Button size="lg">
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export { Feature43 }
