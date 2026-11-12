"use client";
// AI attack-surface map (audit idea 6.2): pick a node to see the attacks we test there. One state change per click; no animation loop JS.
import { useState, type CSSProperties } from "react";
import { Live } from "@/components/motion/client";
import { cx } from "@/components/ui";
import { SURFACE } from "./data";
import "@/components/graphics/graphics.css";
import "./ai.css";

export function SurfaceMap({ className }: { className?: string }) {
  const [on, setOn] = useState(3);
  const n = SURFACE[on];
  return (
    <div className={cx("rounded-panel bg-canvas p-4 shadow-window sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">AI application · attack surface</p>
        <p className="text-micro text-navy-500">Select a component</p>
      </div>
      <Live className="rp-g relative mt-5">
        <svg aria-hidden className="absolute inset-x-[8%] top-1/2 hidden h-2 w-[84%] -translate-y-1/2 lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
          <line x1="0" y1="1" x2="100" y2="1" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="5 3" className="stroke-accent/40" />
        </svg>
        <ul className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {SURFACE.map((s, i) => (
            <li key={s.node}>
              <button
                type="button"
                aria-pressed={i === on}
                onClick={() => setOn(i)}
                className={cx(
                  "flex min-h-16 w-full flex-col items-start rounded-card px-3 py-2.5 text-left transition-[background-color,box-shadow,translate] duration-(--duration-fast) ease-(--ease-out)",
                  i === on ? "-translate-y-0.5 bg-accent text-white shadow-lift" : "bg-canvas text-navy-950 shadow-card hover:-translate-y-0.5 hover:shadow-lift",
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span aria-hidden className={cx("size-1.5 rounded-full", i === on ? "bg-white" : "bg-critical")} />
                  {s.node}
                </span>
                <span className={cx("mt-0.5 font-mono text-micro", i === on ? "text-white/80" : "text-navy-500")}>{s.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      </Live>
      <div aria-live="polite" className="mt-4 rounded-card bg-mist p-4">
        <p className="text-sm font-semibold text-navy-950">What we test: {n.node}</p>
        <ul key={on} className="mt-3 space-y-2">
          {n.attacks.map(([a, id], i) => (
            <li key={a} className="rp-ai-pop flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-control bg-canvas px-3 py-2 shadow-hairline" style={{ "--i": i } as CSSProperties}>
              <span className="text-[0.875rem] text-navy-800">{a}</span>
              <span className="font-mono text-micro text-accent-ink">{id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
