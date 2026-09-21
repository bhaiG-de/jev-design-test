import { Blocks, Globe, Layers, Palette, Rocket, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface FeatureCardListItem {
  title: string
  description: string
  image: Image
  href?: string
  icon?: React.ReactNode
  label?: string
}
interface Image {
  src: string
  alt: string
  srcDark?: string
}

interface FeatureCardListProps {
  heading: string
  features?: FeatureCardListItem[]
  className?: string
}

interface Feature3Props extends FeatureCardListProps {}
type Props = Partial<Feature3Props>

const defaultProps: Feature3Props = {
  heading: "Build faster with production ready features",
  features: [
    {
      icon: <Zap className="size-5" />,
      title: "Full Source Code",
      description:
        "Every block ships as plain React you own. No runtime dependency, no SDK lock-in, just copy and customize.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-1-4x3.svg",
        alt: "Full Source Code",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Palette className="size-5" />,
      title: "Responsive Design",
      description:
        "Every block adapts seamlessly from mobile to desktop with Tailwind's mobile-first utility classes.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-2-4x3.svg",
        alt: "Responsive Design",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Layers className="size-5" />,
      title: "Customizable",
      description:
        "Override any prop, swap icons, adjust spacing — every block is designed to be extended, not locked down.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-3-4x3.svg",
        alt: "Customizable",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Rocket className="size-5" />,
      title: "Production Ready",
      description:
        "Battle-tested in real projects. No placeholder hacks, no lorem ipsum — clean code you can ship today.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-4-4x3.svg",
        alt: "Production Ready",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Blocks className="size-5" />,
      title: "Registry Compatible",
      description:
        "Install blocks directly with the shadcn CLI. Dependencies and registry items are listed in every block's MDX.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-5-4x3.svg",
        alt: "Registry Compatible",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Globe className="size-5" />,
      title: "Framework Agnostic",
      description:
        "Plain ESM + React that works with Next.js, Vite, Remix, and Astro without any Shadcnblocks SDK.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-6-4x3.svg",
        alt: "Framework Agnostic",
      },
      href: "https://www.shadcnblocks.com",
    },
  ],
}

const Feature3 = (props: Props) => {
  const { heading, features, className } = {
    ...defaultProps,
    ...props,
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h2 className="mb-9 text-4xl font-semibold tracking-tight text-balance lg:mb-14 lg:text-5xl">
            {heading}
          </h2>

          <div className="grid w-full grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features?.slice(0, 6).map((feature, index) => (
              <Card key={index}>
                <CardHeader className="pb-1">{feature.icon}</CardHeader>
                <CardContent className="text-left">
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="leading-snug text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter className="justify-end pr-0 pb-0">
                  <img
                    className="aspect-4/3 w-full rounded-tl-xl object-cover object-top"
                    src={feature.image.src}
                    alt={feature.image.alt}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Feature3 }
