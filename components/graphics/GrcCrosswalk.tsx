"use client";
// /grc hero: one control collects its evidence once and is credited to four frameworks at the same time.
// Clause references are the public ones (SOC 2 TSC 2017, ISO/IEC 27001:2022 Annex A, NIST CSF 2.0, HIPAA Security Rule); everything else is illustrative.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "../ui";
import { Check, Chip, Frame } from "./kit";
import "./grc-crosswalk.css";

const FW = ["SOC 2", "ISO 27001", "NIST CSF 2.0", "HIPAA"] as const;
const CONTROLS: { id: string; name: string; src: string; file: string; map: [clause: string, title: string][] }[] = [
  { id: "AC-04", name: "Quarterly user access review", src: "Okta", file: "access_review_q3.csv", map: [["CC6.3", "Access changed or removed by role"], ["A.5.18", "Access rights"], ["PR.AA-05", "Access permissions managed and reviewed"], ["§164.308(a)(4)", "Information access management"]] },
  { id: "AC-01", name: "MFA enforced for every user", src: "Okta", file: "mfa_policy_export.json", map: [["CC6.1", "Logical access security"], ["A.8.5", "Secure authentication"], ["PR.AA-03", "Users and services authenticated"], ["§164.312(d)", "Person or entity authentication"]] },
  { id: "BC-02", name: "Backup restore tested", src: "AWS Backup", file: "restore_job_log.txt", map: [["A1.3", "Recovery plan testing"], ["A.8.13", "Information backup"], ["PR.DS-11", "Backups created, protected and tested"], ["§164.308(a)(7)", "Contingency plan"]] },
];
const BASE = 79; // readiness before any of these controls; +3 points per mapped control (illustrative)
// phase 0 = collecting evidence, 1 = evidence collected, 2 = credited to every framework. Wait (ms) before leaving each phase.
const HOLD = [1400, 700, 3800];

export function GrcCrosswalk({ className }: { className?: string }) {
  // Server frame = control 1 mapped, the rest queued; reduced motion keeps it.
  const [[c, p], set] = useState<[number, number]>([0, 2]);
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => set(p < 2 ? [c, p + 1] : [(c + 1) % CONTROLS.length, 0]), HOLD[p]);
    return () => clearTimeout(t);
  }, [on, c, p]);

  const done = (i: number) => i < c || (i === c && p === 2);
  const mapped = CONTROLS.filter((_, i) => done(i)).length;
  const ready = BASE + 3 * mapped;
  const cur = CONTROLS[c];

  return (
    <div ref={ref} className={className}>
      <Frame
        title="grc · crosswalk"
        status={<Chip tone="accent">{FW.length} frameworks in scope</Chip>}
        beats={[]}
        label="Compliance crosswalk: the control 'Quarterly user access review' collects its evidence from Okta once and is credited to SOC 2 CC6.3, ISO 27001 A.5.18, NIST CSF 2.0 PR.AA-05 and HIPAA 164.308(a)(4) at the same time, raising audit readiness. The scene then repeats for MFA and backup restore testing."
      >
        <div data-p={p} className="gx grid gap-3 bg-mist p-3 @3xl:grid-cols-[15rem_minmax(0,1fr)] @3xl:gap-4 @3xl:p-4">
          {/* control list */}
          <div className="flex flex-col rounded-control bg-canvas p-2 shadow-hairline">
            <p className="px-2 pt-1 pb-2 font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">Controls · 146</p>
            <ul className="grid gap-1">
              {CONTROLS.map((k, i) => (
                <li key={k.id} className={cx("flex items-center gap-2 rounded-control px-2 py-2 transition-shadow duration-300", i === c && "bg-mist shadow-[inset_0_0_0_1.5px_var(--color-accent)]")}>
                  <span className="shrink-0 font-mono text-micro text-navy-500">{k.id}</span>
                  <span className="min-w-0 flex-1 text-[12px] leading-4 font-medium text-navy-950">{k.name}</span>
                  {done(i) ? <Chip tone="ok" className="shrink-0"><Check className="size-3" />×4</Chip>
                    : i === c ? <Chip tone="accent" dot className="gx-pulse shrink-0">Live</Chip>
                    : <Chip className="shrink-0">Queued</Chip>}
                </li>
              ))}
            </ul>
            <p className="mt-auto flex items-center justify-between gap-2 border-t border-line px-2 pt-2.5 pb-1 font-mono text-micro text-navy-500">
              <span>Clauses credited</span><span className="font-semibold text-navy-950 tabular-nums">{mapped * FW.length} / {CONTROLS.length * FW.length}</span>
            </p>
          </div>

          <div className="grid min-w-0 gap-3">
            {/* evidence: the one piece of work */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-control bg-canvas px-3 py-2.5 shadow-hairline">
              <span className="grid size-8 shrink-0 place-items-center rounded-control bg-accent-soft text-accent-ink">
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M4 1.75h5.5L12.5 4.75v9.5h-8.5z" /><path d="M9.25 1.75v3.25h3.25M6.25 8.5h4m-4 2.5h4" strokeLinecap="round" /></svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-navy-950">{cur.id} · {cur.name}</span>
                <span className="block font-mono text-micro break-words text-navy-500">{cur.file} · from {cur.src}</span>
              </span>
              {p === 0
                ? <Chip tone="accent" dot className="gx-pulse">Collecting evidence…</Chip>
                : <Chip tone="ok"><Check className="size-3" />Evidence collected</Chip>}
              <span aria-hidden className="relative h-0.5 basis-full overflow-hidden rounded-full bg-cloud">
                <span className={cx("gx-load absolute inset-y-0 left-0 w-full rounded-full", p === 0 ? "bg-accent" : "gx-full bg-ok")} />
              </span>
            </div>

            {/* one control, four frameworks */}
            <ul className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">
              {FW.map((f, j) => (
                <li key={f} className="gx-fw relative flex flex-col overflow-hidden rounded-control p-2.5" style={{ "--i": j } as CSSProperties}>
                  <span aria-hidden className="gx-bar absolute inset-x-0 top-0 h-0.5 bg-ok" />
                  <p className="font-mono text-micro tracking-[0.04em] text-navy-500 uppercase">{f}</p>
                  {/* all three controls stacked in one cell, so the card never changes height */}
                  <span className="rp-stack mt-1">
                    {CONTROLS.map((k, i) => (
                      <span key={k.id} className={cx("block", i !== c && "invisible")}>
                        <span className="block text-[13px] font-semibold text-navy-950 tabular-nums">{k.map[j][0]}</span>
                        <span className="block text-[11px] leading-4 text-navy-600">{k.map[j][1]}</span>
                      </span>
                    ))}
                  </span>
                  <span className="rp-stack mt-auto justify-items-start pt-2">
                    <span className="gx-no"><Chip>Pending</Chip></span>
                    <span className="gx-yes"><Chip tone="ok"><Check className="size-3" />Satisfied</Chip></span>
                  </span>
                </li>
              ))}
            </ul>

            {/* outcome */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-control bg-canvas px-3 py-2.5 shadow-hairline">
              <span className="text-[12px] font-medium text-navy-950">1 piece of evidence <span className="text-navy-500">→</span> {FW.length} frameworks</span>
              <span className="ml-auto flex min-w-[11rem] flex-1 items-center gap-2 @2xl:max-w-[16rem]">
                <span className="shrink-0 font-mono text-micro text-navy-500">Audit readiness</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cloud"><span className="gx-ready block h-full rounded-full bg-accent" style={{ width: `${ready}%` }} /></span>
                <span className="w-9 shrink-0 text-right text-[13px] font-semibold text-navy-950 tabular-nums">{ready}%</span>
              </span>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}
