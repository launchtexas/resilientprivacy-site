// Product-UI mockup kit. All drawn in HTML/CSS/SVG; no images.
// Data shown in mockups is illustrative and gets an `ILLUSTRATIVE` caption (from ./ui) where a reader could take it as real.
import { useId, type ReactNode } from "react";
import { Badge, cx, type Tone } from "./ui";

/* ---------- Product brand ---------- */
/** Kit symbol (unaltered, via <img>) + name for mockup chrome. `dark`: white symbol. `nameClass` hides the name on narrow frames. */
export function MockBrand({ dark, nameClass = "hidden sm:inline", className }: { dark?: boolean; nameClass?: string; className?: string }) {
  return (
    <span className={cx("flex shrink-0 items-center gap-1.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/brand/ResilientPrivacy_Symbol_${dark ? "White" : "Black"}.svg`} alt="" width={12} height={16} className="h-4 w-auto" />
      <span className={cx("text-xs font-semibold tracking-[-0.01em] whitespace-nowrap", dark ? "text-white" : "text-navy-950", nameClass)}>Resilient Privacy</span>
    </span>
  );
}

/* ---------- App window frame ---------- */
export function AppWindow({
  title,
  sidebar,
  children,
  className,
  label,
}: {
  title: string;
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Accessible description of what the mockup shows. */
  label: string;
}) {
  return (
    <figure role="img" aria-label={label} className={cx("overflow-hidden rounded-panel bg-canvas shadow-window ring-1 ring-navy-900/10", className)}>
      <div className="flex h-10 items-center gap-3 border-b border-line bg-mist px-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        {/* With a sidebar the brand lives there; the sidebar hides below md, so the title bar carries it until then. */}
        <MockBrand className={sidebar ? "md:hidden" : undefined} />
        <span className="mx-auto min-w-0 max-w-[60%] truncate rounded-chip bg-canvas px-3 py-0.5 font-mono text-micro text-navy-500 shadow-hairline">{title}</span>
        <span aria-hidden className="shrink-0 font-mono text-[10px] tracking-[0.04em] text-navy-400 uppercase">Simulated</span>
      </div>
      <div aria-hidden className="flex">
        {sidebar}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </figure>
  );
}

export function AppSidebar({ items, active = 0 }: { items: string[]; active?: number }) {
  return (
    <div className="hidden w-48 shrink-0 flex-col gap-0.5 bg-navy-950 p-3 md:flex">
      <MockBrand dark nameClass="" className="mb-3 px-1 pt-0.5" />
      <div className="mb-3 flex items-center gap-2 rounded-control bg-white/5 px-2.5 py-2">
        <span className="size-5 rounded-md bg-accent" />
        <span className="text-xs font-medium text-white">Example Corp</span>
        <span className="ml-auto text-micro text-navy-500">▾</span>
      </div>
      {items.map((t, i) => (
        <div key={t} className={cx("flex items-center gap-2 rounded-control px-2.5 py-1.5 text-xs", i === active ? "bg-white/10 text-white" : "text-navy-300")}>
          <span className={cx("size-3 rounded-[4px] border", i === active ? "border-accent bg-accent/30" : "border-navy-500")} />
          {t}
        </div>
      ))}
    </div>
  );
}

/* ---------- Stat tile ---------- */
export function StatTile({
  label,
  value,
  delta,
  good,
  spark,
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  /** Whether the delta direction is good news (green) or bad (red). */
  good?: boolean;
  spark?: number[];
  className?: string;
}) {
  return (
    <div className={cx("rounded-card bg-canvas p-4 shadow-card", className)}>
      <p className="text-xs text-navy-500">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-[-0.02em] text-navy-950 tabular-nums">{value}</p>
        {spark && <Sparkline data={spark} className="h-7 w-16" />}
      </div>
      {delta && <p className={cx("mt-1 text-xs font-medium tabular-nums", good ? "text-ok-ink" : "text-critical-ink")}>{delta}</p>}
    </div>
  );
}

/* ---------- Charts ---------- */
const toPoints = (data: number[], w: number, h: number, max = Math.max(...data), pad = 2) =>
  data.map((v, i) => [(i / (data.length - 1)) * w, h - pad - (v / max) * (h - pad * 2)] as const);
const line = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");

export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const pts = toPoints(data, 64, 28);
  return (
    <svg viewBox="0 0 64 28" preserveAspectRatio="none" className={cx("text-accent", className)}>
      <path d={line(pts)} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/** Area chart: one accent series, optional muted comparison series. */
export function AreaChart({
  data,
  compare,
  labels,
  className,
}: {
  data: number[];
  compare?: number[];
  labels?: string[];
  className?: string;
}) {
  const W = 400, H = 140;
  const max = Math.max(...data, ...(compare ?? [])) * 1.1;
  const pts = toPoints(data, W, H, max);
  const gid = useId();
  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-36 w-full overflow-visible">
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--color-line)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        {compare && <path d={line(toPoints(compare, W, H, max))} fill="none" stroke="var(--color-navy-300)" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />}
        <path d={`${line(pts)}L${W},${H}L0,${H}Z`} fill={`url(#${gid})`} />
        <path d={line(pts)} fill="none" stroke="var(--color-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      {labels && (
        <div className="mt-2 flex justify-between font-mono text-micro text-navy-500">
          {labels.map((l) => <span key={l}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

/** Stacked severity bars. Each row: [critical, high, medium]. */
export function SeverityBars({ rows, labels, className }: { rows: [number, number, number][]; labels: string[]; className?: string }) {
  const max = Math.max(...rows.map((r) => r[0] + r[1] + r[2]));
  return (
    <div className={className}>
      <div className="flex h-32 items-end gap-[6%]">
        {rows.map((r, i) => (
          <div key={labels[i]} className="flex h-full flex-1 flex-col justify-end gap-[2px]">
            {([["bg-medium/70", r[2]], ["bg-high", r[1]], ["bg-critical", r[0]]] as const).map(([c, v]) => (
              <div key={c} className={cx("rounded-[3px]", c)} style={{ height: `${(v / max) * 100}%` }} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-[6%] font-mono text-micro text-navy-500">
        {labels.map((l) => <span key={l} className="flex-1 text-center">{l}</span>)}
      </div>
    </div>
  );
}

export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-micro text-navy-500">
      {items.map(([c, l]) => (
        <span key={l} className="inline-flex items-center gap-1.5"><span className={cx("size-2 rounded-[2px]", c)} />{l}</span>
      ))}
    </div>
  );
}

/** Ring gauge for a 0–100 score. */
export function ScoreRing({ value, label, className }: { value: number; label: string; className?: string }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className={cx("relative inline-grid place-items-center", className)}>
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-cloud)" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-accent)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-semibold text-navy-950 tabular-nums">{value}</p>
        <p className="text-micro text-navy-500">{label}</p>
      </div>
    </div>
  );
}

/* ---------- Alert list ---------- */
export type Alert = { sev: "critical" | "high" | "medium" | "ok"; title: string; meta: string; time: string };
const SEV_LABEL: Record<Alert["sev"], string> = { critical: "Critical", high: "High", medium: "Medium", ok: "Resolved" };

export function AlertList({ alerts, className }: { alerts: Alert[]; className?: string }) {
  return (
    <ul className={cx("divide-y divide-line", className)}>
      {alerts.map((a) => (
        <li key={a.title} className="flex items-start gap-3 py-2.5">
          <Badge tone={a.sev as Tone} dot className="mt-px w-[74px] justify-start">{SEV_LABEL[a.sev]}</Badge>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8125rem] font-medium text-navy-950">{a.title}</p>
            <p className="truncate text-xs text-navy-500">{a.meta}</p>
          </div>
          <span className="shrink-0 font-mono text-micro text-navy-500">{a.time}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Data table ---------- */
/** `rowAt[i]`: beat at which row i enters inside a <Scene> (motion/client). */
/** `sort`: column index that shows the active sort chevron. `total`: total row count, adds a "1–n of total" pager. */
export function DataTable({ columns, rows, className, rowAt, sort, total }: { columns: string[]; rows: ReactNode[][]; className?: string; rowAt?: (number | undefined)[]; sort?: number; total?: number }) {
  return (
    <div className={cx("overflow-x-auto max-sm:[mask-image:linear-gradient(to_left,transparent,black_28px)]", className)}>
      <table className="w-full min-w-[420px] text-left text-[0.8125rem] tabular-nums">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c, j) => (
              <th key={c} className="px-3 py-2 font-mono text-micro font-medium tracking-[0.06em] whitespace-nowrap text-navy-500 uppercase">
                {c}{j === sort && <span className="ml-1 text-navy-700">▾</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i} data-at={rowAt?.[i]} className="text-navy-800">
              {r.map((cell, j) => <td key={j} className={cx("px-3 py-2.5", j === 0 && "font-medium text-navy-950")}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {total !== undefined && (
        <div className="flex min-w-[420px] items-center justify-between border-t border-line px-3 pt-2 font-mono text-micro text-navy-500 tabular-nums">
          <span>1–{rows.length} of {total.toLocaleString("en-US")}</span>
          <span className="flex gap-3"><span className="text-navy-300">‹ Prev</span><span className="text-navy-700">Next ›</span></span>
        </div>
      )}
    </div>
  );
}

/** Small progress bar for table cells and checklists. */
export function Progress({ value, tone = "bg-accent" }: { value: number; tone?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-cloud"><div className={cx("h-full rounded-full", tone)} style={{ width: `${value}%` }} /></div>
      <span className="tabular-nums text-navy-500">{value}%</span>
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-card bg-canvas p-4 shadow-card", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[0.8125rem] font-semibold text-navy-950">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}
