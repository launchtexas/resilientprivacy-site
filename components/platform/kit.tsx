// Platform-division helpers. Faq and FinalCta live in components/sections.tsx.
import { cx } from "@/components/ui";

const ICONS = {
  api: "M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12",
  radar: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 12l5-5M12 12m-3 0a3 3 0 1 0 6 0",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  lock: "M6 11h12v10H6zM9 11V8a3 3 0 0 1 6 0v3",
  cloud: "M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z",
  grc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  soc: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4",
  consult: "M4 18l5-5 3 3 8-8M15 8h5v5",
} as const;
export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

export const PLACEHOLDER_NOTE = "Illustrative product data";
export const Note = ({ className }: { className?: string }) => <p className={cx("mt-3 text-micro text-navy-500", className)}>{PLACEHOLDER_NOTE}</p>;

/** Horizontal bars for mockups: [label, value]; widths relative to the largest value. */
export function Bars({ rows, unit = "", tone = "bg-accent" }: { rows: [string, number][]; unit?: string; tone?: string }) {
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div className="space-y-2.5">
      {rows.map(([l, v]) => (
        <div key={l} className="flex items-center gap-3 text-xs">
          <span className="w-28 shrink-0 truncate text-navy-600">{l}</span>
          <div className="h-2 flex-1 rounded-full bg-cloud"><div className={cx("h-full rounded-full", tone)} style={{ width: `${(v / max) * 100}%` }} /></div>
          <span className="w-12 text-right tabular-nums text-navy-950">{v.toLocaleString("en-US")}{unit}</span>
        </div>
      ))}
    </div>
  );
}


