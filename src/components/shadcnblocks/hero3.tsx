import { ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
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

interface HeroBasicProps {
  heading: string
  description: string
  buttons?: Buttons
  image: Image
  className?: string
}

interface Hero3Props extends HeroBasicProps {
  reviews?: Hero3Reviews
}
type Props = Partial<Hero3Props>

const defaultProps: Hero3Props = {
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
  reviews: {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar1.jpg",
        alt: "Mia Chen",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar2.jpg",
        alt: "Marcus Rivera",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar3.jpg",
        alt: "Priya Sharma",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar4.jpg",
        alt: "James Okafor",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar5.jpg",
        alt: "Sofia Chen",
      },
    ],
  },
}

const MAX_REVIEW_AVATARS = 5

interface Hero3Reviews {
  count: number
  rating: number
  avatars: { src: string; alt: string }[]
}

const Hero3 = (props: Props) => {
  const { heading, description, buttons, reviews, image, className } = {
    ...defaultProps,
    ...props,
  }

  const reviewAvatars = (reviews?.avatars ?? []).slice(0, MAX_REVIEW_AVATARS)

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:ml-auto lg:order-1 lg:items-start lg:text-left">
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-balance md:text-4xl lg:max-w-md lg:text-5xl">
              {heading}
            </h1>
            <p className="max-w-5xl text-balance text-muted-foreground lg:text-xl">
              {description}
            </p>
            {reviews && (
              <div className="flex w-fit flex-col items-center gap-4 sm:flex-row">
                <span className="inline-flex items-center -space-x-3">
                  {reviewAvatars.map((avatar, index) => (
                    <Avatar
                      key={index}
                      className="size-10 bg-background ring-2 ring-background after:hidden"
                    >
                      <AvatarImage src={avatar.src} alt={avatar.alt} />
                    </Avatar>
                  ))}
                </span>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="size-5 fill-none stroke-amber-500 dark:stroke-amber-400"
                      />
                    ))}
                    <span className="ml-1 font-semibold text-foreground">
                      {reviews.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-left font-medium text-muted-foreground">
                    from {reviews.count}+ reviews
                  </p>
                </div>
              </div>
            )}
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button size="lg" className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
              {buttons?.secondary && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-background sm:w-auto dark:bg-background"
                >
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </div>
          <div className="flex w-full lg:order-2">
            {image.srcDark ? (
              <>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-video max-h-[600px] w-full rounded-xl border border-border object-cover object-top shadow-sm lg:max-h-[800px] dark:hidden"
                />
                <img
                  src={image.srcDark}
                  alt={image.alt}
                  className="hidden aspect-video max-h-[600px] w-full rounded-xl border border-border object-cover object-top shadow-sm lg:max-h-[800px] dark:block"
                />
              </>
            ) : (
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-video max-h-[600px] w-full rounded-xl border border-border object-cover object-top shadow-sm lg:max-h-[800px]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero3 }
