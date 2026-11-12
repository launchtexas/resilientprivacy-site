"use client";
// "Our AI attack method" signature visual: an agent diagram (user → agent → tools / MCP → data) with the five method
// steps played over it, a step list kept in sync (click or focus a step to jump there), and a log line per step.
// The step is one data attribute on the root (data-step); everything else is CSS in graphics.css (.rp-am).
// Server HTML and reduced motion = the final step (Retest: every edge green, tagged with its OWASP LLM ID).
import { useEffect, useRef } from "react";
import { cx } from "../ui";
import { Check, Shield } from "./kit";
import "./graphics.css";

export type MethodStep = [title: string, body: string];

const NODES = [
  ["User", "ticket text"],
  ["Agent", "LLM + prompt"],
  ["Tools", "MCP · refund_api"],
  ["Data", "customer DB"],
] as const;
const WIRES = ["LLM01", "LLM06", "LLM02"]; // edge tags shown on Retest: injection, excessive agency, sensitive data
const LOG = [
  "› recon · 4 nodes · 11 tools · 2 MCP servers",
  "! inject · hidden text in a ticket · LLM01",
  "! tool abuse · refund_api called · LLM06",
  "! exfil · 3 customer emails left · LLM02",
  "✓ retest · 3/3 chains blocked + logged",
];
const BEAT = 2400; // ms per step; the CSS in graphics.css (.rp-am) is written for exactly 5 steps

export function AiAttackMethod({ steps, className }: { steps: MethodStep[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const last = steps.length - 1;
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let k = 0, timer: ReturnType<typeof setTimeout> | undefined, manual = false;
    const go = (n: number) => { el.dataset.step = String(n); };
    const tick = () => { if (k < last) { go(++k); timer = setTimeout(tick, BEAT); } };
    go(0);
    const io = new IntersectionObserver(([e]) => {
      el.dataset.live = e.isIntersecting ? "on" : "off";
      clearTimeout(timer);
      if (e.isIntersecting && !manual) timer = setTimeout(tick, k ? BEAT : 900);
    }, { threshold: 0.35 });
    io.observe(el.firstElementChild!); // the diagram, so steps play while it is in view
    // the reader takes over: stop the autoplay and show the step they picked
    const pick = (e: Event) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-go]");
      if (!b) return;
      manual = true; clearTimeout(timer); k = Number(b.dataset.go); go(k);
    };
    el.addEventListener("click", pick);
    el.addEventListener("focusin", pick);
    return () => { io.disconnect(); clearTimeout(timer); el.removeEventListener("click", pick); el.removeEventListener("focusin", pick); };
  }, [last]);

  return (
    <div ref={ref} data-step={last} data-live="off" className={cx("rp-am grid gap-4", className)}>
      <div role="img" aria-label="Agent diagram: user input reaches the agent, which calls tools and MCP servers that read customer data. Recon maps every node; an injected instruction reaches the agent, abuses the refund tool and pulls customer emails out; on retest every edge is guarded, each tagged with its OWASP LLM ID, and all three attack chains are blocked and logged." className="@container min-w-0 overflow-hidden rounded-card bg-canvas shadow-card ring-1 ring-line">
        <div aria-hidden>
          <div className="flex h-10 items-center gap-2.5 border-b border-line bg-mist px-3.5">
            <span className="flex shrink-0 gap-1">{[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-line-strong" />)}</span>
            <span className="min-w-0 truncate font-mono text-micro text-navy-500">ai-red-team · support-agent</span>
            <span className="rp-stack ml-auto shrink-0">
              {["Mapping", "Attacking", "Attacking", "Attacking", "Retest passed"].map((s, i) => (
                <span key={i} data-on={i} className={cx("rp-am-show inline-flex items-center gap-1 rounded-chip px-1.5 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap", i === last ? "bg-ok-soft text-ok-ink" : i ? "bg-critical-soft text-critical-ink" : "bg-accent-soft text-accent-ink")}>
                  {i === last ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}{s}
                </span>
              ))}
            </span>
          </div>

          {/* diagram: a row of nodes joined by wires (stacks vertically in a narrow box); each wire carries its attack / OWASP tag */}
          <div className="flex flex-col items-stretch p-4 @2xl:flex-row @2xl:items-center @2xl:p-6">
            {NODES.map(([n, sub], i) => (
              <div key={n} className="contents">
                <div data-node={i} className="rp-am-node min-w-0 rounded-control border bg-mist px-3 py-2.5 @2xl:flex-1">
                  <span className="block truncate text-[13px] font-semibold text-navy-950">{n}</span>
                  <span className="block truncate font-mono text-micro text-navy-500">{sub}</span>
                </div>
                {i < WIRES.length && (
                  <div className="relative h-12 shrink-0 @2xl:h-16 @2xl:w-28">
                    <span data-wire={i} className="rp-am-wire absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 overflow-hidden @2xl:top-1/2 @2xl:bottom-auto @2xl:left-0 @2xl:h-0.5 @2xl:w-full @2xl:translate-x-0 @2xl:-translate-y-1/2">
                      <i className="rp-am-packet absolute inset-0" />
                    </span>
                    <span className="rp-stack absolute top-1/2 left-[calc(50%+0.75rem)] -translate-y-1/2 @2xl:top-[calc(50%+0.5rem)] @2xl:left-1/2 @2xl:-translate-x-1/2 @2xl:translate-y-0">
                      <span data-on={i + 1} className="rp-am-show rp-am-tag rounded-chip bg-critical-soft px-1.5 py-0.5 font-mono text-[11px] leading-4 whitespace-nowrap text-critical-ink">{["injected", "tool abused", "data out"][i]}</span>
                      <span data-on={last} className="rp-am-show inline-flex items-center gap-1 rounded-chip bg-ok-soft px-1.5 py-0.5 font-mono text-[11px] leading-4 whitespace-nowrap text-ok-ink"><Shield className="size-3" />{WIRES[i]}</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rp-stack border-t border-line bg-navy-950 px-4 py-2.5 font-mono text-micro">
            {LOG.map((l, i) => (
              <span key={i} data-on={i} className={cx("rp-am-show truncate", i === last ? "text-[#7fe0b0]" : i ? "text-high" : "text-navy-300")}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map(([t, b], i) => (
          <li key={t}>
            <button type="button" data-go={i} className="rp-am-step w-full rounded-control px-4 py-3 text-left">
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-navy-950">{t}</span>
              </span>
              <span className="mt-1 block pl-8 text-[0.9375rem] leading-relaxed text-navy-600">{b}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
