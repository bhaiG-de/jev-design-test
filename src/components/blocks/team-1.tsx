import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const members = [
  {
    name: "Clara Hoffmann",
    role: "Co-founder & CEO",
    avatar: "/pravatar/150?img=5",
    bio: "Shapes strategy and culture. Previously founded two B2B SaaS companies and led growth at Stripe.",
    social: { linkedin: "#", twitter: "#", github: null },
  },
  {
    name: "Marcus Tran",
    role: "Co-founder & CTO",
    avatar: "/pravatar/150?img=12",
    bio: "Architect behind the platform. Open-source contributor with a decade of distributed-systems experience.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Amara Osei",
    role: "Head of Design",
    avatar: "/pravatar/150?img=49",
    bio: "Crafts interfaces that feel inevitable. Former principal designer at Figma and Linear.",
    social: { linkedin: "#", twitter: "#", github: null },
  },
  {
    name: "Lena Kovač",
    role: "VP of Engineering",
    avatar: "/pravatar/150?img=24",
    bio: "Scales teams and codebases with equal care. Led engineering at three Series B startups.",
    social: { linkedin: "#", twitter: null, github: "#" },
  },
  {
    name: "Daniel Reyes",
    role: "Head of Product",
    avatar: "/pravatar/150?img=33",
    bio: "Turns customer problems into elegant solutions. Background in product management at Notion and Vercel.",
    social: { linkedin: "#", twitter: "#", github: null },
  },
  {
    name: "Yuna Park",
    role: "Head of Marketing",
    avatar: "/pravatar/150?img=44",
    bio: "Builds brand from zero to recognizable. Previously ran marketing at Loom through their acquisition by Atlassian.",
    social: { linkedin: "#", twitter: "#", github: null },
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

export default function TeamBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-20 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-4xl border border-border px-3 py-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Our Team
          </span>
          <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight">
            The people behind Acme
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A small, focused team that cares deeply about craft, reliability,
            and the people who use what we build.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 md:grid-cols-3">
          {members.map(({ name, role, avatar, bio, social }) => (
            <Card
              key={name}
              className="flex flex-col border-0 bg-card p-0 transition-colors duration-150 hover:bg-muted/40"
            >
              <CardContent className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="size-16 border border-border">
                    <AvatarImage
                      src={avatar}
                      alt={name}
                      className=""
                    />
                    <AvatarFallback className="text-sm font-medium">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-sm leading-none font-semibold text-foreground">
                      {name}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {role}
                    </span>
                    <div className="flex gap-0.5">
                      {social.linkedin && (
                        <Button
                          nativeButton={false}
                          variant="secondary"
                          size="icon-sm"
                          render={
                            <a
                              href={social.linkedin}
                              aria-label={`${name} on LinkedIn`}
                            />
                          }
                        >
                          <LinkedinOutlineMark className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
                        </Button>
                      )}
                      {social.twitter && (
                        <Button
                          nativeButton={false}
                          variant="secondary"
                          size="icon-sm"
                          render={
                            <a
                              href={social.twitter}
                              aria-label={`${name} on X`}
                            />
                          }
                        >
                          <XOutlineMark className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
                        </Button>
                      )}
                      {social.github && (
                        <Button
                          nativeButton={false}
                          variant="secondary"
                          size="icon-sm"
                          render={
                            <a
                              href={social.github}
                              aria-label={`${name} on GitHub`}
                            />
                          }
                        >
                          <GithubOutlineMark className="size-4 text-muted-foreground transition-colors hover:text-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Brand marks are inlined rather than imported from an icon library, which
// would drag a whole extra package into the consumer's install for a handful
// of glyphs.
type MarkProps = React.ComponentProps<"svg"> & { size?: number | string }

function GithubOutlineMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M5.88401 18.6533C5.58404 18.4526 5.32587 18.1975 5.0239 17.8369C4.91473 17.7065 4.47283 17.1524 4.55811 17.2583C4.09533 16.6833 3.80296 16.417 3.50156 16.3089C2.9817 16.1225 2.7114 15.5499 2.89784 15.0301C3.08428 14.5102 3.65685 14.2399 4.17672 14.4263C4.92936 14.6963 5.43847 15.1611 6.12425 16.0143C6.03025 15.8974 6.46364 16.441 6.55731 16.5529C6.74784 16.7804 6.88732 16.9182 6.99629 16.9911C7.20118 17.1283 7.58451 17.1874 8.14709 17.1311C8.17065 16.7489 8.24136 16.3783 8.34919 16.0358C5.38097 15.3104 3.70116 13.3952 3.70116 9.63971C3.70116 8.40085 4.0704 7.28393 4.75917 6.3478C4.5415 5.45392 4.57433 4.37284 5.06092 3.15636C5.1725 2.87739 5.40361 2.66338 5.69031 2.57352C5.77242 2.54973 5.81791 2.53915 5.89878 2.52673C6.70167 2.40343 7.83573 2.69705 9.31449 3.62336C10.181 3.41879 11.0885 3.315 12.0012 3.315C12.9129 3.315 13.8196 3.4186 14.6854 3.62277C16.1619 2.69 17.2986 2.39649 18.1072 2.52651C18.1919 2.54013 18.2645 2.55783 18.3249 2.57766C18.6059 2.66991 18.8316 2.88179 18.9414 3.15636C19.4279 4.37256 19.4608 5.45344 19.2433 6.3472C19.9342 7.28337 20.3012 8.39208 20.3012 9.63971C20.3012 13.3968 18.627 15.3048 15.6588 16.032C15.7837 16.447 15.8496 16.9105 15.8496 17.4121C15.8496 18.0765 15.8471 18.711 15.8424 19.4225C15.8412 19.6127 15.8397 19.8159 15.8375 20.1281C16.2129 20.2109 16.5229 20.5077 16.6031 20.9089C16.7114 21.4504 16.3602 21.9773 15.8186 22.0856C14.6794 22.3134 13.8353 21.5538 13.8353 20.5611C13.8353 20.4708 13.836 20.3417 13.8375 20.1145C13.8398 19.8015 13.8412 19.599 13.8425 19.4094C13.8471 18.7019 13.8496 18.0716 13.8496 17.4121C13.8496 16.7148 13.6664 16.2602 13.4237 16.051C12.7627 15.4812 13.0977 14.3973 13.965 14.2999C16.9314 13.9666 18.3012 12.8177 18.3012 9.63971C18.3012 8.68508 17.9893 7.89571 17.3881 7.23559C17.1301 6.95233 17.0567 6.54659 17.199 6.19087C17.3647 5.77663 17.4354 5.23384 17.2941 4.57702L17.2847 4.57968C16.7928 4.71886 16.1744 5.0198 15.4261 5.5285C15.182 5.69438 14.8772 5.74401 14.5932 5.66413C13.7729 5.43343 12.8913 5.315 12.0012 5.315C11.111 5.315 10.2294 5.43343 9.40916 5.66413C9.12662 5.74359 8.82344 5.69492 8.57997 5.53101C7.8274 5.02439 7.2056 4.72379 6.71079 4.58376C6.56735 5.23696 6.63814 5.77782 6.80336 6.19087C6.94565 6.54659 6.87219 6.95233 6.61423 7.23559C6.01715 7.8912 5.70116 8.69376 5.70116 9.63971C5.70116 12.8116 7.07225 13.9683 10.023 14.2999C10.8883 14.3971 11.2246 15.4769 10.5675 16.0482C10.3751 16.2156 10.1384 16.7802 10.1384 17.4121V20.5611C10.1384 21.5474 9.30356 22.2869 8.17878 22.09C7.63476 21.9948 7.27093 21.4766 7.36613 20.9326C7.43827 20.5204 7.75331 20.2116 8.13841 20.1276V19.1381C7.22829 19.1994 6.47656 19.0498 5.88401 18.6533Z" />
    </svg>
  )
}

function LinkedinOutlineMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.001 9.55005C12.9181 8.61327 14.1121 8 15.501 8C18.5385 8 21.001 10.4624 21.001 13.5V21H19.001V13.5C19.001 11.567 17.434 10 15.501 10C13.568 10 12.001 11.567 12.001 13.5V21H10.001V8.5H12.001V9.55005ZM5.00098 6.5C4.17255 6.5 3.50098 5.82843 3.50098 5C3.50098 4.17157 4.17255 3.5 5.00098 3.5C5.8294 3.5 6.50098 4.17157 6.50098 5C6.50098 5.82843 5.8294 6.5 5.00098 6.5ZM4.00098 8.5H6.00098V21H4.00098V8.5Z" />
    </svg>
  )
}

function XOutlineMark({ size = 24, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z" />
    </svg>
  )
}
