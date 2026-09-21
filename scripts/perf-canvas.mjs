#!/usr/bin/env node
// Rerunnable canvas benchmark. Seeds 12 dashboard frames, then measures
// settle cost, overview pan, and inspect remount.
//
//   node scripts/perf-canvas.mjs [out.json]
//
// Expects the Vite app at http://localhost:5174.

import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer-core"

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const BASE = process.env.PERF_URL || "http://localhost:5174"
const OUT = resolve(
  process.argv[2] ||
    fileURLToPath(new URL("../artifacts/perf-canvas.json", import.meta.url))
)

const DASHBOARDS = [
  { nav: "sidebar", kpis: "four-cards", chart: "area-full", table: "data-table" },
  { nav: "rail", kpis: "stat-strip", chart: "bar-full", table: "data-table" },
  { nav: "topbar", kpis: "hero-number", chart: "line-full", table: "data-table" },
  { nav: "sidebar", kpis: "four-cards", chart: "split-two", table: "simple-list" },
  { nav: "rail", kpis: "stat-strip", chart: "three-small", table: "simple-list" },
  { nav: "topbar", kpis: "hero-number", chart: "four-grid", table: "simple-list" },
  { nav: "sidebar", kpis: "four-cards", chart: "area-full", table: "none" },
  { nav: "rail", kpis: "stat-strip", chart: "bar-full", table: "none" },
  { nav: "topbar", kpis: "hero-number", chart: "line-full", table: "none" },
  { nav: "sidebar", kpis: "four-cards", chart: "split-two", table: "data-table" },
  { nav: "rail", kpis: "stat-strip", chart: "three-small", table: "data-table" },
  { nav: "topbar", kpis: "hero-number", chart: "four-grid", table: "data-table" },
]

function percentile(values, p) {
  if (values.length === 0) return null
  const s = [...values].sort((a, b) => a - b)
  const i = Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))
  return s[i]
}

function summarize(values) {
  if (values.length === 0) return { n: 0 }
  const sum = values.reduce((a, b) => a + b, 0)
  return {
    n: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    mean: sum / values.length,
    p50: percentile(values, 50),
    p95: percentile(values, 95),
  }
}

function phaseSummary(sample) {
  const frameMs = sample.frames ?? []
  const fps = frameMs.map((ms) => (ms > 0 ? 1000 / ms : 0))
  const tasks = sample.longTasks ?? []
  return {
    stats: sample.stats ?? null,
    frameMs: summarize(frameMs),
    fps: summarize(fps),
    longTasks: summarize(tasks.map((t) => t.duration)),
    longTaskCount: tasks.length,
    longTaskTotalMs: tasks.reduce((a, b) => a + b.duration, 0),
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--disable-gpu-vsync", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
})

const page = await browser.newPage()
const consoleLines = []
page.on("console", (msg) => {
  const text = msg.text()
  if (text.includes("[snapshot]") || text.includes("error") || text.includes("Error")) {
    consoleLines.push(text)
  }
})

await page.goto(`${BASE}/?perf=1`, { waitUntil: "networkidle0", timeout: 60_000 })
await page.waitForFunction(() => Boolean(window.__PERF), { timeout: 15_000 })

await page.evaluate(() => {
  window.__perfLongTasks = []
  const obs = new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perfLongTasks.push({
        start: e.startTime,
        duration: e.duration,
        name: e.name,
      })
    }
  })
  obs.observe({ type: "longtask", buffered: true })
})

const tSeed = Date.now()
await page.evaluate(
  (schemas) => window.__PERF.seed("dashboard", schemas, "Dashboard"),
  DASHBOARDS
)
await page.waitForFunction(() => window.__PERF.stats().nodes >= 12, {
  timeout: 10_000,
})
const immediately = await page.evaluate(() => window.__PERF.stats())
const settleMark = await page.evaluate(() => window.__perfLongTasks.length)

async function startFrames() {
  return page.evaluate(() => {
    cancelAnimationFrame(window.__perfRaf)
    window.__perfFrames = []
    const from = window.__perfLongTasks.length
    let last = performance.now()
    function tick(now) {
      window.__perfFrames.push(now - last)
      last = now
      window.__perfRaf = requestAnimationFrame(tick)
    }
    window.__perfRaf = requestAnimationFrame(tick)
    return from
  })
}

async function stopFrames(from) {
  return page.evaluate((mark) => {
    cancelAnimationFrame(window.__perfRaf)
    return {
      stats: window.__PERF.stats(),
      frames: window.__perfFrames.slice(2),
      longTasks: window.__perfLongTasks.slice(mark),
    }
  }, from)
}

const pane = await page.$(".react-flow")
if (!pane) throw new Error("react-flow pane missing")
const box = await pane.boundingBox()
if (!box) throw new Error("react-flow has no box")
const cx = box.x + box.width / 2
const cy = box.y + box.height / 2

const settlePanFrom = await startFrames()
await page.mouse.move(cx, cy)
await page.mouse.down()
for (let i = 0; i < 8; i++) {
  await page.mouse.move(cx + i * 8, cy + (i % 2 === 0 ? 4 : -4))
}
await page.mouse.up()
const settlePan = await stopFrames(settlePanFrom)

const drain = []
let settledAt = null
const deadline = Date.now() + 25_000
while (Date.now() < deadline) {
  const snap = await page.evaluate(() => ({
    t: performance.now(),
    ...window.__PERF.stats(),
  }))
  drain.push(snap)
  if (snap.livePages === 0 && snap.snapshots.count >= DASHBOARDS.length) {
    settledAt = Date.now() - tSeed
    break
  }
  await new Promise((r) => setTimeout(r, 250))
}

const settle = await page.evaluate((from) => {
  return {
    stats: window.__PERF.stats(),
    longTasks: window.__perfLongTasks.slice(from),
    peakLive: Math.max(
      ...window.__perfLongTasks.map(() => 0),
      window.__PERF.stats().livePages
    ),
  }
}, settleMark)

const panFrom = await startFrames()
await page.mouse.move(cx, cy)
await page.mouse.down()
for (let i = 0; i < 24; i++) {
  await page.mouse.move(cx + i * 16, cy + (i % 2 === 0 ? 10 : -10))
}
await page.mouse.up()
await new Promise((r) => setTimeout(r, 300))
const overviewPan = await stopFrames(panFrom)

const inspectFrom = await startFrames()
const firstNode = await page.$(".react-flow__node")
if (firstNode) {
  const nb = await firstNode.boundingBox()
  if (nb) {
    await page.mouse.click(nb.x + nb.width / 2, nb.y + nb.height / 2, {
      clickCount: 2,
    })
  }
}
await new Promise((r) => setTimeout(r, 800))
const inspect = await stopFrames(inspectFrom)

await browser.close()

const peakLive = Math.max(...drain.map((d) => d.livePages), immediately.livePages)
const peakDom = Math.max(...drain.map((d) => d.domNodes), immediately.domNodes)

const result = {
  measuredAt: new Date().toISOString(),
  url: `${BASE}/?perf=1`,
  seed: { pageId: "dashboard", count: DASHBOARDS.length },
  immediately,
  drainMs: settledAt,
  peakLive,
  peakDom,
  liveAtEnd: settle.stats.livePages,
  snapshotsAtEnd: settle.stats.snapshots,
  domAtEnd: settle.stats.domNodes,
  settle: phaseSummary(settle),
  settlePan: phaseSummary(settlePan),
  overviewPan: phaseSummary(overviewPan),
  inspect: phaseSummary(inspect),
  snapshotLogs: consoleLines.filter((l) => l.includes("[snapshot]")),
}

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(result, null, 2))
console.log(JSON.stringify(result, null, 2))
console.log(`wrote ${OUT}`)
