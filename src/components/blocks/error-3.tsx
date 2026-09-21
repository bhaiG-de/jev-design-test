import { Button } from "@/components/ui/button"
import { CircleAlert, RefreshCw } from "lucide-react"

export default function ErrorBlock() {
  return (
    <section className="flex min-h-svh w-full items-center justify-center bg-background px-6 py-12">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-10 text-center text-foreground">
        <div className="flex size-16 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10">
          <CircleAlert className="size-8 text-destructive" aria-hidden="true" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            An unexpected error occurred while processing your request. Please try
            again, and contact support if the problem persists.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button className="w-full sm:w-auto">
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            Try Again
          </Button>
          <Button
            variant="outline"
            render={<a href="#" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            Contact Support
          </Button>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          Reference: 7OVR-4F2A9
        </p>
      </div>
    </section>
  )
}
