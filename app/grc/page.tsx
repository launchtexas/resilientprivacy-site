import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CTA } from "@/lib/nav";
import { Tabs } from "@/components/Tabs";
import { Reveal, Spotlight, Stagger, TabUnderline } from "@/components/motion";
import { GrcCrosswalk } from "@/components/graphics";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { Arrow, Badge, Button, Card, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { AppWindow, AreaChart, DataTable, Legend, Panel, ScoreRing, StatTile } from "@/components/mockup";
import { GRC } from "@/components/grc/data";
import { CtaButtons, FinalCta } from "@/components/sections";
import { AI_GOV, ControlMockup, Faq, GRC_CTA, PLACEHOLDER_NOTE } from "@/components/grc/ServicePage";

const DESCRIPTION = "The Risk & Compliance practice: SOC 2, ISO 27001, privacy, risk, vendor and AI governance on one control set, with evidence from the security work.";

export const metadata: Metadata = {
  title: "Risk & Compliance",
  description: DESCRIPTION,
};

/* ====================================================================== */
function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
      <div className="container-rp relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Risk & Compliance practice</Eyebrow>
          <h1 id="hero-title" className="mt-5 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">
            Pass the audit. <span className="text-accent">Keep the trust.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lead text-navy-600 text-pretty">
            The compliance arm of a cybersecurity and AI security consultancy. Readiness, audit support and AI governance built on one control set, with evidence that comes from our testing and SOC work, not from a scramble before fieldwork.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaButtons kind="practice" />
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-[1120px] lg:mt-20">
          <div aria-hidden className="absolute -inset-x-6 -top-6 bottom-12 rounded-[32px] bg-gradient-to-b from-accent-soft to-transparent" />
          <GrcCrosswalk className="relative" />
          <p className="mt-3 text-center text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
        </div>
      </div>
    </section>
  );
}

/* ====================================================================== */
function WorkOnce() {
  return (
    <Section tone="mist" labelledBy="once-title">
      {/* The hero crosswalk already shows the mapping, so this band is copy only (no second visual). */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <SectionHeading id="once-title" eyebrow="One control set" title="Do the work once. Prove it to every auditor." lead="One unified set of controls, mapped clause by clause, so a fix made for SOC 2 is credited to ISO 27001, NIST CSF and HIPAA the same day." />
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6 lg:pt-8">
          <CheckList className="text-navy-800" items={["Each control written once, cross-mapped to every framework in scope", "Gaps ranked by how many frameworks a single fix closes", "Evidence tagged once and reused by each auditor"]} />
        </Reveal>
      </div>
    </Section>
  );
}

/* ====================================================================== */
const AI_FRAMEWORKS: [string, string, string][] = [
  ["ISO/IEC 42001", "AI management system", "Built as an extension of your ISO 27001 ISMS: AI policy, risk and impact assessments, supplier oversight."],
  ["NIST AI RMF", "Govern · Map · Measure · Manage", "An AI risk register and controls aligned to the four functions and the generative AI profile (NIST AI 600-1)."],
  ["EU AI Act", "Readiness, not guesswork", "Role and risk classification per system, then the documentation each tier needs. Phased obligations; dates confirmed at engagement."],
];

function AiGovernance() {
  return (
    <Section tone="mist" labelledBy="aigov-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <SectionHeading id="aigov-title" eyebrow="AI governance" title="AI frameworks on the same control set." lead="Run with our AI Security practice, so the red team that tests your models also writes the evidence your governance framework asks for." />
        </div>
        <Link href={AI_GOV} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-accent">AI governance practice <Arrow /></Link>
      </div>
      <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {AI_FRAMEWORKS.map(([name, kicker, body]) => (
          <Link key={name} href={AI_GOV} className="group block h-full rounded-card">
            <Spotlight className="flex h-full flex-col rounded-card bg-canvas p-6 shadow-card">
              <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{kicker}</p>
              <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em] text-navy-950">{name}</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{body}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
            </Spotlight>
          </Link>
        ))}
      </Stagger>
    </Section>
  );
}

/* ====================================================================== */
const OFFERINGS: { slug: string; kicker: string; body: string; tags: string[] }[] = [
  { slug: "soc-2", kicker: "Attestation readiness", body: "Scoping, gap assessment, controls, evidence and auditor coordination through the final report.", tags: ["Type I", "Type II"] },
  { slug: "iso-27001", kicker: "Certification readiness", body: "An ISMS fitted to how you work, an internal audit and support through Stage 1 and 2.", tags: ["27001:2022", "Annex A"] },
  { slug: "privacy", kicker: "Privacy programs", body: "Data maps, records of processing, DPIAs (AI features included), data subject requests and virtual DPO support.", tags: ["GDPR", "CCPA"] },
  { slug: "risk-assessment", kicker: "Risk", body: "Realistic loss scenarios, AI risk included, rated against your controls and quantified for budget decisions.", tags: ["ISO 27005", "NIST"] },
  { slug: "vendor-risk", kicker: "Third parties", body: "Tiering, right-sized assessments, AI vendor due diligence, contract terms and monitoring after the deal closes.", tags: ["TPRM", "AI vendors"] },
  { slug: "internal-audit", kicker: "Assurance", body: "Independent testing of control design and operation, with findings your auditors can rely on.", tags: ["ITGC", "AI controls"] },
  { slug: "frameworks", kicker: "Everything else", body: "One unified control set mapped to industry, government, EU and AI frameworks.", tags: ["HIPAA", "PCI DSS", "NIST", "CMMC", "DORA", "NIS2"] },
];

function Offerings() {
  return (
    <Section labelledBy="off-title">
      <SectionHeading id="off-title" eyebrow="Services" title="Every framework your buyers name, under one practice." lead="Start with the one a customer asked for. We map it to the rest, so the second framework reuses the work of the first." />
      <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OFFERINGS.map((o) => (
            <Link key={o.slug} href={`/grc/${o.slug}`} className="group block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{o.kicker}</p>
                <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em]">{GRC[o.slug].name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{o.body}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">{o.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
              </Card>
            </Link>
        ))}
          <Card className="flex h-full flex-col bg-navy-950 p-6 text-white">
            <p className="font-mono text-micro tracking-[0.08em] text-navy-400 uppercase">Ongoing</p>
            <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em]">Continuous compliance</h3>
            <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-300">Evidence collected automatically, reviewed every quarter and ready when audit season arrives.</p>
            <Link href={CTA.expert.href} className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-on-dark">{CTA.expert.label} <Arrow /></Link>
          </Card>
      </Stagger>
    </Section>
  );
}

/* ====================================================================== */
function Pane({ title, body, points, children }: { title: string; body: string; points: string[]; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-4">
        <h3 className="text-h3 font-semibold tracking-[-0.015em]">{title}</h3>
        <p className="mt-3 text-navy-600">{body}</p>
        <CheckList items={points} className="mt-6 text-navy-800" />
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
    {
      label: "Readiness",
      content: (
        <Pane title="Gaps ranked by audit risk" body="Every control mapped to the criteria, with owners and the shortest path to green." points={["Gap assessment in weeks, not quarters", "Owners and due dates on every gap", "One fix credited to every framework it satisfies"]}>
          <ControlMockup m={GRC["soc-2"].mockup} label="SOC 2 readiness dashboard with controls passing, evidence collected, progress by criteria and a control list with status." />
        </Pane>
      ),
    },
    {
      label: "Evidence",
      content: (
        <Pane title="Evidence that collects itself" body="Integrations pull configuration, tickets and logs on a schedule, so evidence is current the day the auditor asks." points={["Pulled from cloud, identity, HR and ticketing", "Freshness tracked per control", "Our SOC and testers add their records as they work"]}>
          <AppWindow title="Evidence · library" label="Evidence library showing items collected per week and a table of evidence items with source and freshness.">
            <div className="grid grid-cols-1 gap-3 bg-mist p-4 md:grid-cols-3">
              <Panel title="Evidence freshness" className="flex flex-col items-center md:items-stretch">
                <div className="flex justify-center py-2"><ScoreRing value={94} label="% current" /></div>
                <p className="text-center text-xs text-navy-500">9 items expire in 14 days</p>
              </Panel>
              <Panel title="Items collected" action={<Legend items={[["bg-accent", "Automated"], ["bg-navy-300", "Manual"]]} />} className="md:col-span-2">
                <AreaChart data={[40, 52, 61, 70, 76, 84, 91, 98, 104, 112, 118, 126]} compare={[30, 28, 26, 25, 22, 20, 18, 17, 15, 14, 12, 11]} labels={["Jul", "Aug", "Sep", "Oct", "Nov"]} />
              </Panel>
              <Panel title="Recent evidence" className="md:col-span-3">
                <DataTable
                  columns={["Evidence", "Source", "Control", "Status"]}
                  rows={[
                    ["MFA policy export", "Okta", "CC6.1", <Badge key="a" tone="ok" dot>Current</Badge>],
                    ["Production change log", "GitHub", "CC8.1", <Badge key="b" tone="ok" dot>Current</Badge>],
                    ["Incident case CASE-8812", "Managed SOC", "CC7.4", <Badge key="c" tone="ok" dot>Current</Badge>],
                    ["Backup restore test", "Manual upload", "A1.2", <Badge key="d" tone="medium" dot>Expires 6d</Badge>],
                  ]}
                />
              </Panel>
            </div>
          </AppWindow>
        </Pane>
      ),
    },
    {
      label: "Audit",
      content: (
        <Pane title="Fieldwork without the fire drill" body="Auditor requests land in one queue, answered from the evidence library with a named owner for each." points={["One request queue shared with the auditor", "Answers linked to the evidence, not emailed", "Exceptions tracked to a management response"]}>
          <AppWindow title="Audits · SOC 2 Type II fieldwork" label="Audit request tracker with request counts and a table of auditor requests with owner and status.">
            <div className="grid grid-cols-1 gap-3 bg-mist p-4 md:grid-cols-3">
              <StatTile label="Requests received" value="148" delta="from auditor" good />
              <StatTile label="Answered" value="131" delta="89% in 2 days" good />
              <StatTile label="Exceptions" value="2" delta="management response due" />
              <Panel title="Request list" className="md:col-span-3">
                <DataTable
                  columns={["Request", "Item", "Owner", "Status"]}
                  rows={[
                    [<span key="1" className="font-mono text-xs">PBC-041</span>, "Population of new hires", "HR", <Badge key="a" tone="ok" dot>Accepted</Badge>],
                    [<span key="2" className="font-mono text-xs">PBC-057</span>, "Access review, Q3 sample", "Security", <Badge key="b" tone="medium" dot>In review</Badge>],
                    [<span key="3" className="font-mono text-xs">PBC-063</span>, "Vendor SOC reports", "Procurement", <Badge key="c" tone="ok" dot>Accepted</Badge>],
                    [<span key="4" className="font-mono text-xs">PBC-070</span>, "Restore test evidence", "Infra", <Badge key="d" tone="critical" dot>Exception</Badge>],
                  ]}
                />
              </Panel>
            </div>
          </AppWindow>
        </Pane>
      ),
    },
  ];
  return (
    <Section labelledBy="show-title">
      <SectionHeading id="show-title" eyebrow="How it runs" title="Readiness, evidence and audit in one place." lead="You see the same console our practitioners work in, so status is never a meeting away." />
      <Reveal className="mt-10"><TabUnderline><Tabs items={items} auto={6000} listClassName="w-fit max-w-full" /></TabUnderline></Reveal>
    </Section>
  );
}

/* ====================================================================== */
const DIVISIONS = [
  { name: "Offensive Security", href: "/consulting", body: "Penetration tests and retests satisfy the testing requirements most frameworks set." },
  { name: "AI Security", href: "/ai-security", body: "Each AI red-team finding is delivered with the governance control it evidences." },
  { name: "Managed SOC", href: "/managed-services", body: "Every case our analysts handle is logged as incident-response evidence." },
  { name: "Platform", href: "/platform", body: "Cloud, identity and API findings become control evidence the moment they are fixed." },
];

function CrossLinks() {
  return (
    <Section tone="navy" labelledBy="x-title">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Eyebrow className="text-accent-on-dark">One consultancy</Eyebrow>
          <h2 id="x-title" className="mt-4 text-h2 font-semibold tracking-[-0.025em] text-balance">Compliance as a by-product of security work.</h2>
          <p className="mt-4 text-lead text-navy-300">The other practices produce the records auditors ask for. Risk & Compliance turns them into evidence, so you prove what you already do.</p>
        </div>
        <Stagger className="grid grid-cols-1 gap-3 lg:col-span-7">
          {DIVISIONS.map((d) => (
              <Link key={d.href} href={d.href} className="group flex items-center gap-4 rounded-card bg-navy-900 p-5 ring-1 ring-white/10 transition-colors duration-(--duration-fast) hover:bg-white/10">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="mt-1 text-[0.9375rem] text-navy-300">{d.body}</p>
                </div>
                <span className="text-accent-on-dark"><Arrow /></span>
              </Link>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* ====================================================================== */
const FAQ: [string, string][] = [
  ["Which framework should I start with?", "Usually the one a customer has asked for. We map it to the others so later frameworks reuse the work."],
  ["How long does SOC 2 take?", "A first Type II often takes several months, most of it the observation window."],
  ["Do you issue the audit report?", "The report comes from an independent auditor or certification body. We prepare you and coordinate with them."],
  ["Does the EU AI Act apply to us?", "If you build or use AI in the EU market, probably. Obligations are phased and dates are confirmed at engagement; our AI governance practice classifies each system by role and risk tier first."],
  ["Can software keep us compliant?", "It handles evidence. People still own the decisions, and we help with both."],
];

export default function GrcHub() {
  return (
    <>
      <JsonLd data={[
        service({ name: "Risk & Compliance", description: DESCRIPTION, path: "/grc", serviceType: "Security compliance and AI governance consulting", type: "ProfessionalService" }),
        breadcrumbs([["Home", "/"], ["Consulting", "/consulting"], ["Risk & Compliance", "/grc"]]),
      ]} />
      <Hero />
      <WorkOnce />
      <Offerings />
      <AiGovernance />
      <Showcase />
      <CrossLinks />
      <Faq items={FAQ} tone="mist" />
      <FinalCta {...GRC_CTA} />
    </>
  );
}
