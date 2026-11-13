import { Check, Chip, Frame, Swap, lag } from "./kit";
import { Cursor } from "../motion";
import { INCIDENT } from "@/lib/example";

const STEPS = [
  { tag: "Signal", title: "Detect", meta: "02:14:06Z" },
  { tag: "SOC triage", title: "Confirm", meta: "02:17:30Z" },
  { tag: "Fix", title: "Contain", meta: "02:22:41Z" },
  { tag: "Audit evidence", title: "Prove", meta: "02:31:10Z" },
];
const QUEUE = [
  { t: "Failed-login burst · vpn-gw-01", sev: "medium" as const, s: "Auto-closed" },
  { t: "New device enrolled · LT-0442", sev: "neutral" as const, s: "Auto-closed" },
];
const ACTIONS = ["Sessions revoked", "Signing key rotated", "MFA enforced"];

/** A SOC case moving through Detect → Confirm → Contain → Prove: it lands in the queue, an analyst takes it, containment ticks off, evidence is filed. Plays once in view. */
export function ThreatPipeline({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      title={`soc · ${INCIDENT.id}`}
      status={<Swap steps={[[<Chip key="n" tone="high" dot>New</Chip>, undefined, 2], [<Chip key="i" tone="accent" dot>Investigating</Chip>, 2, 4], [<Chip key="r" tone="ok"><Check className="size-3" />Resolved</Chip>, 4]]} />}
      beats={[500, { at: 2200, click: "assign" }, 3500, 5400]}
      label={`Example managed SOC case ${INCIDENT.id}: a sign-in from a new country on a service account (MITRE ATT&CK ${INCIDENT.technique}) is detected, confirmed by a tier 2 analyst, contained by revoking sessions, rotating a key and enforcing MFA, then filed as SOC 2 CC7.3 evidence.`}
    >
      <ol className="grid grid-cols-4 gap-2 border-b border-line px-3.5 py-3 @md:px-4">
        {STEPS.map((s, i) => (
          <li key={s.tag} className="min-w-0">
            <span className="block h-1 overflow-hidden rounded-full bg-line">
              <span data-at={i + 1} className="rp-grow-x block h-full rounded-full bg-accent" />
            </span>
            <span className="mt-2 hidden truncate font-mono text-micro tracking-[0.06em] text-accent-ink uppercase @lg:block">{s.tag}</span>
            <span className="mt-1 block truncate text-[13px] font-semibold text-navy-950">{s.title}</span>
            <span className="block font-mono text-micro text-navy-500">{s.meta}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 p-3.5 @md:p-4 @2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="min-w-0">
          <p className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">Queue</p>
          <ul className="mt-2 space-y-1.5">
            <li data-at="1" className="rp-slide relative flex h-11 items-center gap-2 rounded-control bg-canvas px-2.5 shadow-hairline">
              <span data-at="2" className="absolute inset-0 rounded-control ring-2 ring-accent" />
              <span className="size-2 shrink-0 rounded-full bg-high" />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-navy-950">Sign-in from new country · {INCIDENT.technique}</span>
              <Chip tone="high">High</Chip>
            </li>
            {QUEUE.map((q) => (
              <li key={q.t} className="flex h-11 items-center gap-2 rounded-control bg-mist px-2.5">
                <span className={q.sev === "medium" ? "size-2 shrink-0 rounded-full bg-medium" : "size-2 shrink-0 rounded-full bg-navy-300"} />
                <span className="min-w-0 flex-1 truncate text-[13px] text-navy-600">{q.t}</span>
                <span className="shrink-0 font-mono text-micro text-navy-500">{q.s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 rounded-control bg-mist p-3">
          <p className="truncate text-[13px] font-semibold text-navy-950">Valid cloud account used from a new country</p>
          <p className="truncate font-mono text-micro text-navy-500">{INCIDENT.user} · {INCIDENT.srcIp}</p>
          <p className="mt-1.5 truncate rounded-sm bg-canvas px-1.5 py-1 font-mono text-[10px] text-navy-600 shadow-hairline">SigninLogs | where UserPrincipalName == &quot;{INCIDENT.user}&quot; | where Location != &quot;US&quot;</p>
          <div className="mt-2.5 flex h-8 items-center justify-between gap-2">
            <span className="text-xs text-navy-500">Assignee</span>
            <Swap
              steps={[
                [<span key="a" data-target="assign" className="rounded-chip bg-accent px-2 py-1 text-[11px] font-semibold text-white">Assign to me</span>, undefined, 2],
                [<span key="b" className="flex items-center gap-1.5 text-xs font-medium text-navy-950"><span className="grid size-6 place-items-center rounded-full bg-navy-950 text-[10px] font-semibold text-white">T2</span>Tier 2 on call</span>, 2],
              ]}
            />
          </div>
          <ul className="mt-2 space-y-1">
            {ACTIONS.map((a, i) => (
              <li key={a} className="flex items-center gap-2 text-xs text-navy-700">
                <span className="rp-stack size-4 shrink-0">
                  <span className="rounded-full border border-line-strong bg-canvas" />
                  <span data-at="3" style={lag(i * 380)} className="rp-pop grid place-items-center rounded-full bg-ok text-white"><Check className="size-2.5" /></span>
                </span>
                {a}
              </li>
            ))}
          </ul>
          <p data-at="4" className="mt-2.5 flex min-w-0 items-center gap-1.5 rounded-chip bg-ok-soft px-2 py-1 text-[11px] font-medium text-ok-ink">
            <Check className="size-3" /><span className="truncate">Filed to evidence locker · SOC 2 CC7.3</span>
          </p>
        </div>
      </div>
      <Cursor />
    </Frame>
  );
}
