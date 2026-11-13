import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Tabs } from "@/components/Tabs";
import { Arrow, Card, CheckList, Section, SectionHeading } from "@/components/ui";
import { Faq, Icon, MetricsBand, PageHero, PLACEHOLDER_NOTE, ProofBand, type IconName } from "@/components/managed/kit";
import { Sparklines, SOC_SPARKS } from "@/components/charts";
import { Reveal, Stagger } from "@/components/motion";
import { SocAlertStream, SocMap, ThreatPipeline } from "@/components/graphics";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { FinalCta } from "@/components/sections";
import { HuntConsole, IrConsole, MdrConsole, NocConsole, OpsConsole, SocConsole } from "@/components/managed/mockups";
import { ProcessSteps } from "@/components/motion/ProcessSteps";

const DESC = "Managed SOC, MDR, NOC and incident response from a cybersecurity and AI security consultancy. What our testers prove, our analysts watch for, 24/7.";

export const metadata: Metadata = {
  title: "Managed SOC, MDR and NOC",
  description: DESC,
};

/* ---------- offerings ---------- */
const OFFERINGS: { icon: IconName; name: string; body: string; href: string }[] = [
  { icon: "shield", name: "Managed detection & response", body: "24/7 monitoring with hands-on containment, not just alerts.", href: "/managed-services/mdr" },
  { icon: "eye", name: "Managed SOC", body: "We run your SIEM and tune detections so analysts see what matters.", href: "/managed-services/soc" },
  { icon: "identity", name: "Identity & cloud response", body: "Stolen sessions, risky permissions and cloud misuse, handled across your providers. Part of MDR.", href: "/managed-services/mdr" },
  { icon: "siren", name: "Incident response & forensics", body: "A retainer with named responders, so the first call is not the first conversation.", href: "/managed-services/incident-response" },
  { icon: "network", name: "Managed NOC", body: "Network monitoring, patching and change control, with clear uptime reporting.", href: "/managed-services/noc" },
  { icon: "search", name: "Threat hunting & intelligence", body: "Analysts look for what automated rules missed, then turn it into detections.", href: "/managed-services/threat-hunting" },
];

function Offerings() {
  return (
    <Section tone="mist" labelledBy="off-title">
      <Reveal><SectionHeading id="off-title" eyebrow="What we run" title="Six services, one operations team." lead="Buy one, or combine them. Every service shares the same analysts, case system and reporting, and the same consultants behind them." /></Reveal>
      <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OFFERINGS.map((o) => (
          <div key={o.name}>
            <Link href={o.href} className="group block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon name={o.icon} /></span>
                <h3 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{o.name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{o.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Learn more <Arrow /></span>
              </Card>
            </Link>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}

/* ---------- showcase ---------- */
function Pane({ title, body, points, href, children }: { title: string; body: string; points: string[]; href: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4 lg:pt-10">
        <h3 className="text-h3 font-semibold tracking-[-0.015em]">{title}</h3>
        <p className="mt-3 text-navy-600">{body}</p>
        <CheckList items={points} className="mt-6 text-navy-800" />
        <Link href={href} className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Learn more<span className="sr-only"> about {title}</span> <Arrow /></Link>
      </div>
      <div className="lg:col-span-8">
        {children}
        <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
      </div>
    </div>
  );
}

function Showcase() {
  const items = [
    { label: "MDR", icon: <Icon name="shield" className="size-4" />, content: (
      <Pane title="From detection to contained in minutes" body="Analysts confirm the threat, act under your playbook and write it up the same day." points={["Pre-approved response actions", "Full timeline for every case", "Call-out for anything critical"]} href="/managed-services/mdr"><MdrConsole /></Pane>
    ) },
    { label: "SOC", icon: <Icon name="eye" className="size-4" />, content: (
      <Pane title="Fewer alerts, better ones" body="Weekly tuning removes noise, so the alerts that reach an analyst are worth their time." points={["SIEM run and maintained for you", "Rules mapped to MITRE ATT&CK", "Log source health checks"]} href="/managed-services/soc"><SocConsole /></Pane>
    ) },
    { label: "NOC", icon: <Icon name="network" className="size-4" />, content: (
      <Pane title="Uptime you can report on" body="Sites, devices and links watched around the clock, with patching and changes in agreed windows." points={["Monitoring for every site and link", "Change control with rollback plans", "Monthly uptime and capacity reports"]} href="/managed-services/noc"><NocConsole /></Pane>
    ) },
    { label: "Hunting", icon: <Icon name="search" className="size-4" />, content: (
      <Pane title="Hunts with a written outcome" body="Each hunt starts from a hypothesis and ends with findings, new detections or logging fixes." points={["Hypotheses from current intelligence", "Findings escalated straight to response", "Every hunt leaves a new detection"]} href="/managed-services/threat-hunting"><HuntConsole /></Pane>
    ) },
    { label: "Response", icon: <Icon name="siren" className="size-4" />, content: (
      <Pane title="Responders already on retainer" body="When something big happens, a team that knows your environment takes command and preserves evidence." points={["24/7 response from named responders", "Forensics with chain of custody", "Reports fit for counsel and insurers"]} href="/managed-services/incident-response"><IrConsole /></Pane>
    ) },
  ];
  return (
    <Section labelledBy="show-title">
      <Reveal><SectionHeading id="show-title" eyebrow="Inside the console" title="Every action, visible to you." lead="You see the same cases, timelines and reports our analysts work from. Nothing happens in a black box." /></Reveal>
      <Reveal><Tabs items={items} auto={7000} className="mt-10" listClassName="w-fit max-w-full" /></Reveal>
    </Section>
  );
}

/* ---------- advice that stays: consulting feeds detection ---------- */
function AdviceThatStays() {
  return (
    <ProofBand
      eyebrow="Advice that stays"
      title="Every red-team finding becomes a detection here."
      lead="Managed services are the run-it-for-you side of our consultancy. The techniques our testers prove against your estate are the ones our analysts watch for."
      points={[
        "Pentest and red-team techniques are written up as detections and replayed to prove they fire.",
        "AI-assisted triage groups, enriches and summarizes alerts. A named analyst makes every decision, and each one is logged.",
        "Closed cases flow into the audit file as evidence for SOC 2 and ISO 27001 controls.",
      ]}
      graphic={<ThreatPipeline />}
    />
  );
}

/* ---------- how an engagement starts: steps beside the SOC map (the page's one dark panel) ---------- */
/* ---------- the measures every client sees monthly ---------- */
function Measured() {
  return (
    <MetricsBand
      tone="mist"
      eyebrow="Measured, not promised"
      title="Noise in. Contained incidents out."
      lead="Tuning and triage turn thousands of alerts into a short list of real incidents, and every one is tracked to containment. Your monthly review shows these same charts for your estate."
      charts={[<SocAlertStream key="f" />, <Sparklines key="s" {...SOC_SPARKS} />]}
    />
  );
}

function Onboarding() {
  const steps = [
    ["Scope", "We agree what is covered, who to call, and which actions analysts may take without asking.", "Escalation runbook"],
    ["Connect", "Log sources, EDR and network devices are connected and checked for gaps.", "Log-source gap list"],
    ["Tune", "A baselining period removes noise and fits detections to how your business runs.", "Tuned detections"],
    ["Operate", "Full 24/7 coverage, a named lead and the first monthly review.", "First monthly review"],
  ] as const;
  return (
    <Section tone="mist" labelledBy="onb-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal><SectionHeading id="onb-title" eyebrow="Getting started" title="Live in weeks, not quarters." lead="Fully managed or co-managed with your team. Onboarding time is set out in your SOW." /></Reveal>
          <ProcessSteps steps={steps} className="mt-8" />
        </div>
        <figure className="lg:col-span-7">
          <OpsConsole />
          <figcaption className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</figcaption>
        </figure>
      </div>
    </Section>
  );
}

/* ---------- the other three divisions ---------- */
const DIVISIONS: { icon: IconName; kicker: string; name: string; body: string; href: string }[] = [
  { icon: "consult", kicker: "Offensive", name: "Security Consulting", body: "Penetration tests and red teams that check whether the SOC would catch a real attacker.", href: "/consulting" },
  { icon: "shield", kicker: "AI", name: "AI Security", body: "AI red teaming and governance; prompt-injection and agent abuse patterns feed straight into detections.", href: "/ai-security" },
  { icon: "grc", kicker: "Compliance", name: "Risk & Compliance", body: "Monitoring records and case reports turned into evidence for SOC 2, ISO 27001 and more.", href: "/grc" },
  { icon: "platform", kicker: "Software", name: "Security Platform", body: "The console our analysts work in, available to your team too.", href: "/platform" },
];

function OtherDivisions() {
  return (
    <Section labelledBy="div-title">
      <Reveal><SectionHeading id="div-title" eyebrow="Works with" title="Part of one accountable team." lead="Managed services connect to the rest of Resilient Privacy, so findings, fixes and evidence move without hand-offs." /></Reveal>
      <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DIVISIONS.map((d) => (
          <div key={d.name}>
            <Link href={d.href} className="group block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon name={d.icon} /></span>
                <p className="mt-6 font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{d.kicker}</p>
                <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em]">{d.name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{d.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
              </Card>
            </Link>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}

const FAQ: [string, string][] = [
  ["Which tools do you support?", "We work with your existing SIEM and EDR stack. Clients commonly run tools such as Microsoft Sentinel, Splunk, CrowdStrike or SentinelOne, alongside their identity and cloud platforms. We confirm yours at scoping."],
  ["What are your response times?", "Critical: under 15 minutes, 24/7. High: within 1 hour. Medium: within 4 business hours. Low: in the monthly report. We report against these every month."],
  ["How do you use AI in the SOC?", "AI groups related alerts, enriches them and drafts a summary with a suggested next step. An analyst reviews every one and makes the call; response actions run only under playbooks you approved."],
  ["Is it really 24/7?", "Yes. Follow-the-sun analyst teams in the USA and India are on shift around the clock, not on call from home."],
  ["Where do you work?", "We are headquartered in the USA, our main hub, and deliver remotely to clients in 15+ countries. Our analysts and support team work from the USA and India."],
  ["Can you work with our in-house team?", "Yes. Co-managed is common: you keep the work you want and we cover the rest, in the same queue."],
  ["What happens during an incident?", "We contain first, tell you what we did, then run the investigation and write it up."],
];

export default function Page() {
  return (
    <>
      <JsonLd data={[service({ name: "Managed security services", description: DESC, path: "/managed-services", type: "ProfessionalService", serviceType: "Managed detection and response" }), breadcrumbs([["Home", "/"], ["Managed Services", "/managed-services"]])]} />
      <PageHero
        crumb={false}
        center
        kind="practice"
        eyebrow="Managed SOC · MDR · NOC · IR"
        title={<>Security operations run by the people <span className="text-accent">who tested you.</span></>}
        lead="The run-it-for-you side of our consultancy. What our testers prove an attacker could do, our analysts watch for around the clock, and report in plain language."
        note="24/7 coverage without hiring a night shift. Critical incidents answered in under 15 minutes."
      >
        <SocMap className="mx-auto max-w-5xl" />
      </PageHero>
      <Offerings />
      <Showcase />
      <Measured />
      <AdviceThatStays />
      <Onboarding />
      <OtherDivisions />
      <Faq items={FAQ} tone="mist" />
      <FinalCta kind="practice" title="See what your operations center would look like." lead="A 30-minute call with an analyst lead, scoped to your environment and the findings you already have." />
    </>
  );
}
