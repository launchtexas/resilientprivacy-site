import { CountUp } from "../motion/client";
import { Check, Chip, Frame, Swap, lag } from "./kit";

export type Framework = { name: string; pct: number };
const DEFAULT: Framework[] = [
  { name: "SOC 2", pct: 92 },
  { name: "ISO 27001", pct: 81 },
  { name: "GDPR", pct: 74 },
];
// [control ID, name, evidence file · source]. SOC 2 TSC 2017 and ISO/IEC 27001:2022 Annex A IDs.
const CONTROLS = [
  ["CC6.3", "Quarterly access review", "access_review_q3.csv · Okta"],
  ["CC7.2", "Alerting on admin logins", "rule_admin_signin.kql · SIEM"],
  ["CC8.1", "Change approval", "pr_approvals_oct.json · GitHub"],
  ["A.8.24", "Key rotation", "kms_rotation_status.json · AWS KMS"],
];
const DONE = 6; // beat when the last control lands

/** Evidence collection: each control flips from "Collecting" to "Evidence collected" with its source, framework coverage bars fill. Up to 3 frameworks. Plays once in view. */
export function ComplianceRing({ frameworks = DEFAULT, className }: { frameworks?: Framework[]; className?: string }) {
  const fw = frameworks.slice(0, 3);
  const avg = Math.round(fw.reduce((s, f) => s + f.pct, 0) / fw.length);
  return (
    <Frame
      className={className}
      title="evidence · audit readiness"
      status={<Swap steps={[[<Chip key="c" tone="accent" dot>Collecting</Chip>, undefined, DONE], [<Chip key="r" tone="ok"><Check className="size-3" />Audit-ready</Chip>, DONE]]} />}
      beats={[400, 1300, 2000, 2700, 3400, 4100]}
      label={`Simulated data. Compliance evidence collected automatically from Okta, the SIEM, GitHub and AWS; control coverage ${fw.map((f) => `${f.name} ${f.pct}%`).join(", ")}.`}
    >
      <div className="grid gap-4 p-3.5 @md:p-4 @xl:grid-cols-[10rem_minmax(0,1fr)]">
        <div className="min-w-0">
          <CountUp value={avg} suffix="%" className="text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-navy-950" />
          <p className="mt-1 text-micro text-navy-500">controls met</p>
          <ul className="mt-3 space-y-2">
            {fw.map((f, i) => (
              <li key={f.name} className="min-w-0">
                <span className="flex justify-between gap-2 text-xs"><span className="truncate font-medium text-navy-900">{f.name}</span><span className="font-mono text-navy-500 tabular-nums">{f.pct}%</span></span>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-cloud">
                  <span data-at="1" style={{ width: `${f.pct}%`, ...lag(i * 160) }} className="rp-grow-x block h-full rounded-full bg-accent" />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="min-w-0 space-y-1.5">
          {CONTROLS.map(([id, name, src], i) => (
            <li key={id} className="flex h-11 items-center gap-2.5 rounded-control bg-mist px-2.5">
              <span className="w-12 shrink-0 font-mono text-micro text-navy-500">{id}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-navy-950">{name}</span>
                <span className="block truncate font-mono text-micro text-navy-500">{src}</span>
              </span>
              <Swap
                className="shrink-0"
                steps={[
                  [<Chip key="w" tone="neutral">Collecting</Chip>, undefined, i + 2],
                  [<Chip key="d" tone="ok"><Check className="size-3" /><span className="hidden @md:inline">Evidence </span>collected</Chip>, i + 2],
                ]}
              />
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}
