import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react"

type EventStatus = "confirmed" | "tentative" | "cancelled"

interface CalEvent {
  time: string
  duration: string
  title: string
  location?: string
  status: EventStatus
}

interface AgendaDay {
  label: string
  date: number
  isToday: boolean
  events: CalEvent[]
}

interface Week {
  range: string
  days: AgendaDay[]
}

const STANDUP: CalEvent = {
  time: "09:00",
  duration: "30 min",
  title: "Daily standup",
  location: "Zoom",
  status: "confirmed",
}

const WEEKS: Week[] = [
  {
    range: "Jun 9 – Jun 15, 2025",
    days: [
      { label: "Mon", date: 9, isToday: false, events: [STANDUP] },
      {
        label: "Tue",
        date: 10,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "13:00",
            duration: "1 hr",
            title: "Hiring panel: Backend",
            location: "Conf room B",
            status: "confirmed",
          },
        ],
      },
      { label: "Wed", date: 11, isToday: false, events: [STANDUP] },
      {
        label: "Thu",
        date: 12,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "15:00",
            duration: "45 min",
            title: "Budget planning",
            location: "Finance suite",
            status: "tentative",
          },
        ],
      },
      { label: "Fri", date: 13, isToday: false, events: [STANDUP] },
      { label: "Sat", date: 14, isToday: false, events: [] },
      { label: "Sun", date: 15, isToday: false, events: [] },
    ],
  },
  {
    range: "Jun 16 – Jun 22, 2025",
    days: [
      {
        label: "Mon",
        date: 16,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "14:00",
            duration: "1 hr",
            title: "Product roadmap review",
            location: "Conf room A",
            status: "confirmed",
          },
        ],
      },
      {
        label: "Tue",
        date: 17,
        isToday: true,
        events: [
          STANDUP,
          {
            time: "11:00",
            duration: "2 hr",
            title: "Design system workshop",
            location: "Studio 2",
            status: "confirmed",
          },
          {
            time: "16:30",
            duration: "30 min",
            title: "1:1 with Jordan",
            status: "tentative",
          },
        ],
      },
      {
        label: "Wed",
        date: 18,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "13:00",
            duration: "1 hr",
            title: "Q2 retrospective",
            location: "Main boardroom",
            status: "confirmed",
          },
        ],
      },
      {
        label: "Thu",
        date: 19,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "10:30",
            duration: "45 min",
            title: "Engineering sync",
            status: "confirmed",
          },
          {
            time: "15:00",
            duration: "1 hr",
            title: "Vendor call: Acme Payments",
            location: "External",
            status: "tentative",
          },
        ],
      },
      {
        label: "Fri",
        date: 20,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "12:00",
            duration: "30 min",
            title: "Sprint planning kick-off",
            status: "cancelled",
          },
        ],
      },
      { label: "Sat", date: 21, isToday: false, events: [] },
      {
        label: "Sun",
        date: 22,
        isToday: false,
        events: [
          {
            time: "10:00",
            duration: "1 hr",
            title: "Team offsite prep call",
            status: "tentative",
          },
        ],
      },
    ],
  },
  {
    range: "Jun 23 – Jun 29, 2025",
    days: [
      {
        label: "Mon",
        date: 23,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "11:00",
            duration: "6 hr",
            title: "Design sprint",
            location: "Studio 2",
            status: "confirmed",
          },
        ],
      },
      { label: "Tue", date: 24, isToday: false, events: [STANDUP] },
      {
        label: "Wed",
        date: 25,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "14:00",
            duration: "1 hr",
            title: "Customer advisory board",
            location: "External",
            status: "confirmed",
          },
        ],
      },
      { label: "Thu", date: 26, isToday: false, events: [STANDUP] },
      {
        label: "Fri",
        date: 27,
        isToday: false,
        events: [
          STANDUP,
          {
            time: "16:00",
            duration: "1 hr",
            title: "Team social",
            location: "Rooftop",
            status: "tentative",
          },
        ],
      },
      { label: "Sat", date: 28, isToday: false, events: [] },
      { label: "Sun", date: 29, isToday: false, events: [] },
    ],
  },
]

const TODAY_WEEK = 1
const NOW_MINUTES = 10 * 60 + 15 // fixed placeholder "current time" (10:15 AM)

// Time grid: 8 AM – 6 PM covers every event in the dataset with a little headroom.
const START_HOUR = 8
const END_HOUR = 18
const ROW_H = 48 // px per hour
const GUTTER_W = 56 // px
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)
const GRID_HEIGHT = HOURS.length * ROW_H

function formatHour(hour: number) {
  if (hour === 0) return "12 AM"
  if (hour === 12) return "12 PM"
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

function parseTimeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function parseDurationToMinutes(duration: string) {
  const match = /^(\d+)\s*(hr|min)$/.exec(duration.trim())
  if (!match) return 30
  const value = Number(match[1])
  return match[2] === "hr" ? value * 60 : value
}

const STATUS_ACCENT: Record<EventStatus, string> = {
  confirmed: "bg-primary",
  tentative: "bg-muted-foreground",
  cancelled: "bg-destructive",
}

const STATUS_CHIP: Record<EventStatus, string> = {
  confirmed: "bg-primary/10 text-primary",
  tentative: "bg-muted text-foreground",
  cancelled: "bg-muted text-muted-foreground line-through",
}

const STATUS_LABEL: Record<EventStatus, string> = {
  confirmed: "Confirmed",
  tentative: "Tentative",
  cancelled: "Cancelled",
}

// ponytail: events never overlap in this dataset, so blocks are stacked by
// time only (no side-by-side lane assignment). Add lane packing if a future
// dataset introduces overlapping events.
function EventBlock({ day, event }: { day: AgendaDay; event: CalEvent }) {
  const startMinutes = parseTimeToMinutes(event.time)
  const durationMinutes = parseDurationToMinutes(event.duration)
  const top = ((startMinutes - START_HOUR * 60) / 60) * ROW_H
  const height = Math.max((durationMinutes / 60) * ROW_H, 18)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "absolute inset-x-0.5 flex items-stretch gap-1 overflow-hidden rounded-md text-left transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              STATUS_CHIP[event.status]
            )}
            style={{ top, height }}
          />
        }
      >
        <span
          className={cn("w-0.5 shrink-0", STATUS_ACCENT[event.status])}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate px-1 py-0.5 text-[11px] leading-tight font-medium">
          {event.title}
        </span>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64">
        <PopoverHeader>
          <PopoverTitle
            className={cn(
              event.status === "cancelled" && "text-muted-foreground line-through"
            )}
          >
            {event.title}
          </PopoverTitle>
          <PopoverDescription>
            {day.label} {day.date}
          </PopoverDescription>
        </PopoverHeader>
        <Separator />
        <div className="flex flex-col gap-1.5 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {event.time} ({event.duration})
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {event.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span
              className={cn("size-1.5 shrink-0", STATUS_ACCENT[event.status])}
              aria-hidden="true"
            />
            {STATUS_LABEL[event.status]}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function CalendarBlock() {
  const [weekIdx, setWeekIdx] = React.useState(TODAY_WEEK)
  const week = WEEKS[weekIdx]
  const totalEvents = week.days.reduce((n, d) => n + d.events.length, 0)
  const nowTop = ((NOW_MINUTES - START_HOUR * 60) / 60) * ROW_H

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-4xl">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Calendar className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <h1 className="font-heading text-sm font-semibold tracking-tight tabular-nums">
                  {week.range}
                </h1>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {totalEvents} {totalEvents === 1 ? "event" : "events"} this
                  week
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous week"
                disabled={weekIdx === 0}
                onClick={() => setWeekIdx((i) => Math.max(0, i - 1))}
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekIdx(TODAY_WEEK)}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next week"
                disabled={weekIdx === WEEKS.length - 1}
                onClick={() =>
                  setWeekIdx((i) => Math.min(WEEKS.length - 1, i + 1))
                }
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Day header row: gutter + 7 day columns share one column template
              with the grid body below so everything lines up. */}
          <div
            className="grid bg-muted"
            style={{
              gridTemplateColumns: `${GUTTER_W}px repeat(7, minmax(0, 1fr))`,
            }}
          >
            <div />
            {week.days.map((day, idx) => (
              <div
                key={day.date}
                className={cn(
                  "flex flex-col items-center gap-1 py-2",
                  idx !== 6 && "border-r border-border"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-widest uppercase",
                    day.isToday ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {day.label}
                </span>
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md text-sm font-semibold tabular-nums",
                    day.isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {day.date}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Time grid: 56px hour gutter + 7 day columns, 48px per hour. */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `${GUTTER_W}px repeat(7, minmax(0, 1fr))`,
            }}
          >
            <div className="relative" style={{ height: GRID_HEIGHT }}>
              {HOURS.map((hour, idx) => (
                <span
                  key={hour}
                  className="absolute inset-x-0 -translate-y-1/2 pr-2 text-right text-[10px] text-muted-foreground tabular-nums"
                  style={{ top: idx * ROW_H }}
                >
                  {formatHour(hour)}
                </span>
              ))}
            </div>

            {week.days.map((day, idx) => (
              <div
                key={day.date}
                className={cn(
                  "relative",
                  idx !== 6 && "border-r border-border"
                )}
                style={{ height: GRID_HEIGHT }}
              >
                <div className="absolute inset-0 flex flex-col">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="border-b border-border/60 last:border-b-0"
                      style={{ height: ROW_H }}
                    />
                  ))}
                </div>

                {day.events.map((event) => (
                  <EventBlock
                    key={`${event.time}-${event.title}`}
                    day={day}
                    event={event}
                  />
                ))}

                {day.isToday && (
                  <div
                    className="absolute inset-x-0 z-10 flex items-center"
                    style={{ top: nowTop }}
                  >
                    <span className="-ml-1 size-2 shrink-0 rounded-full bg-primary" />
                    <span className="h-px flex-1 bg-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center gap-4 px-4 py-3">
            {(
              [
                ["confirmed", "Confirmed"],
                ["tentative", "Tentative"],
                ["cancelled", "Cancelled"],
              ] as [EventStatus, string][]
            ).map(([status, label]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span
                  className={cn("size-1.5", STATUS_ACCENT[status])}
                  aria-hidden="true"
                />
                <span className="text-[10px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
