// Shared pieces for the product scenes: a window frame that is also the <Scene> player, plus tiny icons and chips.
import type { CSSProperties, ReactNode } from "react";
import { Scene, type Beat } from "../motion";
import { cx } from "../ui";
import { MockBrand } from "../mockup";
import "./graphics.css";

/** App-window frame. It is the scene root: `relative overflow-hidden` + a size container, so nothing escapes it at any width. */
export function Frame({ title, status, beats, label, dark, className, children }: { title: string; status?: ReactNode; beats: Beat[]; label: string; dark?: boolean; className?: string; children: ReactNode }) {
  return (
    <Scene beats={beats} role="img" aria-label={label} className={cx("@container w-full rounded-card text-left", dark ? "bg-navy-950 ring-1 ring-white/10" : "bg-canvas shadow-card", className)}>
      <div aria-hidden className={cx("flex h-10 items-center gap-2.5 border-b px-3.5", dark ? "border-white/10" : "border-line bg-mist")}>
        <span className="flex shrink-0 gap-1">
          {[0, 1, 2].map((i) => <span key={i} className={cx("size-2 rounded-full", dark ? "bg-white/15" : "bg-line-strong")} />)}
        </span>
        <MockBrand dark={dark} nameClass="hidden @md:inline" />
        <span className={cx("min-w-0 truncate font-mono text-micro", dark ? "text-navy-300" : "text-navy-500")}>{title}</span>
        <span className="ml-auto shrink-0 font-mono text-[10px] tracking-[0.04em] text-navy-400 uppercase">Simulated</span>
        {status && <span className="shrink-0">{status}</span>}
      </div>
      <div aria-hidden>{children}</div>
    </Scene>
  );
}

/** Before/after swap in one grid cell: `steps` = [[node, at?, until?], …]. */
export function Swap({ steps, className }: { steps: [ReactNode, number?, number?][]; className?: string }) {
  return (
    <span className={cx("rp-stack", className)}>
      {steps.map(([n, at, until], i) => <span key={i} className="flex items-center" data-at={at} data-until={until}>{n}</span>)}
    </span>
  );
}

const CHIP = {
  neutral: "bg-cloud text-navy-700",
  accent: "bg-accent-soft text-accent-ink",
  critical: "bg-critical-soft text-critical-ink",
  high: "bg-high-soft text-high-ink",
  medium: "bg-medium-soft text-medium-ink",
  ok: "bg-ok-soft text-ok-ink",
  dark: "bg-white/10 text-white",
  darkok: "bg-ok/20 text-[#7fe0b0]",
  darkaccent: "bg-accent/30 text-accent-on-dark",
};
export function Chip({ tone = "neutral", dot, children, className }: { tone?: keyof typeof CHIP; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-chip px-1.5 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap", CHIP[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const Check = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={cx("size-3.5 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3.5 8.5 3 3 6-7" /></svg>
);
export const Cross = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={cx("size-3.5 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m4.5 4.5 7 7m0-7-7 7" /></svg>
);
export const Shield = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={cx("size-4 shrink-0", className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M8 1.8 13 3.6v4c0 3.2-2.1 5.4-5 6.6-2.9-1.2-5-3.4-5-6.6v-4z" /><path d="m5.8 8 1.6 1.6 2.9-3.2" strokeLinecap="round" /></svg>
);

/** Stagger helper for elements revealed on the same beat. */
export const lag = (ms: number) => ({ "--lag": `${ms}ms` }) as CSSProperties;
