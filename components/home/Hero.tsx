import Link from "next/link";
import { CtaButtons } from "@/components/sections";
import { Tabs } from "@/components/Tabs";
import { Arrow, Badge, Button } from "@/components/ui";
import { Marquee, Parallax } from "@/components/motion";
import { MdrConsole } from "@/components/managed/mockups";
import { ReportMockup } from "@/components/consulting/parts";
import { SERVICES } from "@/components/consulting/data";
import { AI_SERVICES } from "@/components/ai/data";
import { AlertList, AppSidebar, AppWindow, AreaChart, Legend, Panel, StatTile, type Alert } from "@/components/mockup";
import { Icon, PLACEHOLDER_NOTE } from "./icons";

// The AI red-team sample report lives with the AI practice data.
const AI_REPORT = AI_SERVICES.find((s) => s.slug === "red-teaming") ?? AI_SERVICES[0];

function PlatformConsole() {
  const alerts: Alert[] = [
    { sev: "critical", title: "Admin endpoint without auth · CWE-306", meta: "api.example.com · GET /v2/admin/users", time: "2m" },
    { sev: "high", title: "Sign-in from new country · T1078.004", meta: "svc-billing@example.com · 203.0.113.47 · contained", time: "9m" },
    { sev: "medium", title: "S3 ListBucket allowed to *", meta: "arn:aws:s3:::prod-exports · 111122223333", time: "31m" },
    { sev: "ok", title: "Phishing link quarantined · T1566.002", meta: "M365 · 14 mailboxes", time: "1h" },
  ];
  return (
    <AppWindow
      title="app.resilientprivacy.com/overview"
      label="Resilient Privacy console overview showing open findings, monitored APIs, a weekly alert trend and an alert feed. Example data."
      sidebar={<AppSidebar items={["Overview", "Findings", "API inventory", "Detections", "Privacy", "Compliance", "Reports"]} />}
    >
      <div className="bg-mist p-4 sm:p-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-navy-950">Security overview</p>
          <p className="text-xs text-navy-500">Example Corp · all environments · last 7 days</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatTile label="Open critical findings" value="7" delta="−42% vs last week" good spark={[14, 13, 12, 12, 10, 9, 7]} />
          <StatTile label="APIs monitored" value="1,284" delta="+36 discovered" good spark={[1180, 1200, 1210, 1236, 1250, 1270, 1284]} />
          <StatTile label="SOC 2 readiness" value="92%" delta="7 of 89 controls left" good className="hidden lg:block" />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
          <Panel title="Alerts triaged" action={<Legend items={[["bg-accent", "This week"], ["bg-navy-300", "Last week"]]} />} className="lg:col-span-3">
            <AreaChart data={[42, 55, 48, 70, 64, 82, 76, 90, 84, 98, 92, 104]} compare={[38, 44, 46, 50, 58, 54, 60, 66, 63, 70, 68, 72]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
          </Panel>
          <Panel title="Alerts · newest first" className="lg:col-span-2">
            <AlertList alerts={alerts} />
          </Panel>
        </div>
      </div>
    </AppWindow>
  );
}

const Labeled = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <p className="mt-3 text-center text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
  </>
);

// Platforms RP secures and works in. Unaltered Simple Icons marks, one-colour via CSS mask; sources in public/logos/SOURCES.md.
// Splunk's mark is a wordmark centred in a square viewBox: no extra label, and cover-scaled so it reaches the row height.
const PLATFORMS: [slug: string, name: string, wordmark?: true][] = [
  ["googlecloud", "Google Cloud"], ["kubernetes", "Kubernetes"], ["docker", "Docker"], ["terraform", "Terraform"],
  ["github", "GitHub"], ["cloudflare", "Cloudflare"], ["okta", "Okta"], ["splunk", "Splunk", true],
  ["elastic", "Elastic"], ["datadog", "Datadog"], ["paloaltonetworks", "Palo Alto Networks"], ["anthropic", "Anthropic"],
];

export function Hero() {
  // Consulting first; each tab is that practice's own work artefact.
  const tabs = [
    { label: "Consulting", icon: <Icon name="consult" className="size-4" />, content: <Labeled><ReportMockup s={SERVICES[0]} /></Labeled> },
    {
      label: "AI Security",
      icon: <Icon name="ai" className="size-4" />,
      // The attack-surface scene plays in the AI section below; the tab shows the report it produces.
      content: <Labeled><ReportMockup s={AI_REPORT} /></Labeled>,
    },
    { label: "Managed SOC", icon: <Icon name="soc" className="size-4" />, content: <Labeled><MdrConsole /></Labeled> },
    { label: "Platform", icon: <Icon name="platform" className="size-4" />, content: <Labeled><PlatformConsole /></Labeled> },
  ];
  return (
    <section aria-labelledby="hero-title" className="bg-hero-wash relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-60" />
      <Parallax speed={1.2} className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2">
        <div aria-hidden className="h-72 w-[720px] rounded-full bg-accent/15 blur-3xl" />
      </Parallax>
      <div className="container-rp relative pt-12 pb-16 lg:pt-20 lg:pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <Link href="/resources/blog/ai-agent-mcp-security" className="group inline-flex max-w-full items-center gap-2 rounded-full bg-canvas py-1 pr-3 pl-1 text-xs font-medium text-navy-700 shadow-card transition-shadow hover:shadow-lift">
            <Badge tone="accent">Research</Badge> <span className="truncate">Securing AI agents and MCP tools</span> <Arrow />
          </Link>
          <h1 id="hero-title" className="mt-6 text-display font-semibold tracking-[-0.04em] text-balance text-navy-950">
            We red-team your AI <span className="text-accent">before the internet does.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lead text-navy-600 text-pretty">
            We break, secure and govern the systems and the AI you run: applications, cloud, identity, models, agents and their tools. Then we stay until the fix is shipped, monitored and proven to an auditor.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaButtons kind="practice" />
          </div>
          <p className="mt-5 text-xs text-navy-500">Offensive Security · AI Security · Security Advisory · Risk & Compliance</p>
        </div>

        <div className="mx-auto mt-14 max-w-[1160px] lg:mt-16">
          <Tabs variant="strip" items={tabs} panelClassName="sm:rounded-frame sm:bg-accent-soft sm:p-4 sm:ring-1 sm:ring-accent/10" />
        </div>

        <div className="mx-auto mt-16 max-w-5xl text-center lg:mt-20">
          <p className="text-sm text-navy-600">Platforms we secure and work in</p>
          <Marquee label="Platforms we secure and work in" className="mt-6">
            {PLATFORMS.map(([slug, name, wordmark]) => (
              <span key={slug} role="img" aria-label={name} className="flex h-7 shrink-0 items-center gap-2 text-navy-500 transition-colors hover:text-navy-700">
                <span aria-hidden className={`h-full bg-current [mask-position:center] [mask-repeat:no-repeat] ${wordmark ? "w-24 [mask-size:cover]" : "w-7 [mask-size:contain]"}`} style={{ maskImage: `url(/logos/${slug}.svg)` }} />
                {!wordmark && <span aria-hidden className="text-base font-semibold whitespace-nowrap">{name}</span>}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
