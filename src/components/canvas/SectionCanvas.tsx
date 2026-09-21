import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { Trash2Icon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { THEME_EVENT } from "@/components/ThemeMenu"
import {
  invalidateSnapshots,
  pauseCaptures,
  resumeCaptures,
} from "@/lib/snapshots"
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { PromptBar } from "@/components/PromptBar"
import { ThemeMenu } from "@/components/ThemeMenu"
import {
  PageFrameNode,
  FRAME_WIDTH,
  FRAME_HEIGHT,
  type PageFrameNodeType,
} from "@/components/canvas/SectionFrameNode"
import { generatePage } from "@/lib/page-client"
import { getPage } from "@/lib/pages"
import { sampleJoint } from "@/lib/sample"

const VARIANT_COUNT = 12
const COLS = 4
const CELL_W = FRAME_WIDTH + 24
const CELL_H = FRAME_HEIGHT + 60
const BATCH_GAP = 80
const REVEAL_STEP = 120 // ms between frame arrivals (mount + reveal), random order

const nodeTypes = { pageFrame: PageFrameNode }

function shuffledIndices(n: number) {
  const idx = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

export function SectionCanvas() {
  return (
    <ReactFlowProvider>
      <SectionCanvasInner />
    </ReactFlowProvider>
  )
}

function SectionCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<PageFrameNodeType>([])
  const batchCount = useRef(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const { fitView } = useReactFlow()
  // xyflow's own dark styling (the pane) keys off a `dark` class on
  // its own root, not an ancestor .dark — so canvas chrome needs it explicitly,
  // from the same theme context the Mode toggle writes to.
  const { theme } = useTheme()

  // Frame bitmaps bake the theme in. Re-theming everything in one commit
  // (12+ full-page remounts) froze the viewport, so a theme change sweeps
  // diagonally across the mounted frames, one per tick, cross-fading each
  // from its stale bitmap; off-screen frames are simply invalidated and
  // re-capture when they scroll in. Captures pause until the sweep ends.
  const [sweep, setSweep] = useState<{ key: number; duration: number } | null>(
    null
  )
  const sweepTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const themeEpoch = useRef(0)
  useEffect(() => {
    const onTheme = () => {
      sweepTimers.current.forEach(clearTimeout)
      sweepTimers.current = []
      const epoch = ++themeEpoch.current
      const mounted = [
        ...document.querySelectorAll<HTMLElement>(".react-flow__node[data-id]"),
      ]
        .map((el) => ({ id: el.dataset.id!, r: el.getBoundingClientRect() }))
        .sort((a, b) => a.r.left + a.r.top - (b.r.left + b.r.top))
      const mountedIds = new Set(mounted.map((m) => m.id))
      const bump = (ids: Set<string>) =>
        // A transition lets React time-slice the heavy page remounts instead of
        // blocking a frame per page.
        startTransition(() => {
          setNodes((prev) =>
            prev.map((n) =>
              ids.has(n.id)
                ? { ...n, data: { ...n.data, themeEpoch: epoch } }
                : n
            )
          )
        })
      // Off-screen frames just get the new epoch; they re-render when they scroll in.
      bump(new Set(nodes.map((n) => n.id).filter((id) => !mountedIds.has(id))))
      if (mounted.length === 0) return
      const step = Math.min(160, 3000 / mounted.length)
      const duration = step * mounted.length + 400
      setSweep({ key: Date.now(), duration })
      mounted.forEach((m, i) => {
        sweepTimers.current.push(
          setTimeout(() => bump(new Set([m.id])), i * step)
        )
      })
      sweepTimers.current.push(setTimeout(() => setSweep(null), duration))
    }
    window.addEventListener(THEME_EVENT, onTheme)
    return () => window.removeEventListener(THEME_EVENT, onTheme)
  }, [nodes, setNodes])

  const clearCanvas = useCallback(() => {
    invalidateSnapshots()
    setNodes([])
    batchCount.current = 0
  }, [setNodes])

  const handleGenerate = useCallback(
    async (query: string) => {
      setLoading(true)
      setError(null)
      const batch = batchCount.current++
      const yOffset =
        batch * (Math.ceil(VARIANT_COUNT / COLS) * CELL_H + BATCH_GAP)
      const ids = Array.from(
        { length: VARIANT_COUNT },
        (_, i) => `${batch}-${i}`
      )

      // Frames land on the canvas immediately as shimmering placeholders so
      // the request feels instant; Jev's answer fills them in.
      const placeholders: PageFrameNodeType[] = ids.map((id, i) => ({
        id,
        type: "pageFrame",
        position: {
          x: (i % COLS) * CELL_W,
          y: yOffset + Math.floor(i / COLS) * CELL_H,
        },
        data: {
          label: query,
          pageId: "",
          schema: {},
          loading: true,
          popDelay: i * 20,
        },
      }))
      setNodes((prev) => [...prev, ...placeholders])
      requestAnimationFrame(() =>
        fitView({
          nodes: ids.map((id) => ({ id })),
          duration: 500,
          padding: 0.08,
        })
      )

      try {
        const result = await generatePage(query)
        // One Jev call already ran; N combos are sampled from its per-slot
        // distributions here, with no further model calls.
        const samples = sampleJoint(
          result.distributions,
          VARIANT_COUNT,
          getPage(result.pageId)?.exclude
        )
        // Stagger the arrivals: mounting 20 full pages in one commit would
        // freeze the viewport for hundreds of ms. Each frame fills in on its
        // own tick, in random order, and blur-fades as it lands.
        const order = shuffledIndices(VARIANT_COUNT)
        pauseCaptures()
        for (const i of order) {
          const id = ids[i]
          startTransition(() =>
            setNodes((prev) =>
              prev.map((n) =>
                n.id === id
                  ? {
                      ...n,
                      data: {
                        label: `${result.label} · ${Object.values(samples[i]).join(" · ")}  —  "${query}"`,
                        pageId: result.pageId,
                        schema: samples[i],
                        revealDelay: 0,
                        themeEpoch: themeEpoch.current,
                      },
                    }
                  : n
              )
            )
          )
          await new Promise((r) => setTimeout(r, REVEAL_STEP))
        }
        resumeCaptures()
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
        setNodes((prev) => prev.filter((n) => !ids.includes(n.id)))
      } finally {
        setLoading(false)
      }
    },
    [fitView, setNodes]
  )

  return (
    <div className="flex h-svh w-full">
      <ThemeMenu
        collapsed={panelCollapsed}
        onToggle={() => setPanelCollapsed((c) => !c)}
      />
      <div className="relative min-w-0 flex-1 bg-zinc-100 dark:bg-zinc-900">
        <ReactFlow
          nodes={nodes}
          edges={[]}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          minZoom={0.05}
          colorMode={theme === "dark" ? "dark" : "light"}

          // Virtualise: frames outside the viewport are not mounted at all.
          onlyRenderVisibleElements
          // No DOM captures while panning/zooming.
          onMoveStart={pauseCaptures}
          onMoveEnd={resumeCaptures}
          // Double-click a frame to zoom to it; double-click the pane to see all.
          onNodeDoubleClick={(_, node) =>
            fitView({ nodes: [{ id: node.id }], duration: 400, padding: 0.05 })
          }
          onDoubleClick={(e) => {
            if ((e.target as HTMLElement).closest(".react-flow__node")) return
            fitView({ duration: 400 })
          }}
          zoomOnDoubleClick={false}
        >
          <Background color="var(--canvas-dot)" gap={20} size={1} />
        </ReactFlow>
        {/* Shine that rides the re-theme sweep across the viewport. */}
        <AnimatePresence>
          {sweep && (
            <motion.div
              key={sweep.key}
              className="pointer-events-none absolute inset-y-0 z-[5] w-1/3 skew-x-[-12deg] bg-gradient-to-r from-transparent via-background/80 to-transparent"
              initial={{ left: "-40%", opacity: 0 }}
              animate={{ left: "110%", opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: sweep.duration / 1000, ease: "linear" }}
            />
          )}
        </AnimatePresence>
        {nodes.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearCanvas}
            className="absolute top-4 right-4 z-10"
            title="Remove every frame"
          >
            <Trash2Icon /> Clear canvas
          </Button>
        )}
        <PromptBar onSubmit={handleGenerate} loading={loading} error={error} />
      </div>
    </div>
  )
}
