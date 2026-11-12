import type { Metadata } from "next";
import { ThreatPipeline } from "@/components/graphics";
import { Sparklines, TrendChart } from "@/components/charts";
import { ServicePage, type ServiceData } from "@/components/managed/kit";
import { MdrConsole } from "@/components/managed/mockups";

export const metadata: Metadata = {
  title: "Managed Detection & Response",
  description: "24/7 monitoring with hands-on containment. Our analysts investigate, act under playbooks you approve, and tell you exactly what they did.",
};

const data: ServiceData = {
  href: "/managed-services/mdr",
  name: "Managed Detection and Response",
  eyebrow: "Managed detection & response",
  title: "We don't forward alerts. We stop the attack.",
  lead: "Analysts watch your endpoints, identities, cloud and email around the clock. When something is real, they contain it under playbooks you signed off, then explain what happened.",
  note: "Works with most major EDR, identity and cloud platforms. Yours are confirmed at scoping.",
  model: {
    title: "Detect, confirm, contain, write it up.",
    lead: "Detection runs on the tools you already own. Response follows rules you approved before the first alert.",
    coverage: [
      ["Hours", "24/7/365, follow-the-sun analyst shifts in the USA and India"],
      ["Telemetry", "Endpoint, identity, email, cloud and SaaS logs"],
      ["Response authority", "Pre-approved actions: isolate host, revoke sessions, block indicators, disable accounts"],
      ["Your contact", "Named lead analyst plus a shared incident channel"],
      ["Model", "Fully managed or co-managed with your team"],
    ],
    stamp: 3,
    steps: [
      { title: "Detect", body: "Detections from your EDR, identity provider and cloud are correlated into one case, not twelve alerts.", when: "Continuous", clock: ["00:00", "detection"] },
      { title: "Triage", body: "An analyst confirms whether it is real, scopes affected users and hosts, and sets severity.", when: "Target: per severity, in your SOW", clock: ["00:04", "confirmed"] },
      { title: "Contain", body: "Pre-approved actions run immediately. Anything outside the playbook waits for your approval.", when: "Target: agreed in your SOW", clock: ["00:09", "host isolated"] },
      { title: "Escalate and report", body: "You get a call for critical cases and a written summary for every case, with what we did and what is left.", when: "Call for critical · summary same day", clock: ["00:12", "you are called"] },
    ],
    commits: [
      ["Critical response", "Under 15 minutes, 24/7: critical alert or call → an analyst is working it"],
      ["Time to acknowledge", "Alert fires → a named analyst owns the case"],
      ["Time to contain", "Threat confirmed → first approved playbook action runs"],
      ["Time to notify", "Threat confirmed → you are told what we did"],
      ["Case write-up", "Case closed → written summary in your hands"],
    ],
    slaColumns: ["Notify you", "Containment"],
    slas: [
      ["Critical", "By phone", "Playbook actions run at once"],
      ["High", "In channel", "Playbook actions run at once"],
      ["Medium", "Daily digest", "On your approval"],
      ["Low", "Monthly report", "Not applicable"],
    ],
  },
  metrics: {
    eyebrow: "Measured every month",
    title: "Containment gets faster as the playbooks grow.",
    lead: "Each case adds a pre-approved action, so more threats are contained before anyone has to wake up. These are the measures in your monthly report.",
    charts: [
      <TrendChart key="t" title="Median time to contain" desc="Minutes from detection to contained, per month." unit="m" target={{ label: "Example target 30m", value: 30 }}
        points={[{ label: "Jan", value: 94 }, { label: "Feb", value: 71 }, { label: "Mar", value: 58 }, { label: "Apr", value: 46 }, { label: "May", value: 38 }, { label: "Jun", value: 31 }, { label: "Jul", value: 27 }, { label: "Aug", value: 22 }]} />,
      <Sparklines key="s" title="MDR health, last 12 weeks" items={[
        { label: "Contained by playbook", unit: "%", goodWhen: "up", values: [52, 55, 58, 61, 64, 66, 70, 73, 77, 80, 83, 86] },
        { label: "Time to triage", unit: "m", goodWhen: "down", values: [18, 17, 17, 15, 14, 13, 12, 11, 10, 9, 8, 7] },
        { label: "Cases needing your approval", goodWhen: "down", values: [14, 13, 12, 12, 10, 9, 9, 8, 7, 6, 5, 4] },
        { label: "Detections from red-team findings", goodWhen: "up", values: [6, 8, 9, 11, 14, 15, 17, 19, 22, 24, 25, 28] },
      ]} />,
    ],
  },
  proof: {
    eyebrow: "Advice that stays",
    title: "Every finding becomes a detection.",
    lead: "MDR is where consulting work keeps paying off: what our testers prove an attacker could do, our analysts watch for.",
    points: [
      "Red-team and pentest techniques are turned into detections and replayed to prove they fire.",
      "AI-assisted triage correlates and explains alerts; containment actions always run under a playbook you approved.",
      "Each closed case lands as evidence for SOC 2 and ISO 27001 controls, with no extra work from your team.",
    ],
    graphic: <ThreatPipeline />,
  },
  monthly: {
    lead: "A monthly service review with your lead analyst, backed by the documents below.",
    items: [
      ["Case report", "Every case opened, what caused it, what we did and how long each step took."],
      ["Response log", "Each containment action with timestamp, approver and rollback status."],
      ["Detection changes", "New and tuned rules, and noise removed, with the reason for each change."],
      ["Coverage gaps", "Hosts without an agent, log sources gone quiet, and accounts outside monitoring."],
      ["Risk themes", "Patterns across cases, ranked, with the fix that removes the most risk."],
      ["Service metrics", "Time to acknowledge, contain and close, against the targets in your contract."],
    ],
  },
  faq: [
    ["What is the difference between MDR and a managed SOC?", "A managed SOC monitors and escalates. MDR also takes response actions on your systems, under playbooks you approve. Many customers start with SOC and add response later."],
    ["Do we need to buy new tools?", "Usually not. We work with most major EDR, identity, email and cloud platforms you already run. We confirm yours at scoping."],
    ["What can your analysts do without asking?", "Only what is in the playbook you signed: typically isolating a host, revoking sessions and blocking indicators. Everything else waits for your approval."],
    ["How fast do you respond?", "Critical: under 15 minutes, 24/7. High: within 1 hour. Medium: within 4 business hours. Low: in the monthly report. We report against these every month."],
    ["How is MDR priced?", "From $15 per endpoint per month, minimum $2,500 a month. You get a fixed quote after scoping."],
    ["What happens if the incident is bigger than MDR?", "We bring in our incident response team under the same case, so nobody has to re-explain what happened."],
  ],
  cta: { title: "Find out what we would have caught last month.", lead: "We review a sample of your recent alerts and show how MDR would have handled them." },
};

export default function Page() {
  return <ServicePage data={data} mockup={<MdrConsole />} />;
}
