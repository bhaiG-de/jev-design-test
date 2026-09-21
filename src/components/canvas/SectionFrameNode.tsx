import { memo, useEffect, useRef, useState } from "react"
import { useStore, type Node, type NodeProps } from "@xyflow/react"
import { motion, useReducedMotion } from "motion/react"
import { pageRegistry } from "@/components/pages/registry"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  cancelSnapshot,
  requestSnapshot,
  setCaptureSize,
  useCapturePermit,
  useSnapshot,
} from "@/lib/snapshots"

// React Flow's Node<T> constrains T to Record<string, unknown>, which needs
// an explicit index signature to satisfy (a plain interface doesn't count).
export interface PageFrameData extends Record<string, unknown> {
  label: string
  pageId: string
  schema: Record<string, string>
  loading?: boolean
  revealDelay?: number
  popDelay?: number
  themeEpoch?: number
}

export type PageFrameNodeType = Node<PageFrameData, "pageFrame">

export const PAGE_WIDTH = 1440
export const PAGE_HEIGHT = 1000
export const FRAME_SCALE = 0.25
export const FRAME_WIDTH = PAGE_WIDTH * FRAME_SCALE
export const FRAME_HEIGHT = PAGE_HEIGHT * FRAME_SCALE
setCaptureSize(FRAME_WIDTH, FRAME_HEIGHT)

const CAPTURE_WAIT_MS = 80
const INSPECT_ZOOM = 1
const selectInspecting = (s: { transform: [number, number, number] }) =>
  s.transform[2] >= INSPECT_ZOOM

const revealed = new Set<string>()

const EASE = [0.2, 0.8, 0.2, 1] as const
const POP = { opacity: 0, y: 8 }
const SETTLED = { opacity: 1, y: 0, scale: 1 }

export const PageFrameNode = memo(function PageFrameNode({
  id,
  data,
  selected,
}: NodeProps<PageFrameNodeType>) {
  const Page = pageRegistry[data.pageId]
  const entry = useSnapshot(id)
  const epoch = data.themeEpoch ?? 0
  const snapshot = entry && entry.epoch === epoch ? entry.url : null
  const needsCapture = !data.loading && !snapshot
  const captureTurn = useCapturePermit(id, needsCapture)
  const inspecting = useStore(selectInspecting)
  const reduced = useReducedMotion()
  const bodyRef = useRef<HTMLDivElement>(null)
  const live =
    !data.loading &&
    (captureTurn || (Boolean(snapshot) && selected && inspecting))
  const firstMount = !revealed.has(id) && !reduced
  useEffect(() => {
    if (!data.loading) revealed.add(id)
  }, [id, data.loading])

  const [stale, setStale] = useState<string | null>(null)
  useEffect(() => {
    if (entry && entry.epoch !== epoch) setStale(entry.url)
  }, [entry, epoch])

  useEffect(() => {
    if (data.loading || snapshot || !live || !bodyRef.current) return
    const el = bodyRef.current
    const t = setTimeout(
      () => requestSnapshot(id, el, epoch),
      (data.revealDelay ?? 0) + CAPTURE_WAIT_MS
    )
    return () => {
      clearTimeout(t)
      cancelSnapshot(id)
    }
  }, [id, data.loading, data.revealDelay, snapshot, epoch, live])

  return (
    <motion.div
      initial={firstMount && data.loading ? POP : false}
      animate={SETTLED}
      transition={{
        duration: 0.3,
        ease: EASE,
        delay: (data.popDelay ?? 0) / 1000,
      }}
      style={{ width: FRAME_WIDTH }}
    >
      <div
        className="mb-1 truncate font-mono text-[10px] text-muted-foreground"
        title={data.label}
      >
        {data.loading ? (
          <span className="frame-shimmer inline-block h-2.5 w-2/3 rounded" />
        ) : (
          data.label
        )}
      </div>
      <div
        ref={bodyRef}
        className="overflow-hidden bg-background shadow-sm"
        style={{
          height: FRAME_HEIGHT,
          contain: "strict",
          position: "relative",
        }}
      >
        {stale && live && (
          <img
            src={stale}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
            }}
          />
        )}
        {data.loading || (!live && !snapshot) ? (
          <div className="frame-shimmer h-full w-full" />
        ) : !live ? (
          <img
            src={snapshot!}
            alt=""
            draggable={false}
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              display: "block",
            }}
          />
        ) : Page ? (
          // The reveal animates this wrapper, never the scaled element below —
          // its `transform` would override the scale.
          <motion.div
            className="relative h-full"
            initial={stale ? { opacity: 0 } : false}
            animate={SETTLED}
            transition={{
              duration: stale ? 0.35 : 0.45,
              ease: EASE,
              delay: stale ? 0 : (data.revealDelay ?? 0) / 1000,
            }}
            onAnimationComplete={() => stale && setStale(null)}
          >
            <div
              style={{
                width: PAGE_WIDTH,
                height: PAGE_HEIGHT,
                overflow: "hidden",
                transform: `scale(${FRAME_SCALE})`,
                transformOrigin: "top left",
              }}
              className="theme-scope pointer-events-none"
            >
              <TooltipProvider>
                <Page schema={data.schema} />
              </TooltipProvider>
            </div>
          </motion.div>
        ) : (
          <div className="p-4 text-xs text-destructive">
            Unknown page "{data.pageId}"
          </div>
        )}
      </div>
    </motion.div>
  )
})
