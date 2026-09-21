import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export default function PageHeaderBlock() {
  return (
    <section className="min-h-svh w-full bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your team&apos;s projects and track their progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download data-icon="inline-start" aria-hidden="true" />
              Export
            </Button>
            <Button>
              <Plus data-icon="inline-start" aria-hidden="true" />
              New Project
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-border bg-muted/30"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
