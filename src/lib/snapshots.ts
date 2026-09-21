import {
  createContext,
  destroyContext,
  domToBlob,
  type Context,
} from "modern-screenshot"
import workerUrl from "modern-screenshot/worker?url"
import { useEffect, useState, useSyncExternalStore } from "react"

// Level-of-detail store for canvas frames (the Figma trick): a frame is live
// React DOM only while it holds the single capture slot, or while the user
// has that frame selected. Otherwise it is one <img>. Canvas zoom never
// remounts every visible page.

export interface Snapshot {
  url: string
  /** Theme epoch the bitmap was captured under; a newer epoch on the node means "stale, re-render". */
  epoch: number
}
const urls = new Map<string, Snapshot>()
const listenersById = new Map<string, Set<() => void>>()
let version = 0

function emit(id: string) {
  version++
  listenersById.get(id)?.forEach((l) => l())
}

function emitMany(ids: Iterable<string>) {
  version++
  for (const id of ids) listenersById.get(id)?.forEach((l) => l())
}

export function useSnapshot(id: string) {
  return useSyncExternalStore(
    (l) => {
      let set = listenersById.get(id)
      if (!set) {
        set = new Set()
        listenersById.set(id, set)
      }
      set.add(l)
      return () => {
        set!.delete(l)
        if (set!.size === 0) listenersById.delete(id)
      }
    },
    () => urls.get(id) ?? null
  )
}

let captureOwner: string | null = null
const captureWaiters = new Set<() => void>()

function notifyCaptureWaiters() {
  captureWaiters.forEach((l) => l())
}

export function tryAcquireCapture(id: string) {
  if (captureOwner === id) return true
  if (captureOwner !== null) return false
  captureOwner = id
  notifyCaptureWaiters()
  return true
}

export function releaseCapture(id: string) {
  if (captureOwner !== id) return
  captureOwner = null
  notifyCaptureWaiters()
}

export function subscribeCapture(listener: () => void) {
  captureWaiters.add(listener)
  return () => captureWaiters.delete(listener)
}

/** At most one uncaptured frame mounts live DOM. Everyone else waits. */
export function useCapturePermit(id: string, needed: boolean) {
  const [held, setHeld] = useState(false)
  useEffect(() => {
    if (!needed) {
      releaseCapture(id)
      setHeld(false)
      return
    }
    if (tryAcquireCapture(id)) {
      setHeld(true)
      return () => releaseCapture(id)
    }
    const unsub = subscribeCapture(() => {
      if (tryAcquireCapture(id)) setHeld(true)
    })
    return () => {
      unsub()
      releaseCapture(id)
    }
  }, [id, needed])
  return needed && held
}

export function snapshotStats() {
  return {
    version,
    count: urls.size,
    queue: queue.length,
    queued: queued.size,
    running,
    busy,
    captureOwner,
  }
}

/** Drop every bitmap (theme changed, canvas cleared). Frames go live and re-capture lazily. */
export function invalidateSnapshots(ids?: Iterable<string>) {
  fontCssPromise = null // theme may have loaded new font families
  resetCaptureContext()
  const targets = ids ? [...ids] : [...urls.keys()]
  const old: string[] = []
  for (const id of targets) {
    const u = urls.get(id)
    if (u) old.push(u.url)
    urls.delete(id)
  }
  // Frames cross-fade from the stale bitmap to the fresh live page, so the
  // old URLs must outlive this call by a moment.
  if (old.length)
    setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 4000)
  emitMany(targets)
}

// ---- font embedding, computed once ---------------------------------------
// modern-screenshot re-fetches and base64-encodes every @font-face on each
// capture (the bulk of a capture's time). Build that CSS once for the latin
// faces currently loaded and hand it over via `font.cssText`.
let fontCssPromise: Promise<string> | null = null
function fontCss(): Promise<string> {
  return (fontCssPromise ??= (async () => {
    const out: string[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        continue // cross-origin sheet (Google Fonts): fonts already in document.fonts, handled below
      }
      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSFontFaceRule)) continue
        const range = rule.style.getPropertyValue("unicode-range")
        if (range && !/U\+0{0,2}0-|U\+0{0,2}4/i.test(range)) continue // keep latin only
        const src = rule.style.getPropertyValue("src")
        const m = /url\(["']?([^"')]+)["']?\)/.exec(src)
        if (!m) continue
        try {
          const url = new URL(m[1], sheet.href ?? location.href).href
          const buf = await (await fetch(url)).arrayBuffer()
          const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)))
          out.push(
            rule.cssText.replace(m[0], `url(data:font/woff2;base64,${b64})`)
          )
        } catch {
          /* skip a face we cannot fetch */
        }
      }
    }
    return out.join("\n")
  })())
}

// ---- interaction gate -----------------------------------------------------
// A capture clones a full page's DOM (hundreds of ms). It must never overlap
// a pan/zoom or a batch landing, so the queue only advances after the canvas
// has been quiet for a moment.
let busy = 0
let quietSince = 0
const QUIET_MS = 350
export function pauseCaptures() {
  busy++
}
export function resumeCaptures() {
  busy = Math.max(0, busy - 1)
  quietSince = performance.now()
  if (!running) pump()
}
function canRun() {
  return busy === 0 && performance.now() - quietSince >= QUIET_MS
}

// ---- capture --------------------------------------------------------------
// One modern-screenshot Context is reused across captures: creating one
// spins up a sandbox iframe (default computed styles per tag), a worker and
// re-parses fonts — the fixed cost that made each capture ~1s. Reset on
// invalidate (fonts may change).
let ctx: Context | null = null
let clipBottom = 0
async function capture(el: HTMLElement): Promise<Blob | null> {
  const width = captureSize.width || el.clientWidth
  const height = captureSize.height || el.clientHeight
  clipBottom = el.getBoundingClientRect().bottom
  if (!ctx) {
    const cssText = await fontCss()
    ctx = await createContext(el, {
      width,
      height,
      // 2× a 360px frame = 720px: crisp on a 2× display up to INSPECT_ZOOM.
      scale: 2,
      type: "image/webp",
      quality: 0.82,
      font: cssText ? { cssText } : { preferredFormat: "woff2" },
      workerUrl,
      workerNumber: 1,
      features: { copyScrollbar: false, restoreScrollPosition: false },
      filter: (node) => {
        if (!(node instanceof Element) || !ctx || node === ctx.node) return true
        const r = node.getBoundingClientRect()
        return r.height === 0 || r.top < clipBottom
      },
      autoDestruct: false,
    } as Parameters<typeof createContext>[1])
  } else {
    ctx.node = el
  }
  return domToBlob(ctx)
}
function resetCaptureContext() {
  if (ctx) destroyContext(ctx)
  ctx = null
}

// ---- capture queue -------------------------------------------------------

type Job = { id: string; el: HTMLElement; epoch: number; waits?: number }
const queue: Job[] = []
const queued = new Set<string>()
let running = false

const idle: (cb: () => void) => void =
  typeof requestIdleCallback === "function"
    ? (cb) => requestIdleCallback(cb, { timeout: 2000 })
    : (cb) => setTimeout(cb, 50)

// Layout size of the captured element. modern-screenshot otherwise measures
// getBoundingClientRect(), which the canvas zoom transform has already
// scaled, and the clone crops to that box (frames looked "zoomed in").
let captureSize = { width: 0, height: 0 }
export function setCaptureSize(width: number, height: number) {
  captureSize = { width, height }
}

export function requestSnapshot(id: string, el: HTMLElement, epoch = 0) {
  const have = urls.get(id)
  if ((have && have.epoch === epoch) || queued.has(id)) return
  queued.add(id)
  queue.push({ id, el, epoch })
  if (!running) pump()
}

export function cancelSnapshot(id: string) {
  queued.delete(id)
  const i = queue.findIndex((j) => j.id === id)
  if (i >= 0) queue.splice(i, 1)
}

function pump() {
  if (queue.length === 0) {
    running = false
    return
  }
  running = true
  if (!canRun()) {
    setTimeout(pump, QUIET_MS)
    return
  }
  const job = queue.shift()!
  idle(async () => {
    if (!canRun()) {
      // Interaction started while we waited: put it back, try later.
      queue.unshift(job)
      setTimeout(pump, QUIET_MS)
      return
    }
    // A shader backdrop inside is still rendering (live WebGL canvas, or
    // waiting on a shared render): capturing now would bake a frame without
    // its backdrop, or with the canvas clone painted over the content.
    if (
      job.el.querySelector("[data-shader-pending]") &&
      (job.waits = (job.waits ?? 0) + 1) < 20
    ) {
      queue.push(job)
      setTimeout(pump, 300)
      return
    }
    let retry = false
    if (queued.has(job.id) && job.el.isConnected) {
      try {
        const t0 = performance.now()
        const blob = await capture(job.el)
        // A ~1kB webp is a blank frame (clone came back empty): don't cache it.
        if (blob && blob.size > 3000 && queued.has(job.id)) {
          const prev = urls.get(job.id)
          urls.set(job.id, { url: URL.createObjectURL(blob), epoch: job.epoch })
          if (prev) setTimeout(() => URL.revokeObjectURL(prev.url), 4000)
          emit(job.id)
        } else if ((job.waits = (job.waits ?? 0) + 1) < 3) {
          retry = true
          queue.push(job)
        }
        if (import.meta.env.DEV)
          console.debug(
            `[snapshot] ${job.id} ${Math.round(performance.now() - t0)}ms ${blob ? Math.round(blob.size / 1024) : 0}kB`
          )
      } catch (e) {
        console.warn("snapshot failed", job.id, e)
        if ((job.waits = (job.waits ?? 0) + 1) < 3) {
          retry = true
          queue.push(job)
        }
      }
    }
    if (!retry) queued.delete(job.id)
    // Breathe between captures so a pending frame or input gets its turn.
    setTimeout(pump, 120)
  })
}
