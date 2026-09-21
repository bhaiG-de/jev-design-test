import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Reviews {
  count: number
  rating: number
  avatars: Avatar[]
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
interface Avatar {
  src: string
  alt: string
}

interface HeroSocialProofProps {
  heading: string
  description: string
  buttons?: Buttons
  reviews?: Reviews
  className?: string
}

interface Hero7Props extends HeroSocialProofProps {}
type Props = Partial<Hero7Props>

const defaultProps: Hero7Props = {
  heading: "Introducing the world's best marketing software.",
  description:
    "Loved by marketers around the world—plan campaigns, track results, and grow faster with the tools teams actually rely on.",
  buttons: {
    primary: {
      text: "Get Started",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View Reviews",
      url: "https://www.shadcnblocks.com",
    },
  },
  reviews: {
    count: 206,
    rating: 4.9,
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

const Hero7 = (props: Props) => {
  const { heading, description, buttons, reviews, className } = {
    ...defaultProps,
    ...props,
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <h1 className="mx-auto max-w-4xl text-3xl font-semibold tracking-tight text-balance lg:text-5xl">
            {heading}
          </h1>
          <p className="mx-auto max-w-4xl text-balance text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>
        {buttons?.primary && (
          <Button size="lg" className="mt-10 h-12 px-8 text-base">
            <a href={buttons.primary.url}>{buttons.primary.text}</a>
          </Button>
        )}
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-3 sm:flex-row sm:gap-2">
          <span className="inline-flex items-center -space-x-3">
            {(reviews?.avatars ?? []).map((avatar, index) => (
              <Avatar key={index} className="size-12 border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="mr-1 font-semibold">
                {reviews?.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-left font-medium text-muted-foreground">
              from {reviews?.count}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero7 }
