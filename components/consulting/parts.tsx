// Consulting-only building blocks. Faq and FinalCta live in components/sections.tsx.
import type { ReactNode } from "react";
import { Badge, Section, SectionHeading, cx } from "@/components/ui";
import { AppWindow, Panel } from "@/components/mockup";
import { SEV_LABEL, type Service } from "./data";

export const PLACEHOLDER_NOTE = "Illustrative report data";

export function Icon({ d, className = "size-5" }: { d: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/** Sample report: severity summary, findings list and one finding in detail. */
export function ReportMockup({ s, className }: { s: Service; className?: string }) {
  const r = s.report;
  const f = r.finding;
  const counts = [["Critical", "critical"], ["High", "high"], ["Medium", "medium"], ["Low", "neutral"]] as const;
  return (
    <AppWindow title={r.window} label={`Sample ${s.name} report: severity summary, a findings list and the detail of finding "${f.title}" with evidence and a fix.`} className={className}>
      <div className="bg-mist p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-950">Findings report</p>
            <p className="truncate font-mono text-micro text-navy-500">{r.engagement}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {counts.map(([l, t], i) => <Badge key={l} tone={t}>{r.counts[i]} {l}</Badge>)}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <Panel title={`${f.id} · ${f.title}`} className="md:col-span-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={f.sev} dot>{SEV_LABEL[f.sev]}</Badge>
              <Badge>{f.score}</Badge>
            </div>
            <p className="mt-3 font-mono text-micro text-navy-500">{f.asset}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-navy-700">{f.summary}</p>
            <p className="mt-4 text-micro font-medium tracking-[0.06em] text-navy-500 uppercase">{f.evidenceLabel}</p>
            <pre className="mt-1.5 overflow-x-auto whitespace-pre rounded-control bg-navy-950 p-3 font-mono text-micro leading-relaxed text-navy-300">{f.evidence.join("\n")}</pre>
            <p className="mt-4 text-micro font-medium tracking-[0.06em] text-navy-500 uppercase">Recommended fix</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-navy-700">{f.fix}</p>
          </Panel>
          <div className="flex flex-col gap-3 md:col-span-2">
            <Panel title="Findings" action={<span className="text-micro font-medium text-accent">Export</span>}>
              <ul className="divide-y divide-line">
                {r.list.map(([t, sev]) => (
                  <li key={t} className="flex items-center gap-2 py-2 text-[0.8125rem]">
                    <Badge tone={sev} className="w-[68px] justify-center">{SEV_LABEL[sev]}</Badge>
                    <span className="min-w-0 flex-1 truncate text-navy-900">{t}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Status">
              <Badge tone={f.status[1]} dot>{f.status[0]}</Badge>
              <ol className="mt-3 space-y-2 border-l border-line pl-3 text-xs text-navy-600">
                <li>Reported to owner, same day</li>
                <li>Fix shipped by engineering</li>
                <li className="font-medium text-navy-950">Verified by our team</li>
              </ol>
            </Panel>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}



/** Copy on one side, one animated chart on the other. One chart per band keeps at most two in view. */
export function ChartBand({ id, eyebrow, title, lead, tone = "canvas", flip = false, children }: {
  id: string; eyebrow: string; title: string; lead: string; tone?: "canvas" | "mist"; flip?: boolean; children: ReactNode;
}) {
  return (
    <Section tone={tone} labelledBy={`${id}-title`}>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} lead={lead} className={cx("lg:col-span-5", flip && "lg:order-last")} />
        <div className={cx("min-w-0 rounded-card bg-canvas p-4 shadow-card sm:p-6 lg:col-span-7", tone === "canvas" && "ring-1 ring-line")}>{children}</div>
      </div>
    </Section>
  );
}
