import { Button } from "@/components/ui/button"
import { Compass, ArrowLeft } from "lucide-react"

export default function ErrorBlock() {
  return (
    <section className="flex min-h-svh w-full items-center justify-center bg-background px-6 py-12">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-10 text-center text-foreground">
        <p className="font-mono text-7xl font-bold tracking-tighter sm:text-8xl">
          404
        </p>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            The page you are looking for does not exist or has been moved. Check
            the URL, or head back to safety.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            render={<a href="#" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            <Compass data-icon="inline-start" aria-hidden="true" />
            Go Home
          </Button>
          <Button
            variant="outline"
            render={<a href="#" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Go Back
          </Button>
        </div>
      </div>
    </section>
  )
}
