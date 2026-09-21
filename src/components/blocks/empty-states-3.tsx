"use client"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { Search, RefreshCw } from "lucide-react"

export default function EmptyStatesBlock() {
  const [query, setQuery] = useState("quarterly")

  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Toaster />
      <div className="flex min-h-[720px] w-full items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-border bg-card">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search className="size-4" />
              </EmptyMedia>
              <EmptyTitle>No results found</EmptyTitle>
              <EmptyDescription>
                We couldn&apos;t find anything matching &ldquo;{query}
                &rdquo;. Try a different keyword or clear your filters to see
                all records.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search records..."
                  aria-label="Search records"
                  className="pl-9 [&::-webkit-search-cancel-button]:appearance-none"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("")
                  toast("Filters cleared", {
                    id: "filters-cleared",
                    description: "Showing all records.",
                  })
                }}
              >
                <RefreshCw data-icon="inline-start" />
                Clear Filters
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    </section>
  )
}
