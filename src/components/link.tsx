import type { AnchorHTMLAttributes, ReactNode } from "react"

// Stand-in for next/link inside fetched blocks; frames are static previews.
export default function Link({ href, children, ...props }: { href: string; children?: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
