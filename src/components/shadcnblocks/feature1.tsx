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

interface FeatureSingleFocusProps {
  heading: string
  description: string
  image: Image
  buttons?: Buttons
  className?: string
}

type Props = Partial<FeatureSingleFocusProps>

const defaultProps: FeatureSingleFocusProps = {
  heading: "Feature blocks ready to ship with shadcn/ui",
  description:
    "Shadcnblocks ships production-ready React sections built with Tailwind CSS and shadcn/ui. Pick a block, preview it with your theme, then paste it in or install with the shadcn CLI.",
  buttons: {
    secondary: {
      text: "View feature",
      url: "https://www.shadcnblocks.com",
    },
  },
  image: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-detail-1-1x1.png",
    alt: "Shadcnblocks section preview in the explorer",
  },
}

const Feature1 = (props: Props) => {
  const { heading, description, image, buttons, className } = {
    ...defaultProps,
    ...props,
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="mb-6 text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
              {heading}
            </h2>
            {description && (
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
                {description}
              </p>
            )}
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons?.secondary ? (
                <Button variant="outline">
                  <a
                    href={buttons.secondary.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {buttons.secondary.text}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
          <img
            src={image.src}
            alt={image.alt}
            className="aspect-square w-full rounded-xl border border-border object-cover shadow-sm"
          />
        </div>
      </div>
    </section>
  )
}

export { Feature1 }
