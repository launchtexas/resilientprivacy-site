import { Live } from "../motion/client";
import { Chip } from "./kit";
import { MockBrand } from "../mockup";
import { INCIDENT } from "@/lib/example";

// SIEM incident queue rows: [severity dot, time UTC, rule, ATT&CK technique, entity, status, chip tone]. Example data.
const EVENTS = [
  { sev: "bg-critical", time: "02:14:06Z", t: "Shadow copies deleted", tid: "T1490", where: "fs-02.internal", out: ["Escalated", "darkaccent"] },
  { sev: "bg-high", time: "02:11:52Z", t: "Sign-in from new country", tid: "T1078.004", where: `${INCIDENT.user} · ${INCIDENT.srcIp}`, out: ["Contained", "darkok"] },
  { sev: "bg-high", time: "02:09:30Z", t: "Password spray on VPN", tid: "T1110.003", where: "vpn-gw-01 · 198.51.100.23", out: ["Blocked", "darkok"] },
  { sev: "bg-medium", time: "01:58:14Z", t: "Lookalike domain registered", tid: "T1583.001", where: "examp1e-corp.com", out: ["Takedown", "dark"] },
  { sev: "bg-high", time: "01:47:03Z", t: "Beaconing to new domain", tid: "T1071.001", where: "build-07.internal", out: ["Isolated", "darkok"] },
] as const;
// Same open-case count and median triage as the managed OpsConsole.
const STATS = [["Open", "14"], ["Unassigned", "3"], ["Median triage", "6 min"]];

/** Live SOC console: triaged events stream in (one new row every 2.4s, loop paused offscreen), each with its outcome. */
export function SocMap({ className }: { className?: string }) {
  const row = (e: (typeof EVENTS)[number], k: string) => (
    <li key={k} className="flex h-12 items-center gap-2.5 border-b border-white/5 px-1">
      <span className={`size-2 shrink-0 rounded-full ${e.sev}`} />
      <span className="hidden w-[4.5rem] shrink-0 font-mono text-micro text-navy-400 tabular-nums @md:block">{e.time}</span>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-[13px] font-medium text-white">{e.t}</span>
          <span className="shrink-0 font-mono text-[10px] text-navy-400">{e.tid}</span>
        </span>
        <span className="block truncate font-mono text-micro text-navy-400">{e.where}</span>
      </span>
      <Chip tone={e.out[1]} className="shrink-0">{e.out[0]}</Chip>
    </li>
  );
  return (
    <Live className={`@container overflow-hidden rounded-panel bg-navy-950 shadow-window ring-1 ring-white/10 ${className ?? ""}`} role="img" aria-label="Example SIEM incident queue: shadow-copy deletion, a sign-in from a new country, a VPN password spray, a lookalike domain and beaconing, each tagged with its MITRE ATT&CK technique and escalated, contained, blocked or taken down. Example data.">
      <div aria-hidden className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 @md:px-5">
        <MockBrand dark nameClass="hidden @md:inline" />
        <span className="mr-auto flex shrink-0 items-center gap-2 font-mono text-micro tracking-[0.08em] whitespace-nowrap text-white uppercase">
          <span className="pulse-dot size-2 rounded-full bg-accent-on-dark" /> siem · incident queue
        </span>
        <span className="truncate font-mono text-micro text-navy-400">2026-11-03 UTC · example data</span>
      </div>
      <div aria-hidden className="grid gap-4 p-4 @md:px-5 @xl:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="rp-feed h-60 overflow-hidden">
          <ul className="rp-feed-track">
            {EVENTS.map((e) => row(e, e.t))}
            {EVENTS.map((e) => row(e, `${e.t}-2`))}
          </ul>
        </div>
        <dl className="grid grid-cols-3 gap-2 @xl:grid-cols-1 @xl:content-start">
          {STATS.map(([k, v]) => (
            <div key={k} className="min-w-0 rounded-control bg-white/5 px-3 py-2.5">
              <dt className="font-mono text-micro leading-tight text-navy-400">{k}</dt>
              <dd className="mt-0.5 text-sm leading-tight font-semibold text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Live>
  );
}
