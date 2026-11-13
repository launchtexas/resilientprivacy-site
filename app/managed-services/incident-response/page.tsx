import type { Metadata } from "next";
import { Terminal } from "@/components/motion";
import { Timeline } from "@/components/charts";
import { ServicePage, type ServiceData } from "@/components/managed/kit";
import { IrConsole } from "@/components/managed/mockups";

export const metadata: Metadata = {
  title: "Incident Response Retainer & DFIR",
  description: "Named responders on call, pre-agreed hours and response times, plus digital forensics when you need evidence that holds up.",
};

const data: ServiceData = {
  href: "/managed-services/incident-response",
  name: "Incident Response Retainer",
  eyebrow: "Incident response retainer · DFIR",
  title: "When it happens, your first call is not your first conversation.",
  lead: "A retainer gives you named responders who already know your environment, with hours and response times agreed in advance. Forensics follows, so legal, insurers and regulators get evidence they can rely on.",
  note: "Under attack and not yet a client? Use the contact form and mark it urgent. Retainer clients get the hotline number at onboarding.",
  model: {
    title: "Declare, contain, investigate, recover.",
    lead: "Most of the value of a retainer is spent before the incident: onboarding, a tested plan and contacts that already work.",
    coverage: [
      ["Availability", "24/7 hotline: a responder on critical incidents in under 15 minutes"],
      ["Hours", "Pre-paid block sized in your retainer, usable for incidents or readiness work"],
      ["Team", "Incident commander, forensic analysts and a communications lead"],
      ["Onboarding", "Environment review, contact tree and evidence-collection access set up in advance"],
      ["AI incidents", "Prompt-injection abuse, agent and tool misuse, and model or training-data leakage, worked with our AI red team"],
      ["Works with", "Your counsel, your insurer and its panel requirements"],
    ],
    stamp: 0,
    steps: [
      { title: "Declare", body: "You call the hotline. A responder scopes the situation and opens an engagement under your retainer.", when: "Critical: responder in under 15 minutes, 24/7", clock: ["00:09", "responder scoping"] },
      { title: "Contain", body: "We stop the spread first: isolate systems, cut attacker access and preserve evidence before it is lost.", when: "Remote start: per retainer terms", clock: ["+3h", "spread stopped"] },
      { title: "Investigate", body: "Forensic analysis of hosts, identities, email and cloud logs to establish what happened and what was taken.", when: "On site: when the case needs it", clock: ["+2d", "root cause found"] },
      { title: "Recover and report", body: "Guided recovery, then a written report with timeline, root cause and fixes, fit for legal and insurers.", when: "Report: on the timeline agreed at close", clock: ["+3w", "report delivered"] },
    ],
    commits: [
      ["Critical response", "Under 15 minutes, 24/7: you call the hotline → a responder is scoping with you"],
      ["Remote start", "Incident declared → remote containment and forensics begin"],
      ["On-site arrival", "On-site requested → responder at your location"],
    ],
    slaColumns: ["Remote work starts", "On site"],
    slas: [
      ["Critical", "Timed, retainer target", "When the case needs it"],
      ["High", "Timed, retainer target", "On request"],
      ["Medium", "Next business day", "Not applicable"],
      ["Low", "Scheduled", "Not applicable"],
    ],
  },
  metrics: {
    eyebrow: "A case, start to finish",
    title: "Containment in the first hours. A report your counsel can use.",
    lead: "A typical ransomware case on retainer: containment and forensics start together, recovery overlaps the investigation, and the report closes the case.",
    charts: [
      <Timeline key="t" title="Ransomware case on retainer, by week" desc="Phases of one engagement; the line marks where the case stands today." weeks={6} today={2.5}
        phases={[
          { label: "Declare + contain", start: 0, end: 1 },
          { label: "Forensics", start: 0, end: 3 },
          { label: "Eradicate", start: 1, end: 2.5 },
          { label: "Recover systems", start: 2, end: 4 },
          { label: "Report for counsel", start: 3.5, end: 5 },
          { label: "Lessons learned", start: 5, end: 6 },
        ]} />,
    ],
  },
  proof: {
    eyebrow: "First hour",
    title: "Contain first. Then explain.",
    lead: "The opening hour of a retained incident follows a written runbook, so nothing waits on a contract or an access request.",
    points: [
      "Access, contacts and evidence collection are set up at onboarding, not during the incident.",
      "AI incidents are in scope: prompt logs, tool calls and retrieval history are preserved like disk images.",
      "Root cause goes back to consulting as a retest, and to the SOC as a detection.",
    ],
    graphic: <Terminal title="ir — case log" label="Incident case log: a hotline call is logged, a host is isolated, a token is revoked, evidence is hashed and the case moves to investigation." lines={[
      { text: "$ rp-ir open --severity critical", tone: "prompt", pause: 400 },
      { text: "› case IR-0217 · commander assigned", tone: "muted" },
      { text: "! host fin-ws-14 isolated (EDR)", tone: "warn" },
      { text: "! session token revoked · user j.doe", tone: "warn" },
      { text: "  disk + memory image · sha256 logged", tone: "plain" },
      { text: "  prompt and tool-call logs preserved", tone: "plain", pause: 400 },
      { text: "✓ contained · investigation started", tone: "accent" },
    ]} />,
    caption: "Example case log",
  },
  monthly: {
    lead: "Unused hours are not wasted. They go into readiness work, reported every month.",
    items: [
      ["Retainer statement", "Hours used, hours left and what they were spent on."],
      ["Incident response plan", "Your plan, kept current as people, systems and vendors change."],
      ["Tabletop exercises", "Scenario sessions with leadership and technical teams, at a frequency set in your retainer."],
      ["Compromise assessment", "A periodic check for signs of an attacker already inside."],
      ["Readiness checklist", "Logging, backups and access needed for an investigation, with the gaps listed."],
      ["Threat briefing", "Attacks hitting companies like yours, and whether you are exposed to them."],
    ],
  },
  faq: [
    ["What is the difference between a retainer and calling when something happens?", "With a retainer the contract, access and context are already in place, so work starts in minutes rather than days. Rates are usually lower too."],
    ["How much does a retainer cost?", "Retainers start from $15,000 a year. Unused hours convert to readiness work."],
    ["What happens to unused hours?", "They can be spent on readiness work such as tabletop exercises, plan updates or a compromise assessment, under your retainer terms."],
    ["Do you work with our cyber insurer?", "Yes. We coordinate with your insurer and counsel."],
    ["Is your forensic evidence usable in court?", "We follow documented chain-of-custody procedures and hash every item we collect. Your counsel decides how it is used."],
    ["Do you handle incidents involving AI systems?", "Yes. If an LLM app or agent was manipulated through prompt injection, misused a tool, or leaked data from a model or retrieval store, we investigate it like any other incident: preserve prompts, tool-call logs and retrieval history, establish what was exposed, and hand the fix to our AI red team to retest."],
    ["Can you help if we are not a customer?", "Yes. Use the contact form or email our security team and mark it urgent. A retainer makes the first hours faster, but we do take emergency engagements."],
  ],
  cta: { title: "Set up the call before you need to make it.", lead: "We walk through retainer options and what onboarding involves for your environment." },
};

export default function Page() {
  return <ServicePage data={data} mockup={<IrConsole />} />;
}
