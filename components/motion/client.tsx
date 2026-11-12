"use client";
// Small client primitives. Each one writes to the DOM directly (data attributes, CSS vars, textContent),
// so scrolling and pointer moves never re-render React.
import { useEffect, useRef, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { cx } from "../ui";
import "./motion.css";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView<T extends Element>(onChange: (el: T, inView: boolean) => void, once = false, rootMargin = "0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      onChange(el, e.isIntersecting);
      if (once && e.isIntersecting) io.disconnect();
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
    // onChange is a stable module-level function at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

const setLive = (el: HTMLElement, on: boolean) => { el.dataset.live = on ? "on" : "off"; };

/** Wrapper that runs CSS animations inside it only while it is on screen. Root of every animated graphic. */
export function Live({ className, children, ...rest }: ComponentProps<"div">) {
  const ref = useInView<HTMLDivElement>(setLive, false, "80px");
  return <div ref={ref} data-live="off" className={className} {...rest}>{children}</div>;
}

const show = (attr: "reveal" | "stagger") => (el: HTMLElement, on: boolean) => { if (on) el.dataset[attr] = "in"; };
const showReveal = show("reveal");
const showStagger = show("stagger");
const MARGIN = "0px 0px -10% 0px";

/** Fades + rises 16px once when scrolled into view. Not for above-the-fold content. */
export function Reveal({ delay = 0, className, children }: { delay?: number; className?: string; children: ReactNode }) {
  const ref = useInView<HTMLDivElement>(showReveal, true, MARGIN);
  return <div ref={ref} data-reveal="wait" className={className} style={delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined}>{children}</div>;
}

/** Like Reveal, but each direct child enters 70ms after the previous one. Pass the grid/flex classes here. */
export function Stagger({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useInView<HTMLDivElement>(showStagger, true, MARGIN);
  return <div ref={ref} data-stagger="wait" className={className}>{children}</div>;
}

/** Counts from 0 to `value` when first seen. Server HTML (and reduced motion) shows the final number. */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1400, className }: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const fmt = (n: number) => prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) { el.textContent = fmt(0); return; } // parked at 0 until seen
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        el.textContent = fmt(value * (1 - (1 - p) ** 3));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);
  return <span ref={ref} className={cx("tabular-nums", className)}>{fmt(value)}</span>;
}

/** Card with a violet glow that follows the pointer; `tilt` adds a 4° 3D lean on mouse/trackpad. */
export function Spotlight({ tilt = false, className, children, ...rest }: ComponentProps<"div"> & { tilt?: boolean }) {
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      el.style.setProperty("--rx", `${((r.height / 2 - y) / r.height) * 8}deg`);
      el.style.setProperty("--ry", `${((x - r.width / 2) / r.width) * 8}deg`);
    }
  };
  const leave = (e: React.PointerEvent<HTMLDivElement>) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };
  return <div onPointerMove={move} onPointerLeave={leave} className={cx("rp-spot", tilt && "rp-tilt", className)} {...rest}>{children}</div>;
}

/** Wrap the existing `<Tabs>` to add an accent underline that slides to the selected tab. Tabs.tsx stays untouched. */
export function TabUnderline({ className, children }: { className?: string; children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const w = wrap.current, b = bar.current;
    const list = w?.querySelector<HTMLElement>('[role="tablist"]');
    if (!w || !b || !list) return;
    const place = () => {
      const tab = list.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!tab) return;
      const t = tab.getBoundingClientRect(), o = w.getBoundingClientRect(), l = list.getBoundingClientRect();
      b.style.width = `${t.width - 24}px`;
      b.style.translate = `${t.left - o.left + 12}px 0`;
      b.style.top = `${l.bottom - o.top - 6}px`;
    };
    place();
    const mo = new MutationObserver(place);
    mo.observe(list, { attributes: true, subtree: true, attributeFilter: ["aria-selected"] });
    const ro = new ResizeObserver(place);
    ro.observe(w);
    list.addEventListener("scroll", place, { passive: true });
    return () => { mo.disconnect(); ro.disconnect(); list.removeEventListener("scroll", place); };
  }, []);
  return (
    <div ref={wrap} className={cx("relative", className)}>
      {children}
      <span ref={bar} aria-hidden className="rp-underline" />
    </div>
  );
}

/** One beat of a <Scene>: when it lands (ms from start), and optionally a `[data-target]` name the cursor moves to and clicks. */
export type Beat = number | { at: number; click?: string };

/**
 * Product scene player. Children mark what changes with `data-at="k"` (appears at beat k) and `data-until="k"` (gone at beat k);
 * the CSS lives in motion.css. Server HTML has no `data-s`, so reduced motion and no-JS show the final frame.
 * Plays once when 35% visible (replays only if it was cut off), or loops with `loop`. An optional `<Cursor />` child is driven here.
 */
export function Scene({ beats, loop = false, hold = 3200, className, children, ...rest }: ComponentProps<"div"> & { beats: Beat[]; loop?: boolean; hold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const cur = el.querySelector<HTMLElement>("[data-cursor]");
    const list = beats.map((b) => (typeof b === "number" ? { at: b } : b));
    let timers: ReturnType<typeof setTimeout>[] = [];
    let done = false;
    const later = (ms: number, f: () => void) => timers.push(setTimeout(f, ms));
    const stop = () => { timers.forEach(clearTimeout); timers = []; };
    const set = (k: number) => { el.dataset.s = Array.from({ length: k + 1 }, (_, i) => i).join(" "); };
    const aim = (name: string) => {
      const t = el.querySelector(`[data-target="${name}"]`);
      if (!t || !cur) return;
      const r = t.getBoundingClientRect(), o = el.getBoundingClientRect();
      // keep the 20px pointer inside the scene box
      const x = Math.min(Math.max(r.left - o.left + Math.min(r.width * 0.55, 60), 4), o.width - 22);
      const y = Math.min(Math.max(r.top - o.top + r.height * 0.55, 4), o.height - 24);
      cur.style.translate = `${x}px ${y}px`;
      cur.dataset.on = "1";
    };
    const play = () => {
      stop(); done = false; set(0);
      if (cur) { cur.dataset.on = "0"; cur.style.translate = `${el.clientWidth * 0.62}px ${el.clientHeight - 30}px`; }
      list.forEach((b, i) => {
        // the pointer glides in, clicks, then leaves: a parked cursor reads as a screenshot artefact
        if (b.click) { later(Math.max(0, b.at - 750), () => aim(b.click!)); later(b.at + 600, () => { if (cur) cur.dataset.on = "0"; }); }
        later(b.at, () => {
          set(i + 1);
          if (b.click && cur) cur.animate([{ scale: 1 }, { scale: 0.82 }, { scale: 1 }], { duration: 260, easing: "ease-out" });
        });
      });
      const end = (list.at(-1)?.at ?? 0) + 700;
      later(end, () => { if (cur) cur.dataset.on = "0"; done = !loop; });
      if (loop) later(end + hold, () => { el.dataset.fade = ""; later(420, () => { delete el.dataset.fade; play(); }); });
    };
    set(0);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!done && !timers.length) play(); }
      else if (!done) { stop(); delete el.dataset.fade; set(0); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
    // beats are module-level constants at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div ref={ref} className={cx("rp-scene relative overflow-hidden", className)} {...rest}>{children}</div>;
}
