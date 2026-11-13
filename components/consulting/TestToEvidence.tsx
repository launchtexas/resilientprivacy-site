import type { CSSProperties } from "react";
import { Live } from "@/components/motion/client";
import "@/components/graphics/graphics.css";
import { FINDING } from "@/lib/example"; // reuses the ThreatPipeline step/packet animation (8s loop)

const STEPS = [
  { tag: "Test", title: "Find", body: "Broken object-level authorization exposes other tenants' invoices", meta: `${FINDING.id} · critical` },
  { tag: "Fix", title: "Verify", body: "Ownership check shipped; our retest confirms the chain is broken", meta: "PR #418 · retest passed 2026-10-21" },
  { tag: "Detect", title: "Watch", body: "Invoice-ID enumeration becomes a detection rule in the SOC", meta: "Sigma DET-118 · T1190 · enabled" },
  { tag: "Evidence", title: "Prove", body: "Finding, fix and retest filed against the control they prove", meta: "SOC 2 CC7.1 · ISO 27001 A.8.29" },
];

/** Test-to-Evidence (working name, not shown on pages) (audit idea 6.1): one finding travels test → fix → detect → evidence. */
export function TestToEvidence({ className }: { className?: string }) {
  return (
    <Live className={className} role="img" aria-label="Test to evidence: a pentest finding is fixed and retested, becomes a SOC detection, and is filed as audit evidence.">
      <div aria-hidden className="relative">
        <div className="absolute left-11 right-[calc(25%-2.75rem)] top-[43px] z-10 hidden h-0.5 overflow-hidden rounded-full bg-line-strong md:block">
          <span className="rp-pipe-packet absolute inset-0 block">
            <span className="absolute inset-y-0 right-0 w-20 rounded-full bg-linear-to-r from-transparent to-accent" />
          </span>
        </div>
        <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.tag} className="rp-pipe-step rounded-card bg-canvas p-5 shadow-card" style={{ "--i": i } as CSSProperties}>
              <span className="relative z-20 flex size-12 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold text-accent-ink ring-4 ring-canvas">0{i + 1}</span>
              <p className="mt-4 font-mono text-micro tracking-[0.08em] text-accent-ink uppercase">{s.tag}</p>
              <p className="mt-1 text-h3 font-semibold tracking-[-0.015em] text-navy-950">{s.title}</p>
              <p className="mt-1.5 text-sm text-pretty text-navy-600">{s.body}</p>
              <p className="mt-3 flex items-center gap-1.5 font-mono text-micro text-navy-500"><span className="size-1.5 rounded-full bg-ok" />{s.meta}</p>
            </li>
          ))}
        </ol>
      </div>
    </Live>
  );
}
