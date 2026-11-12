import { Live } from "../motion/client";
import { Chip } from "./kit";

const EVENTS = [
  { sev: "bg-critical", t: "Ransomware precursor", where: "fin-db-02 · EMEA", out: ["Escalated", "darkaccent"] },
  { sev: "bg-high", t: "Credential stuffing", where: "login · AMER", out: ["Blocked", "darkok"] },
  { sev: "bg-medium", t: "Phishing kit hosted", where: "lookalike domain", out: ["Takedown", "dark"] },
  { sev: "bg-accent-on-dark", t: "C2 beaconing", where: "build-07 · APAC", out: ["Contained", "darkok"] },
  { sev: "bg-high", t: "Exposed RDP", where: "203.0.113.4 · EMEA", out: ["Closed", "darkok"] },
] as const;
const STATS = [["Escalated today", "6"], ["Median triage", "4 min"], ["On shift", "EMEA → AMER"]];

/** Live SOC console: triaged events stream in (one new row every 2.4s, loop paused offscreen), each with its outcome. */
export function SocMap({ className }: { className?: string }) {
  const row = (e: (typeof EVENTS)[number], k: string) => (
    <li key={k} className="flex h-12 items-center gap-2.5 border-b border-white/5 px-1">
      <span className={`size-2 shrink-0 rounded-full ${e.sev}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-white">{e.t}</span>
        <span className="block truncate font-mono text-micro text-navy-400">{e.where}</span>
      </span>
      <Chip tone={e.out[1]} className="shrink-0">{e.out[0]}</Chip>
    </li>
  );
  return (
    <Live className={`@container overflow-hidden rounded-panel bg-navy-950 shadow-window ring-1 ring-white/10 ${className ?? ""}`} role="img" aria-label="Live SOC console: events such as a ransomware precursor, credential stuffing, a phishing kit, C2 beaconing and exposed RDP arrive around the clock and are each escalated, blocked or contained by the security operations centre.">
      <div aria-hidden className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 @md:px-5">
        <span className="flex items-center gap-2 font-mono text-micro tracking-[0.08em] text-white uppercase">
          <span className="pulse-dot size-2 rounded-full bg-accent-on-dark" /> SOC · live
        </span>
        <span className="truncate font-mono text-micro text-navy-300">24/7 · follow-the-sun</span>
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
