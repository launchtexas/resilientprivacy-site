import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { Arrow, Badge, Button, Card, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { CtaButtons, Faq, FinalCta } from "@/components/sections";
import { GradientBorder, Stagger } from "@/components/motion";
import { Scrubber } from "@/components/consulting/Scrubber";
import { Timeline } from "@/components/charts";
import { TestToEvidence } from "@/components/consulting/TestToEvidence";

const DESC = "How Resilient Privacy runs consulting engagements: our method, fixed-scope engagement models, severity rubric, retest policy and a named lead.";
export const metadata: Metadata = { title: "How We Work: Method and Engagements", description: DESC };

const MODELS = [
  { name: "Fixed-scope test", for: "A pentest, AI red team, appsec review or MCP permission review", length: "1–4 weeks", team: "Named lead + 1–2 testers", out: "Report, readout, retest, attestation", price: "From $5,000 (web app or API from $6,000)" },
  { name: "Campaign", for: "Red or purple team against a business objective", length: "4–8 weeks", team: "Lead + operators + SOC liaison", out: "Attack narrative, gap matrix, detections", price: "From $30,000", featured: true },
  { name: "Program", for: "Architecture, AI governance or compliance readiness", length: "6–12 weeks", team: "Lead advisor + specialists", out: "Roadmap, policy set, evidence file", price: "From $10,000 (e.g. SOC 2 readiness, audit not included)" },
  { name: "Retainer", for: "vCISO, continuous testing or on-call advisory", length: "Monthly", team: "Named lead, fixed days per month", out: "Board pack, rolling tests, live findings", price: "From $4,000/month (vCISO)" },
];

const SEVERITY: { sev: "critical" | "high" | "medium" | "neutral"; label: string; means: string; call: string }[] = [
  { sev: "critical", label: "Critical", means: "Direct path to sensitive data, money movement or full control, exploitable now.", call: "Phone call the same day; fix guidance within hours" },
  { sev: "high", label: "High", means: "Serious impact with one extra condition, or a chain that needs a second weakness.", call: "Flagged in the live feed within one working day" },
  { sev: "medium", label: "Medium", means: "Limited impact or harder to exploit; worth fixing in the normal cycle.", call: "In the live feed and the report" },
  { sev: "neutral", label: "Low", means: "Hardening and hygiene that shrink the attack surface.", call: "In the report, grouped by theme" },
];

const FAQ: [string, string][] = [
  ["Who will we work with?", "One named lead from the scoping call to sign-off, plus the specialists your scope needs. You get their names before the engagement starts."],
  ["How do you score severity?", "CVSS for technical findings, OWASP LLM and MITRE ATLAS references for AI findings, adjusted for your business context using the rubric above. We explain every adjustment."],
  ["What does the retest cover?", "Every finding rated medium or above. Tell us when the fixes are in and we retest within 30 days of that notice, unless your SOW sets another window. The report is updated with a status per finding."],
  ["Do you publish prices?", "Yes, as starting prices: fixed-scope tests from $5,000, campaigns from $30,000, programs from $10,000 and vCISO retainers from $4,000 a month. Every engagement then gets a fixed, written quote after the scoping call, before any work starts."],
];

export default function HowWeWorkPage() {
  return (
    <>
      <JsonLd data={[service({ name: "Consulting engagements", description: DESC, path: "/consulting/how-we-work", serviceType: "Cybersecurity and AI security consulting" }), breadcrumbs([["Home", "/"], ["Consulting", "/consulting"], ["How we work", "/consulting/how-we-work"]])]} />

      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-60" />
        <div className="container-rp relative pt-10 pb-16 lg:pt-16 lg:pb-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-navy-500">
              <li className="flex items-center gap-1.5"><Link href="/consulting" className="hover:text-navy-950">Consulting</Link><span aria-hidden>/</span></li>
              <li aria-current="page" className="text-navy-800">How we work</li>
            </ol>
          </nav>
          <div className="mt-8 grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Eyebrow>How we work</Eyebrow>
              <h1 id="hero-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">Our method, in the open. Before you sign anything.</h1>
              <p className="mt-5 max-w-2xl text-lead text-navy-600 text-pretty">How we scope, test, score, retest and hand over, with the engagement models and price bands we use. Judge the method first, then decide.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaButtons kind="practice" />
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-card bg-line shadow-hairline sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              {[["One named lead", "From scoping call to sign-off"], ["Fixed scope, fixed fee", "Agreed before work starts"], ["Retest included", "Every medium and above"]].map(([t, b]) => (
                <li key={t} className="bg-canvas p-4">
                  <p className="text-sm font-semibold text-navy-950">{t}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-navy-600">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section tone="mist" labelledBy="tl-title">
        <SectionHeading id="tl-title" eyebrow="Engagement timeline" title="What arrives, and when." lead="Every phase has a week and every artefact has a name. The plan shows the shape; drag the handle below to walk through what lands when." />
        <div className="mt-12 rounded-card bg-canvas p-4 shadow-card sm:p-6">
          <Timeline
            title="A typical fixed-scope engagement"
            desc="Phases by week; the line marks a project in week 4."
            weeks={8}
            today={4}
            phases={[
              { label: "Scoping call + quote", start: 0, end: 1 },
              { label: "Kick-off + access", start: 1, end: 1.5 },
              { label: "Testing", start: 1.5, end: 4.5 },
              { label: "Critical alerts", start: 1.5, end: 4.5 },
              { label: "Report + readout", start: 4.5, end: 5.5 },
              { label: "Fix window", start: 5.5, end: 7 },
              { label: "Retest + attestation", start: 7, end: 8 },
            ]}
          />
        </div>
        <Scrubber className="reveal mt-8" />
      </Section>

      <Section labelledBy="te-title">
        <SectionHeading id="te-title" eyebrow={"From test to evidence"} title="One finding, followed all the way to the audit file." lead="The loop most firms split across separate teams. We run it as one: the finding is fixed, retested, watched by the SOC and filed as evidence." />
        <TestToEvidence className="mt-12" />
        <p className="mt-3 text-micro text-navy-500">Illustrative report data</p>
      </Section>

      <Section tone="mist" labelledBy="em-title">
        <SectionHeading id="em-title" eyebrow="Engagement models" title="Four ways to work with us." lead="Typical shapes, so you can compare before the first call. Final scope and fee are fixed in writing." />
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODELS.map((m) => {
            const body = (
              <div className="flex h-full flex-col p-6">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">{m.name}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{m.for}</p>
                <dl className="mt-6 flex-1 space-y-3 border-t border-line pt-4 text-sm">
                  {[["Typical length", `${m.length}`], ["Team", m.team], ["You get", m.out], ["Price band", m.price]].map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">{k}</dt>
                      <dd className="mt-0.5 text-navy-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
            return m.featured ? <GradientBorder key={m.name} className="h-full">{body}</GradientBorder> : <Card key={m.name} className="h-full">{body}</Card>;
          })}
        </Stagger>
      </Section>

      <Section labelledBy="sev-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading id="sev-title" eyebrow="Severity rubric" title="How we rate a finding, and how fast you hear about it." lead="CVSS or OWASP/ATLAS references set the baseline. Your business context sets the final rating, and we write down why." />
          </div>
          <Stagger className="divide-y divide-line overflow-hidden rounded-panel bg-canvas shadow-card lg:col-span-8">
            {SEVERITY.map((r) => (
              <div key={r.label} className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-12 sm:gap-4">
                <div className="sm:col-span-2"><Badge tone={r.sev} dot>{r.label}</Badge></div>
                <p className="text-[0.9375rem] text-navy-800 sm:col-span-6">{r.means}</p>
                <p className="text-sm text-navy-600 sm:col-span-4">{r.call}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section tone="mist" labelledBy="rt-title">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading id="rt-title" eyebrow="Retest policy" title="We check our own advice." lead="A finding closes when we have verified the fix, not when a ticket moves." />
          </div>
          <Card className="reveal p-6 sm:p-8 lg:col-span-7">
            <CheckList className="text-navy-800" items={[
              "Every finding rated medium or above is retested within 30 days of your fix notice, unless your SOW sets another window",
              "Each chain is replayed exactly as first exploited, including AI transcripts",
              "The report is reissued with a status per finding",
              "A shareable attestation letter once criticals and highs are closed",
              "Missed detections are handed to your SOC, or ours, as rules",
            ]} />
          </Card>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear most." className="lg:col-span-4" />
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </Section>

      <div className="pt-20 lg:pt-28">
        <FinalCta kind="practice" title="Start with a scope, not a sales call." lead="A 30-minute call with a senior practitioner. You leave with a written scope, a timeline and a fixed quote." />
      </div>
    </>
  );
}
