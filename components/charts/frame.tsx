"use client";
// ChartFrame: the shell every chart sits in. It plays the chart once when 30% is on screen (data-play),
// marks it live/offscreen for loops (data-live), and runs one tooltip for every [data-tip] mark inside,
// by pointer or by arrow keys. It writes to the DOM directly, so hovering never re-renders React.
import { useEffect, useRef, type ReactNode } from "react";
import { ILLUSTRATIVE, cx } from "../ui";
import "./charts.css";

export type Table = { head: string[]; rows: (string | number)[][] };
export type LegendItem = { label: string; color: string; dash?: string };
/** Kept for imports; same text as ILLUSTRATIVE in components/ui.tsx. */
export const PLACEHOLDER = ILLUSTRATIVE;

type Mark = HTMLElement | SVGElement;

/** Counts a [data-count] mark from 0 to its value after data-count-d ms. Server HTML holds the final text. */
function countUp(m: Mark) {
  const to = Number(m.dataset.count), t0 = performance.now() + Number(m.dataset.countD ?? 0);
  const tick = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - t0) / 900));
    m.textContent = Math.round(to * (1 - (1 - p) ** 3)).toLocaleString("en-US");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function ChartFrame({ title, desc, table, legend, legendShape = "line", controls, placeholder = true, onPlay, className, children }: {
  title: string;
  desc?: string;
  /** Text alternative: rendered as a visually hidden table. */
  table: Table;
  legend?: LegendItem[];
  legendShape?: "line" | "box";
  controls?: ReactNode;
  placeholder?: boolean;
  onPlay?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const idx = useRef(-1);

  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.live = e.isIntersecting ? "on" : "off";
      if (e.intersectionRatio >= 0.3 && el.dataset.play !== "on") {
        el.dataset.play = "on"; onPlay?.();
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) el.querySelectorAll<Mark>("[data-count]").forEach(countUp);
      }
    }, { threshold: [0, 0.3] });
    io.observe(el);
    return () => io.disconnect();
    // onPlay is read once on first view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marks = () => Array.from(plot.current!.querySelectorAll<Mark>("[data-tip]"));
  function show(m: Element | null) {
    const p = plot.current!, t = tip.current!;
    p.querySelector("[data-active]")?.removeAttribute("data-active");
    if (!m) { t.removeAttribute("data-show"); t.style.left = t.style.top = ""; return; } // reset after the fade (CSS delay) so a stale spot cannot widen the page after a resize
    m.setAttribute("data-active", "");
    t.textContent = m.getAttribute("data-tip");
    t.setAttribute("data-show", "");
    const pr = p.getBoundingClientRect(), r = m.getBoundingClientRect();
    const w = t.offsetWidth, h = t.offsetHeight;
    const below = r.top - pr.top < h + 10; // no room above: flip under the mark
    t.style.left = `${Math.min(Math.max(r.left + r.width / 2 - pr.left, w / 2), pr.width - w / 2)}px`;
    t.style.top = `${below ? r.bottom - pr.top + 8 : r.top - pr.top - h - 8}px`;
  }
  function onKey(e: React.KeyboardEvent) {
    const ms = marks();
    if (!ms.length) return;
    let i = idx.current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (i + 1) % ms.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (i - 1 + ms.length) % ms.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = ms.length - 1;
    else if (e.key === "Escape") return show(null);
    else return;
    e.preventDefault();
    idx.current = i;
    show(ms[i]);
  }

  return (
    <figure ref={root} data-play="wait" data-live="off" className={cx("rpc relative min-w-0", className)}>
      <figcaption className="mb-4">
        <span className="block text-[0.9375rem] font-semibold text-navy-950">{title}</span>
        {desc && <span className="mt-1 block text-sm text-pretty text-navy-600">{desc}</span>}
      </figcaption>
      {controls}
      {legend && (
        <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-600">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5">
              {legendShape === "box"
                ? <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: l.color }} />
                : <svg aria-hidden width="18" height="8"><line x1="2" x2="16" y1="4" y2="4" stroke={l.color} strokeWidth="2.5" strokeDasharray={l.dash} strokeLinecap="round" /></svg>}
              {l.label}
            </li>
          ))}
        </ul>
      )}
      <div
        ref={plot}
        role="group"
        tabIndex={0}
        aria-label={`${title}. Use the arrow keys to read each value.`}
        className="relative rounded-control"
        onPointerOver={(e) => show((e.target as Element).closest("[data-tip]"))}
        onPointerLeave={() => show(null)}
        onFocus={() => { idx.current = Math.max(idx.current, 0); show(marks()[idx.current] ?? null); }}
        onBlur={() => show(null)}
        onKeyDown={onKey}
      >
        {children}
        <div ref={tip} className="rpc-tip" role="status" aria-live="polite" />
      </div>
      <div className="sr-only"><table>
        <caption>{title}{placeholder ? ` (${PLACEHOLDER})` : ""}</caption>
        <thead><tr>{table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => j ? <td key={j}>{c}</td> : <th key={j} scope="row">{c}</th>)}</tr>)}</tbody>
      </table></div>
      {placeholder && <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER}</p>}
    </figure>
  );
}
