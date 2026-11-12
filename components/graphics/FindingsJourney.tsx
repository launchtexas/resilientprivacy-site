import type { CSSProperties } from "react";
import { CountUp, Live } from "../motion";
import { cx } from "../ui";
import { Frame } from "./kit";
import "./findings-journey.css";

type Ico = "pr" | "check" | "file" | "search" | "sign" | "clock";
export type JourneyStage = { label: string; value: number; stamp?: [Ico, string] };
export type JourneyItem = { id: string; title: string; tag: string; tone: "critical" | "high" | "medium" | "accent"; owner: string };

const PATH: Record<Ico, string> = {
  pr: "M4.5 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM4.5 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM4.5 5v6M4.5 5.5c0 2.5 2.5 3 5.5 3",
  check: "m3.5 8.5 3 3 6-7",
  file: "M4 1.8h5l3 3V14H4zM9 1.8v3h3M6 9h4M6 11.2h4",
  search: "M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM10.3 10.3 13.5 13.5",
  sign: "M10.5 2.5l3 3L6 13H3v-3zM9 4l3 3M8.5 14h5",
  clock: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 5v3.3l2.2 1.4",
};
const I = ({ n, className }: { n: Ico; className?: string }) => (
  <svg viewBox="0 0 16 16" className={cx("size-3.5 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={PATH[n]} /></svg>
);
const DOT = ["bg-medium", "bg-navy-300", "bg-high"];
const fmt = (n: number) => n.toLocaleString("en-US");
const TONE = { critical: "bg-critical-soft text-critical-ink", high: "bg-high-soft text-high-ink", medium: "bg-medium-soft text-medium-ink", accent: "bg-accent-soft text-accent-ink" };

/** One real item (a finding, a privacy request) travels a 4-column board: header counts tick as it lands, each stop stamps the card,
 *  then the side notes account for everything that left the flow. Board at container >= 36rem, stacked tiles below. Exactly 4 stages. */
export function FindingsJourney({ title, board, item, stages, others, notes, done, label, className }: {
  title: string; board: string; item: JourneyItem; stages: JourneyStage[]; others: [string, string][]; notes: [Ico, string, string][]; done: string; label: string; className?: string;
}) {
  return (
    <Live className={cx("min-w-0", className)}>
      <Frame
        title={board}
        beats={[500, 2000, 3500, 5000, 6200]}
        label={label}
        status={
          <span className="rp-stack text-xs font-medium">
            <span data-until="5" className="flex items-center gap-1.5 text-navy-600"><span className="size-1.5 rounded-full bg-accent" />In progress</span>
            <span data-at="5" className="flex items-center gap-1.5 text-ok-ink"><span className="rp-fj-live size-1.5 rounded-full bg-ok" />{done}</span>
          </span>
        }
      >
        <div className="rp-fj p-3 @[36rem]:p-4">
          {stages.map((s, i) => (
            <div key={s.label} data-stage={i} className="rp-fj-head flex flex-col gap-0.5 rounded-lg px-2.5 py-2">
              <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-navy-600">
                <span className="rp-fj-dot size-1.5 shrink-0 rounded-full" />
                <span className="truncate">{s.label}</span>
              </span>
              <span className="rp-stack font-mono text-lg font-semibold text-navy-950 tabular-nums">
                <span data-until={i + 1}><CountUp value={s.value - 1} duration={1100} /></span>
                <span data-at={i + 1} className="rp-fj-tick">{fmt(s.value)}</span>
              </span>
            </div>
          ))}
          {stages.map((s, i) => (
            <div key={s.label} aria-hidden className="rp-fj-lane rounded-lg bg-mist p-1.5" style={{ gridColumn: i + 1 }}>
              {others.slice(i * 3, i * 3 + 3).map(([t, tag], g) => (
                <div key={t} className="mt-1.5 rounded-md bg-canvas px-2 py-1.5 shadow-hairline first:mt-0">
                  <p className="truncate text-xs font-medium text-navy-700">{t}</p>
                  <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-navy-500"><span className={cx("size-1.5 rounded-full", DOT[g])} />{tag}</p>
                </div>
              ))}
            </div>
          ))}
          <article className="rp-fj-card flex flex-col rounded-md bg-canvas p-2.5 shadow-lift ring-1 ring-accent/40" data-at="1">
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-navy-500">{item.id}</span>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[0.6875rem] font-semibold text-white">{item.owner}</span>
            </span>
            <span className="mt-1 line-clamp-2 text-sm leading-snug font-semibold text-navy-950">{item.title}</span>
            <span className={cx("mt-1.5 w-fit rounded-chip px-1.5 py-0.5 text-xs font-medium", TONE[item.tone])}>{item.tag}</span>
            <span className="rp-fj-stamps mt-2 flex gap-1 border-t border-line pt-2">
              {stages.slice(1).map((s, i) => s.stamp && (
                <span key={s.label} data-at={i + 2} className="rp-pop flex min-w-0 items-center gap-1 rounded-chip bg-ok-soft px-1.5 py-0.5 text-xs font-medium text-ok-ink" style={{ "--lag": "750ms" } as CSSProperties}>
                  <I n={s.stamp[0]} className="size-3" /><span className="truncate">{s.stamp[1]}</span>
                </span>
              ))}
            </span>
          </article>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-3 py-2.5 @[36rem]:px-4">
          {notes.map(([ico, text, sub], i) => (
            <span key={text} data-at="5" className="rp-pop flex min-w-0 items-center gap-2 rounded-lg bg-mist px-2.5 py-1.5 text-xs" style={{ "--lag": `${i * 120}ms` } as CSSProperties}>
              <I n={ico} className="text-accent" />
              <span className="font-semibold text-navy-950">{text}</span>
              <span className="hidden text-navy-500 @[28rem]:inline">{sub}</span>
            </span>
          ))}
        </div>
      </Frame>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {stages.map((s) => <tr key={s.label}><th scope="row">{s.label}</th><td>{fmt(s.value)}</td></tr>)}
          {notes.map(([, text, sub]) => <tr key={text}><th scope="row">{text}</th><td>{sub}</td></tr>)}
        </tbody>
      </table>
    </Live>
  );
}
