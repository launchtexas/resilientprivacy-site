import type { Metadata } from "next";
import { Gauge, TrendChart } from "@/components/charts";
import { ServicePage, type ServiceData } from "@/components/managed/kit";
import { NocConsole } from "@/components/managed/mockups";

export const metadata: Metadata = {
  title: "Managed NOC Services",
  description: "Managed NOC services: network monitoring, patching and change control around the clock, with clear uptime reporting.",
};

const data: ServiceData = {
  href: "/managed-services/noc",
  name: "Managed NOC",
  eyebrow: "Managed NOC",
  title: "Your network, watched and maintained around the clock.",
  lead: "Engineers monitor sites, devices and cloud links, fix what breaks, and run patching and changes in agreed windows. You get uptime numbers you can show the board.",
  note: "Works with most major network, SD-WAN and cloud vendors. Yours are confirmed at scoping.",
  model: {
    title: "Watched, patched and changed on schedule.",
    lead: "Outages and incidents often start in the same place. Our NOC and SOC share one case system, so a failing firewall is never just an IT ticket.",
    coverage: [
      ["Hours", "24/7/365 monitoring; remediation in agreed hours or around the clock"],
      ["Scope", "Routers, switches, firewalls, Wi-Fi, SD-WAN, servers and cloud network links"],
      ["Change control", "Planned changes with risk rating, rollback plan and your approval"],
      ["Patching", "Monthly cycle for network gear and servers, emergency patches on demand"],
      ["Your contact", "Named service manager plus a shared ticket queue"],
    ],
    steps: [
      { title: "Monitor", body: "Availability, latency, capacity and configuration drift across every site and link.", when: "Continuous", clock: ["00:00", "link down"] },
      { title: "Diagnose", body: "An engineer works out whether the cause is hardware, carrier, config or a security event.", when: "Target: per priority, in your SOW", clock: ["00:06", "carrier fault"] },
      { title: "Fix or escalate", body: "We fix what we manage, and chase carriers and vendors for what we do not.", when: "Restore target: per site, in your SOW", clock: ["00:40", "service restored"] },
      { title: "Close and learn", body: "Each P1 gets a short root-cause note and a change to stop it happening again.", when: "Within the window agreed in your SOW", clock: ["+2d", "root-cause note"] },
    ],
    commits: [
      ["Time to respond", "Alert fires → an engineer is working it"],
      ["Time to restore", "Incident opened → service back, per site"],
      ["Root-cause note", "P1 closed → written cause and fix delivered"],
    ],
    slaColumns: ["Updates to you", "Fix lands"],
    slas: [
      ["Critical", "Continuous until restored", "Immediately"],
      ["High", "Interval set in your SOW", "Immediately"],
      ["Medium", "Daily", "Scheduled with you"],
      ["Low", "On change", "Next maintenance window"],
    ],
  },
  metrics: {
    eyebrow: "Uptime you can report on",
    title: "Less downtime every month, and headroom before it runs out.",
    lead: "Root-cause fixes after each P1 bring unplanned downtime down; capacity is watched so a link is upgraded before it saturates.",
    charts: [
      <TrendChart key="t" title="Unplanned downtime across all sites" desc="Minutes per month; the line marks the 99.9% availability budget." unit="m" target={{ label: "99.9% budget 43m", value: 43 }}
        points={[{ label: "Jan", value: 128 }, { label: "Feb", value: 96 }, { label: "Mar", value: 71 }, { label: "Apr", value: 64 }, { label: "May", value: 41 }, { label: "Jun", value: 35 }, { label: "Jul", value: 22 }, { label: "Aug", value: 18 }]} />,
      <div key="g" className="grid grid-cols-1 gap-6 min-[30rem]:grid-cols-2">
        <Gauge title="Busiest WAN link" desc="Peak utilisation last 30 days." label="Peak use" value={62} note="Upgrade planned at 75" />
        <Gauge title="Firewall cluster" desc="Peak CPU last 30 days." label="Peak CPU" value={38} note="Headroom for 2× traffic" />
      </div>,
    ],
  },
  monthly: {
    lead: "A monthly service review with your service manager, and the reports behind it.",
    items: [
      ["Uptime report", "Availability by site and service against the target in your contract."],
      ["Incident summary", "Every outage and degradation, root cause and time to restore."],
      ["Patch status", "Devices patched, pending and exempt, with the reason for each exemption."],
      ["Change record", "Changes made, their outcome and any rollbacks."],
      ["Capacity outlook", "Links and devices nearing limits, with the date they will hit them."],
      ["End-of-life list", "Hardware and firmware going out of support in the next 12 months."],
    ],
  },
  faq: [
    ["Do you replace our IT team?", "No. Most customers keep their team for projects and users, and hand us monitoring, patching and out-of-hours response."],
    ["Can you work with our carriers and vendors?", "Yes. With a letter of authority we open and chase tickets with your carriers and hardware vendors directly."],
    ["How do you handle changes?", "Every change has a risk rating, a rollback plan and your approval, and runs in a window you agree."],
    ["What uptime do you guarantee?", "Targets are set per site and service in your contract and reported monthly."],
    ["Why buy NOC from a security company?", "Because a failed firewall update and an attack look the same at 3 a.m. Our NOC and SOC see the same cases."],
  ],
  cta: { title: "Know your network is up before your users ask.", lead: "We map your sites and devices and show what 24/7 NOC coverage would look like." },
};

export default function Page() {
  return <ServicePage data={data} mockup={<NocConsole />} />;
}
