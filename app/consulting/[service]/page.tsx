import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SERVICES, bySlug } from "@/components/consulting/data";
import { ServiceView } from "@/components/consulting/ServiceView";
import { Terminal } from "@/components/motion";
import { PentestTerminal } from "@/components/graphics";
import { AttackGraph, RadarChart, StackedBars, Timeline, TrendChart, ATTACK_PATH, ENGAGEMENT, MTTR, RADAR_NIST, SEV, SPRINT_FINDINGS } from "@/components/charts";
import { ChartBand } from "@/components/consulting/parts";

type Props = { params: Promise<{ service: string }> };

export const dynamicParams = false;
// how-we-work has its own static page; ai-security redirects to /ai-security/red-teaming (next.config.ts).
export const generateStaticParams = () => SERVICES.map((s) => ({ service: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = bySlug((await params).service);
  return s ? { title: s.name, description: s.desc } : {};
}

const NOTE = <p className="mt-3 text-micro text-navy-500">Example data</p>;
const GRAPHIC: Record<string, { title: string; lead: string; node: ReactNode }> = {
  "penetration-testing": {
    title: "Findings are written while we test.",
    lead: "Criticals reach you the same day with evidence and a fix, not three weeks later in a PDF.",
    node: <><PentestTerminal />{NOTE}</>,
  },
  "red-team": {
    title: "One path to the crown jewels, then closed.",
    lead: "We chain small weaknesses into the route a real adversary would take, then prove the fix breaks the chain.",
    node: <div className="rounded-card bg-canvas p-4 shadow-card ring-1 ring-line sm:p-6"><AttackGraph {...ATTACK_PATH} /></div>,
  },
  appsec: {
    title: "Guardrails that stop the bug class, not one bug.",
    lead: "Every finding ends in a rule in your pipeline, so the same mistake can't ship twice.",
    node: (
      <>
        <Terminal
          title="ci — payments-service"
          label="CI pipeline: a new guardrail rule blocks a pull request that reads tenantId from the request body."
          lines={[
            { text: "$ rp-guard check --pr 2902", tone: "prompt", pause: 400 },
            { text: "› 38 files · 4 rules · 2.1s", tone: "muted" },
            { text: "✗ tenant-from-body  refunds.ts:91", tone: "warn", pause: 300 },
            { text: "  tenantId must come from req.auth", tone: "plain" },
            { text: "✗ PR blocked · fix suggested inline", tone: "warn", pause: 400 },
            { text: "✓ re-run after fix: 0 findings", tone: "accent" },
          ]}
        />
        {NOTE}
      </>
    ),
  },
};

const SEV_KEYS = [
  { label: "Critical", color: SEV.critical },
  { label: "High", color: SEV.high },
  { label: "Medium", color: SEV.medium },
  { label: "Low", color: SEV.low },
];

// Chart bands after the methodology, one chart each (DESIGN.md: at most two charts in view).
const BANDS: Record<string, ReactNode> = {
  "penetration-testing": (
    <>
      <ChartBand id="plan" tone="mist" eyebrow="Engagement plan" title="Nine weeks, with the fix window built in." lead="Testing ends in week 5 and the report lands in week 6, but the engagement doesn't. Your team gets two weeks to fix, then we retest every finding and reissue the report.">
        <Timeline {...ENGAGEMENT} />
      </ChartBand>
      <ChartBand id="burn" flip eyebrow="After the report" title="Criticals close first, then the backlog." lead="Findings arrive ranked, with a fix your engineers can apply. The target: every critical closed within two sprints, then the backlog burns down sprint by sprint.">
        <StackedBars {...SPRINT_FINDINGS} />
      </ChartBand>
    </>
  ),
  "red-team": (
    <ChartBand id="sev" eyebrow="Findings" title="Where the chain was weakest." lead="Every finding is tied to the stage of the attack it enabled, so you fix the links that broke the chain first, not the longest list.">
      <StackedBars
        title="Red-team findings by severity, per attack stage"
        desc="Findings from one objective-based engagement, grouped by the stage of the attack chain they enabled."
        keys={SEV_KEYS}
        groups={[
          { label: "Access", values: [1, 2, 3, 2] },
          { label: "Execution", values: [0, 3, 2, 1] },
          { label: "Escalation", values: [2, 1, 2, 0] },
          { label: "Lateral", values: [1, 2, 3, 2] },
          { label: "Objective", values: [1, 1, 0, 1] },
        ]}
      />
    </ChartBand>
  ),
  appsec: (
    <ChartBand id="mttr" eyebrow="Remediation" title="Fixes get faster when the rule ships with the finding." lead="Each guardrail turns a fix into a check, so repeat findings drop out and the time from report to verified fix keeps falling.">
      <TrendChart {...MTTR} />
    </ChartBand>
  ),
  vciso: (
    <ChartBand id="maturity" eyebrow="Maturity" title="Where your programme stands, and where six months gets it." lead="We score each NIST CSF 2.0 function in the first month and set a target tier the board signs off. Toggle between today and the six-month plan.">
      <RadarChart {...RADAR_NIST} />
    </ChartBand>
  ),
};

export default async function ServicePage({ params }: Props) {
  const s = bySlug((await params).service);
  if (!s) notFound();
  return <ServiceView s={s} crumbs={[["Consulting", "/consulting"]]} graphic={GRAPHIC[s.slug]}>{BANDS[s.slug]}</ServiceView>;
}
