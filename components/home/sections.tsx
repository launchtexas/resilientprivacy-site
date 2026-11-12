import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Arrow, Badge, Button, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { GradientBorder, Live, Reveal, Spotlight, Stagger } from "@/components/motion";
import { AiAttackSurface, ComplianceRing, FindingsJourney, FindingsTable, SocMap } from "@/components/graphics";
import { KpiTiles, MTTR, TrendChart } from "@/components/charts";
import { Icon as PIcon, type IconName as PIconName } from "@/components/platform/kit";
import "@/components/graphics/graphics.css";
import { POSTS } from "@/components/resources/data";
import { Icon, PLACEHOLDER_NOTE, type IconName } from "./icons";
import { ProcessSteps } from "@/components/motion/ProcessSteps";
import { FINDING, QUARTER } from "@/lib/example";

const more = "group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover";

export { Proof } from "./proof";

/* ---------- Practices: AI Security featured, the other three beside it, operations underneath ---------- */
const PRACTICES: { icon: IconName; name: string; body: string; services: string[]; href: string }[] = [
  { icon: "consult", name: "Offensive Security", body: "Attack your apps, APIs, cloud and people the way a real adversary would, then retest the fix.", services: ["Penetration testing", "Red & purple team", "Application security review"], href: "/consulting/penetration-testing" },
  { icon: "advisory", name: "Security Advisory", body: "Senior judgement on architecture and roadmap, from design review to a part-time CISO.", services: ["Security architecture", "Virtual CISO"], href: "/consulting/architecture" },
  { icon: "grc", name: "Risk & Compliance", body: "SOC 2, ISO 27001, privacy and risk programs built from one control set, evidenced as the work happens.", services: ["SOC 2 · ISO 27001", "Privacy · risk · vendor risk"], href: "/grc" },
];

const SCENES: [ReactNode, string, string, string][] = [
  [<FindingsTable key="f" />, "Offensive Security", "A critical lands, gets an owner, and closes on a passed retest.", "/consulting/penetration-testing"],
  [<ComplianceRing key="c" />, "Risk & Compliance", "Controls collect their own evidence as the work happens.", "/grc"],
];

export function Practices() {
  return (
    <Section tone="mist" labelledBy="practice-title">
      <SectionHeading id="practice-title" eyebrow="Practices" title="Four practices. The same people from first test to final evidence." lead="One named lead scopes the work, the practitioners who test it also fix and govern it, and our operations team keeps it running." />
      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <GradientBorder className="lg:col-span-5 lg:row-span-3">
          <Link href="/ai-security" className="group flex h-full flex-col p-6 lg:p-8">
            <span className="grid size-11 place-items-center rounded-control bg-accent text-white"><Icon name="ai" /></span>
            <Badge tone="accent" className="mt-6 w-fit">New practice</Badge>
            <h3 className="mt-3 text-h2 font-semibold tracking-[-0.025em] text-navy-950">AI Security</h3>
            <p className="mt-3 text-navy-600">Red-team the models, agents, RAG pipelines and MCP tool chains you ship, then govern them under ISO/IEC 42001, the NIST AI RMF and the EU AI Act.</p>
            <CheckList items={["AI red teaming: LLM, agent and MCP testing", "AI governance and EU AI Act readiness", "Secure AI adoption and shadow-AI discovery"]} className="mt-6 flex-1 text-navy-800" />
            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore AI Security <Arrow /></span>
          </Link>
        </GradientBorder>
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7 lg:row-span-3 lg:grid-cols-1">
          {PRACTICES.map((p) => (
            <Spotlight key={p.name} className="h-full rounded-card bg-canvas shadow-card">
              <Link href={p.href} className="group flex h-full flex-col gap-4 p-6 lg:flex-row lg:items-start">
                <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><Icon name={p.icon} /></span>
                <div className="flex-1">
                  <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">{p.name}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-navy-600">{p.body}</p>
                  <p className="mt-3 font-mono text-micro text-navy-500">{p.services.join(" · ")}</p>
                </div>
                <Arrow />
              </Link>
            </Spotlight>
          ))}
        </Stagger>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SCENES.map(([scene, name, line, href]) => (
          <figure key={name} className="min-w-0">
            {scene}
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 text-sm">
              <span className="text-navy-600"><span className="font-semibold text-navy-950">{name}.</span> {line}</span>
              <Link href={href} className="group inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-hover">See the practice<span className="sr-only">: {name}</span> <Arrow /></Link>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
      <Reveal className="mt-4 grid grid-cols-1 gap-4 rounded-card border border-dashed border-line-strong p-5 sm:grid-cols-[auto_1fr_1fr] sm:items-center">
        <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">How the advice stays</p>
        {[["soc", "Managed Services", "24/7 SOC, MDR and NOC turn findings into detections.", "/managed-services"], ["platform", "Platform", "Exposure, API, detection and privacy tooling we run with you.", "/platform"]].map(([i, n, b, h]) => (
          <Link key={n} href={h} className="group flex items-start gap-3 rounded-control p-2 transition-colors hover:bg-canvas">
            <span className="text-accent"><Icon name={i as IconName} /></span>
            <span><span className="block text-sm font-semibold text-navy-950">{n}</span><span className="block text-sm text-navy-600">{b}</span></span>
          </Link>
        ))}
      </Reveal>
    </Section>
  );
}

/* ---------- AI Security deep section ---------- */
const AI_SERVICES = [
  { name: "AI Red Teaming", body: "Prompt and indirect injection, tool and agent abuse, data exfiltration and guardrail retests across LLM apps, agents, RAG and MCP servers.", map: "OWASP LLM Top 10 · MITRE ATLAS", href: "/ai-security/red-teaming" },
  { name: "AI Governance", body: "An AI management system, risk register and impact assessments that one control set can evidence for every framework.", map: "ISO/IEC 42001 · NIST AI RMF · EU AI Act", href: "/ai-security/governance" },
  { name: "Secure AI Adoption", body: "Architecture review, AI usage policy, shadow-AI discovery and data controls for copilots before they reach production data.", map: "NIST AI 600-1 · your data policy", href: "/ai-security/secure-adoption" },
];

export function AiSecurity() {
  return (
    <Section labelledBy="ai-title">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-6">
          <Reveal>
            <Eyebrow>AI Security practice</Eyebrow>
            <h2 id="ai-title" className="mt-4 text-h2 font-semibold tracking-[-0.025em] text-balance text-navy-950">Your AI has an attack surface. We test every edge of it.</h2>
            <p className="mt-4 text-lead text-navy-600">Models read untrusted text, agents call real tools, and retrieval pulls in documents nobody reviewed. We attack that chain end to end, and every finding ships with the governance control it evidences.</p>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-1 gap-3">
            {AI_SERVICES.map((s) => (
              <Link key={s.name} href={s.href} className="group block rounded-card p-4 ring-1 ring-line transition-shadow hover:shadow-card">
                <span className="flex items-center justify-between gap-3 text-base font-semibold text-navy-950">{s.name} <Arrow /></span>
                <span className="mt-1 block text-sm leading-relaxed text-navy-600">{s.body}</span>
                <span className="mt-2 block font-mono text-micro text-accent-ink">{s.map}</span>
              </Link>
            ))}
          </Stagger>
        </div>
        <div className="lg:col-span-6">
          {/* Phones: the scene card sits flat, without the two framing boxes. */}
          <div className="sm:rounded-frame sm:bg-accent-soft sm:p-6 sm:ring-1 sm:ring-accent/10">
            <div className="sm:rounded-panel sm:bg-canvas sm:p-6 sm:shadow-card"><AiAttackSurface /></div>
          </div>
          <p className="mt-3 text-micro text-navy-500">Illustrative attack classes, not client data</p>
          <Link href="/ai-security" className={more}>The AI Security practice <Arrow /></Link>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Test-to-Evidence: one finding travels four stations (reuses the ThreatPipeline loop CSS) ---------- */
const STATIONS = [
  { tag: "Test", title: "Found", body: "Broken object-level authorization exposes other tenants' invoices", meta: `${FINDING.id} · Critical`, tone: "bg-critical" },
  { tag: "Fix", title: "Retested", body: "Ownership check added; our retest confirms the fix", meta: "Retest passed", tone: "bg-ok" },
  { tag: "Detect", title: "Watched", body: "The same technique becomes a SOC detection rule", meta: "Rule live in SOC", tone: "bg-ok" },
  { tag: "Evidence", title: "Proven", body: "Report, retest and rule filed against the control", meta: "SOC 2 CC7.2 ✓", tone: "bg-ok" },
];

const CLOSURE = {
  title: "Findings from report to proof, one quarter",
  board: "findings · Q3 board",
  item: { id: FINDING.id, title: FINDING.title, tag: "Critical", tone: "critical", owner: "JP" },
  stages: [
    { label: "Reported", value: QUARTER.reported },
    { label: "Fixed", value: QUARTER.fixed, stamp: ["pr", "PR #482"] },
    { label: "Retest passed", value: QUARTER.retested, stamp: ["check", "Retest passed"] },
    { label: "Evidence filed", value: QUARTER.retested, stamp: ["file", "SOC 2 CC7.1"] },
  ],
  notes: [["sign", "9 risks accepted in writing", "signed by owner"], ["clock", "2 in fix window", "inside SLA"]],
  others: [
    ["Stored XSS", "Medium"], ["Public S3 bucket", "Low"], ["JWT never expires", "High"],
    ["Session valid after logout", "Medium"], ["Weak TLS ciphers", "Low"], ["SSRF in image proxy", "High"],
    ["Rate limit on /login", "Medium"], ["Server version in headers", "Low"], ["Exposed admin panel", "High"],
    ["CSRF on settings", "Medium"], ["Outdated jQuery", "Low"], ["Secrets in CI logs", "High"],
  ],
  done: "All accounted for",
  label: "One quarter of findings on a board. A critical broken object-level authorization finding moves from Reported to Fixed with PR 482, passes its retest and is filed as SOC 2 CC7.1 evidence. Totals: 142 reported, 133 fixed, 131 retest passed, 131 evidence filed, 9 risks accepted in writing, 2 still in the fix window.",
} satisfies Parameters<typeof FindingsJourney>[0];

export function TestToEvidence() {
  return (
    <Section tone="mist" labelledBy="t2e-title">
      <SectionHeading id="t2e-title" eyebrow="Test-to-Evidence" title="A finding isn't done when the report is." lead="Most firms hand over a PDF. We follow each finding through the fix, into detection, and into your audit file." align="center" />
      <Live className="mt-14" role="img" aria-label="Test to evidence: a critical broken object-level authorization finding is fixed and retested, becomes a SOC detection rule, and is filed as SOC 2 evidence.">
        <div aria-hidden className="relative">
          <div className="absolute left-11 right-[calc(25%-2.75rem)] top-[43px] z-10 hidden h-0.5 overflow-hidden rounded-full bg-line-strong md:block">
            <span className="rp-pipe-packet absolute inset-0 block"><span className="absolute inset-y-0 right-0 w-20 rounded-full bg-linear-to-r from-transparent to-accent" /></span>
          </div>
          <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {STATIONS.map((s, i) => (
              <li key={s.tag} className="rp-pipe-step rounded-card bg-canvas p-5 shadow-card" style={{ "--i": i } as CSSProperties}>
                <span className="relative z-20 flex size-12 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold text-accent-ink ring-4 ring-canvas">0{i + 1}</span>
                <p className="mt-4 font-mono text-micro tracking-[0.08em] text-accent-ink uppercase">{s.tag}</p>
                <p className="mt-1 text-h3 font-semibold tracking-[-0.015em] text-navy-950">{s.title}</p>
                <p className="mt-1.5 text-sm text-pretty text-navy-600">{s.body}</p>
                <p className="mt-3 flex items-center gap-1.5 font-mono text-micro text-navy-500"><span className={`size-1.5 rounded-full ${s.tone}`} />{s.meta}</p>
              </li>
            ))}
          </ol>
        </div>
      </Live>
      <p className="mt-3 text-center text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
      <div className="mt-12 grid grid-cols-1 items-start gap-8 rounded-panel bg-canvas p-5 shadow-card sm:p-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-4">
          <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">Where a quarter's findings end up.</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Every finding is tracked to one of two ends: a passed retest filed as evidence, or a risk your owner accepted in writing. Nothing stays in a PDF.</p>
        </Reveal>
        <FindingsJourney className="lg:col-span-8" {...CLOSURE} />
      </div>
    </Section>
  );
}

/* ---------- Outcomes: one example engagement, framed as sample data, never as RP's own results ---------- */
// Sample numbers; they match the findings board above (142 reported, 9 risk accepted).
const EXAMPLE_KPIS = [
  { label: "Findings fixed and retested", value: QUARTER.fixed, good: true, delta: `of ${QUARTER.reported} reported` },
  { label: "Median time to remediate", value: 6.5, decimals: 1, suffix: "h", delta: "down from 38h in month one", good: true },
  { label: "Controls with live evidence", value: 94, suffix: "%", delta: "+22 pts vs the previous audit", good: true },
  { label: "Risks accepted in writing", value: 9, delta: "each signed by its owner", good: true },
];

export function Outcomes() {
  return (
    <Section labelledBy="out-title">
      <SectionHeading id="out-title" eyebrow="Example engagement" title="Measured in fixes, not in findings." lead="What a security lead sees each week once an engagement is running: what got fixed, how fast, and what is proven. The numbers below are sample data from an illustrative engagement, not client results." />
      <KpiTiles items={EXAMPLE_KPIS} className="mt-10" />
      <div className="mt-4 grid grid-cols-1 items-start gap-8 rounded-panel bg-mist p-5 sm:p-8 lg:grid-cols-12 lg:gap-12">
        <TrendChart className="min-w-0 lg:col-span-8" {...MTTR} target={{ label: "Example target 8h", value: 8 }} />
        <Reveal className="lg:col-span-4">
          <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">Criticals close inside the agreed target.</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Testers pair with your engineers on each fix and retest it the same week, so time to remediate falls month over month until it sits under the target. Your targets are agreed in your statement of work (SOW).</p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Managed (navy): mechanism, no invented numbers ---------- */
export function Managed() {
  return (
    <Section tone="navy" labelledBy="ms-title">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-5">
          <Eyebrow className="text-accent-on-dark">Managed SOC · MDR · NOC</Eyebrow>
          <h2 id="ms-title" className="mt-4 text-h2 font-semibold tracking-[-0.025em] text-balance">The fix stays fixed because someone is watching.</h2>
          <p className="mt-4 text-lead text-navy-300">Our analysts monitor around the clock with detections built from what our testers found in your environment. They contain threats under playbooks you approve, and you see every action they take.</p>
          <CheckList items={["Detections seeded from your own pentest and red-team findings", "Containment under pre-agreed playbooks", "Named lead analyst and monthly reviews"]} className="mt-6 text-navy-300 [&_svg]:text-accent-on-dark" />
          <Button href="/managed-services" variant="inverse" className="mt-8">Explore managed services <Arrow /></Button>
        </Reveal>
        <div className="lg:col-span-7">
          <SocMap />
          <p className="mt-3 text-micro text-navy-400">{PLACEHOLDER_NOTE}</p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Platform: supporting, compact ---------- */
/** Card micro-state on hover/focus: `a` fades out, then `b` fades in, in one grid cell (no overlap, no reflow). */
function Flip({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <span className="rp-stack justify-items-start">
      <span className="transition-opacity delay-150 duration-(--duration-fast) group-hover:opacity-0 group-hover:delay-0 group-focus-visible:opacity-0 group-focus-visible:delay-0">{a}</span>
      <span className="opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 group-hover:delay-150 group-focus-visible:opacity-100 group-focus-visible:delay-150">{b}</span>
    </span>
  );
}
const row = "block truncate font-mono text-micro text-navy-700";
// [name, body, href, icon, a one-row crop of the product that changes state on hover]
const PRODUCTS: [string, string, string, PIconName, ReactNode][] = [
  ["APIWall", "API Protection · Inventory from live traffic, auth testing, inline blocking.", "/platform/api-protection", "api",
    <><span className={row}>GET /v2/admin/users</span><Flip a={<Badge>shadow endpoint</Badge>} b={<Badge tone="critical" dot>no auth · flagged</Badge>} /></>],
  ["ReachMap", "Exposure Management · External attack surface ranked by reachability.", "/platform/exposure-management", "radar",
    <><svg viewBox="0 0 120 16" className="block h-4 w-full max-w-30" fill="none">
      <path d="M6 8 L60 4 L114 12" stroke="currentColor" strokeWidth="1.5" className="text-line" />
      <path d="M6 8 L60 4 L114 12" stroke="currentColor" strokeWidth="2" className="text-critical [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-700 ease-(--ease-out) group-hover:[clip-path:inset(0)] group-focus-visible:[clip-path:inset(0)]" />
      {[[6, 8], [60, 4], [114, 12]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.5" fill="currentColor" className="text-navy-700" />)}
    </svg><Flip a={<Badge>3 assets</Badge>} b={<Badge tone="critical" dot>1 reachable path</Badge>} /></>],
  ["AlertRank", "Threat Detection · Correlated incidents with timelines, handed to our SOC.", "/platform/threat-detection", "eye",
    <><span className={row}>CASE-8812 · lateral move</span><Flip a={<Badge tone="medium" dot>Investigating</Badge>} b={<Badge tone="ok" dot>Contained</Badge>} /></>],
  ["PrivacyFlow", "Privacy Automation · Data discovery, live data map and DSAR workflows.", "/platform/privacy-automation", "lock",
    <><span className={row}>DSAR-0217 · access</span><Flip a={<Badge tone="medium" dot>Due in 9d</Badge>} b={<Badge tone="ok" dot>Sent · day 6</Badge>} /></>],
];

export function Platform() {
  return (
    <Section labelledBy="pf-title">
      <SectionHeading id="pf-title" eyebrow="Platform" title="Our own tooling, so findings never fall out of view." lead="The console our consultants and SOC analysts work in, and you can too. Use it with an engagement or on its own." />
      <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map(([n, b, h, icon, crop]) => (
          <Spotlight key={n} className="h-full rounded-card bg-canvas shadow-card">
            <Link href={h} className="group flex h-full flex-col p-6">
              <span aria-hidden className="mb-5 flex h-16 items-center gap-3 rounded-control bg-mist px-3 ring-1 ring-line">
                <span className="grid size-9 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><PIcon name={icon} /></span>
                <span className="grid min-w-0 flex-1 gap-1">{crop}</span>
              </span>
              <h3 className="text-base font-semibold text-navy-950">{n}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-navy-600">{b}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Learn more<span className="sr-only"> about {n}</span> <Arrow /></span>
            </Link>
          </Spotlight>
        ))}
      </Stagger>
    </Section>
  );
}

/* ---------- Research: the three newest real posts ---------- */
export function Research() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <Section tone="mist" labelledBy="rs-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="rs-title" eyebrow="Resilient Privacy Research" title="Notes from the practice." />
        <Link href="/resources/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">All research <Arrow /></Link>
      </div>
      <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/resources/blog/${p.slug}`} className="group flex h-full flex-col rounded-card bg-canvas p-6 shadow-card transition-shadow hover:shadow-lift">
            <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{p.category} · <time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></p>
            <h3 className="mt-3 text-h3 font-semibold tracking-[-0.015em] text-balance text-navy-950">{p.title}</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-600">{p.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Read<span className="sr-only">: {p.title}</span> <Arrow /></span>
          </Link>
        ))}
      </Stagger>
    </Section>
  );
}

/* ---------- How we work ---------- */
export function HowWeWork() {
  const steps = [
    ["Scope", "A short call and a written scope: assets, objectives, frameworks, team and timeline. No surprises later.", "Written scope"],
    ["Test", "Practitioners attack the systems and the AI in scope. Critical findings reach you the day we confirm them.", "Same-day critical alert"],
    ["Fix", "We pair with your engineers on the fix, then retest it inside the agreed retest window.", "Retest result"],
    ["Prove", "Findings become detections and evidence, mapped to the controls your auditors and customers ask about.", "Mapped evidence"],
  ] as const;
  return (
    <Section labelledBy="how-title">
      <SectionHeading id="how-title" eyebrow="How we work" title="From first call to audit-ready." align="center" />
      <ProcessSteps steps={steps} className="mt-14" />
      <p className="mt-8 text-center"><Link href="/consulting/how-we-work" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Our method and engagement models <Arrow /></Link></p>
    </Section>
  );
}
