import { Check, Chip, Frame, Swap } from "./kit";
import { Cursor } from "../motion";
import { FINDING } from "@/lib/example";

// [id, title, CWE, CVSS, sev label, tone, status]; same rows and scores as ENGAGEMENT in lib/example.
const ROWS = [
  ["RP-0139", "Verbose errors leak stack traces and hostnames", "CWE-209", "7.5", "High", "high", "Fixed"],
  ["RP-0137", "No rate limit on /login", "CWE-307", "5.3", "Medium", "medium", "In fix"],
  ["RP-0131", "Outdated TLS cipher suite on legacy host", "CWE-327", "3.1", "Low", "neutral", "Accepted"],
] as const;
const COLS = "grid grid-cols-[minmax(0,1fr)_auto_6.5rem] items-center gap-2 @lg:grid-cols-[4.5rem_minmax(0,1fr)_2.5rem_auto_7.5rem]";

/** Pentest findings table: a critical finding lands, is triaged to an owner, flips to Fixed and gets a passed retest. Plays once in view. */
export function FindingsTable({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title="findings · api pentest"
      status={<Chip tone="neutral">4 open → 3</Chip>}
      beats={[600, { at: 2300, click: "triage" }, 3800, 4900]}
      label="Penetration test findings: a critical broken object-level authorization finding appears, is triaged to an owner, fixed, and passes a retest."
    >
      <div className={`${COLS} border-b border-line px-3.5 py-2 font-mono text-micro tracking-[0.06em] text-navy-500 uppercase`}>
        <span className="hidden @lg:block">ID</span><span>Finding</span><span className="hidden @lg:block">CVSS ▾</span><span>Severity</span><span>Status</span>
      </div>
      <ul className="divide-y divide-line">
        <li data-at="1" className={`rp-slide relative ${COLS} h-12 px-3.5`}>
          <span data-at="1" data-until="3" className="absolute inset-0 bg-critical-soft/70" />
          <span className="relative hidden font-mono text-micro text-navy-500 @lg:block">{FINDING.id}</span>
          <span className="relative min-w-0" title={FINDING.title}>
            <span className="block truncate text-[13px] font-medium text-navy-950">{FINDING.title}</span>
            <span className="block truncate font-mono text-[10px] text-navy-500">{FINDING.cwe} · {FINDING.endpoint}</span>
          </span>
          <span className="relative hidden font-mono text-micro text-navy-950 tabular-nums @lg:block">{FINDING.cvss}</span>
          <Chip tone="critical" className="relative">Critical</Chip>
          <Swap
            className="relative"
            steps={[
              [<span key="t" data-target="triage" className="rounded-chip bg-accent px-2 py-1 text-[11px] font-semibold text-white">Triage</span>, undefined, 2],
              [<Chip key="f" tone="accent" dot>In fix · JP</Chip>, 2, 3],
              [<span key="d" className="flex flex-col items-start gap-0.5"><Chip tone="ok"><Check className="size-3" />Fixed</Chip><span data-at="4" className="rp-pop font-mono text-[10px] leading-3 text-ok-ink">retest passed</span></span>, 3],
            ]}
          />
        </li>
        {ROWS.map(([id, t, cwe, cvss, sev, tone, s]) => (
          <li key={id} className={`${COLS} h-12 px-3.5`}>
            <span className="hidden font-mono text-micro text-navy-500 @lg:block">{id}</span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] text-navy-800">{t}</span>
              <span className="block truncate font-mono text-[10px] text-navy-500">{cwe}</span>
            </span>
            <span className="hidden font-mono text-micro text-navy-700 tabular-nums @lg:block">{cvss}</span>
            <Chip tone={tone}>{sev}</Chip>
            <span className="truncate text-xs text-navy-600">{s}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-3.5 py-2 font-mono text-[10px] text-navy-500 tabular-nums">
        <span>4 of 8 findings · sorted by CVSS</span><span>‹ 1 / 2 ›</span>
      </div>
      <Cursor />
    </Frame>
  );
}
