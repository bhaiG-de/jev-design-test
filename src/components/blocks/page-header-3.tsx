import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function PageHeaderBlock() {
  return (
    <section className="min-h-svh w-full bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your workspace preferences, members, and billing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button>
              <Plus data-icon="inline-start" aria-hidden="true" />
              New Webhook
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6 gap-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-lg border border-border bg-muted/30"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg border border-border bg-muted/30"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="grid gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg border border-border bg-muted/30"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
