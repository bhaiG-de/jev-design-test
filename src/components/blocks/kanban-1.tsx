import * as React from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"

type TaskLabel = "Bug" | "Feature" | "Docs" | "Design" | "Infra" | "Research"

const labelVariant: Record<
  TaskLabel,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Bug: "destructive",
  Feature: "default",
  Docs: "secondary",
  Design: "secondary",
  Infra: "outline",
  Research: "outline",
}

type Task = {
  id: string
  title: string
  label: TaskLabel
  assignee: string
  initials: string
  avatarSrc: string
  priority: "high" | "medium" | "low"
}

type Column = {
  id: string
  title: string
  accent: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    accent: "bg-muted-foreground/20",
    tasks: [
      {
        id: "t1",
        title: "Audit accessibility across all form components",
        label: "Docs",
        assignee: "Morgan Lee",
        initials: "ML",
        avatarSrc: "/pravatar/32?img=47",
        priority: "medium",
      },
      {
        id: "t2",
        title: "Investigate memory leak in background worker",
        label: "Bug",
        assignee: "Sam Rivera",
        initials: "SR",
        avatarSrc: "/pravatar/32?img=12",
        priority: "high",
      },
      {
        id: "t3",
        title: "Add dark-mode support to email templates",
        label: "Design",
        assignee: "Jamie Park",
        initials: "JP",
        avatarSrc: "/pravatar/32?img=33",
        priority: "low",
      },
      {
        id: "t4",
        title: "Define quarterly OKRs with product team",
        label: "Research",
        assignee: "Alex Chen",
        initials: "AC",
        avatarSrc: "/pravatar/32?img=68",
        priority: "medium",
      },
      {
        id: "t11",
        title: "Improve empty states for search results",
        label: "Design",
        assignee: "Taylor Obi",
        initials: "TO",
        avatarSrc: "/pravatar/32?img=22",
        priority: "low",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    accent: "bg-primary",
    tasks: [
      {
        id: "t5",
        title: "Migrate CI/CD pipeline to GitHub Actions",
        label: "Infra",
        assignee: "Jordan Kim",
        initials: "JK",
        avatarSrc: "/pravatar/32?img=51",
        priority: "high",
      },
      {
        id: "t6",
        title: "Build multi-step onboarding wizard",
        label: "Feature",
        assignee: "Taylor Obi",
        initials: "TO",
        avatarSrc: "/pravatar/32?img=22",
        priority: "high",
      },
      {
        id: "t7",
        title: "Fix pagination on the invoices list view",
        label: "Bug",
        assignee: "Sam Rivera",
        initials: "SR",
        avatarSrc: "/pravatar/32?img=12",
        priority: "medium",
      },
      {
        id: "t12",
        title: "Refactor auth middleware for multi-tenant support",
        label: "Infra",
        assignee: "Alex Chen",
        initials: "AC",
        avatarSrc: "/pravatar/32?img=68",
        priority: "high",
      },
      {
        id: "t13",
        title: "Write integration tests for payment webhooks",
        label: "Bug",
        assignee: "Morgan Lee",
        initials: "ML",
        avatarSrc: "/pravatar/32?img=47",
        priority: "medium",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    accent: "bg-muted-foreground/30",
    tasks: [
      {
        id: "t8",
        title: "Set up error monitoring with Sentry",
        label: "Infra",
        assignee: "Alex Chen",
        initials: "AC",
        avatarSrc: "/pravatar/32?img=68",
        priority: "medium",
      },
      {
        id: "t9",
        title: "Write API reference for webhooks endpoint",
        label: "Docs",
        assignee: "Jamie Park",
        initials: "JP",
        avatarSrc: "/pravatar/32?img=33",
        priority: "low",
      },
      {
        id: "t10",
        title: "Redesign settings page layout",
        label: "Design",
        assignee: "Morgan Lee",
        initials: "ML",
        avatarSrc: "/pravatar/32?img=47",
        priority: "low",
      },
      {
        id: "t14",
        title: "Upgrade Node runtime to v20 across services",
        label: "Infra",
        assignee: "Jordan Kim",
        initials: "JK",
        avatarSrc: "/pravatar/32?img=51",
        priority: "low",
      },
    ],
  },
]

const priorityDot: Record<Task["priority"], string> = {
  high: "bg-destructive",
  medium: "bg-primary",
  low: "bg-muted-foreground/40",
}

const priorityLabel: Record<Task["priority"], string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
}

function TaskCardBody({
  task,
  dimmed,
  dragging,
}: {
  task: Task
  dimmed?: boolean
  dragging?: boolean
}) {
  return (
    <Card
      size="sm"
      className={`transition-shadow duration-150 hover:shadow-md ${
        dimmed ? "opacity-60 transition-opacity hover:opacity-100" : ""
      }${dragging ? "shadow-lg ring-1 ring-foreground/15" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start gap-2">
          <span
            className={`mt-1.5 size-1.5 shrink-0 rounded-full ${priorityDot[task.priority]}`}
            role="img"
            aria-label={priorityLabel[task.priority]}
          />
          <CardTitle className="text-sm leading-snug font-medium">
            {task.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <Badge variant={labelVariant[task.label]}>{task.label}</Badge>
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs text-muted-foreground">
              {task.assignee}
            </span>
            <Avatar size="sm">
              <AvatarImage
                src={task.avatarSrc}
                alt={task.assignee}
                className=""
              />
              <AvatarFallback>{task.initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SortableTaskCard({
  task,
  dimmed,
  onOpen,
}: {
  task: Task
  dimmed?: boolean
  onOpen: (task: Task) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const movedRef = React.useRef(false)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-label={`Open task: ${task.title}`}
      className="cursor-grab touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      onPointerDownCapture={() => {
        movedRef.current = false
      }}
      onPointerMoveCapture={() => {
        movedRef.current = true
      }}
      onClick={() => {
        if (!movedRef.current) onOpen(task)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onOpen(task)
        }
      }}
    >
      <TaskCardBody task={task} dimmed={dimmed} />
    </div>
  )
}

function BoardColumn({
  column,
  onOpen,
  reflowKey,
}: {
  column: Column
  onOpen: (task: Task) => void
  reflowKey: number
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex w-[78%] shrink-0 flex-col gap-3 rounded-lg bg-muted p-3 sm:w-auto sm:shrink">
      <div className="flex items-center gap-2.5">
        <span className={`size-2 ${column.accent}`} />
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {column.title}
        </span>
        <span className="ml-auto flex size-5 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground tabular-nums">
          {column.tasks.length}
        </span>
      </div>

      <div className={`h-px w-full ${column.accent} opacity-60`} />

      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ScrollArea
          key={reflowKey}
          className={`min-h-[640px] transition-colors [&_[data-slot=scroll-area-viewport]]:scroll-fade-y ${isOver ? "bg-accent" : ""}`}
        >
          <div
            ref={setNodeRef}
            className="flex min-h-full flex-col gap-2 p-0.5 pr-2.5"
          >
            {column.tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                dimmed={column.id === "done"}
                onOpen={onOpen}
              />
            ))}
            {column.tasks.length === 0 && (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border py-8 text-xs text-muted-foreground">
                Drop here
              </div>
            )}
            <button
              type="button"
              className="mt-auto flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add card
            </button>
          </div>
        </ScrollArea>
      </SortableContext>
    </div>
  )
}

export default function KanbanBlock() {
  const [columns, setColumns] = React.useState<Column[]>(initialColumns)
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  const [detailTask, setDetailTask] = React.useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [reflow, setReflow] = React.useState(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findColumnId = React.useCallback(
    (id: string): string | undefined => {
      if (columns.some((c) => c.id === id)) return id
      return columns.find((c) => c.tasks.some((t) => t.id === id))?.id
    },
    [columns]
  )

  const totalTasks = columns.reduce((n, c) => n + c.tasks.length, 0)
  const doneCount = columns.find((c) => c.id === "done")?.tasks.length ?? 0

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    const task = columns.flatMap((c) => c.tasks).find((t) => t.id === id)
    setActiveTask(task ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    const activeCol = findColumnId(activeId)
    const overCol = findColumnId(overId)
    if (!activeCol || !overCol || activeCol === overCol) return

    setColumns((prev) => {
      const from = prev.find((c) => c.id === activeCol)!
      const to = prev.find((c) => c.id === overCol)!
      const moving = from.tasks.find((t) => t.id === activeId)
      if (!moving) return prev

      const overIndex = to.tasks.findIndex((t) => t.id === overId)
      const insertAt = overIndex >= 0 ? overIndex : to.tasks.length

      return prev.map((c) => {
        if (c.id === activeCol) {
          return { ...c, tasks: c.tasks.filter((t) => t.id !== activeId) }
        }
        if (c.id === overCol) {
          const next = [...c.tasks]
          next.splice(insertAt, 0, moving)
          return { ...c, tasks: next }
        }
        return c
      })
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    setReflow((n) => n + 1)
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const activeCol = findColumnId(activeId)
    const overCol = findColumnId(overId)
    if (!activeCol || !overCol) return

    if (activeCol === overCol) {
      setColumns((prev) =>
        prev.map((c) => {
          if (c.id !== activeCol) return c
          const oldIndex = c.tasks.findIndex((t) => t.id === activeId)
          const newIndex = c.tasks.findIndex((t) => t.id === overId)
          if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return c
          return { ...c, tasks: arrayMove(c.tasks, oldIndex, newIndex) }
        })
      )
    }
  }

  function openDetail(task: Task) {
    setDetailTask(task)
    setDetailOpen(true)
  }

  return (
    <section className="flex min-h-svh w-full items-start justify-center bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-end justify-between border-b border-border pb-5">
          <div>
            <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Acme Engineering
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Sprint Board
            </h1>
          </div>
          <Badge variant="outline" className="mb-0.5">
            Q3 Sprint 7
          </Badge>
        </div>

        <DndContext
          id="kanban-1-board"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setActiveTask(null)
            setReflow((n) => n + 1)
          }}
        >
          <div className="-mx-1 flex gap-5 overflow-x-auto px-1 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                onOpen={openDetail}
                reflowKey={reflow}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="cursor-grabbing">
                <TaskCardBody task={activeTask} dragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="mt-8 flex items-center gap-3 border-t border-border pt-4">
          <div className="flex -space-x-2">
            {[
              {
                src: "/pravatar/32?img=47",
                name: "Morgan Lee",
                initials: "ML",
              },
              {
                src: "/pravatar/32?img=12",
                name: "Sam Rivera",
                initials: "SR",
              },
              {
                src: "/pravatar/32?img=33",
                name: "Jamie Park",
                initials: "JP",
              },
              {
                src: "/pravatar/32?img=68",
                name: "Alex Chen",
                initials: "AC",
              },
              {
                src: "/pravatar/32?img=51",
                name: "Jordan Kim",
                initials: "JK",
              },
            ].map((member) => (
              <Avatar
                key={member.name}
                size="sm"
                className="border-2 border-background"
              >
                <AvatarImage
                  src={member.src}
                  alt={member.name}
                  className=""
                />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-x-4 text-xs text-muted-foreground tabular-nums">
            <span>
              <span className="font-medium text-foreground">5</span>{" "}
              Contributors
            </span>
            <span>
              <span className="font-medium text-foreground">{totalTasks}</span>{" "}
              Tasks
            </span>
            <span>
              <span className="font-medium text-foreground">{doneCount}</span>{" "}
              Completed
            </span>
          </div>
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          {detailTask && (
            <>
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${priorityDot[detailTask.priority]}`}
                  />
                  <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {priorityLabel[detailTask.priority]}
                  </span>
                </div>
                <DialogTitle>{detailTask.title}</DialogTitle>
                <DialogDescription>
                  Task in the{" "}
                  {columns.find((c) =>
                    c.tasks.some((t) => t.id === detailTask.id)
                  )?.title ?? "board"}{" "}
                  column. Drag the card to move it across the board.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <Badge variant={labelVariant[detailTask.label]}>
                  {detailTask.label}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {detailTask.assignee}
                  </span>
                  <Avatar size="sm">
                    <AvatarImage
                      src={detailTask.avatarSrc}
                      alt={detailTask.assignee}
                      className=""
                    />
                    <AvatarFallback>{detailTask.initials}</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <DialogFooter showCloseButton />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
