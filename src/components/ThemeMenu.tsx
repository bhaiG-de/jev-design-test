import { useEffect, useState } from "react"
import {
  MoonIcon,
  PaletteIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  RotateCcwIcon,
  ShuffleIcon,
  SunIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import accents from "@/lib/shadcn-accents.json"
import themes from "@/lib/shadcn-themes.json"

// Mirrors shadcn create's preset dimensions (our project preset decodes to
// style nova · base stone · theme amber · chart stone · font inter · radius
// none · menu default/subtle): base color, theme accent, chart color, body
// and heading font, radius, menu color, menu accent. Data is shadcn's own
// (r/themes/*.json base token sets, r/colors/index.json palettes) saved as
// static JSON. Applying writes tokens onto :root so every frame re-themes
// live; blocks only ever read tokens.
type Vars = Record<string, string>
type BaseTheme = { label: string; light: Vars; dark: Vars }
type Palette = Record<string, string>

const BASES = themes as Record<string, BaseTheme>
const ACCENTS = accents as Record<string, Palette>
const BASE_NAMES = Object.keys(BASES)
const ACCENT_NAMES = Object.keys(ACCENTS)

const CHART_MODES = ["base", "accent", "palette"] as const
const RADII: Record<string, string> = {
  none: "0rem",
  small: "0.3rem",
  default: "0.625rem",
  large: "0.875rem",
  xl: "1.25rem",
}
const FONTS: Record<string, string> = {
  Inter: "'Inter Variable', 'Inter', sans-serif",
  Manrope: "'Manrope', sans-serif",
  "DM Sans": "'DM Sans', sans-serif",
  "IBM Plex Sans": "'IBM Plex Sans', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
}
const HEADINGS: Record<string, string> = {
  inherit: "inherit",
  "Playfair Display": "'Playfair Display', serif",
  Lora: "'Lora', serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  Manrope: "'Manrope', sans-serif",
}
const MENU_COLORS = ["default", "solid"] as const
const MENU_ACCENTS = ["subtle", "bold"] as const
// Light accents need a darker step to keep white text readable — why shadcn
// create uses amber-700, not -600, for our preset.
const LIGHT_ACCENTS = new Set(["amber", "yellow", "lime"])
// Tailwind palettes in hue order, for harmonious multi-hue chart palettes.
const HUE_ORDER = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"].filter((n) => n in ACCENTS)

interface Choice {
  base: string
  accent: string | null
  chart: (typeof CHART_MODES)[number]
  radius: string
  font: string
  heading: string
  menu: (typeof MENU_COLORS)[number]
  menuAccent: (typeof MENU_ACCENTS)[number]
  mode: "light" | "dark"
}

const PRESET_DEFAULT: Choice = {
  base: "zinc",
  accent: "blue",
  chart: "accent",
  radius: "default",
  font: "Inter",
  heading: "inherit",
  menu: "default",
  menuAccent: "subtle",
  mode: "light",
}

function cssValue(raw: string) {
  return /^[\d.]+ [\d.]+% [\d.]+%$/.test(raw.trim()) ? `hsl(${raw.trim()})` : raw
}

// Google Fonts, loaded once per family on first use.
const loadedFonts = new Set<string>()
function ensureFont(family: string) {
  if (family === "Inter" || family === "inherit" || loadedFonts.has(family)) return
  loadedFonts.add(family)
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

// Tokens are scoped to `.theme-scope` (each frame's page content) via one
// <style> tag, so the canvas chrome itself keeps its own neutral tokens.
function styleTag() {
  let el = document.getElementById("theme-scope-vars") as HTMLStyleElement | null
  if (!el) {
    el = document.createElement("style")
    el.id = "theme-scope-vars"
    document.head.appendChild(el)
  }
  return el
}

function applyChoice(c: Choice) {
  const theme = BASES[c.base]
  if (!theme) return

  const vars: Vars = {}
  const tokens = c.mode === "dark" ? theme.dark : theme.light
  for (const [k, v] of Object.entries(tokens)) vars[`--${k}`] = cssValue(v)

  const pal = c.accent ? ACCENTS[c.accent] : undefined
  if (pal) {
    const step = LIGHT_ACCENTS.has(c.accent!) ? "700" : "600"
    vars["--primary"] = pal[step]
    vars["--primary-foreground"] = pal["50"]
    vars["--ring"] = pal[step]
  }

  // Chart palettes all follow the theme: `accent` = tints of the accent,
  // `palette` = the accent plus its hue-wheel neighbours, `base` = neutral tones.
  if (c.chart === "accent" && pal) {
    ;["700", "500", "400", "300", "200"].forEach((s, i) => (vars[`--chart-${i + 1}`] = pal[s]))
  } else if (c.chart === "palette" && c.accent) {
    const i = HUE_ORDER.indexOf(c.accent)
    const at = (d: number) => ACCENTS[HUE_ORDER[(i + d + HUE_ORDER.length) % HUE_ORDER.length]]
    vars["--chart-1"] = pal!["600"]
    vars["--chart-2"] = at(3)["500"]
    vars["--chart-3"] = at(-3)["500"]
    vars["--chart-4"] = at(6)["400"]
    vars["--chart-5"] = at(-6)["400"]
  } else {
    ;["foreground", "muted-foreground", "border", "input", "muted"].forEach(
      (t, i) => (vars[`--chart-${i + 1}`] = cssValue(tokens[t] ?? "0 0% 50%")),
    )
  }

  // Sidebar tokens follow the menu dimensions.
  vars["--sidebar"] = c.menu === "solid" ? vars["--foreground"] : cssValue(tokens.card ?? tokens.background)
  vars["--sidebar-foreground"] = c.menu === "solid" ? vars["--background"] : vars["--foreground"]
  vars["--sidebar-border"] = c.menu === "solid" ? "color-mix(in oklch, var(--background) 15%, transparent)" : vars["--border"]
  vars["--sidebar-primary"] = vars["--primary"]
  vars["--sidebar-primary-foreground"] = vars["--primary-foreground"]
  vars["--sidebar-accent"] =
    c.menuAccent === "bold" ? vars["--primary"] : c.menu === "solid" ? "color-mix(in oklch, var(--background) 12%, transparent)" : vars["--accent"]
  vars["--sidebar-accent-foreground"] = c.menuAccent === "bold" ? vars["--primary-foreground"] : vars["--sidebar-foreground"]
  vars["--sidebar-ring"] = vars["--ring"]

  vars["--radius"] = RADII[c.radius]
  ensureFont(c.font)
  ensureFont(c.heading)
  vars["--font-sans"] = FONTS[c.font]
  vars["--font-heading"] = HEADINGS[c.heading] === "inherit" ? FONTS[c.font] : HEADINGS[c.heading]

  styleTag().textContent = `.theme-scope {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}`
  announce()
}

function resetAll() {
  applyChoice(PRESET_DEFAULT)
}

// Shader backdrops snapshot their colors once; tell them tokens changed.
export const THEME_EVENT = "theme-scope-change"
function announce() {
  window.dispatchEvent(new CustomEvent(THEME_EVENT))
}

const pickRandom = <T,>(xs: readonly T[]) =>
  xs[Math.floor(Math.random() * xs.length)]

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="w-12 shrink-0 pt-1 text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean
  onClick: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <Button
      size="xs"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  )
}

export function ThemeMenu({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const current: Choice = { ...PRESET_DEFAULT, ...(choice ?? {}) }
  const { setTheme } = useTheme()
  // Frames start on the default theme, not whatever tokens the app chrome has;
  // the canvas chrome's own light/dark class follows the same mode so the
  // canvas background switches together with the frames.
  useEffect(() => {
    applyChoice(PRESET_DEFAULT)
    setTheme(PRESET_DEFAULT.mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const on = (test: boolean) => Boolean(choice) && test

  function update(patch: Partial<Choice>) {
    const next = { ...current, ...patch }
    applyChoice(next)
    setChoice(next)
    if (patch.mode) setTheme(patch.mode)
  }

  function shuffle() {
    update({
      base: pickRandom(BASE_NAMES),
      accent: Math.random() < 0.85 ? pickRandom(ACCENT_NAMES) : null,
      chart: pickRandom(CHART_MODES),
      radius: pickRandom(Object.keys(RADII)),
      font: pickRandom(Object.keys(FONTS)),
      heading: pickRandom(Object.keys(HEADINGS)),
      menu: pickRandom(MENU_COLORS),
      menuAccent: pickRandom(MENU_ACCENTS),
    })
  }

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r bg-sidebar text-xs text-sidebar-foreground transition-[width] duration-200 ${collapsed ? "w-12" : "w-72"}`}
    >
      <div
        className={`flex h-12 shrink-0 items-center border-b ${collapsed ? "justify-center" : "gap-2 px-3"}`}
      >
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm leading-tight font-semibold">
              Screen variants
            </div>
            <div className="truncate text-[11px] leading-tight text-muted-foreground">
              Jev picks the structure, code builds the page
            </div>
          </div>
        )}
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onToggle}
          title={collapsed ? "Expand panel" : "Collapse panel"}
        >
          {collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
        </Button>
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center gap-1 py-2">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onToggle}
            title={`Theme: ${current.base} · ${current.accent ?? "no accent"}`}
          >
            <PaletteIcon />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => update({ mode: current.mode === "dark" ? "light" : "dark" })}
            title={current.mode === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {current.mode === "dark" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={shuffle}
            title="Shuffle theme"
          >
            <ShuffleIcon />
          </Button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <PaletteIcon className="size-4" /> Theme
            <span className="ml-auto truncate text-[11px] font-normal text-muted-foreground">
              {choice
                ? `${current.base} · ${current.accent ?? "no accent"} · ${current.font}`
                : "zinc · blue · Inter"}
            </span>
          </div>

          <Row label="Mode">
            <Chip
              active={on(current.mode === "light")}
              onClick={() => update({ mode: "light" })}
              title="Light canvas and pages"
            >
              <SunIcon /> Light
            </Chip>
            <Chip
              active={on(current.mode === "dark")}
              onClick={() => update({ mode: "dark" })}
              title="Dark canvas and pages"
            >
              <MoonIcon /> Dark
            </Chip>
          </Row>

          <Row label="Base">
            {BASE_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                title={BASES[name].label}
                onClick={() => update({ base: name })}
                className={`size-6 rounded-full border-2 ${on(current.base === name) ? "border-foreground" : "border-border"}`}
                style={{
                  background: cssValue(BASES[name].light.muted ?? "0 0% 90%"),
                }}
              />
            ))}
          </Row>

          <Row label="Theme">
            <button
              type="button"
              title="No accent (base primary)"
              onClick={() => update({ accent: null })}
              className={`size-6 rounded-full border-2 bg-[repeating-linear-gradient(45deg,var(--border)_0_3px,transparent_3px_6px)] ${on(current.accent === null) ? "border-foreground" : "border-border"}`}
            />
            {ACCENT_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => update({ accent: name })}
                className={`size-6 rounded-full border-2 ${on(current.accent === name) ? "border-foreground" : "border-border"}`}
                style={{
                  background:
                    ACCENTS[name][LIGHT_ACCENTS.has(name) ? "700" : "600"],
                }}
              />
            ))}
          </Row>

          <Row label="Charts">
            {CHART_MODES.map((m) => (
              <Chip
                key={m}
                active={on(current.chart === m)}
                onClick={() => update({ chart: m })}
              >
                {m}
              </Chip>
            ))}
          </Row>

          <Row label="Font">
            {Object.keys(FONTS).map((f) => (
              <Chip
                key={f}
                active={on(current.font === f)}
                onClick={() => update({ font: f })}
              >
                {f}
              </Chip>
            ))}
          </Row>

          <Row label="Heading">
            {Object.keys(HEADINGS).map((f) => (
              <Chip
                key={f}
                active={on(current.heading === f)}
                onClick={() => update({ heading: f })}
              >
                {f}
              </Chip>
            ))}
          </Row>

          <Row label="Radius">
            {Object.entries(RADII).map(([name, r]) => (
              <button
                key={name}
                type="button"
                title={`${name} (${r})`}
                onClick={() => update({ radius: name })}
                className={`size-6 border-2 bg-muted ${on(current.radius === name) ? "border-foreground" : "border-border"}`}
                style={{ borderRadius: r }}
              />
            ))}
          </Row>

          <Row label="Menu">
            {MENU_COLORS.map((m) => (
              <Chip
                key={m}
                active={on(current.menu === m)}
                onClick={() => update({ menu: m })}
                title="Sidebar color"
              >
                {m}
              </Chip>
            ))}
            <span className="px-1 pt-1 text-muted-foreground">·</span>
            {MENU_ACCENTS.map((m) => (
              <Chip
                key={m}
                active={on(current.menuAccent === m)}
                onClick={() => update({ menuAccent: m })}
                title="Active item accent"
              >
                {m}
              </Chip>
            ))}
          </Row>

          <div className="flex justify-end gap-1 border-t pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={shuffle}
              title="Shuffle every dimension"
            >
              <ShuffleIcon /> Shuffle
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                resetAll()
                setChoice(null)
                setTheme(PRESET_DEFAULT.mode)
              }}
              title="Back to the project preset"
            >
              <RotateCcwIcon /> Reset
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}
