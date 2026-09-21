import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Inbox } from "lucide-react"

export default function EmptyStatesBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="flex min-h-[720px] w-full max-w-md items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox className="size-4" />
            </EmptyMedia>
            <EmptyTitle>You&apos;re all caught up</EmptyTitle>
            <EmptyDescription>
              No new notifications right now. We&apos;ll let you know the moment
              something needs your attention.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              render={<a href="#" />}
              nativeButton={false}
            >
              View All Notifications
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </section>
  )
}
