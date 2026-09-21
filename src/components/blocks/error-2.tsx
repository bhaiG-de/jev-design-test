import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight } from "lucide-react"

const popularPages = [
  "Getting started",
  "Installation guide",
  "Components reference",
  "Theming and tokens",
]

export default function ErrorBlock() {
  return (
    <section className="flex min-h-svh w-full items-center justify-center bg-background px-6 py-12">
      <div className="flex flex-col items-center gap-8 rounded-2xl bg-card p-10 text-center text-foreground">
        <div className="flex flex-col items-center gap-2">
          <span className="text-6xl font-bold tracking-tight tabular-nums sm:text-7xl">
            404
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            We could not find the page you were looking for. Try searching, or
            pick one of the popular pages below.
          </p>
        </div>

        <form
          action="#"
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <Input
            type="search"
            placeholder="Search the docs..."
            aria-label="Search the docs"
            className="h-9 flex-1 text-sm"
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            <Search data-icon="inline-start" aria-hidden="true" />
            Search
          </Button>
        </form>

        <div className="flex w-full max-w-md flex-col gap-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Popular pages
          </p>
          <ul className="flex flex-col border-t border-border">
            {popularPages.map((page) => (
              <li key={page} className="border-b border-border">
                <a
                  href="#"
                  className="group flex items-center justify-between gap-4 py-2.5 text-sm text-primary"
                >
                  <span>{page}</span>
                  <ArrowRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
