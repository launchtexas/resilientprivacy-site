"use client";
// Framework crosswalk (audit idea 6.4): pick a control theme; its ISO/IEC 42001, NIST AI RMF, EU AI Act and SOC 2/27001 references
// link to the one RP deliverable that covers all of them. Public clause names only.
import { useState, type CSSProperties } from "react";
import { cx } from "@/components/ui";
import { CROSSWALK } from "./data";
import "./ai.css";

const COLS = [["ISO/IEC 42001", "iso"], ["NIST AI RMF", "nist"], ["EU AI Act", "euai"], ["SOC 2 / ISO 27001", "sec"]] as const;

export function Crosswalk({ className }: { className?: string }) {
  const [on, setOn] = useState(2);
  const row = CROSSWALK[on];
  return (
    <div className={cx("grid grid-cols-1 gap-6 lg:grid-cols-12", className)}>
      <div className="lg:col-span-4">
        <p id="cw-label" className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">Control theme</p>
        <ul aria-labelledby="cw-label" className="mt-3 flex flex-wrap gap-2 lg:flex-col">
          {CROSSWALK.map((r, i) => (
            <li key={r.theme}>
              <button
                type="button"
                aria-pressed={i === on}
                onClick={() => setOn(i)}
                className={cx(
                  "min-h-10 w-full rounded-control px-3.5 py-2 text-left text-sm font-medium transition-colors duration-(--duration-fast)",
                  i === on ? "bg-navy-950 text-white shadow-pill" : "bg-canvas text-navy-800 shadow-hairline hover:bg-cloud",
                )}
              >
                {r.theme}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div aria-live="polite" className="self-start rounded-panel bg-canvas p-4 shadow-window sm:p-6 lg:col-span-8">
        <p className="text-sm font-semibold text-navy-950">{row.theme}: one piece of work, four frameworks</p>
        <ul key={on} className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {COLS.map(([label, k], i) => (
            <li key={k} className="rp-ai-pop rounded-card bg-mist p-3 shadow-hairline" style={{ "--i": i } as CSSProperties}>
              <p className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">{label}</p>
              <p className="mt-1.5 text-sm font-medium text-navy-950">{row[k]}</p>
            </li>
          ))}
        </ul>
        <svg key={`l${on}`} aria-hidden viewBox="0 0 400 48" preserveAspectRatio="none" className="hidden h-12 w-full lg:block">
          {[50, 150, 250, 350].map((x) => (
            <path key={x} d={`M${x} 0 C${x} 30 200 18 200 48`} pathLength={1} fill="none" strokeWidth="1.5" className="rp-ai-draw stroke-accent" />
          ))}
        </svg>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-card bg-accent-soft px-4 py-3 lg:mt-0">
          <span className="text-sm text-accent-ink">Covered by</span>
          <span className="text-sm font-semibold text-navy-950">{row.deliverable}</span>
        </div>
      </div>
    </div>
  );
}
