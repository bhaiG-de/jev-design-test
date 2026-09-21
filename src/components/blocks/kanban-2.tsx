"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
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
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CircleAlert, Flashlight, Clock, CircleCheck, GripVertical, Calendar, MessageCircle } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

type Priority = "critical" | "high" | "medium" | "low"
type LabelTag = "Frontend" | "Backend" | "Design" | "API" | "DevOps" | "QA"

type Assignee = {
  name: string
  initials: string
}

type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  labels: LabelTag[]
  dueDate: string
  assignees: Assignee[]
  commentCount: number
}

const priorityConfig: Record<
  Priority,
  {
    label: string
    icon: React.ElementType
    variant: "destructive" | "default" | "secondary" | "outline"
    dot: string
  }
> = {
  critical: {
    label: "Critical",
    icon: (p: IconProps) => (
      <CircleAlert {...p} />
    ),
    variant: "destructive",
    dot: "bg-destructive",
  },
  high: {
    label: "High",
    icon: (p: IconProps) => (
      <Flashlight {...p} />
    ),
    variant: "default",
    dot: "bg-primary",
  },
  medium: {
    label: "Medium",
    icon: (p: IconProps) => (
      <Clock {...p} />
    ),
    variant: "secondary",
    dot: "bg-muted-foreground",
  },
  low: {
    label: "Low",
    icon: (p: IconProps) => (
      <CircleCheck {...p} />
    ),
    variant: "outline",
    dot: "bg-border",
  },
}

const labelVariant: Record<LabelTag, "outline" | "secondary"> = {
  Frontend: "outline",
  Backend: "secondary",
  Design: "outline",
  API: "secondary",
  DevOps: "secondary",
  QA: "outline",
}

const assigneeAvatars: Record<string, string> = {
  "Sam Rivera": "/pravatar/150?img=15",
  "Jordan Kim": "/pravatar/150?img=8",
  "Morgan Lee": "/pravatar/150?img=26",
  "Taylor Obi": "/pravatar/150?img=59",
  "Jamie Park": "/pravatar/150?img=12",
  "Alex Chen": "/pravatar/150?img=33",
}

const initialTasks: Task[] = [
  {
    id: "ACM-412",
    title: "Resolve CORS error on the upload endpoint",
    description:
      "POST /api/v2/files returns 403 for cross-origin requests; preflight OPTIONS never reaches the handler.",
    priority: "critical",
    labels: ["Backend", "API"],
    dueDate: "Jun 18",
    assignees: [
      { name: "Sam Rivera", initials: "SR" },
      { name: "Jordan Kim", initials: "JK" },
    ],
    commentCount: 7,
  },
  {
    id: "ACM-398",
    title: "Redesign the account settings page",
    description:
      "Consolidate billing, profile, and notification preferences into a single tabbed layout using the new design tokens.",
    priority: "high",
    labels: ["Frontend", "Design"],
    dueDate: "Jun 23",
    assignees: [
      { name: "Morgan Lee", initials: "ML" },
      { name: "Taylor Obi", initials: "TO" },
      { name: "Jamie Park", initials: "JP" },
    ],
    commentCount: 4,
  },
  {
    id: "ACM-385",
    title: "Add rate limiting to the public REST API",
    description:
      "Implement a sliding-window limiter (100 req/min per key) with proper Retry-After headers on 429 responses.",
    priority: "high",
    labels: ["Backend", "API", "DevOps"],
    dueDate: "Jun 26",
    assignees: [{ name: "Alex Chen", initials: "AC" }],
    commentCount: 2,
  },
  {
    id: "ACM-371",
    title: "Write end-to-end tests for the checkout flow",
    description:
      "Cover happy path, declined card, and coupon-code scenarios using Playwright against the staging environment.",
    priority: "medium",
    labels: ["QA", "Frontend"],
    dueDate: "Jul 2",
    assignees: [
      { name: "Sam Rivera", initials: "SR" },
      { name: "Morgan Lee", initials: "ML" },
    ],
    commentCount: 0,
  },
  {
    id: "ACM-360",
    title: "Document the webhook payload schema",
    description:
      "Add OpenAPI 3.1 schemas for all event types and publish the spec to the developer portal.",
    priority: "low",
    labels: ["Backend", "API"],
    dueDate: "Jul 8",
    assignees: [{ name: "Jamie Park", initials: "JP" }],
    commentCount: 1,
  },
]

function TaskCardBody({
  task,
  dragHandle,
  dragging,
}: {
  task: Task
  dragHandle?: React.ReactNode
  dragging?: boolean
}) {
  const pCfg = priorityConfig[task.priority]
  const PriorityIcon = pCfg.icon
  const visibleAssignees = task.assignees.slice(0, 3)
  const overflow = task.assignees.length - visibleAssignees.length

  return (
    <Card
      className={`group border-border/80 transition-shadow duration-150 hover:shadow-md ${
        dragging ? "shadow-lg ring-1 ring-foreground/15" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 pb-1">
          <span className={`size-1.5 shrink-0 ${pCfg.dot}`} />
          <span className="font-mono text-[10px] font-medium tracking-wide text-muted-foreground/70 uppercase">
            {task.id}
          </span>
          {dragHandle ?? (
            <GripVertical className="ml-auto size-3.5 text-muted-foreground/40" />
          )}
        </div>
        <CardTitle className="text-sm leading-snug font-medium">
          {task.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
          {task.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 pb-3.5">
          <Badge variant={pCfg.variant} className="gap-1">
            <PriorityIcon data-icon="inline-start" />
            {pCfg.label}
          </Badge>
          {task.labels.map((lbl) => (
            <Badge
              key={lbl}
              variant={labelVariant[lbl]}
              className="font-normal"
            >
              {lbl}
            </Badge>
          ))}
        </div>

        <Separator className="mb-3.5 opacity-50" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              <span className="tabular-nums">{task.dueDate}</span>
            </div>
            {task.commentCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageCircle className="size-3.5 shrink-0" />
                <span className="tabular-nums">{task.commentCount}</span>
              </div>
            )}
          </div>

          <AvatarGroup>
            {visibleAssignees.map((a) => (
              <Avatar key={a.name} size="sm">
                <AvatarImage
                  src={assigneeAvatars[a.name]}
                  alt={a.name}
                  className=""
                />
                <AvatarFallback>{a.initials}</AvatarFallback>
              </Avatar>
            ))}
            {overflow > 0 && <AvatarGroupCount>+{overflow}</AvatarGroupCount>}
          </AvatarGroup>
        </div>
      </CardContent>
    </Card>
  )
}

function SortableTaskCard({
  task,
  onOpen,
}: {
  task: Task
  onOpen: (task: Task) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        type="button"
        className="block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open task ${task.id}: ${task.title}`}
        onClick={() => onOpen(task)}
      >
        <TaskCardBody
          task={task}
          dragHandle={
            <span
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              role="button"
              tabIndex={0}
              aria-label={`Reorder task ${task.id}`}
              className="-my-1 ml-auto flex cursor-grab touch-none items-center justify-center p-1 text-muted-foreground/50 outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="size-3.5" />
            </span>
          }
        />
      </button>
    </div>
  )
}

export default function KanbanBlock() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [detailTask, setDetailTask] = React.useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeTask = activeId
    ? (tasks.find((t) => t.id === activeId) ?? null)
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id)
      const newIndex = prev.findIndex((t) => t.id === over.id)
      if (oldIndex < 0 || newIndex < 0) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  function openDetail(task: Task) {
    setDetailTask(task)
    setDetailOpen(true)
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 px-1 pb-5">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight">
              In Progress
            </span>
            <Badge
              variant="secondary"
              className="px-1.5 font-medium tabular-nums"
            >
              {tasks.length}
            </Badge>
          </div>
          <Separator orientation="horizontal" className="flex-1 opacity-60" />
        </div>

        <DndContext
          id="kanban-2-board"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ScrollArea className="h-[34rem] rounded-lg bg-muted [&_[data-slot=scroll-area-viewport]]:scroll-fade-y">
              <div className="flex flex-col gap-2.5 p-2 pr-3">
                {tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onOpen={openDetail}
                  />
                ))}
              </div>
            </ScrollArea>
          </SortableContext>

          <DragOverlay>
            {activeTask ? (
              <div className="cursor-grabbing">
                <TaskCardBody task={activeTask} dragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          {detailTask && (
            <>
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`size-1.5 shrink-0 ${priorityConfig[detailTask.priority].dot}`}
                  />
                  <span className="font-mono text-[10px] font-medium tracking-wide text-muted-foreground/70 uppercase">
                    {detailTask.id}
                  </span>
                </div>
                <DialogTitle>{detailTask.title}</DialogTitle>
                <DialogDescription>{detailTask.description}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant={priorityConfig[detailTask.priority].variant}
                  className="gap-1"
                >
                  {React.createElement(
                    priorityConfig[detailTask.priority].icon,
                    {
                      "data-icon": "inline-start",
                    }
                  )}
                  {priorityConfig[detailTask.priority].label}
                </Badge>
                {detailTask.labels.map((lbl) => (
                  <Badge
                    key={lbl}
                    variant={labelVariant[lbl]}
                    className="font-normal"
                  >
                    {lbl}
                  </Badge>
                ))}
              </div>

              <Separator className="opacity-50" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0" />
                    <span className="tabular-nums">{detailTask.dueDate}</span>
                  </div>
                  {detailTask.commentCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MessageCircle className="size-3.5 shrink-0" />
                      <span className="tabular-nums">
                        {detailTask.commentCount}
                      </span>
                    </div>
                  )}
                </div>

                <AvatarGroup>
                  {detailTask.assignees.slice(0, 3).map((a) => (
                    <Avatar key={a.name} size="sm">
                      <AvatarImage
                        src={assigneeAvatars[a.name]}
                        alt={a.name}
                        className=""
                      />
                      <AvatarFallback>{a.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  {detailTask.assignees.length > 3 && (
                    <AvatarGroupCount>
                      +{detailTask.assignees.length - 3}
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              </div>

              <DialogFooter showCloseButton />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
