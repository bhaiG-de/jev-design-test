import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface Image {
  src: string
  alt: string
  srcDark?: string
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
interface Badge {
  text: string
  announcement?: string
  url?: string
}

interface HeroBasicProps {
  badge?: Badge
  heading: string
  description: string
  buttons?: Buttons
  image: Image
  className?: string
}

interface Hero34Props extends HeroBasicProps {}
type Props = Partial<Hero34Props>

const defaultProps: HeroBasicProps = {
  badge: {
    text: "Changelog v1.1",
    announcement: "Check out our latest updates",
  },
  heading: "Blocks Built With Shadcn & Tailwind",
  description:
    "Finely crafted components built with React, Tailwind and shadcn/ui. Developers can copy and paste these blocks directly into their project.",
  buttons: {
    primary: {
      text: "Browse Components",
      url: "https://shadcnblocks.com",
    },
    secondary: {
      text: "View GitHub",
      url: "https://shadcnblocks.com",
    },
  },
  image: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9.png",
    srcDark:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9-dark.png",
    alt: "Hero Image Placeholder",
  },
}

const Hero34 = (props: Props) => {
  const { badge, heading, description, buttons, image, className } = {
    ...defaultProps,
    ...props,
  }

  return (
    <section className={cn("", className)}>
      <div className="container">
        <div className="grid items-center gap-8 overflow-hidden rounded-xl border border-border bg-muted shadow-sm lg:grid-cols-2">
          <div className="flex flex-col items-center p-16 text-center lg:items-start lg:text-left">
            {badge && (
              <p className="text-sm text-muted-foreground">{badge.text}</p>
            )}
            <h1 className="my-6 text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
              {heading}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button size="lg">
                  <a href={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button variant="outline" size="lg">
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </div>
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export { Hero34 }
