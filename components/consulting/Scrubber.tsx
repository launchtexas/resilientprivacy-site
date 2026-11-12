"use client";
// Engagement timeline scrubber (audit idea 6.7). Every artefact stays in the DOM and readable; the slider only marks progress.
import { useState } from "react";
import { cx } from "@/components/ui";

export const TIMELINE: [number, string, string][] = [
  [0, "Scope document", "Targets, rules of engagement, test windows, named lead and a fixed quote."],
  [1, "Kickoff", "Access checked, contacts agreed, the emergency stop route tested."],
  [2, "Live findings feed", "Findings land in your tracker as we confirm them; criticals by phone the same day."],
  [4, "Report and readout", "Technical report, executive summary and a walkthrough with your engineers."],
  [5, "Retest", "Every fix verified; the report updated with status per finding."],
  [6, "Evidence pack", "Attestation letter and control mapping for auditors and customers."],
];

export function Scrubber({ className }: { className?: string }) {
  const [w, setW] = useState(2);
  return (
    <div className={cx("rounded-panel bg-canvas p-5 shadow-window sm:p-7", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor="wk" className="text-sm font-semibold text-navy-950">Drag through a typical engagement</label>
        <output htmlFor="wk" className="font-mono text-sm text-accent-ink">Week {w}</output>
      </div>
      <input id="wk" type="range" min={0} max={6} step={1} value={w} onChange={(e) => setW(+e.target.value)} aria-valuetext={`Week ${w}`} className="mt-4 h-10 w-full cursor-pointer accent-[var(--color-accent)]" />
      <div aria-hidden className="mt-1 flex justify-between font-mono text-micro text-navy-500">
        {[0, 1, 2, 3, 4, 5, 6].map((n) => <span key={n}>W{n}</span>)}
      </div>
      <ol className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {TIMELINE.map(([wk, t, b]) => {
          const done = wk <= w;
          return (
            <li key={t} className={cx("rounded-card p-4 transition-[background-color,box-shadow] duration-(--duration-base) ease-(--ease-out)", done ? "bg-accent-soft shadow-hairline" : "border border-dashed border-line-strong bg-mist")}>
              <p className="flex items-center justify-between font-mono text-micro text-navy-600">
                <span>Week {wk}</span>
                <span className={done ? "text-ok-ink" : ""}>{done ? "✓ delivered" : "upcoming"}</span>
              </p>
              <p className="mt-1.5 text-sm font-semibold text-navy-950">{t}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-navy-600">{b}</p>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-micro text-navy-500">Typical fixed-scope test; durations are illustrative</p>
    </div>
  );
}
