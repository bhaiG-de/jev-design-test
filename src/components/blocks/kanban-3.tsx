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
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"

type Label = "Design" | "Engineering" | "Marketing" | "Ops"

const labelVariant: Record<Label, "default" | "secondary" | "outline"> = {
  Design: "secondary",
  Engineering: "default",
  Marketing: "outline",
  Ops: "outline",
}

type Priority = "high" | "medium" | "low"

const priorityDot: Record<Priority, string> = {
  high: "bg-destructive",
  medium: "bg-primary",
  low: "bg-muted-foreground/40",
}

const priorityLabel: Record<Priority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
}

type Task = {
  id: string
  title: string
  label: Label
  assignee: string
  initials: string
  avatarSrc: string
  priority: Priority
}

type Column = { id: string; title: string; tasks: Task[] }

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "k1",
        title: "Draft Q3 launch announcement",
        label: "Marketing",
        assignee: "Ravi Patel",
        initials: "RP",
        avatarSrc: "/pravatar/32?img=15",
        priority: "medium",
      },
      {
        id: "k2",
        title: "Design empty states for reports",
        label: "Design",
        assignee: "Mia Cho",
        initials: "MC",
        avatarSrc: "/pravatar/32?img=47",
        priority: "low",
      },
      {
        id: "k3",
        title: "Set up staging environment",
        label: "Ops",
        assignee: "Leo Fenn",
        initials: "LF",
        avatarSrc: "/pravatar/32?img=51",
        priority: "high",
      },
      {
        id: "k9",
        title: "Update pricing page copy",
        label: "Marketing",
        assignee: "Ravi Patel",
        initials: "RP",
        avatarSrc: "/pravatar/32?img=15",
        priority: "low",
      },
      {
        id: "k10",
        title: "Create design tokens for dark mode",
        label: "Design",
        assignee: "Mia Cho",
        initials: "MC",
        avatarSrc: "/pravatar/32?img=47",
        priority: "medium",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "k4",
        title: "Build billing usage endpoint",
        label: "Engineering",
        assignee: "Dana Wu",
        initials: "DW",
        avatarSrc: "/pravatar/32?img=32",
        priority: "high",
      },
      {
        id: "k5",
        title: "Rework onboarding checklist",
        label: "Design",
        assignee: "Mia Cho",
        initials: "MC",
        avatarSrc: "/pravatar/32?img=47",
        priority: "medium",
      },
      {
        id: "k11",
        title: "Add rate limiting to public API",
        label: "Engineering",
        assignee: "Dana Wu",
        initials: "DW",
        avatarSrc: "/pravatar/32?img=32",
        priority: "high",
      },
      {
        id: "k12",
        title: "Migrate legacy jobs to new queue",
        label: "Ops",
        assignee: "Leo Fenn",
        initials: "LF",
        avatarSrc: "/pravatar/32?img=51",
        priority: "medium",
      },
      {
        id: "k13",
        title: "Prototype new dashboard widgets",
        label: "Design",
        assignee: "Mia Cho",
        initials: "MC",
        avatarSrc: "/pravatar/32?img=47",
        priority: "low",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "k6",
        title: "Audit tracking events",
        label: "Marketing",
        assignee: "Ravi Patel",
        initials: "RP",
        avatarSrc: "/pravatar/32?img=15",
        priority: "low",
      },
      {
        id: "k14",
        title: "Review Q3 budget allocations",
        label: "Ops",
        assignee: "Leo Fenn",
        initials: "LF",
        avatarSrc: "/pravatar/32?img=51",
        priority: "medium",
      },
      {
        id: "k15",
        title: "QA billing usage endpoint",
        label: "Engineering",
        assignee: "Dana Wu",
        initials: "DW",
        avatarSrc: "/pravatar/32?img=32",
        priority: "high",
      },
      {
        id: "k16",
        title: "Proofread launch announcement",
        label: "Marketing",
        assignee: "Ravi Patel",
        initials: "RP",
        avatarSrc: "/pravatar/32?img=15",
        priority: "low",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "k7",
        title: "Migrate assets to CDN",
        label: "Ops",
        assignee: "Leo Fenn",
        initials: "LF",
        avatarSrc: "/pravatar/32?img=51",
        priority: "low",
      },
      {
        id: "k8",
        title: "Ship dark-mode tokens",
        label: "Engineering",
        assignee: "Dana Wu",
        initials: "DW",
        avatarSrc: "/pravatar/32?img=32",
        priority: "medium",
      },
      {
        id: "k17",
        title: "Publish API changelog",
        label: "Engineering",
        assignee: "Dana Wu",
        initials: "DW",
        avatarSrc: "/pravatar/32?img=32",
        priority: "low",
      },
      {
        id: "k18",
        title: "Archive Q2 campaign assets",
        label: "Marketing",
        assignee: "Ravi Patel",
        initials: "RP",
        avatarSrc: "/pravatar/32?img=15",
        priority: "low",
      },
    ],
  },
]

function TaskCardBody({ task, dragging }: { task: Task; dragging?: boolean }) {
  return (
    <Card
      size="sm"
      className={cn(
        "gap-2 transition-shadow duration-150 hover:shadow-md",
        dragging && "shadow-lg ring-1 ring-foreground/15"
      )}
    >
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-start gap-2">
          <span
            className={`mt-1.5 size-1.5 shrink-0 rounded-full ${priorityDot[task.priority]}`}
            role="img"
            aria-label={priorityLabel[task.priority]}
          />
          <p className="text-sm leading-snug font-medium">{task.title}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant={labelVariant[task.label]}>{task.label}</Badge>
          <Avatar size="sm">
            <AvatarImage
              src={task.avatarSrc}
              alt={task.assignee}
              className=""
            />
            <AvatarFallback>{task.initials}</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}

function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
    >
      <TaskCardBody task={task} />
    </div>
  )
}

function BoardColumn({
  column,
  reflowKey,
}: {
  column: Column
  reflowKey: number
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  return (
    <div className="flex w-[80%] shrink-0 flex-col gap-3 sm:w-auto sm:shrink">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {column.title}
        </span>
        <span className="flex size-5 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground tabular-nums">
          {column.tasks.length}
        </span>
      </div>
      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ScrollArea
          key={reflowKey}
          className={cn(
            "min-h-[640px] rounded-lg border border-border transition-colors [&_[data-slot=scroll-area-viewport]]:scroll-fade-y",
            isOver ? "border-foreground/30 bg-accent" : "bg-muted"
          )}
        >
          <div ref={setNodeRef} className="flex min-h-full flex-col gap-2 p-2">
            {column.tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
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
  const [reflow, setReflow] = React.useState(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findColumnId = React.useCallback(
    (id: string) =>
      columns.some((c) => c.id === id)
        ? id
        : columns.find((c) => c.tasks.some((t) => t.id === id))?.id,
    [columns]
  )

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    setActiveTask(
      columns.flatMap((c) => c.tasks).find((t) => t.id === id) ?? null
    )
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
      const moving = from.tasks.find((t) => t.id === activeId)
      if (!moving) return prev
      const to = prev.find((c) => c.id === overCol)!
      const overIndex = to.tasks.findIndex((t) => t.id === overId)
      const insertAt = overIndex >= 0 ? overIndex : to.tasks.length
      return prev.map((c) => {
        if (c.id === activeCol)
          return { ...c, tasks: c.tasks.filter((t) => t.id !== activeId) }
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
    const col = findColumnId(activeId)
    if (!col || col !== findColumnId(overId)) return
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== col) return c
        const oldIndex = c.tasks.findIndex((t) => t.id === activeId)
        const newIndex = c.tasks.findIndex((t) => t.id === overId)
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return c
        return { ...c, tasks: arrayMove(c.tasks, oldIndex, newIndex) }
      })
    )
  }

  return (
    <section className="flex min-h-svh w-full items-start justify-center bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 border-b border-border pb-5">
          <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Acme Workspace
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Project Board
          </h1>
        </div>

        <DndContext
          id="kanban-3-board"
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
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:pb-0">
            {columns.map((col) => (
              <BoardColumn key={col.id} column={col} reflowKey={reflow} />
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
      </div>
    </section>
  )
}
