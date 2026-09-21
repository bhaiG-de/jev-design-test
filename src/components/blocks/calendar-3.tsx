"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X, CalendarDays } from "lucide-react"

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

type EventTone = "default" | "secondary" | "outline"

type CalendarEvent = {
  id: string
  title: string
  time: string
  tone: EventTone
}

const EVENTS: Record<string, CalendarEvent[]> = {
  "2026-5-3": [
    { id: "e1", title: "Team sync", time: "9:00 AM", tone: "secondary" },
    { id: "e2", title: "1:1 with Dana", time: "11:30 AM", tone: "outline" },
  ],
  "2026-5-10": [
    { id: "e3", title: "Q2 review", time: "2:00 PM", tone: "secondary" },
  ],
  "2026-5-18": [
    { id: "e4", title: "Acme launch", time: "All day", tone: "default" },
    { id: "e5", title: "Press briefing", time: "4:00 PM", tone: "outline" },
    { id: "e6", title: "Launch party", time: "6:30 PM", tone: "secondary" },
  ],
  "2026-5-23": [
    { id: "e7", title: "Design sprint", time: "10:00 AM", tone: "secondary" },
  ],
  "2026-5-29": [
    { id: "e8", title: "Board meeting", time: "1:00 PM", tone: "outline" },
  ],
}

function keyFor(year: number, month: number, day: number) {
  return `${year}-${month}-${day}`
}

const TODAY = { year: 2026, month: 5, day: 18 }

const TONE_ACCENT: Record<EventTone, string> = {
  default: "bg-primary",
  secondary: "bg-muted-foreground",
  outline: "bg-muted-foreground/40",
}

type View = "month" | "week"

export default function CalendarBlock() {
  const [cursor, setCursor] = useState(() => new Date(2026, 5, 18))
  const [view, setView] = useState<View>("month")
  const [selected, setSelected] = useState<string | null>(keyFor(2026, 5, 18))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const monthCells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [year, month])

  const weekDays = useMemo(() => {
    const start = new Date(cursor)
    start.setDate(cursor.getDate() - cursor.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [cursor])

  function shift(step: number) {
    setCursor((prev) => {
      const next = new Date(prev)
      if (view === "month") next.setMonth(prev.getMonth() + step)
      else next.setDate(prev.getDate() + step * 7)
      return next
    })
    setSelected(null)
  }

  function isToday(y: number, m: number, d: number) {
    return y === TODAY.year && m === TODAY.month && d === TODAY.day
  }

  const headerLabel =
    view === "month"
      ? `${MONTH_NAMES[month]} ${year}`
      : `${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getDate()} – ${weekDays[6].getDate()}, ${weekDays[6].getFullYear()}`

  const selectedEvents = selected ? (EVENTS[selected] ?? []) : []
  const [, selMonth, selDay] = selected
    ? selected.split("-").map(Number)
    : [0, 0, 0]
  const selectedLabel = selected ? `${MONTH_NAMES[selMonth]} ${selDay}` : ""

  return (
    <section className="flex min-h-svh w-full items-start justify-center bg-muted/30 px-6 py-16 text-foreground">
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label={
                  view === "month" ? "Previous month" : "Previous week"
                }
                onClick={() => shift(-1)}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={view === "month" ? "Next month" : "Next week"}
                onClick={() => shift(1)}
              >
                <ChevronRight aria-hidden="true" />
              </Button>
              <h2 className="ml-1 font-heading text-base font-semibold tracking-tight">
                {headerLabel}
              </h2>
            </div>

            <Tabs value={view} onValueChange={(v) => setView(v as View)}>
              <TabsList>
                <TabsTrigger value="month" className="capitalize">
                  Month
                </TabsTrigger>
                <TabsTrigger value="week" className="capitalize">
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          <div className="grid grid-cols-7 border-b border-border bg-muted">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {d}
              </div>
            ))}
          </div>

          {view === "month" ? (
            <div className="grid grid-cols-7">
              {monthCells.map((day, idx) => {
                const k = day ? keyFor(year, month, day) : null
                const events = k ? (EVENTS[k] ?? []) : []
                const today = day ? isToday(year, month, day) : false
                const isLastRow = idx >= monthCells.length - 7
                const isSelected = k !== null && k === selected

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={day === null}
                    onClick={() => k && setSelected(k)}
                    className={cn(
                      "group flex min-h-[5.5rem] min-w-0 flex-col gap-1 border-border p-1.5 text-left align-top transition-colors sm:min-h-[6rem]",
                      idx % 7 !== 6 && "border-r",
                      !isLastRow && "border-b",
                      day === null && "bg-muted",
                      day !== null && "hover:bg-accent/40",
                      isSelected && "bg-accent/60"
                    )}
                  >
                    {day !== null && (
                      <>
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center self-end rounded-md text-xs font-medium",
                            today
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground"
                          )}
                        >
                          {day}
                        </span>

                        <div className="flex min-w-0 flex-col gap-1">
                          {events.slice(0, 2).map((ev) => (
                            <span
                              key={ev.id}
                              className="flex min-w-0 items-center gap-1.5"
                            >
                              <span
                                className={cn(
                                  "size-1.5 shrink-0",
                                  TONE_ACCENT[ev.tone]
                                )}
                                aria-hidden="true"
                              />
                              <span className="truncate text-[11px] text-foreground/90">
                                {ev.title}
                              </span>
                            </span>
                          ))}
                          {events.length > 2 && (
                            <span className="pl-3 text-[10px] font-medium text-muted-foreground">
                              +{events.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {weekDays.map((d, idx) => {
                const k = keyFor(d.getFullYear(), d.getMonth(), d.getDate())
                const events = EVENTS[k] ?? []
                const today = isToday(
                  d.getFullYear(),
                  d.getMonth(),
                  d.getDate()
                )
                const isSelected = k === selected

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelected(k)}
                    className={cn(
                      "flex min-h-[14rem] min-w-0 flex-col gap-2 border-border p-2 text-left transition-colors",
                      idx !== 6 && "border-r",
                      "hover:bg-accent/40",
                      isSelected && "bg-accent/60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center self-start rounded-md text-sm font-semibold",
                        today
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {d.getDate()}
                    </span>

                    <div className="flex min-w-0 flex-col gap-1.5">
                      {events.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex min-w-0 items-stretch gap-1.5 overflow-hidden rounded-md bg-muted"
                        >
                          <span
                            className={cn(
                              "w-0.5 shrink-0",
                              TONE_ACCENT[ev.tone]
                            )}
                            aria-hidden="true"
                          />
                          <div className="min-w-0 py-1 pr-1.5">
                            <p className="truncate text-xs font-medium">
                              {ev.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {ev.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selected && (
          <div className="relative mt-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <button
              type="button"
              aria-label="Close events"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2 pr-8">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="font-heading text-sm font-semibold">
                {selectedLabel}
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {selectedEvents.length}{" "}
                {selectedEvents.length === 1 ? "event" : "events"}
              </Badge>
            </div>

            {selectedEvents.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {selectedEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5 transition-colors hover:bg-accent"
                  >
                    <span
                      className={cn("size-1.5 shrink-0", TONE_ACCENT[ev.tone])}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {ev.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {ev.time}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No events scheduled. Enjoy the free day.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
