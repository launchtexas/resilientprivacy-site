"use client";
// Spider/radar chart: rings and spokes draw in, polygons grow from the centre on first view,
// and the filled polygon morphs to whichever series the toggle highlights (rAF writes `points` directly).
import { useEffect, useRef, useState } from "react";
import { ChartFrame } from "./frame";
import { DASH, INK, SERIES, fmt, wrap } from "./data";

export type RadarSeries = { name: string; values: number[] };

const W = 480, H = 300, CX = 240, CY = 150, R = 100;

export function RadarChart({ title, desc, axes, series, max = 5, placeholder = true, className }: {
  title: string;
  desc?: string;
  axes: string[];
  /** 1 to 3 series, values on 0..max in axis order. */
  series: RadarSeries[];
  max?: number;
  placeholder?: boolean;
  className?: string;
}) {
  const n = axes.length;
  const at = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n, r = (R * v) / max;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
  };
  const pts = (vals: number[]) => vals.map((v, i) => at(i, v).map((c) => c.toFixed(1)).join(",")).join(" ");
  const ring = (v: number) => "M" + axes.map((_, i) => at(i, v).map((c) => c.toFixed(1)).join(",")).join("L") + "Z";

  const [active, setActive] = useState(0);
  const poly = useRef<SVGPolygonElement>(null);
  const dots = useRef<SVGGElement>(null);
  const cur = useRef<number[]>(series[0].values);

  useEffect(() => {
    const from = cur.current, to = series[active].values;
    if (from === to) return;
    const draw = (vals: number[]) => {
      poly.current!.setAttribute("points", pts(vals));
      Array.from(dots.current!.children).forEach((c, i) => { const [x, y] = at(i, vals[i]); c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); });
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { cur.current = to; return draw(to); }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 700), e = 1 - (1 - p) ** 3;
      cur.current = from.map((f, i) => f + (to[i] - f) * e);
      draw(cur.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // geometry helpers are pure functions of props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const color = SERIES[active];
  const origin = { transformOrigin: `${CX}px ${CY}px` };
  const tipFor = (i: number) => `${axes[i]}\n` + series.map((s) => `${s.name}: ${fmt(s.values[i], 1)} of ${max}`).join("\n");

  const controls = series.length > 1 && (
    <div role="group" aria-label="Highlight a series" className="mb-3 inline-flex flex-wrap gap-1 rounded-control bg-cloud p-1">
      {series.map((s, i) => (
        <button key={s.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)}
          className="min-h-10 rounded-[8px] px-3 text-sm font-medium text-navy-700 transition-colors duration-150 hover:text-navy-950 aria-pressed:bg-canvas aria-pressed:text-navy-950 aria-pressed:shadow-card">
          {s.name}
        </button>
      ))}
    </div>
  );

  return (
    <ChartFrame
      title={title} desc={desc} placeholder={placeholder} className={className} controls={controls}
      legend={series.length > 1 ? series.map((s, i) => ({ label: s.name, color: SERIES[i], dash: DASH[i] })) : undefined}
      table={{ head: ["Area", ...series.map((s) => s.name)], rows: axes.map((a, i) => [a, ...series.map((s) => fmt(s.values[i], 1))]) }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="c-radar mx-auto block h-auto w-full max-w-[38rem]" aria-hidden>
        {Array.from({ length: max }, (_, k) => (
          <path key={k} d={ring(k + 1)} pathLength={1} fill="none" stroke={k + 1 === max ? INK.strong : INK.line} className="c-draw" style={{ ["--i" as string]: k }} />
        ))}
        {axes.map((_, i) => { const [x, y] = at(i, max); return <path key={i} d={`M${CX},${CY}L${x.toFixed(1)},${y.toFixed(1)}`} pathLength={1} stroke={INK.line} className="c-draw" style={{ ["--i" as string]: i }} />; })}
        {series.map((s, i) => (
          <polygon key={s.name} points={pts(s.values)} fill="none" stroke={SERIES[i]} strokeWidth="1.5" strokeDasharray={DASH[i]} strokeLinejoin="round"
            className="c-scale" style={{ ...origin, ["--d" as string]: "400ms", ["--i" as string]: i }} />
        ))}
        <polygon ref={poly} points={pts(series[0].values)} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" strokeLinejoin="round"
          className="c-scale" style={{ ...origin, ["--d" as string]: "400ms", transition: "fill 600ms, stroke 600ms" }} />
        <g ref={dots} className="c-scale" style={{ ...origin, ["--d" as string]: "400ms" }}>
          {series[0].values.map((v, i) => { const [x, y] = at(i, v); return <circle key={i} cx={x} cy={y} r="4.5" fill={color} stroke="#fff" strokeWidth="2" style={{ transition: "fill 600ms" }} />; })}
        </g>
        {/* only the outer value sets the scale (inner ticks always landed on a series edge); it sits above the top ring, right of the spoke, where no edge runs */}
        <text x={CX + 7} y={CY - R - 3} fontSize="11" fill={INK.muted} stroke="#fff" strokeWidth="3" paintOrder="stroke" className="c-fade c-tick">{max}</text>
        {axes.map((a, i) => {
          const [x, y] = at(i, max), [lx, ly] = at(i, max * 1.13);
          const c = Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n), lines = a.length > 10 ? wrap(a, 10) : [a];
          return (
            <g key={a} data-tip={tipFor(i)}>
              <line x1={CX} y1={CY} x2={x} y2={y} stroke="transparent" strokeWidth="30" />
              <line x1={CX} y1={CY} x2={x} y2={y} stroke={SERIES[0]} strokeWidth="1.5" className="c-hot" />
              <text y={ly} textAnchor={c > 0.3 ? "start" : c < -0.3 ? "end" : "middle"} fontSize="14" fontWeight="500" fill={INK.text}>
                {lines.map((ln, j) => <tspan key={j} x={lx} dy={j ? "1.15em" : ly < CY - R ? `${-0.15 - (lines.length - 1) * 1.15}em` : ly > CY + R ? "0.85em" : `${0.3 - (lines.length - 1) * 0.575}em`}>{ln}</tspan>)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
