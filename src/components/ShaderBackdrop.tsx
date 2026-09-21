import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { THEME_EVENT } from "@/components/ThemeMenu";
import { DotOrbit, GrainGradient, MeshGradient, Waves } from "@paper-design/shaders-react";

// Paper Shaders (Apache-2.0) as backdrop material behind heroes, marketing
// sections and centered screens.
//
// Shaders only parse hex/rgb/hsl and our tokens are oklch, so colors are
// resolved through a 2D canvas (serialises any CSS color, color-mix included)
// read from this element, which honours the frame's `.theme-scope` overrides.
//
// ponytail: browsers cap live WebGL contexts (~16) and 20 frames × shaders
// would blow past it, so each shader runs for a moment, is snapshotted to a
// PNG and unmounted. Frames are 0.25-scale thumbnails; a still is fine. Keep
// a live shader only if a frame is ever shown at full size.
function tokenColor(expr: string, fallback: string) {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;
  // Paint one pixel and read it back: works for oklch, color-mix, anything.
  // (Reading fillStyle back is not enough — Chrome serialises color-mix as
  // `color(srgb …)`, which the shaders can't parse.)
  ctx.fillStyle = "#010203";
  ctx.fillStyle = expr;
  if (ctx.fillStyle === "#010203") return fallback; // unparsable expression
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export const SHADER_KINDS = ["mesh-gradient", "grain-gradient", "waves", "dot-orbit"] as const;
type Kind = (typeof SHADER_KINDS)[number];

const SNAPSHOT_AFTER_MS = 450;

// One render per (kind, palette): 12 frames share at most 4 shader looks, so
// re-theming used to compile 12 shaders when 4 would do. The first instance
// for a key renders live and resolves the PNG; the rest just wait for it.
type Pending = { promise: Promise<string>; resolve: (url: string) => void; reject: () => void; owner: symbol | null };
const shaderCache = new Map<string, Pending>();
function pendingFor(key: string): Pending {
  let p = shaderCache.get(key);
  if (!p) {
    let resolve!: (u: string) => void;
    let reject!: () => void;
    const promise = new Promise<string>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    promise.catch(() => {});
    p = { promise, resolve, reject, owner: null };
    shaderCache.set(key, p);
  }
  return p;
}
if (typeof window !== "undefined") window.addEventListener(THEME_EVENT, () => shaderCache.clear());
const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -1 } as const;

interface Palette {
  bg: string;
  muted: string;
  tint30: string;
  tint60: string;
}

export function ShaderBackdrop({ kind }: { kind?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [epoch, setEpoch] = useState(0);
  const [renderer, setRenderer] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const me = useRef(Symbol("shader"));
  const active = (SHADER_KINDS as readonly string[]).includes(kind ?? "");
  const key = palette ? `${kind}|${palette.bg}|${palette.tint30}|${palette.tint60}|${palette.muted}` : null;

  // Claim the render for this key or wait for whoever has it.
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    const p = pendingFor(key);
    if (p.owner === null) {
      p.owner = me.current;
      setRenderer(true);
    } else {
      setRenderer(false);
    }
    p.promise.then((url) => {
      if (!cancelled) setSnapshot(url);
    }, () => {
      // Owner unmounted before capturing: retry with a fresh claim.
      if (!cancelled) setEpoch((e) => e + 1);
    });
    return () => {
      cancelled = true;
      if (p.owner === me.current && shaderCache.get(key) === p) {
        // Leaving before we produced the image: release the key.
        shaderCache.delete(key);
        p.reject();
      }
    };
    // `epoch` re-runs the claim after a rejected wait (owner unmounted first).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, epoch]);

  // Theme menu changed tokens: drop the snapshot and re-render with the new
  // palette. Staggered so 20+ frames don't open WebGL contexts at once.
  useEffect(() => {
    if (!active) return;
    const onTheme = () => {
      const t = setTimeout(() => {
        setPalette(null);
        setSnapshot(null);
        setEpoch((e) => e + 1);
      }, Math.random() * 2500);
      timers.current.push(t);
    };
    window.addEventListener(THEME_EVENT, onTheme);
    const pending = timers.current;
    return () => {
      window.removeEventListener(THEME_EVENT, onTheme);
      pending.forEach(clearTimeout);
    };
  }, [active]);

  useLayoutEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const cs = getComputedStyle(el);
    const primary = cs.getPropertyValue("--primary").trim() || "#d97706";
    const bg = cs.getPropertyValue("--background").trim() || "#ffffff";
    setPalette({
      bg: tokenColor(bg, "#ffffff"),
      muted: tokenColor(cs.getPropertyValue("--muted").trim() || "#f5f5f4", "#f5f5f4"),
      tint30: tokenColor(`color-mix(in srgb, ${primary} 15%, ${bg})`, "#f8efe2"),
      tint60: tokenColor(`color-mix(in srgb, ${primary} 35%, ${bg})`, "#efd3ad"),
    });
  }, [active, epoch]);

  useLayoutEffect(() => {
    if (!palette || !key || snapshot || !renderer || !ref.current) return;
    const el = ref.current;
    const t = setTimeout(() => {
      const canvas = el.querySelector("canvas");
      if (!canvas) return;
      try {
        const url = canvas.toDataURL("image/png");
        const p = shaderCache.get(key);
        if (p && p.owner === me.current) {
          p.owner = null; // done; keep the resolved promise cached
          p.resolve(url);
        }
        setSnapshot(url);
      } catch {
        /* tainted/lost context: keep the live shader */
      }
    }, SNAPSHOT_AFTER_MS);
    return () => clearTimeout(t);
  }, [palette, key, snapshot, renderer]);

  if (!active) return null;
  if (!palette) return <div ref={ref} style={FILL} data-shader-pending="" />;
  if (snapshot) return <img ref={ref as never} src={snapshot} alt="" style={{ ...FILL, objectFit: "cover" }} />;
  if (!renderer) return <div ref={ref} style={FILL} data-shader-pending="" />;

  // Render small: the frame is a 0.25-scale thumbnail and the result is snapshotted.
  const gl = { webGlContextAttributes: { preserveDrawingBuffer: true }, minPixelRatio: 0.5, maxPixelCount: 600_000, style: FILL };
  const k = kind as Kind;
  return (
    <div ref={ref} style={FILL} aria-hidden data-shader-pending="">
      {k === "mesh-gradient" && (
        <MeshGradient colors={[palette.bg, palette.tint30, palette.muted, palette.tint60]} distortion={0.45} swirl={0.3} speed={0.6} {...gl} />
      )}
      {k === "grain-gradient" && (
        <GrainGradient colors={[palette.tint60, palette.tint30]} colorBack={palette.bg} softness={0.85} intensity={0.15} noise={0.3} speed={1} {...gl} />
      )}
      {k === "waves" && (
        <Waves colorFront={palette.tint30} colorBack={palette.bg} scale={3} amplitude={0.2} frequency={0.1} spacing={2.2} proportion={0.2} softness={1} {...gl} />
      )}
      {k === "dot-orbit" && (
        <DotOrbit colors={[palette.tint60, palette.tint30]} colorBack={palette.bg} size={0.3} spreading={0.6} speed={1} {...gl} />
      )}
    </div>
  );
}
