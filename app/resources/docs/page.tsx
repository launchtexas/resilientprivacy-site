import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Badge, Card, Section, SectionHeading } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { CONTACT } from "@/components/resources/data";
import { PageHero } from "@/components/resources/parts";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Get started with the Resilient Privacy platform: setup, integrations and the API reference outline.",
};

const STEPS = [
  ["Create your workspace", "Accept the invitation, sign in with your identity provider and turn on single sign-on for your team."],
  ["Connect your first source", "Add a cloud account, identity provider or code repository. Read-only access is enough to start."],
  ["Review the first findings", "Inventory and posture results appear as sources finish their first sync. Assign owners to what matters."],
  ["Route the work", "Send findings to your ticketing and chat tools so fixes happen where your teams already work."],
];
const INTEGRATIONS = [
  ["Cloud", "Cloud accounts and Kubernetes clusters"],
  ["Identity", "Identity providers and directory services"],
  ["Code", "Source control and CI/CD pipelines"],
  ["Endpoint", "EDR and device management"],
  ["Ticketing & chat", "Issue trackers and team chat"],
  ["SIEM & data", "Log platforms and data lakes"],
];
const API = [
  ["Authentication", "API keys scoped per workspace; token rotation"],
  ["Assets", "List and filter discovered assets, APIs and identities"],
  ["Findings", "Query, assign and update findings and their status"],
  ["Controls & evidence", "Read control status; upload evidence"],
  ["Webhooks", "Subscribe to finding, incident and control events"],
];

export default function Docs() {
  return (
    <>
      <PageHero eyebrow="Documentation" title="Platform documentation." lead="Set up the Resilient Privacy platform, connect your tools and automate with the API. Full documentation is available to customers in the console." />
      <Section labelledBy="start-title" className="pt-0!">
        <SectionHeading id="start-title" eyebrow="Getting started" title="From invitation to first findings." />
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="reveal">
              <Card className="h-full p-6">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{d}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>
      <Section tone="mist" labelledBy="int-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading id="int-title" eyebrow="Integrations" title="Connect the tools you already run." lead="Each integration has a setup page with the permissions it needs and the data it reads." />
            <Link href="/platform/integrations" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">See all integrations <Arrow /></Link>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">
            {INTEGRATIONS.map(([t, d]) => (
              <li key={t} className="rounded-card bg-canvas p-5 shadow-card">
                <p className="font-semibold text-navy-950">{t}</p>
                <p className="mt-1 text-sm text-navy-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section labelledBy="api-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="api-title" eyebrow="API reference" title="A REST API for everything in the console." lead="JSON over HTTPS. The outline below shows how the reference is organized." />
          <Badge tone="medium">Outline</Badge>
        </div>
        <div className="reveal mt-10 overflow-x-auto rounded-card bg-canvas shadow-card">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-mist text-navy-500"><tr><th scope="col" className="px-5 py-3 font-medium">Section</th><th scope="col" className="px-5 py-3 font-medium">Covers</th></tr></thead>
            <tbody className="divide-y divide-line">
              {API.map(([s, c]) => <tr key={s}><th scope="row" className="px-5 py-4 font-mono font-medium text-navy-950">{s}</th><td className="px-5 py-4 text-navy-600">{c}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-navy-600">Need access to the full reference or a sandbox workspace? Email <a href={`mailto:${CONTACT}`} className="font-medium text-accent hover:text-accent-hover">{CONTACT}</a>.</p>
      </Section>
      <FinalCta title="See the platform with your own data." lead="A guided demo, connected to a test environment of your choice." />
    </>
  );
}
