// Server-rendered animated charts. Each sits in <ChartFrame> (client), which plays it on first view,
// runs the tooltip, and renders the hidden data table. Motion lives in charts.css.
import { useId, type CSSProperties } from "react";
import { CountUp } from "../motion";
import { ILLUSTRATIVE, cx } from "../ui";
import { ChartFrame } from "./frame";
import { INK, SERIES, SEV, fmt, niceMax, wrap } from "./data";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
type Base = { title: string; desc?: string; placeholder?: boolean; className?: string };

/* ---------------- Line / area trend ---------------- */
export function TrendChart({ points, unit = "", target, ...base }: Base & {
  points: { label: string; value: number }[];
  unit?: string;
  /** Optional threshold line, e.g. an SLA. */
  target?: { label: string; value: number };
}) {
  const W = 360, H = 230, L = 38, Rm = 30, T = 14, B = 26;
  const max = niceMax(Math.max(...points.map((p) => p.value), target?.value ?? 0));
  const x = (i: number) => L + (i * (W - L - Rm)) / (points.length - 1);
  const y = (val: number) => T + (1 - val / max) * (H - T - B);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join("");
  const last = points.length - 1, step = (W - L - Rm) / last;
  // end label sits 10px above its dot; if the dashed target line would cross the text, lift the label above the line
  const yEnd = y(points[last].value), yT = target ? y(target.value) : -99;
  const endY = Math.abs(yT - (yEnd - 15)) < 15 ? Math.min(yEnd - 10, yT - 6) : yEnd - 10;
  return (
    <ChartFrame {...base} table={{ head: ["Period", `Value${unit ? ` (${unit})` : ""}`], rows: points.map((p) => [p.label, fmt(p.value, 1)]) }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[32rem]" aria-hidden>
        {[0, 1, 2, 3, 4].map((k) => (
          <g key={k}>
            <line x1={L} x2={W - Rm + 8} y1={y((max * k) / 4)} y2={y((max * k) / 4)} stroke={INK.line} />
            <text x={L - 6} y={y((max * k) / 4) + 4} textAnchor="end" fontSize="12" fill={INK.muted} className="tabular-nums">{fmt((max * k) / 4)}</text>
          </g>
        ))}
        {points.map((p, i) => <text key={p.label} x={x(i)} y={H - 6} textAnchor="middle" fontSize="12" fill={INK.muted}>{p.label}</text>)}
        {target && (
          <g className="c-fade" style={v({ "--d": "900ms" })}>
            <line x1={L} x2={W - Rm + 8} y1={y(target.value)} y2={y(target.value)} stroke={INK.muted} strokeDasharray="4 4" />
            <text x={L + 4} y={y(target.value) - 5} fontSize="12" fill={INK.muted}>{target.label}</text>
          </g>
        )}
        <g className="c-wipe">
          <path d={`${line}L${x(last)},${y(0)}L${x(0)},${y(0)}Z`} fill={SERIES[0]} fillOpacity="0.1" />
          <path d={line} fill="none" stroke={SERIES[0]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </g>
        <g className="c-pop" style={v({ "--d": "1200ms" })}>
          <circle cx={x(last)} cy={y(points[last].value)} r="4.5" fill={SERIES[0]} stroke="#fff" strokeWidth="2" />
          <text x={x(last)} y={endY} textAnchor="middle" fontSize="14" fontWeight="600" fill={INK.strongText}>{fmt(points[last].value, 1)}{unit}</text>
        </g>
        {points.map((p, i) => (
          <g key={p.label} data-tip={`${p.label}: ${fmt(p.value, 1)}${unit}`}>
            <rect x={x(i) - step / 2} y={T} width={step} height={H - T - B} fill="transparent" />
            <line x1={x(i)} x2={x(i)} y1={T} y2={H - B} stroke={INK.soft} className="c-hot" />
            <circle cx={x(i)} cy={y(p.value)} r="4.5" fill={SERIES[0]} stroke="#fff" strokeWidth="2" className="c-hot" />
          </g>
        ))}
      </svg>
    </ChartFrame>
  );
}

/* ---------------- Stacked columns (severity per sprint) ---------------- */
export function StackedBars({ keys, groups, ...base }: Base & {
  keys: { label: string; color: string }[];
  groups: { label: string; values: number[] }[];
}) {
  const max = niceMax(Math.max(...groups.map((g) => sum(g.values))));
  return (
    <ChartFrame {...base} legend={keys} legendShape="box"
      table={{ head: ["Group", ...keys.map((k) => k.label), "Total"], rows: groups.map((g) => [g.label, ...g.values, sum(g.values)]) }}>
      <div className="mx-auto max-w-[36rem]">
        <div className="relative h-56">
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} className="absolute inset-x-0 border-t border-line" style={{ bottom: `${k * 25}%` }}>
              <span className="absolute -top-2 left-0 text-[11px] leading-none text-navy-500 tabular-nums">{fmt((max * k) / 4)}</span>
            </div>
          ))}
          <div className="absolute inset-y-0 right-0 left-8 flex justify-around">
            {groups.map((g, i) => {
              const total = sum(g.values), top = g.values.reduce((t, x, k) => (x > 0 ? k : t), -1);
              return (
                <div key={g.label} className="relative h-full w-6">
                  <span className="c-fade absolute left-1/2 w-max -translate-x-1/2 text-xs font-semibold text-navy-950 tabular-nums" style={v({ bottom: `calc(${(total / max) * 100}% + 4px)`, "--i": i, "--d": "500ms" })}>{total}</span>
                  <div className="c-grow-y absolute inset-x-0 bottom-0 flex flex-col-reverse gap-[2px]" style={v({ height: `${(total / max) * 100}%`, "--i": i })}>
                    {g.values.map((x, k) => x > 0 && (
                      <div key={k} data-tip={`${g.label} · ${keys[k].label}: ${x}`} className={k === top ? "rounded-t-[4px]" : ""} style={{ flex: `${x} 1 0`, background: keys[k].color }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-2 ml-8 flex justify-around text-xs text-navy-500">
          {groups.map((g) => <span key={g.label} className="w-6 text-center">{g.label}</span>)}
        </div>
      </div>
    </ChartFrame>
  );
}

/* ---------------- Gauge (risk score) ---------------- */
const BANDS = [
  { to: 39, label: "Low", color: "#138a52", soft: "#e4f5ec" },
  { to: 69, label: "Elevated", color: SEV.medium, soft: "#fdf6dd" },
  { to: 84, label: "High", color: SEV.high, soft: "#fef1e4" },
  { to: 100, label: "Critical", color: SEV.critical, soft: "#fdecea" },
];
/** goodWhen="high": readiness/coverage, where a full arc is the good end. */
const READY = [
  { to: 39, label: "Not ready", color: SEV.critical, soft: "#fdecea" },
  { to: 69, label: "In progress", color: SEV.high, soft: "#fef1e4" },
  { to: 84, label: "Nearly ready", color: SEV.medium, soft: "#fdf6dd" },
  { to: 100, label: "Audit-ready", color: "#138a52", soft: "#e4f5ec" },
];
export function Gauge({ value, max = 100, label, note, goodWhen = "low", ...base }: Base & {
  value: number; max?: number; label: string; note?: string;
  /** "low" (default): risk bands Low..Critical. "high": readiness bands Not ready..Audit-ready. */
  goodWhen?: "low" | "high";
}) {
  const pct = (value / max) * 100;
  const bands = goodWhen === "high" ? READY : BANDS;
  const band = bands.find((b) => pct <= b.to) ?? bands[3];
  const arc = "M24,124 A96,96 0 0 1 216,124";
  return (
    <ChartFrame {...base} table={{ head: ["Measure", "Value"], rows: [[label, `${value} of ${max} (${band.label})`]] }}>
      <div className="relative mx-auto max-w-[18rem]">
        <svg viewBox="0 0 240 152" className="block h-auto w-full" aria-hidden>
          <path d={arc} fill="none" stroke={band.soft} strokeWidth="16" strokeLinecap="round" />
          <path d={arc} data-tip={`${label}: ${value} of ${max} · ${band.label}`} pathLength={100} fill="none" stroke={band.color} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={`${pct} 100`} className="c-arc" style={v({ "--v": pct })} />
          <text x="24" y="146" textAnchor="middle" fontSize="11" fill={INK.muted}>0</text>
          <text x="216" y="146" textAnchor="middle" fontSize="11" fill={INK.muted}>{max}</text>
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
          <CountUp value={value} className="block text-[2.5rem] leading-none font-semibold tracking-tight text-navy-950" />
          <span className="mt-1 block text-xs text-navy-600">{label} · <span className="font-semibold">{band.label}</span></span>
        </div>
      </div>
      {note && <p className="mt-3 text-center text-sm text-navy-600">{note}</p>}
    </ChartFrame>
  );
}

/* ---------------- Donut (part of a whole) ---------------- */
export function Donut({ segments, centerLabel, ...base }: Base & { segments: { label: string; value: number; color: string }[]; centerLabel: string }) {
  const total = sum(segments.map((s) => s.value));
  const GAP = 1.2; // % of the ring left as surface gap between segments
  let at = 0;
  return (
    <ChartFrame {...base} legend={segments.map((s) => ({ label: `${s.label} ${s.value}`, color: s.color }))} legendShape="box"
      table={{ head: ["Status", "Count", "Share"], rows: segments.map((s) => [s.label, s.value, `${Math.round((s.value / total) * 100)}%`]) }}>
      <div className="relative mx-auto max-w-[15rem]">
        <svg viewBox="0 0 200 200" className="block h-auto w-full" aria-hidden>
          {segments.map((s, i) => {
            const len = (s.value / total) * 100, start = at;
            at += len;
            return (
              <circle key={s.label} cx="100" cy="100" r="78" fill="none" stroke={s.color} strokeWidth="22" pathLength={100}
                strokeDasharray={`${Math.max(len - GAP, 0.1)} 100`} transform={`rotate(${start * 3.6 - 90} 100 100)`}
                data-tip={`${s.label}: ${s.value} of ${total} (${Math.round(len)}%)`} className="c-arc" style={v({ "--v": len, "--i": i * 4 })} />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <CountUp value={Math.round((segments[0].value / total) * 100)} suffix="%" className="text-[2.25rem] leading-none font-semibold tracking-tight text-navy-950" />
          <span className="mt-1 text-xs text-navy-600">{centerLabel}</span>
        </div>
      </div>
    </ChartFrame>
  );
}

/* ---------------- Heatmap (likelihood × impact) ---------------- */
const riskBand = (s: number) => s >= 20 ? { l: "Critical", soft: "#fdecea", c: SEV.critical, ink: "#fff" }
  : s >= 10 ? { l: "High", soft: "#fef1e4", c: SEV.high, ink: INK.strongText }
  : s >= 5 ? { l: "Medium", soft: "#fdf6dd", c: SEV.medium, ink: INK.strongText }
  : { l: "Low", soft: "#e4f5ec", c: "#138a52", ink: "#fff" };
export function RiskHeatmap({ counts, ...base }: Base & { /** counts[likelihood-1][impact-1] on a 5×5 grid */ counts: number[][] }) {
  const n = counts.length;
  const rows = Array.from({ length: n }, (_, r) => n - r); // likelihood n..1, top to bottom
  return (
    <ChartFrame {...base} legendShape="box"
      legend={["Low", "Medium", "High", "Critical"].map((l) => ({ label: `${l}`, color: riskBand(l === "Low" ? 1 : l === "Medium" ? 5 : l === "High" ? 10 : 20).c }))}
      table={{ head: ["Likelihood", ...Array.from({ length: n }, (_, i) => `Impact ${i + 1}`)], rows: rows.map((L) => [L, ...counts[L - 1]]) }}>
      <div className="mx-auto grid max-w-[30rem] grid-cols-[1.25rem_1fr] gap-2">
        <span className="self-center text-[11px] text-navy-500 [writing-mode:vertical-rl] rotate-180">Likelihood →</span>
        <div>
          <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {rows.map((L) => counts[L - 1].map((c, k) => {
              const I = k + 1, s = L * I, b = riskBand(s);
              return (
                <div key={`${L}-${I}`} data-tip={`Likelihood ${L} × Impact ${I} = ${s} · ${b.l}\n${c} open risk${c === 1 ? "" : "s"}`}
                  className="c-fade grid aspect-[5/4] place-items-center rounded-[4px]" style={v({ background: b.soft, "--i": L + I - 2 })}>
                  {c > 0 && (
                    <span className="c-pop grid size-7 place-items-center rounded-full text-xs font-semibold tabular-nums" style={v({ background: b.c, color: b.ink, "--i": L + I - 2, "--d": "450ms" })}>{c}</span>
                  )}
                </div>
              );
            }))}
          </div>
          <div className="mt-1.5 grid text-center text-[11px] text-navy-500" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {counts.map((_, i) => <span key={i}>{i + 1}</span>)}
          </div>
          <p className="mt-0.5 text-center text-[11px] text-navy-500">Impact →</p>
        </div>
      </div>
    </ChartFrame>
  );
}

/* ---------------- Flow / Sankey workflow (funnel) ---------------- */
// Nodes are capsules on a shared midline; each retained flow is a curved ribbon into the next node and what
// drops out peels off the bottom as an amber branch to a node + count on a lower row. On first view stages
// light up left to right, numbers count up (ChartFrame, [data-count]), dots stream along the ribbons and
// branches, and the last stage pulses; then the stream keeps a slow loop while on screen. Motion: charts.css.
const DROP = "#e0700b", DROP_INK = "#b54708"; // status `high` / `high-ink` (AA on white)
const STEP = 650; // ms between stages lighting up
const ICON = { first: "M-4,-3.5h8M-4,0h8M-4,3.5h5", mid: "M-4.5,0h8M0.5,-3.5l3,3.5l-3,3.5", last: "M-4,0.2l2.8,2.8l5.2,-6" };
export function FlowChart({ stages, ...base }: Base & { stages: { label: string; value: number; drop?: string }[] }) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const W = 380, NW = 22, HMAX = 108;
  // Long stage labels wrap to two lines (they collide at phone font sizes); the bands move down to make room.
  const lab = stages.map((s) => wrap(s.label, 11)), T = 46 + (Math.max(...lab.map((l) => l.length)) - 1) * 18;
  const M = T + HMAX / 2, DY = T + HMAX + 20;
  const n = stages.length, gap = (W - NW) / (n - 1), first = stages[0].value;
  const h = stages.map((s) => Math.max(3, Math.sqrt(s.value / first) * HMAX));
  const top = h.map((hh) => M - hh / 2);
  const X = (i: number) => i * gap;
  const hasDrop = stages.some((s, i) => stages[i + 1] && s.value > stages[i + 1].value);
  const H = hasDrop ? DY + 64 : T + HMAX + 8;
  const pct = (a: number, b: number) => `${((a / b) * 100).toFixed(a / b < 0.01 ? 1 : 0)}%`;
  const ms = (x: number) => `${Math.round(x)}ms`;
  // One edge of ribbon i at fraction f of its thickness: a cubic from node i's top part to node i+1.
  const edge = (i: number, f: number, back = false) => {
    const xa = X(i) + NW, xb = X(i + 1), xm = (xa + xb) / 2, ya = top[i] + f * h[i + 1], yb = top[i + 1] + f * h[i + 1];
    return back ? `L${xb},${yb}C${xm},${yb} ${xm},${ya} ${xa},${ya}` : `M${xa},${ya}C${xm},${ya} ${xm},${yb} ${xb},${yb}`;
  };
  // Dots: dasharray "0 gap" with round caps. Fewer lanes and wider gaps as the value shrinks.
  const dots = (d: string, color: string, sw: number, per: number, delay: number, o = 0, key?: number) => (
    <path key={key} d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`0 ${per.toFixed(1)}`} className="c-flow"
      style={v({ "--per": `${per.toFixed(1)}px`, "--o": `${o.toFixed(1)}px`, "--slow": `${(per / (14 + (key ?? 0) * 3)).toFixed(2)}s`, "--fast": `${(per / 90).toFixed(2)}s`, "--d": ms(delay) })} />
  );
  return (
    <ChartFrame {...base}
      table={{ head: ["Stage", "Count", "Dropped"], rows: stages.map((s, i) => [s.label, fmt(s.value), stages[i + 1] ? `${fmt(s.value - stages[i + 1].value)} ${s.drop ?? ""}` : "—"]) }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[32rem]" aria-hidden>
        <defs>
          {stages.slice(1).map((s, i) => (
            <linearGradient key={i} id={`${gid}g${i}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={SERIES[0]} stopOpacity="0.3" />
              <stop offset="1" stopColor={i === n - 2 ? SERIES[1] : SERIES[0]} stopOpacity="0.16" />
            </linearGradient>
          ))}
        </defs>
        {stages.map((s, i) => {
          const next = stages[i + 1], x0 = X(i) + NW, t0 = i * STEP;
          const dropV = next ? s.value - next.value : 0, last = i === n - 1;
          const anchor = i === 0 ? "start" : last ? "end" : "middle";
          const tx = i === 0 ? X(i) : last ? X(i) + NW : X(i) + NW / 2;
          // Drop branch: leaves the bottom of the node, bends down to the shared drop row.
          const a0 = next ? top[i] + h[i + 1] : 0, t = Math.max(2, h[i] - (next ? h[i + 1] : 0));
          const dx = x0 + Math.max(16, t / 2 + 10), xl = dx - t / 2, xr = dx + t / 2;
          const hn = Math.max(NW, h[i]), cx = X(i) + NW / 2, color = last ? SERIES[1] : SERIES[0];
          const lanes = next ? Math.max(1, Math.min(3, Math.round(h[i + 1] / 16))) : 0;
          const per = next ? Math.min(64, 16 / Math.sqrt(next.value / first)) : 0;
          const xm = (x0 + X(i + 1)) / 2, topMid = next ? (top[i] + top[i + 1]) / 2 : 0;
          return (
            <g key={s.label}>
              <g data-tip={`${s.label}: ${fmt(s.value)}${i ? ` (${pct(s.value, first)} of ${stages[0].label.toLowerCase()})` : ""}`}>
                <rect x={Math.max(0, X(i) - 6)} y={0} width={Math.min(W, X(i) + NW + 6) - Math.max(0, X(i) - 6)} height={M + hn / 2} fill="transparent" />
                <g className="c-fade" style={v({ "--d": ms(t0) })}>
                  <text y={16} textAnchor={anchor} fontSize="12" fill={INK.muted}>{lab[i].map((ln, k) => <tspan key={k} x={tx} dy={k ? "1.1em" : undefined}>{ln}</tspan>)}</text>
                  <text x={tx} y={T - 10} textAnchor={anchor} fontSize="15" fontWeight="600" fill={INK.strongText} className="tabular-nums" data-count={s.value} data-count-d={t0 + 100}>{fmt(s.value)}</text>
                </g>
                {last && <circle cx={cx} cy={M} r={NW / 2} fill="none" stroke={color} strokeWidth="2" className="c-ring" style={v({ "--d": ms(t0 + 900) })} />}
                <g className="c-pop" style={v({ "--d": ms(t0) })}>
                  <rect x={X(i)} y={M - hn / 2} width={NW} height={hn} rx={NW / 2} fill={color} />
                  <path d={ICON[i === 0 ? "first" : last ? "last" : "mid"]} transform={`translate(${cx} ${M})`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
              {next && (
                <g data-tip={`${s.label} → ${next.label}: ${fmt(next.value)} carried on (${pct(next.value, s.value)})`}>
                  <g className="c-wipe" style={v({ "--d": ms(t0 + 250), "--wipe": "800ms" })}>
                    <path d={`${edge(i, 0)}${edge(i, 1, true)}Z`} fill={`url(#${gid}g${i})`} />
                    <path d={edge(i, 0)} fill="none" stroke={SERIES[0]} strokeOpacity="0.45" strokeWidth="1.5" />
                    {h[i + 1] >= 18
                      ? <text x={xm} y={topMid + Math.min(h[i + 1] / 2, 30) + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={INK.text} className="tabular-nums">{pct(next.value, s.value)}</text>
                      : <text x={xm} y={topMid - 6} textAnchor="middle" fontSize="12" fill={INK.muted} className="tabular-nums">{pct(next.value, s.value)}</text>}
                  </g>
                  {Array.from({ length: lanes }, (_, k) => dots(edge(i, (k + 0.5) / lanes), SERIES[0], Math.min(3.2, Math.max(2, h[i + 1] * 0.5)), per, t0 + 500 + k * 60, (k * per) / lanes, k))}
                </g>
              )}
              {next && dropV > 0 && (
                <g data-tip={`${s.label}: ${fmt(dropV)} ${s.drop ?? "dropped"} (${pct(dropV, s.value)})`}>
                  <path d={`M${x0},${a0}C${xr},${a0} ${xr},${a0} ${xr},${DY}L${xl},${DY}C${xl},${a0 + t} ${xl},${a0 + t} ${x0},${a0 + t}Z`} fill={DROP} fillOpacity="0.4" className="c-drop" style={v({ "--d": ms(t0 + 450), "--wipe": "700ms" })} />
                  {dots(`M${x0},${a0 + t / 2}C${dx},${a0 + t / 2} ${dx},${a0 + t / 2} ${dx},${DY}`, DROP_INK, Math.min(2.6, Math.max(2, t * 0.5)), 30, t0 + 650)}
                  <g className="c-fade" style={v({ "--d": ms(t0 + 900) })}>
                    <rect x={xl - 1} y={DY} width={t + 2} height="5" rx="2" fill={DROP} />
                    <text x={xl - 1} y={DY + 19} fontSize="13" fontWeight="600" fill={DROP_INK} className="tabular-nums" data-count={dropV} data-count-d={t0 + 900}>{fmt(dropV)}</text>
                    {s.drop && <text y={DY + 36} fontSize="12" fill={INK.muted}>{wrap(s.drop, 12).slice(0, 2).map((ln, k) => <tspan key={k} x={xl - 1} dy={k ? "1.2em" : undefined}>{ln}</tspan>)}</text>}
                  </g>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

/* ---------------- Timeline / Gantt ---------------- */
const SWEEP = 2500, SWEEP_D = 900; // keep in step with .c-sweep in charts.css
export function Timeline({ phases, weeks, today, unit = "week", ...base }: Base & {
  phases: { label: string; start: number; end: number }[];
  /** Length of the axis, counted in `unit`s. */
  weeks: number;
  today?: number;
  /** Axis unit, singular: "week" (default), "day", "hour". */
  unit?: string;
}) {
  const Unit = unit[0].toUpperCase() + unit.slice(1), every = Math.ceil(weeks / 10);
  const state = (p: { start: number; end: number }) => today === undefined ? "Planned" : p.end <= today ? "Done" : p.start < today ? "In progress" : "Planned";
  const fill = { Done: SERIES[0], "In progress": "#a59bff", Planned: INK.strong } as const;
  // the playhead sweeps 0 → today in SWEEP ms (ease-out cubic) after the bars grow; when it reaches week w:
  const sweepAt = (w: number) => Math.round(SWEEP_D + SWEEP * (1 - Math.cbrt(1 - Math.min(1, w / (today || 1)))));
  return (
    <ChartFrame {...base} legendShape="box" legend={today === undefined ? undefined : (["Done", "In progress", "Planned"] as const).map((l) => ({ label: l, color: fill[l] }))}
      table={{ head: ["Phase", `Start ${unit}`, `End ${unit}`, "Status"], rows: phases.map((p) => [p.label, p.start, p.end, state(p)]) }}>
      <div className="relative mt-6 grid grid-cols-[fit-content(40%)_1fr] gap-x-3 pr-2 text-sm">
        {phases.map((p, i) => (
          <div key={p.label} className="contents">
            <span className="py-1.5 leading-snug text-pretty text-navy-700">{p.label}</span>
            <div className="relative border-l border-line">
              <div data-tip={`${p.label}: ${unit} ${p.start} to ${p.end} · ${state(p)}`} className="c-grow-x absolute top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-[4px]"
                style={v({ left: `${(p.start / weeks) * 100}%`, width: `calc(${((p.end - p.start) / weeks) * 100}% - 2px)`, background: fill[state(p)], "--i": i })}>
                {/* earlier states cover the bar and fade out as the playhead passes its start / end (final state = base colour) */}
                {state(p) === "Done" && <i className="c-gone absolute inset-0" style={v({ background: fill["In progress"], "--d": `${sweepAt(p.end)}ms` })} />}
                {state(p) !== "Planned" && <i className="c-gone absolute inset-0" style={v({ background: fill.Planned, "--d": `${sweepAt(p.start)}ms` })} />}
              </div>
            </div>
          </div>
        ))}
        <span />
        <div className="flex justify-between border-t border-line pt-1 text-[11px] text-navy-500 tabular-nums">
          {Array.from({ length: weeks + 1 }, (_, k) => <span key={k} className="flex w-0 justify-center">{k % every ? "" : k}</span>)}
        </div>
        {today !== undefined && (
          <div aria-hidden className="c-sweep pointer-events-none absolute inset-y-0 col-start-2 w-full" style={v({ "--x": `${(-today / weeks) * 100}%`, gridRow: `1 / span ${phases.length}` })}>
            <div className="absolute inset-y-0" style={{ left: `${(today / weeks) * 100}%` }}>
              <div className="absolute inset-y-0 border-l-2 border-navy-950" />
              <span className="c-live absolute -top-[3px] -left-[3px] size-2 rounded-full bg-navy-950" />
              <span className="absolute -top-5 -translate-x-1/2 text-[11px] font-semibold text-navy-950">Today</span>
            </div>
          </div>
        )}
      </div>
      <p className="mt-1 text-right text-[11px] text-navy-500">{Unit}</p>
    </ChartFrame>
  );
}

/* ---------------- Attack graph ---------------- */
type GNode = { id: string; label: string; x: number; y: number; note?: string };
export function AttackGraph({ nodes, edges, path, ...base }: Base & { nodes: GNode[]; edges: [string, string][]; /** node ids from entry to target */ path: string[] }) {
  const by = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const hop = (a: string, b: string) => path.findIndex((p, i) => (p === a && path[i + 1] === b) || (p === b && path[i + 1] === a));
  const target = path[path.length - 1];
  return (
    <ChartFrame {...base} legend={[{ label: "Attack path", color: SERIES[0] }, { label: "Reachable, not exploited", color: INK.strong }]}
      table={{ head: ["Step", "Asset", "What happened"], rows: path.map((id, i) => [i + 1, by[id].label, by[id].note ?? ""]) }}>
      <svg viewBox="0 -14 400 290" className="mx-auto block h-auto w-full max-w-[32rem]" aria-hidden>
        {edges.map(([a, b]) => <line key={a + b} x1={by[a].x} y1={by[a].y} x2={by[b].x} y2={by[b].y} stroke={INK.strong} strokeWidth="1.5" />)}
        {edges.map(([a, b]) => {
          const k = hop(a, b);
          if (k < 0) return null;
          const [s, e] = path[k] === a ? [by[a], by[b]] : [by[b], by[a]];
          return <path key={"p" + a + b} d={`M${s.x},${s.y}L${e.x},${e.y}`} pathLength={1} stroke={SERIES[0]} strokeWidth="2.5" strokeLinecap="round" className="c-draw" style={v({ "--i": k * 6 + 3 })} />;
        })}
        {nodes.map((n) => {
          const k = path.indexOf(n.id), on = k >= 0, isT = n.id === target;
          const above = n.y < 130, lines = wrap(n.label, 12);
          return (
            <g key={n.id} data-tip={`${on ? `Step ${k + 1} of ${path.length}: ` : ""}${n.label}${n.note ? `\n${n.note}` : ""}`}>
              <circle cx={n.x} cy={n.y} r="18" fill="transparent" />
              <circle cx={n.x} cy={n.y} r="14" fill="none" stroke={SERIES[0]} strokeWidth="1.5" className="c-hot" />
              <g className={on ? "c-pop" : undefined} style={on ? v({ "--i": k * 6 }) : undefined}>
                {isT && <circle cx={n.x} cy={n.y} r="13" fill={SEV.critical} fillOpacity="0.15" />}
                <circle cx={n.x} cy={n.y} r={on ? 7 : 6} fill={isT ? SEV.critical : on ? SERIES[0] : "#fff"} stroke={on ? "#fff" : INK.muted} strokeWidth={on ? 2 : 1.5} />
              </g>
              <text y={above ? n.y - 16 : n.y + 25} textAnchor={n.x < 70 ? "start" : n.x > 330 ? "end" : "middle"} fontSize="14" fontWeight={on ? 600 : 400} fill={on ? INK.strongText : INK.muted}>
                {lines.map((ln, j) => <tspan key={j} x={n.x < 70 ? n.x - 18 : n.x > 330 ? n.x + 18 : n.x} dy={j ? "1.15em" : above ? `${-(lines.length - 1) * 1.15}em` : undefined}>{ln}</tspan>)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

/* ---------------- Sparkline set ---------------- */
export function Sparklines({ items, live = false, ...base }: Base & {
  items: { label: string; values: number[]; unit?: string; decimals?: number; goodWhen: "up" | "down" }[];
  /** Pulse the end dots (only for data that is actually live). Pauses offscreen. */
  live?: boolean;
}) {
  const W = 120, H = 34;
  return (
    <ChartFrame {...base} table={{ head: ["Measure", "First", "Latest"], rows: items.map((it) => [it.label, `${fmt(it.values[0], it.decimals)}${it.unit ?? ""}`, `${fmt(it.values.at(-1)!, it.decimals)}${it.unit ?? ""}`]) }}>
      <ul className="grid grid-cols-1 gap-3 min-[30rem]:grid-cols-2">
        {items.map((it, i) => {
          const lo = Math.min(...it.values), hi = Math.max(...it.values), n = it.values.length;
          const px = (k: number) => 3 + (k * (W - 6)) / (n - 1), py = (val: number) => 4 + (1 - (val - lo) / (hi - lo || 1)) * (H - 8);
          const d = it.values.map((val, k) => `${k ? "L" : "M"}${px(k).toFixed(1)},${py(val).toFixed(1)}`).join("");
          const first = it.values[0], last = it.values[n - 1], change = last - first;
          const good = it.goodWhen === "up" ? change >= 0 : change <= 0;
          const u = it.unit ?? "";
          return (
            <li key={it.label} data-tip={`${it.label}, ${n} weeks\n${fmt(first, it.decimals)}${u} → ${fmt(last, it.decimals)}${u} (low ${fmt(lo, it.decimals)}${u}, high ${fmt(hi, it.decimals)}${u})`}
              className="rounded-card bg-canvas p-4 shadow-card">
              <p className="truncate text-xs text-navy-600">{it.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-semibold text-navy-950">{fmt(last, it.decimals)}{u}</span>
                <span className={cx("text-xs font-medium", good ? "text-ok-ink" : "text-critical-ink")}>{change >= 0 ? "▲" : "▼"} {fmt(Math.abs(change), it.decimals)}{u}</span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block h-auto w-full" aria-hidden>
                <path d={d} fill="none" stroke={INK.soft} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className="c-wipe" style={v({ "--i": i })} />
                <g className="c-pop" style={v({ "--i": i, "--d": "1100ms" })}>
                  {live && <circle cx={px(n - 1)} cy={py(last)} r="3.5" fill={SERIES[0]} className="c-live" />}
                  <circle cx={px(n - 1)} cy={py(last)} r="3.5" fill={SERIES[0]} stroke="#fff" strokeWidth="1.5" />
                </g>
              </svg>
            </li>
          );
        })}
      </ul>
    </ChartFrame>
  );
}

/* ---------------- KPI tiles (count up) ---------------- */
export function KpiTiles({ items, placeholder = true, className }: {
  items: { label: string; value: number; decimals?: number; prefix?: string; suffix?: string; delta?: string; good?: boolean }[];
  placeholder?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dl className="grid grid-cols-1 gap-3 min-[30rem]:grid-cols-2 lg:grid-cols-4">
        {items.map((k) => (
          <div key={k.label} className="flex flex-col rounded-card bg-canvas p-5 shadow-card">
            <dt className="text-sm text-navy-600">{k.label}</dt>
            <dd className="order-first text-[2.25rem] leading-tight font-semibold tracking-tight text-navy-950">
              <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
            </dd>
            {k.delta && <dd className={cx("mt-2 text-xs font-medium", k.good ? "text-ok-ink" : "text-critical-ink")}>{k.delta}</dd>}
          </div>
        ))}
      </dl>
      {placeholder && <p className="mt-3 text-micro text-navy-500">{ILLUSTRATIVE}</p>}
    </div>
  );
}
