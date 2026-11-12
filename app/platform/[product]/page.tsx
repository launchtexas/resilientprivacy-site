import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tabs } from "@/components/Tabs";
import { Arrow, Badge, Button, Card, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { Icon, Note } from "@/components/platform/kit";
import { ReplayAtEnd } from "@/components/platform/live";
import { CtaButtons, Faq, FinalCta } from "@/components/sections";
import { Reveal, Stagger } from "@/components/motion";
import { AttackPath, ComplianceRing, PentestTerminal, ThreatPipeline } from "@/components/graphics";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { PRODUCTS, productBySlug, type Capability } from "@/components/platform/products";
import { ProcessSteps } from "@/components/motion/ProcessSteps";

type Props = { params: Promise<{ product: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PRODUCTS.map((p) => ({ product: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = productBySlug((await params).product);
  return p ? { title: `${p.name} · ${p.kind}`, description: p.summary } : {};
}

// One signature graphic per product where it shows the hand-off to people (DESIGN.md › Motion budget).
const GRAPHIC: Record<string, { node: ReactNode; caption: string }> = {
  "api-protection": { node: <PentestTerminal />, caption: "A tester takes a risky endpoint further and writes the finding." },
  "exposure-management": { node: <AttackPath className="mx-auto max-w-xl" />, caption: "A validated path to the database, closed by one fix." },
  "cloud-posture": { node: <AttackPath className="mx-auto max-w-xl" />, caption: "Misconfigurations chained into a path, then closed at the weakest hop." },
  "threat-detection": { node: <ThreatPipeline />, caption: "Signal, SOC triage, fix and audit evidence on one record." },
  "compliance-automation": { node: <ComplianceRing />, caption: "Control coverage per framework, refreshed from your tools." },
};

function CapabilityPane({ c }: { c: Capability }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <h3 className="text-h3 font-semibold tracking-[-0.015em]">{c.title}</h3>
        <p className="mt-3 max-w-xl text-navy-600 text-pretty">{c.body}</p>
        <CheckList items={c.points} className="mt-6 text-navy-800" />
      </div>
      <Card className="p-6 lg:col-span-5">
        <Eyebrow className="text-navy-500">What you get</Eyebrow>
        <dl className="mt-4 divide-y divide-line">
          {c.outputs.map(([what, who]) => (
            <div key={what} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="font-medium text-navy-950">{what}</dt>
              <dd className="text-right text-sm text-navy-500">{who}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const p = productBySlug((await params).product);
  if (!p) notFound();
  const others = PRODUCTS.filter((o) => o.slug !== p.slug);
  const path = `/platform/${p.slug}`;
  const g = GRAPHIC[p.slug];

  return (
    <>
      <JsonLd data={[service({ name: `${p.name} · ${p.kind}`, description: p.summary, path, serviceType: p.category }), breadcrumbs([["Home", "/"], ["Platform", "/platform"], [p.name, path]])]} />
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[480px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
        <div className="container-rp relative pt-10 pb-16 lg:pt-16 lg:pb-24">
          <nav aria-label="Breadcrumb" className="text-sm text-navy-500">
            <Link href="/platform" className="hover:text-navy-900">Platform</Link> <span aria-hidden>/</span> <span className="text-navy-800">{p.name}</span>
          </nav>
          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon name={p.icon} /></span>
              <Eyebrow>{p.name} · {p.kind}</Eyebrow>
            </div>
            <h1 id="hero-title" className="mt-5 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">{p.h1}</h1>
            <p className="mt-5 max-w-2xl text-lead text-navy-600 text-pretty">{p.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButtons kind="platform" />
            </div>
          </div>
          <div className="relative mt-12 lg:mt-16">
            <div aria-hidden className="absolute -inset-x-6 -top-6 bottom-12 rounded-[32px] bg-gradient-to-b from-accent-soft to-transparent" />
            <div className="relative"><ReplayAtEnd>{p.mockup}</ReplayAtEnd></div>
            <Note className="text-center" />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <Section tone="mist" labelledBy="cap-title">
        <Reveal><SectionHeading id="cap-title" eyebrow="Capabilities" title={`What ${p.name} does.`} lead={p.summary} /></Reveal>
        <Reveal><Tabs items={p.capabilities.map((c) => ({ label: c.label, content: <CapabilityPane c={c} /> }))} className="mt-10" listClassName="w-fit max-w-full" /></Reveal>
      </Section>

      {/* Proof: the charts that show the product doing its job (each plays once in view) */}
      <Section labelledBy="proof-title">
        <Reveal><SectionHeading id="proof-title" eyebrow="The proof" title={p.proof.title} lead={p.proof.lead} /></Reveal>
        <div className={p.proof.charts.length > 1 ? "mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2" : "mt-12"}>
          {p.proof.charts.map((c, i) => <div key={i} className="min-w-0 rounded-card bg-canvas p-4 shadow-card ring-1 ring-line sm:p-6">{c}</div>)}
        </div>
      </Section>

      {/* Delivered with consulting */}
      <Section tone="mist" labelledBy="with-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className={g ? "lg:col-span-5" : "lg:col-span-12"}>
            <Reveal><SectionHeading id="with-title" eyebrow="Delivered with consulting" title="Software that keeps the advice working." lead="The same practitioners who test, govern and monitor your systems work in this console, so their findings land where your team already looks." /></Reveal>
            <Stagger className={g ? "mt-8 space-y-3" : "mt-8 grid grid-cols-1 gap-3 md:grid-cols-2"}>
              {p.consulting.map(([label, href, how]) => (
                <Link key={href} href={href} className="group block rounded-card bg-canvas p-5 shadow-card ring-1 ring-line transition-[translate,box-shadow] duration-(--duration-fast) hover:-translate-y-0.5 hover:shadow-lift">
                  <span className="flex items-center gap-1.5 font-semibold text-navy-950">{label} <Arrow /></span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-navy-600">{how}</span>
                </Link>
              ))}
            </Stagger>
          </div>
          {g && (
            <figure className="lg:col-span-7">
              {g.node}
              <figcaption className="mt-3 text-micro text-navy-500">{g.caption} Illustrative product data</figcaption>
            </figure>
          )}
        </div>
      </Section>

      {/* How it works */}
      <Section labelledBy="how-title">
        <Reveal><SectionHeading id="how-title" eyebrow="How it works" title={`${p.name}, from first connection to running.`} lead="Most teams start with read-only connections and switch on automation once they trust the results. Deployment is scoped in the first call." /></Reveal>
        <ProcessSteps steps={p.steps} className="mt-12" />
      </Section>

      {/* Integrations + related */}
      <Section tone="mist" labelledBy="int-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading id="int-title" eyebrow="Integrations" title="Works with the stack you have." lead="Connect once and the data feeds every RP product. Specific connectors are listed on the integrations page." />
            <Link href="/platform/integrations" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">All integrations <Arrow /></Link>
          </div>
          <div className="lg:col-span-7">
            <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {p.integrations.map((t) => (
                <div key={t} className="flex items-center gap-3 rounded-card bg-canvas p-4 shadow-card ring-1 ring-line">
                  <span className="grid size-8 place-items-center rounded-control bg-cloud text-navy-600"><Icon name="plug" className="size-4" /></span>
                  <span className="font-medium text-navy-900">{t}</span>
                </div>
              ))}
            </Stagger>
            <p className="mt-3 text-micro text-navy-500">Supported connectors and versions are confirmed at scoping</p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear." />
            <p className="mt-6 text-sm font-medium text-navy-500">Also on the platform</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/platform/${o.slug}`} className="inline-flex min-h-10 items-center"><Badge className="py-1 hover:bg-line">{o.category}</Badge></Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8"><Faq items={p.faqs} /></div>
        </div>
      </Section>

      <FinalCta title={`See ${p.name} on your own environment.`} lead="A 30-minute walkthrough scoped to your stack, with a look at what it would find first." />
    </>
  );
}
