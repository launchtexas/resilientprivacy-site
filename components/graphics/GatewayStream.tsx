"use client";
// Gateway scenes: a stream of inputs runs through one gate. Clean items pass dimmed, review items wait for an analyst,
// caught items get stamped and drop into the log panel below. Server HTML (no JS, reduced motion) is the finished frame;
// in view, a ~7s intro plays, then a calm idle stream that stops offscreen. Chips and log rows are written to the DOM
// directly, so the stream never re-renders React.
import { useEffect, useRef } from "react";
import { ILLUSTRATIVE, cx } from "../ui";
import { SOC_FLOW } from "../charts/data";
import "./gateway.css";

type Kind = "pass" | "review" | "catch";
type Icon = "msg" | "tool" | "bell";
/** A log row: [time, code, text, end]. */
type Row = [string, string, string, string];
type Ev = { kind: Exclude<Kind, "pass">; icon: Icon; text: string; row: Row };
type Tone = "navy" | "critical" | "high" | "ok" | "accent";
type Cfg = {
  title: string;
  label: string;
  app: string;
  inLabel: string;
  outLabel: string;
  gate: string;
  stamp: string;
  review: [verdict: string, initials: string];
  panel: string;
  verdict: Record<Exclude<Kind, "pass">, string>;
  /** Shown on the newest caught row a moment after it lands (SOC: containment). */
  settle?: string;
  stats: [label: string, value: number, tone: Tone, hero?: boolean][];
  /** Intro: the B-track events (review/catch) in order; their rows, newest last, are also the final frame's log. */
  hits: Ev[];
  /** Older log rows (newest first) shown under the oldest hit before the intro, so the log starts full. */
  seed: Pick<Ev, "kind" | "row">[];
  clean: [Icon, string][];
};

const ICON: Record<Icon, string> = {
  msg: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11h.5" />',
  tool: '<path d="M6 4 2.5 8 6 12M10 4l3.5 4-3.5 4" />',
  bell: '<path d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3zM6.5 14h3" />',
};
const svg = (i: Icon) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="gw-ico">${ICON[i]}</svg>`;
const ROWS = 4;
const fmt = (n: number) => n.toLocaleString("en-US");

function Chip({ icon, text, kind, at, stamp }: { icon: Icon; text: string; kind: Kind; at: string; stamp?: string }) {
  return (
    <span className={cx("gw-chip gw-static", `gw-${kind}`, at)}>
      <span className="contents" dangerouslySetInnerHTML={{ __html: svg(icon) }} />
      <span className="truncate">{text}</span>
      {stamp && <span className="gw-stamp">{stamp}</span>}
    </span>
  );
}

function LogRow({ r, kind, cfg }: { r: Row; kind: Exclude<Kind, "pass">; cfg: Cfg }) {
  return (
    <li className="gw-row">
      <span className="gw-time">{r[0]}</span>
      <span className={cx("gw-pill", kind === "catch" ? "gw-pill-catch" : "gw-pill-review")}>{cfg.verdict[kind]}</span>
      <span className="gw-code">{r[1]}</span>
      <span className="min-w-0 flex-1 truncate text-navy-900">{r[2]}</span>
      <span className="gw-end">{r[3]}</span>
    </li>
  );
}

function Stream({ cfg, className }: { cfg: Cfg; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lane = el.querySelector<HTMLElement>(".gw-lane")!;
    const log = el.querySelector<HTMLElement>(".gw-log ul")!;
    const nums = Array.from(el.querySelectorAll<HTMLElement>("[data-n]"));
    let timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0, started = false, a = 0, b = 0;
    let clock = 14 * 3600 + 2 * 60 + 33; // log clock, continues after the newest seeded row
    const later = (ms: number, f: () => void) => timers.push(setTimeout(f, ms));
    const stamp = () => { clock += 3 + (clock % 5); const s = clock; return [s / 3600, (s / 60) % 60, s % 60].map((v) => String(Math.floor(v)).padStart(2, "0")).join(":"); };

    function chip(kind: Kind, icon: Icon, text: string) {
      const c = document.createElement("span");
      c.className = `gw-chip gw-${kind} gw-run`;
      c.innerHTML = svg(icon);
      const t = document.createElement("span"); t.className = "truncate"; t.textContent = text; c.append(t);
      if (kind === "catch") { const s = document.createElement("span"); s.className = "gw-stamp"; s.textContent = cfg.stamp; c.append(s); }
      if (kind === "review") { const s = document.createElement("span"); s.className = "gw-stamp gw-stamp-review"; s.innerHTML = `<span class="gw-av">${cfg.review[1]}</span>${cfg.review[0]}`; c.append(s); }
      c.addEventListener("animationend", (e) => { if (e.target === c) c.remove(); });
      lane.append(c);
    }
    function mk(k: Ev["kind"], r: Row, time: string, cls: string) {
      const li = document.createElement("li");
      li.className = cls;
      const parts: [string, string][] = [["gw-time", time], [cx("gw-pill", k === "catch" ? "gw-pill-catch" : "gw-pill-review"), cfg.verdict[k]], ["gw-code", r[1]], ["min-w-0 flex-1 truncate text-navy-900", r[2]], ["gw-end", r[3]]];
      for (const [c, txt] of parts) { const s = document.createElement("span"); s.className = c; s.textContent = txt; li.append(s); }
      return li;
    }
    function row(ev: Ev) {
      const k = ev.kind, r = ev.row;
      const li = mk(k, r, stamp(), "gw-row gw-new");
      const end = li.lastChild as HTMLElement;
      if (cfg.settle && k === "catch") { end.textContent = cfg.settle; end.classList.add("gw-wait"); later(2200, () => { end.textContent = r[3]; end.classList.remove("gw-wait"); end.classList.add("gw-done"); }); }
      log.prepend(li);
      while (log.children.length > ROWS) log.lastElementChild!.remove();
    }
    // one B-track event: chip now, log row when it lands (catch drops at ~80%, review clears at ~65%)
    const hit = (ev: Ev) => { chip(ev.kind, ev.icon, ev.text); later(ev.kind === "catch" ? 2350 : 2300, () => row(ev)); };
    const clean = () => { const [i, t] = cfg.clean[a++ % cfg.clean.length]; chip("pass", i, t); };

    function count() {
      const t0 = performance.now(), D = 6200;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / D), e = 1 - (1 - p) ** 3;
        nums.forEach((n) => { n.textContent = fmt(Math.round(Number(n.dataset.n) * e)); });
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    // start state, set on mount while the scene is still offscreen: counters at 0, the oldest hit plus the seeded older rows
    function prime() {
      el.dataset.run = "";
      log.replaceChildren(log.lastElementChild!, ...cfg.seed.map((e) => mk(e.kind, e.row, e.row[0], "gw-row")));
      nums.forEach((n) => { n.textContent = "0"; });
    }
    // ~8s: counters run up, clean inputs stream past, the three newest hits play (B events 2700ms apart so they never overlap)
    function intro() {
      count();
      [0, 1100, 2200, 3300, 4400, 5500, 6600].forEach((t) => later(t, clean));
      cfg.hits.slice(1).forEach((ev, i) => later(500 + i * 2700, () => hit(ev)));
      later(8800, idle);
    }
    function idle() {
      el.dataset.idle = "";
      let n = 0;
      const step = () => {
        n++;
        clean();
        if (n % 3 === 2) hit(cfg.hits[b++ % cfg.hits.length]);
        later(1700, step);
      };
      later(1700, step);
    }
    const stop = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => {
      el.dataset.live = e.isIntersecting ? "on" : "off";
      if (e.isIntersecting && e.intersectionRatio >= 0.35) {
        if (!started) { started = true; intro(); }
        else if (!timers.length) idle();
      } else if (!e.isIntersecting && started) {
        stop();
        // finish the counters so a cut-off intro never leaves partial totals
        nums.forEach((n) => { n.textContent = fmt(Number(n.dataset.n)); });
        lane.querySelectorAll(".gw-run").forEach((c) => c.remove());
      }
    }, { threshold: [0, 0.35] });
    prime();
    io.observe(el);
    return () => { io.disconnect(); stop(); };
    // cfg is a module-level constant at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const last = cfg.hits.slice(-ROWS).reverse();
  const caught = cfg.hits.findLast((h) => h.kind === "catch")!;
  return (
    <figure className={cx("min-w-0", className)}>
      <figcaption className="mb-4 block text-[0.9375rem] font-semibold text-navy-950">{cfg.title}</figcaption>
      <div ref={root} data-live="off" role="img" aria-label={cfg.label} className="gw @container">
        <div aria-hidden>
          <div className="gw-bar">
            <span className="min-w-0 truncate font-mono text-[12px] text-navy-500">{cfg.app}</span>
            <span className="gw-live"><span className="gw-dot" />Example data</span>
          </div>
          <dl className="gw-stats">
            {cfg.stats.map(([l, v, tone, hero]) => (
              <div key={l} className="min-w-0">
                <dt className="flex items-center gap-1.5 truncate text-[12px] text-navy-600"><span className={cx("size-1.5 shrink-0 rounded-full", `gw-t-${tone}`)} />{l}</dt>
                <dd data-n={v} className={cx("mt-0.5 text-[1.25rem] leading-7 font-semibold tracking-[-0.02em] tabular-nums @lg:text-[1.375rem]", hero ? "text-accent-ink" : "text-navy-950")}>{fmt(v)}</dd>
              </div>
            ))}
          </dl>
          <div className="gw-lane">
            <span className="gw-lab left-3">{cfg.inLabel}</span>
            <span className="gw-lab right-3">{cfg.outLabel}</span>
            <span className="gw-gate"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="size-4"><path d="M8 1.8 13 3.6v4c0 3.2-2.1 5.4-5 6.6-2.9-1.2-5-3.4-5-6.6v-4z" /><path d="m5.8 8 1.6 1.6 2.9-3.2" strokeLinecap="round" /></svg><span className="gw-gate-l">{cfg.gate}</span></span>
            <Chip kind="pass" icon={cfg.clean[1][0]} text={cfg.clean[1][1]} at="gw-at-in" />
            <Chip kind="pass" icon={cfg.clean[0][0]} text={cfg.clean[0][1]} at="gw-at-out" />
            <Chip kind="catch" icon={caught.icon} text={caught.text} at="gw-at-gate" stamp={cfg.stamp} />
          </div>
          <div className="gw-log">
            <p className="gw-log-h"><span>{cfg.panel}</span><span className="font-normal text-navy-500">Newest first</span></p>
            <ul>{last.map((h) => <LogRow key={h.text} r={h.row} kind={h.kind} cfg={cfg} />)}</ul>
          </div>
        </div>
      </div>
      <div className="sr-only"><table>
        <caption>{cfg.title} ({ILLUSTRATIVE})</caption>
        <thead><tr><th scope="col">Stage</th><th scope="col">Count</th></tr></thead>
        <tbody>{cfg.stats.map(([l, v]) => <tr key={l}><th scope="row">{l}</th><td>{fmt(v)}</td></tr>)}</tbody>
      </table></div>
      <p className="mt-3 text-micro text-navy-500">{ILLUSTRATIVE}</p>
    </figure>
  );
}

const AI: Cfg = {
  title: "From agent input to audit evidence, last 30 days",
  label: "AI gateway: agent prompts and tool calls stream through a guardrail. Clean inputs pass, a tool call waits for human review, and prompt-injection, tool-abuse and data-exfiltration attempts are blocked and logged as audit evidence. Last 30 days: 48,200 inputs screened, 1,340 attack attempts, 1,318 blocked and logged, 22 allowed on review, 46,860 clean.",
  app: "ai-gateway · prod agents",
  inLabel: "Agent inputs",
  outLabel: "Allowed",
  gate: "Guard",
  stamp: "Blocked",
  review: ["Review", "MR"],
  panel: "Audit log",
  verdict: { catch: "Blocked", review: "Allowed" },
  stats: [["Screened", 48200, "navy"], ["Blocked + logged", 1318, "critical", true], ["Human review", 22, "high"], ["Clean", 46860, "ok"]],
  clean: [["msg", "Summarize ticket 4821"], ["tool", "search_kb(\"refund\")"], ["msg", "Draft a reply to Ana"], ["tool", "get_order(77310)"], ["msg", "Translate to Spanish"]],
  hits: [
    { kind: "catch", icon: "msg", text: "Ignore your rules", row: ["14:02:09", "LLM01", "Prompt injection", "Logged"] },
    { kind: "review", icon: "tool", text: "refund($480)", row: ["14:02:16", "LLM06", "Refund over limit", "Logged"] },
    { kind: "catch", icon: "tool", text: "export_all(*)", row: ["14:02:24", "LLM02", "Data exfiltration", "Logged"] },
    { kind: "catch", icon: "msg", text: "Print sys prompt", row: ["14:02:31", "LLM07", "Prompt leak", "Logged"] },
  ],
  seed: [
    { kind: "review", row: ["14:01:52", "LLM06", "Human review", "Logged"] },
    { kind: "review", row: ["14:01:40", "LLM06", "Tool call approved", "Logged"] },
    { kind: "catch", row: ["14:01:31", "LLM01", "Prompt injection", "Logged"] },
  ],
};

const [alerts, triaged, incidents, contained] = SOC_FLOW.stages.map((s) => s.value);
const SOC: Cfg = {
  title: SOC_FLOW.title,
  label: `SOC alert funnel: alerts stream into triage. Noise is auto-closed, an analyst clears a benign alert, and real threats escalate to incidents that are contained within 15 minutes. Last 30 days: ${fmt(alerts)} alerts, ${fmt(triaged)} triaged, ${fmt(incidents)} incidents, ${fmt(contained)} contained.`,
  app: "soc · alert queue",
  inLabel: "Alerts",
  outLabel: "Auto-closed",
  gate: "Triage",
  stamp: "Escalated",
  review: ["Benign", "AK"],
  panel: "Incidents",
  verdict: { catch: "Incident", review: "Benign" },
  settle: "Containing…",
  stats: [["Alerts", alerts, "navy"], ["Triaged", triaged, "accent"], ["Incidents", incidents, "critical"], ["Contained", contained, "ok", true]],
  clean: [["bell", "Failed login · vpn-gw"], ["bell", "New device · LT-0442"], ["bell", "DNS spike · build-07"], ["bell", "AV signature update"], ["bell", "Port scan · edge-fw"]],
  hits: [
    { kind: "catch", icon: "bell", text: "Ransomware · fs-02", row: ["14:02:09", "INC-418", "T1486 Data encrypted · fs-02", "Contained · 9 min"] },
    { kind: "review", icon: "bell", text: "Admin login, new IP", row: ["14:02:16", "AL-9921", "T1078 Admin login · 198.51.100.9", "Closed"] },
    { kind: "catch", icon: "bell", text: "Token theft · idp", row: ["14:02:24", "INC-419", "T1528 OAuth token theft", "Contained · 13 min"] },
    { kind: "catch", icon: "bell", text: "Admin takeover", row: ["14:02:31", "INC-420", "T1098 Admin role added", "Contained · 11 min"] },
  ],
  seed: [
    { kind: "review", row: ["14:01:52", "AL-9917", "T1078 Impossible travel", "Closed"] },
    { kind: "catch", row: ["14:01:40", "INC-417", "T1566.002 Phishing link", "Contained · 12 min"] },
    { kind: "review", row: ["14:01:31", "AL-9910", "T1621 MFA push spam", "Closed"] },
  ],
};

/** /ai-security: agent inputs through the AI gateway, attacks blocked and logged as evidence. */
export const AiGatewayStream = ({ className }: { className?: string }) => <Stream cfg={AI} className={className} />;
/** SOC funnel (SOC_FLOW numbers): alerts triaged, noise auto-closed, incidents escalated and contained. */
export const SocAlertStream = ({ className }: { className?: string }) => <Stream cfg={SOC} className={className} />;
