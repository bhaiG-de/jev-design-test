import { useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Check, ArrowRight } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const columns = [
  {
    title: "Product",
    links: ["Blocks", "Templates", "Pricing", "Changelog", "Roadmap"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "API Reference", "Support"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
]

const socials = [
  { label: "GitHub", icon: (p: IconProps) => <GithubMark {...p} /> },
  { label: "X", icon: (p: IconProps) => <XMark {...p} /> },
  { label: "LinkedIn", icon: (p: IconProps) => <LinkedinMark {...p} /> },
  { label: "YouTube", icon: (p: IconProps) => <YoutubeMark {...p} /> },
]

export default function FooterBlock() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    toast.success("You're subscribed", {
      description: `Confirmation sent to ${email}.`,
    })
  }

  return (
    <section className="flex min-h-svh w-full flex-col justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Toaster />
      <footer className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            <a href="#" className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-6 shrink-0 text-primary"
              >
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  transform="rotate(-6 7 7)"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  transform="rotate(5 7 17)"
                />
                <rect
                  x="13"
                  y="13"
                  width="8"
                  height="8"
                  transform="rotate(-4 17 17)"
                />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  transform="rotate(15 17 7)"
                />
              </svg>
              <span className="text-lg font-bold tracking-tight">Acme</span>
            </a>
            <h2 className="mt-6 font-heading text-xl font-bold tracking-tight">
              Ship faster with our newsletter
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Product updates, new blocks, and engineering notes. One email a
              week, no spam.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5">
              <Label htmlFor="footer-email" className="sr-only">
                Email address
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="footer-email"
                  type="email"
                  placeholder="you@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background sm:flex-1"
                  required
                />
                <Button type="submit" disabled={subscribed}>
                  {subscribed ? (
                    <>
                      <Check data-icon="inline-start" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight data-icon="inline-start" />
                    </>
                  )}
                </Button>
              </div>
            </form>
            <p
              className={cn(
                "mt-3 text-xs text-muted-foreground transition-colors",
                subscribed && "text-foreground"
              )}
            >
              {subscribed
                ? "Thanks for subscribing. Check your inbox to confirm."
                : "By subscribing you agree to our Privacy Policy."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-heading text-sm font-bold tracking-tight">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mt-12" />

        <div className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Acme, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="rounded-md border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <social.icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </section>
  )
}

// Brand marks are inlined rather than imported from an icon library: the rest
// of this file uses IconPlaceholder, which resolves to whichever icon set the
// consumer already has, and one brand import would drag a whole extra package
// into their install for a handful of glyphs.
type MarkProps = React.ComponentProps<"svg"> & { size?: number | string }

function GithubMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
    </svg>
  )
}

function LinkedinMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z" />
    </svg>
  )
}

function XMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z" />
    </svg>
  )
}

function YoutubeMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.2439 4C12.778 4.00294 14.1143 4.01586 15.5341 4.07273L16.0375 4.09468C17.467 4.16236 18.8953 4.27798 19.6037 4.4755C20.5486 4.74095 21.2913 5.5155 21.5423 6.49732C21.942 8.05641 21.992 11.0994 21.9982 11.8358L21.9991 11.9884L21.9991 11.9991C21.9991 11.9991 21.9991 12.0028 21.9991 12.0099L21.9982 12.1625C21.992 12.8989 21.942 15.9419 21.5423 17.501C21.2878 18.4864 20.5451 19.261 19.6037 19.5228C18.8953 19.7203 17.467 19.8359 16.0375 19.9036L15.5341 19.9255C14.1143 19.9824 12.778 19.9953 12.2439 19.9983L12.0095 19.9991L11.9991 19.9991C11.9991 19.9991 11.9956 19.9991 11.9887 19.9991L11.7545 19.9983C10.6241 19.9921 5.89772 19.941 4.39451 19.5228C3.4496 19.2573 2.70692 18.4828 2.45587 17.501C2.0562 15.9419 2.00624 12.8989 2 12.1625V11.8358C2.00624 11.0994 2.0562 8.05641 2.45587 6.49732C2.7104 5.51186 3.45308 4.73732 4.39451 4.4755C5.89772 4.05723 10.6241 4.00622 11.7545 4H12.2439ZM9.99911 8.49914V15.4991L15.9991 11.9991L9.99911 8.49914Z" />
    </svg>
  )
}
