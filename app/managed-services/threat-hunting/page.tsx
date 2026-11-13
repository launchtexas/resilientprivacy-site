import type { Metadata } from "next";
import { AttackPath } from "@/components/graphics";
import { Card } from "@/components/ui";
import { AttackGraph, ATTACK_PATH, SERIES, StackedBars } from "@/components/charts";
import { ServicePage, type ServiceData } from "@/components/managed/kit";
import { HuntConsole } from "@/components/managed/mockups";

export const metadata: Metadata = {
  title: "Threat Hunting Services",
  description: "Threat hunting services: hypothesis-led hunts in your data. Analysts look for what automated rules missed and turn each finding into a new detection.",
};

const data: ServiceData = {
  href: "/managed-services/threat-hunting",
  name: "Threat Hunting",
  eyebrow: "Threat hunting & intelligence",
  title: "Looking for the attack your rules did not catch.",
  lead: "Our hunters start from a hypothesis, drawn from current threat intelligence and your own incident history, and search your data for proof. Every finding becomes a detection, so the next one is caught automatically.",
  note: "Runs on your EDR and SIEM data. Available on its own or with MDR.",
  model: {
    title: "Hypothesis in, detection out.",
    lead: "Hunting is scheduled work with a written outcome, not an analyst browsing logs when the queue is quiet.",
    coverage: [
      ["Cadence", "Planned hunt cycles plus emergency hunts when a major threat breaks; cycle length set in your SOW"],
      ["Data", "Endpoint, identity, network, email and cloud telemetry already collected"],
      ["Method", "Hypotheses mapped to MITRE ATT&CK techniques, chosen for your industry and stack"],
      ["Intelligence", "Current campaigns, attacker tooling and indicators relevant to you"],
      ["Your contact", "Lead hunter who presents each cycle's results"],
    ],
    steps: [
      { title: "Hypothesize", body: "Pick the techniques most likely to be used against you right now, and say what evidence would prove them.", when: "Start of each cycle", clock: ["Day 1", "hypothesis set"] },
      { title: "Hunt", body: "Query across your telemetry, pivot on anything odd, and rule out normal behavior with your team.", when: "Duration: fixed in the hunt plan", clock: ["Day 3", "queries run"] },
      { title: "Escalate", body: "A confirmed threat becomes a case right away, handled by MDR or your team.", when: "Immediately on confirmation", clock: ["Day 4", "case opened"] },
      { title: "Codify", body: "Each finding and each blind spot becomes a new detection rule or a logging fix.", when: "Before the cycle closes", clock: ["Day 10", "detection shipped"] },
    ],
    commits: [
      ["Escalation", "Threat confirmed in a hunt → case opened with MDR or your on-call"],
      ["Cycle report", "Cycle closes → written findings and new detections delivered"],
    ],
    slaColumns: ["Escalate to you", "Hand-off", "Written up"],
    slas: [
      ["Critical", "On confirmation", "MDR or your on-call", "Same day"],
      ["High", "On confirmation", "Case opened", "In cycle report"],
      ["Medium", "Cycle report", "Backlog item", "In cycle report"],
      ["Low", "Cycle report", "Recommendation", "In cycle report"],
    ],
  },
  metrics: {
    eyebrow: "What a hunt leaves behind",
    title: "Every hunt ends in a detection, a fix or a case.",
    lead: "A hunt follows one hypothesis hop by hop through your telemetry. Whatever it finds, or proves it cannot see, becomes something that runs every day after.",
    charts: [
      <AttackGraph key="g" {...ATTACK_PATH} title="Hunt H-12: the path we tested" desc="Hypothesis: one phished workstation reaches the customer database through cached admin credentials. Each hop was queried in your logs." />,
      <StackedBars key="b" title="Hunt outcomes per quarter" desc="What each quarter of hunting added to everyday defense."
        keys={[{ label: "New detections", color: SERIES[0] }, { label: "Logging fixes", color: SERIES[1] }, { label: "Escalated cases", color: SERIES[2] }]}
        groups={[{ label: "Q1", values: [5, 3, 1] }, { label: "Q2", values: [7, 2, 0] }, { label: "Q3", values: [6, 4, 2] }, { label: "Q4", values: [9, 2, 1] }]} />,
    ],
  },
  proof: {
    eyebrow: "Hunt the path",
    title: "Hunts start where an attacker would.",
    lead: "Hypotheses come from attack paths our testers and exposure data show are reachable in your estate, not from a generic list.",
    points: [
      "Each hunt follows one path hop by hop: exposed service, stolen credential, privilege, data.",
      "Anything found is escalated to response the same day; anything missed becomes a new detection.",
      "Hunts on AI systems look for prompt-injection attempts and unusual agent tool calls in your logs.",
    ],
    graphic: <Card className="p-6"><AttackPath className="mx-auto max-w-xl" /></Card>,
  },
  monthly: {
    lead: "Each hunt cycle closes with a written report and a walkthrough with your team.",
    items: [
      ["Hunt report", "Each hypothesis, the data searched, what we found and how confident we are."],
      ["New detections", "Rules created from the hunt, ready to deploy in your SIEM or EDR."],
      ["Visibility gaps", "Places we could not look because the logs were missing, and how to fix that."],
      ["Intelligence brief", "Campaigns and techniques relevant to your sector this month."],
      ["ATT&CK coverage", "Techniques hunted and covered, tracked over time."],
      ["Next cycle plan", "The hypotheses we propose next, for you to adjust."],
    ],
  },
  faq: [
    ["How is hunting different from monitoring?", "Monitoring waits for a rule to fire. Hunting assumes something already got past the rules and goes looking for it."],
    ["Do we need MDR to buy threat hunting?", "No. It runs on your EDR and SIEM data on its own. With MDR, confirmed findings go straight into response."],
    ["What if you find nothing?", "That is still a result: you get evidence that a technique is not in use, plus the detections and logging fixes the hunt produced."],
    ["Can we suggest hypotheses?", "Yes. Concerns from your team, recent incidents and audit findings all make good hunts."],
    ["How often do you hunt?", "Cycle length and frequency are agreed per contract and written into your SOW."],
  ],
  cta: { title: "Ask us what is hiding in your logs.", lead: "We propose three hunts for your environment and explain what each would look for." },
};

export default function Page() {
  return <ServicePage data={data} mockup={<HuntConsole />} />;
}
