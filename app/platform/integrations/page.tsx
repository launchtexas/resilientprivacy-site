import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Button, Card, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/platform/kit";
import { CtaButtons, FinalCta } from "@/components/sections";
import { Reveal, Stagger } from "@/components/motion";
import { JsonLd, breadcrumbs } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Platform Integrations",
  description: "Connect SIEM, EDR, identity, cloud, ticketing and chat tools to the Resilient Privacy platform.",
};

// shortcut: categories only; vendor connector list is withheld until RP confirms supported integrations.
const GROUPS: { title: string; flows: string; uses: string[] }[] = [
  { title: "Identity providers", flows: "Sign-ins, sessions, groups and admin changes", uses: ["Identity threat detection", "Access review evidence", "Owner mapping"] },
  { title: "Endpoint (EDR / XDR)", flows: "Process, file and network telemetry; isolation actions", uses: ["Incident correlation", "Host containment playbooks"] },
  { title: "Cloud providers", flows: "Configuration, audit logs, workloads and identities", uses: ["Cloud posture", "Exposure discovery", "Compliance evidence"] },
  { title: "SIEM and data lakes", flows: "Alerts and logs in; incidents and findings out", uses: ["Run beside your SIEM", "Forward enriched incidents"] },
  { title: "API gateways and ingress", flows: "Traffic metadata and policy enforcement", uses: ["API inventory", "Inline protection"] },
  { title: "Code and CI/CD", flows: "Repositories, pull requests and pipeline results", uses: ["IaC and API tests in pipelines", "Fix suggestions in pull requests"] },
  { title: "Ticketing and ITSM", flows: "Two-way ticket sync with status and owners", uses: ["Remediation routing", "SLA tracking"] },
  { title: "Chat and paging", flows: "Notifications and approvals", uses: ["Incident alerts", "Playbook approvals in chat"] },
  { title: "SaaS and data stores", flows: "Records, sharing settings and activity", uses: ["Personal data discovery", "SaaS threat detection"] },
];

export default function IntegrationsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([["Home", "/"], ["Platform", "/platform"], ["Integrations", "/platform/integrations"]])} />
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
        <div className="container-rp relative pt-10 pb-12 lg:pt-16 lg:pb-16">
          <nav aria-label="Breadcrumb" className="text-sm text-navy-500">
            <Link href="/platform" className="hover:text-navy-900">Platform</Link> <span aria-hidden>/</span> <span className="text-navy-800">Integrations</span>
          </nav>
          <div className="mt-8 max-w-3xl">
            <Eyebrow>Integrations</Eyebrow>
            <h1 id="hero-title" className="mt-5 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">Connect once. Every product uses it.</h1>
            <p className="mt-5 text-lead text-navy-600 text-pretty">The platform reads from the tools you already run and writes back to the ones your teams work in. No rip and replace.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButtons kind="platform" />
            </div>
          </div>
        </div>
      </section>

      <Section tone="mist" labelledBy="cat-title">
        <Reveal><SectionHeading id="cat-title" eyebrow="Categories" title="What connects, and what it powers." lead="Each category lists the data that flows in or out and what the products and our analysts do with it. Named connectors and versions are confirmed during scoping." /></Reveal>
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <Card className="h-full p-6">
                <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon name="plug" /></span>
                <h2 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{g.title}</h2>
                <p className="mt-2 text-[0.9375rem] text-navy-600">{g.flows}</p>
                <CheckList items={g.uses} className="mt-5 text-navy-800" />
              </Card>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section labelledBy="api-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="api-title" eyebrow="Open API" title="Not on the list? Build it." lead="Everything in the console is available through a REST API and webhooks, so you can push findings anywhere." />
          </div>
          <div role="img" aria-label="Example API request that lists open critical findings." className="lg:col-span-7">
            <pre aria-hidden className="overflow-x-auto rounded-card bg-navy-950 p-5 font-mono text-xs leading-relaxed text-navy-300 shadow-window">
{`$ curl https://api.resilientprivacy.com/v1/findings \\
    -H "Authorization: Bearer $RP_TOKEN" \\
    -G -d severity=critical -d status=open

{ "data": [
    { "id": "fnd_8Q2", "product": "api-protection",
      "title": "Admin endpoint with no auth",
      "asset": "GET /v2/admin/users", "owner": "identity-team" }
] }`}
            </pre>
            <p className="mt-3 text-micro text-navy-500">Illustrative request, not the published schema</p>
          </div>
        </div>
      </Section>

      <FinalCta title="Map the platform to your stack." lead="Tell us what you run today and we'll show you what connects on day one." />
    </>
  );
}
