import type { Metadata } from "next";
import { SocAlertStream, SocMap } from "@/components/graphics";
import { Sparklines, SOC_SPARKS } from "@/components/charts";
import { ServicePage, type ServiceData } from "@/components/managed/kit";
import { SocConsole } from "@/components/managed/mockups";

export const metadata: Metadata = {
  title: "Managed SOC Services (SOC as a Service)",
  description: "Managed SOC services: around-the-clock security monitoring. We run and tune your SIEM so analysts see what matters and escalate with context.",
};

const data: ServiceData = {
  href: "/managed-services/soc",
  name: "Managed SOC",
  eyebrow: "Managed SOC",
  title: "A security operations center, without building one.",
  lead: "We run your SIEM, tune the detections and staff the screens around the clock. Your team hears from us when something matters, with the context to act on it.",
  note: "Bring your own SIEM or use ours. Supported platforms are confirmed at scoping.",
  model: {
    title: "Your SIEM, run by people who tune it weekly.",
    lead: "Monitoring is only useful if the signal is clean. Half the job is tuning, and we do it every week.",
    coverage: [
      ["Hours", "24/7/365, follow-the-sun analyst shifts in the USA and India"],
      ["Platforms", "Your SIEM, or ours, plus EDR, identity, email, firewall and cloud logs"],
      ["Detection engineering", "Rules mapped to MITRE ATT&CK, tuned weekly against your environment"],
      ["Your contact", "Named lead analyst and a shared escalation channel"],
      ["Model", "Fully managed, or co-managed with shared queues"],
    ],
    stamp: 2,
    steps: [
      { title: "Collect", body: "We onboard your log sources, check they are parsed correctly and alert when one goes quiet.", when: "Continuous", clock: ["00:00", "alert fires"] },
      { title: "Triage", body: "Analysts review every alert that passes tuning, enrich it and decide whether it is real.", when: "Target: per severity, in your SOW", clock: ["00:04", "triaged"] },
      { title: "Escalate", body: "Confirmed threats reach your on-call contact with scope, evidence and the recommended action.", when: "Phone for critical · channel for high", clock: ["00:11", "on-call phoned"] },
      { title: "Tune", body: "False positives become rule changes, so the same noise does not come back next week.", when: "Weekly", clock: ["+7d", "rule tuned"] },
    ],
    commits: [
      ["Critical response", "Under 15 minutes, 24/7: critical alert or call → an analyst is working it"],
      ["Time to acknowledge", "Alert fires → a named analyst owns the case"],
      ["Time to escalate", "Threat confirmed → your on-call contact is told"],
      ["Log source alerting", "A source goes quiet → you hear from us"],
    ],
    slaColumns: ["Escalation", "Channel"],
    slas: [
      ["Critical", "Under 15 minutes, 24/7", "Phone + channel"],
      ["High", "Within 1 hour", "Channel + ticket"],
      ["Medium", "Within 4 business hours", "Ticket"],
      ["Low", "Monthly report", "Report"],
    ],
  },
  metrics: {
    eyebrow: "Signal, not noise",
    title: "Thousands of alerts in. A short list of real incidents out.",
    lead: "Tuning and triage cut the volume before it reaches an analyst, and every confirmed incident is tracked to containment. Your monthly review shows these charts for your estate.",
    charts: [<SocAlertStream key="f" />, <Sparklines key="s" {...SOC_SPARKS} />],
  },
  proof: {
    eyebrow: "Follow the sun",
    title: "One queue, watched around the clock.",
    lead: "Events from every region land in one case queue, worked by analyst teams in the USA and India. AI-assisted triage groups and summarizes alerts; an analyst makes every call that matters.",
    points: [
      "AI drafts the summary and suggested next step. A named analyst approves or rejects it, and the decision is logged.",
      "Every technique our red team uses on your estate becomes a detection rule here, tested before it ships.",
      "Rules are mapped to MITRE ATT&CK, so coverage gaps are visible by technique, not by gut feel.",
    ],
    graphic: <SocMap />,
  },
  monthly: {
    lead: "A monthly review with your lead analyst. Quarterly, we walk your leadership through trends.",
    items: [
      ["Alert and case summary", "Volume, outcomes and the escalations that mattered, in plain language."],
      ["Detection coverage map", "Which attack techniques you can see, which you cannot, and what would close the gap."],
      ["Tuning log", "Every rule added, changed or retired, with the noise it removed."],
      ["Log source health", "Sources that dropped, changed format or never arrived."],
      ["Recommendations", "Three to five changes, ranked by the risk they remove."],
      ["Service metrics", "Acknowledge and escalation times against the targets in your contract."],
    ],
  },
  faq: [
    ["Do you need access to our SIEM?", "Yes, analyst access to your SIEM and read access to key consoles. If you do not have a SIEM, we provide one and name it in your SOW."],
    ["Can our internal team work the same queue?", "Yes. Co-managed is common: your team takes business hours, or certain alert types, and we cover the rest."],
    ["Will you take action on our systems?", "A managed SOC escalates. If you want analysts to contain threats directly, that is our MDR service."],
    ["How do you reduce false positives?", "Weekly tuning against your environment. Every suppression is logged and reviewed, so we do not hide real attacks."],
    ["Does this help with compliance?", "Yes. Monitoring logs, case records and monthly reports are common evidence for SOC 2, ISO 27001 and PCI DSS."],
  ],
  cta: { title: "See your alerts through our analysts' eyes.", lead: "A 30-minute session on your current alert volume and what a tuned SOC would surface." },
};

export default function Page() {
  return <ServicePage data={data} mockup={<SocConsole />} />;
}
