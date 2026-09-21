import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, CalendarDays, Clock, MapPin } from "lucide-react"

const CHIP_TONE: Record<CalEvent["variant"], string> = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-muted text-muted-foreground",
  outline: "bg-muted text-muted-foreground",
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface CalEvent {
  label: string
  variant: "default" | "secondary" | "outline"
  time: string
  location: string
  description: string
}

const EVENTS: Record<string, CalEvent> = {
  "2025-5-5": {
    label: "Team sync",
    variant: "secondary",
    time: "10:00 – 10:30",
    location: "Zoom",
    description: "Weekly cross-functional sync to align on priorities.",
  },
  "2025-5-12": {
    label: "Q2 review",
    variant: "secondary",
    time: "14:00 – 15:30",
    location: "Conf room A",
    description: "Quarterly business review with leadership.",
  },
  "2025-5-17": {
    label: "Launch",
    variant: "default",
    time: "All day",
    location: "Company-wide",
    description: "Public launch of the new platform release.",
  },
  "2025-5-23": {
    label: "Design sprint",
    variant: "secondary",
    time: "11:00 – 17:00",
    location: "Studio 2",
    description: "Full-day design sprint for the onboarding flow.",
  },
  "2025-5-28": {
    label: "Board meeting",
    variant: "outline",
    time: "15:00 – 16:00",
    location: "Main boardroom",
    description: "Monthly board meeting and financial review.",
  },
  "2025-6-3": {
    label: "All-hands",
    variant: "default",
    time: "16:00 – 17:00",
    location: "Auditorium",
    description: "Company all-hands with Q3 kickoff.",
  },
  "2025-6-15": {
    label: "Offsite",
    variant: "secondary",
    time: "All day",
    location: "Lakeside resort",
    description: "Annual team offsite and strategy planning.",
  },
}

const TODAY = { year: 2025, month: 5, day: 17 }

function keyFor(year: number, month: number, day: number) {
  return `${year}-${month}-${day}`
}

function buildCells(year: number, month: number): (number | null)[] {
  const leadingBlanks = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function CalendarBlock() {
  const [view, setView] = React.useState({ year: 2025, month: 5 })
  const [selected, setSelected] = React.useState<string | null>(() =>
    keyFor(TODAY.year, TODAY.month, TODAY.day)
  )

  const cells = React.useMemo(() => buildCells(view.year, view.month), [view])

  function shiftMonth(delta: number) {
    setView((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  function goToday() {
    setView({ year: TODAY.year, month: TODAY.month })
    setSelected(keyFor(TODAY.year, TODAY.month, TODAY.day))
  }

  const [selYear, selMonth, selDay] = selected
    ? selected.split("-").map(Number)
    : [0, 0, 0]
  const selectedInView =
    selected !== null && selYear === view.year && selMonth === view.month
  const selectedEvent = selected ? EVENTS[selected] : undefined

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="text-sm font-semibold tracking-wide tabular-nums">
              {MONTH_NAMES[view.month]} {view.year}
            </span>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={goToday}>
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-7 border-b border-border bg-muted">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const key = day ? keyFor(view.year, view.month, day) : ""
              const event = day ? EVENTS[key] : undefined
              const isToday =
                day === TODAY.day &&
                view.month === TODAY.month &&
                view.year === TODAY.year
              const isSelected = day !== null && key === selected
              const isLastRow = idx >= cells.length - 7

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={day === null}
                  aria-pressed={isSelected}
                  aria-label={
                    day
                      ? `${MONTH_NAMES[view.month]} ${day}, ${view.year}`
                      : undefined
                  }
                  onClick={() => key && setSelected(key)}
                  className={cn(
                    "flex min-h-[5.5rem] min-w-0 flex-col gap-1 overflow-hidden border-border p-1 text-left align-top transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    idx % 7 !== 6 && "border-r",
                    !isLastRow && "border-b",
                    day === null ? "bg-muted" : "hover:bg-muted/50",
                    isSelected &&
                      "bg-primary/10 ring-1 ring-primary/50 ring-inset hover:bg-primary/10"
                  )}
                >
                  {day !== null && (
                    <>
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center self-end rounded-md text-xs font-medium",
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground"
                        )}
                      >
                        {day}
                      </span>

                      {event && (
                        <span
                          className={cn(
                            "block w-full min-w-0 truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium",
                            CHIP_TONE[event.variant]
                          )}
                        >
                          {event.label}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>

          {selectedInView && (
            <>
              <Separator />
              <div className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h3 className="font-heading text-sm font-semibold">
                    {MONTH_NAMES[selMonth]} {selDay}, {selYear}
                  </h3>
                </div>

                {selectedEvent ? (
                  <div className="mt-2.5 flex flex-col gap-2">
                    <Badge
                      variant={selectedEvent.variant}
                      className="self-start text-[10px]"
                    >
                      {selectedEvent.label}
                    </Badge>
                    <p className="text-xs/relaxed text-foreground">
                      {selectedEvent.description}
                    </p>
                    <div className="flex flex-col gap-1.5 text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                        {selectedEvent.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        {selectedEvent.location}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No events scheduled.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
