import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Toaster } from "@/components/ui/sonner"
import { CircleAlert, RefreshCw, Headset } from "lucide-react"

export default function EmptyStatesBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Toaster />
      <div className="flex min-h-[720px] w-full items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-border bg-card">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="bg-destructive/10 text-destructive"
              >
                <CircleAlert className="size-4" />
              </EmptyMedia>
              <EmptyTitle>Something went wrong</EmptyTitle>
              <EmptyDescription>
                We hit an unexpected error while loading your data. Check your
                connection and try again in a few moments.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <Button
                  onClick={() =>
                    toast.success("Retrying…", {
                      id: "retrying",
                      description: "Reloading your data.",
                    })
                  }
                >
                  <RefreshCw data-icon="inline-start" className="text-destructive" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast("Support", {
                      id: "support",
                      description: "Opening a support ticket.",
                    })
                  }
                >
                  <Headset data-icon="inline-start" />
                  Contact Support
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    </section>
  )
}
