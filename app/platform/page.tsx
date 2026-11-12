import type { Metadata } from "next";
import Link from "next/link";
import { Tabs } from "@/components/Tabs";
import { Arrow, Button, Card, CheckList, Section, SectionHeading } from "@/components/ui";
import { AppSidebar, AppWindow, StatTile } from "@/components/mockup";
import { HubConsole, TabMockup } from "@/components/platform/live";
import { Icon, Note, type IconName } from "@/components/platform/kit";
import { CtaButtons, Faq, FinalCta } from "@/components/sections";
import { CountUp, Reveal, Stagger } from "@/components/motion";
import { SocMap } from "@/components/graphics";
import { KpiTiles, KPIS, MTTR, SPRINT_FINDINGS, StackedBars, TrendChart } from "@/components/charts";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { PRODUCTS, productBySlug } from "@/components/platform/products";

const DESC = "The platform our consultants and SOC run on, available to you: API protection, exposure, detection, privacy and compliance on one data model.";

export const metadata: Metadata = {
  title: "Security Platform",
  description: DESC,
};

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
      <div className="container-rp relative grid grid-cols-1 items-center gap-12 pt-12 pb-16 lg:grid-cols-12 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs font-medium tracking-[0.08em] text-accent uppercase">Resilient Privacy Platform</p>
          <h1 id="hero-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">
            The platform our consultants run on. <span className="text-accent">Now yours to run.</span>
          </h1>
          <p className="mt-5 text-lead text-navy-600 text-pretty">Our testers, analysts and auditors work in this console every day. Use it yourself to keep the findings closed between engagements, or have our SOC run it for you.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButtons kind="platform" />
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <div aria-hidden className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-accent-soft to-transparent" />
          <AppWindow
            title="app.resilientprivacy.com/overview"
            label="Platform overview with one status tile per product and a combined feed of findings from API protection, detection, exposure, privacy and compliance."
            className="relative"
            sidebar={<AppSidebar items={["Overview", "APIs", "Privacy", "Detections", "Exposure", "Cloud", "Compliance"]} />}
          >
            <HubConsole tiles={
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Shadow APIs found" value={<CountUp value={23} />} delta="+4 this week" />
                <StatTile label="Open incidents" value={<span data-open className="inline-block">9</span>} delta="−5 vs yesterday" good />
                <StatTile label="Exposure score" value={<CountUp value={78} />} delta="+9 in 30 days" good className="hidden sm:block" />
                <StatTile label="SOC 2 controls passing" value={<CountUp value={92} suffix="%" />} delta="4 left" good className="hidden sm:block" />
              </div>
            } />
          </AppWindow>
          <Note className="relative text-center" />
        </div>
      </div>
    </section>
  );
}

function Overview() {
  const cards = PRODUCTS.map((p) => ({ icon: p.icon, name: p.name, category: p.kind, body: p.summary, href: `/platform/${p.slug}`, cta: "Explore" }));
  return (
    <Section tone="mist" labelledBy="ov-title">
      <Reveal><SectionHeading id="ov-title" eyebrow="Products" title="Six products. One console. One data model." lead="Each product automates work our consultants and analysts do on engagements. They share assets, owners and findings, so a pentest finding, a detection and an audit control all point at the same record." /></Reveal>
      <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.name}>
            <Link href={c.href} className="group block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon name={c.icon} /></span>
                <p className="mt-6 font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{c.category}</p>
                <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em]">{c.name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{c.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">{c.cta} <Arrow /></span>
              </Card>
            </Link>
          </div>
        ))}
      </Stagger>
      <Link href="/platform/integrations" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-canvas px-4 py-2 text-sm font-medium text-navy-800 shadow-card hover:text-accent">
        <Icon name="plug" className="size-4 text-accent" /> Connects to your SIEM, EDR, identity, cloud and ticketing tools <Arrow />
      </Link>
    </Section>
  );
}

function Showcase() {
  const picks = ["api-protection", "threat-detection", "exposure-management", "cloud-posture", "privacy-automation", "compliance-automation"].map((s) => productBySlug(s)!);
  return (
    <Section labelledBy="show-title">
      <Reveal><SectionHeading id="show-title" eyebrow="Inside the console" title="Built by the people who use it every day." lead="Every view answers three questions: what do we have, what is at risk, and who fixes it." /></Reveal>
      <Reveal><Tabs
        auto={7000}
        className="mt-10"
        listClassName="w-fit max-w-full"
        items={picks.map((p, i) => ({
          label: p.name,
          icon: <Icon name={p.icon} className="size-4" />,
          content: (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">{p.h1}</h3>
                <p className="mt-3 text-navy-600">{p.summary}</p>
                <CheckList items={p.capabilities.slice(0, 3).map((c) => c.title)} className="mt-6 text-navy-800" />
                <Link href={`/platform/${p.slug}`} className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Explore {p.name} <Arrow /></Link>
              </div>
              <div className="lg:col-span-8"><TabMockup eager={!i}>{p.mockup}</TabMockup><Note /></div>
            </div>
          ),
        }))}
      /></Reveal>
    </Section>
  );
}

const DIVISIONS: { icon: IconName; name: string; body: string; href: string }[] = [
  { icon: "consult", name: "Consulting and AI security", body: "Testers and architects take platform findings further, including AI apps and agents, and report back into the same console.", href: "/consulting" },
  { icon: "soc", name: "Managed SOC and MDR", body: "Our analysts run the platform for you 24/7, investigating and containing under playbooks you approve.", href: "/managed-services" },
  { icon: "grc", name: "Risk & Compliance", body: "Readiness and audit support, with evidence pulled straight from ComplyLoop.", href: "/grc" },
];

// Outcomes across the platform: the numbers a buyer's board asks for, each animated once in view.
function Results() {
  return (
    <Section tone="mist" labelledBy="res-title">
      <Reveal><SectionHeading id="res-title" eyebrow="Results" title="Findings closed, not just found." lead="Every product feeds one record from finding to fix to evidence, so the platform can show what got better, not only what is wrong." /></Reveal>
      <KpiTiles items={KPIS} className="mt-12" />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-card bg-canvas p-4 shadow-card ring-1 ring-line sm:p-6"><TrendChart {...MTTR} /></div>
        <div className="min-w-0 rounded-card bg-canvas p-4 shadow-card ring-1 ring-line sm:p-6"><StackedBars {...SPRINT_FINDINGS} /></div>
      </div>
    </Section>
  );
}

function Divisions() {
  return (
    <Section labelledBy="div-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal><SectionHeading id="div-title" eyebrow="Software plus people" title="Run it yourself, or have us run it." lead="The platform is the shared workspace of every Resilient Privacy practice. Whoever finds an issue, the same record carries it to the fix and the evidence." /></Reveal>
          <Stagger className="mt-8 space-y-3">
            {DIVISIONS.map((d) => (
              <Link key={d.name} href={d.href} className="group flex gap-4 rounded-card bg-canvas p-5 shadow-card transition-[translate,box-shadow] duration-(--duration-fast) hover:-translate-y-0.5 hover:shadow-lift">
                <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><Icon name={d.icon} /></span>
                <span>
                  <span className="flex items-center gap-1.5 font-semibold text-navy-950">{d.name} <Arrow /></span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-navy-600">{d.body}</span>
                </span>
              </Link>
            ))}
          </Stagger>
        </div>
        <div className="lg:col-span-7">
          <SocMap />
          <Note />
        </div>
      </div>
    </Section>
  );
}

const FAQ: [string, string][] = [
  ["How does it deploy?", "Through read-only connectors to your cloud, identity and security tools; deployment options are confirmed at scoping. Most teams connect cloud and identity accounts first."],
  ["Does it replace my SIEM or EDR?", "It can sit beside them or take over. We map it to your stack before you commit."],
  ["Where is data stored?", "In the US by default; EU hosting on request. The region is fixed in your contract before any data is connected."],
  ["Can your team run it for me?", "Yes, through Managed Services. Our SOC works in the same console you do."],
  ["Do I need the platform to hire your consultants?", "No. Every consulting engagement stands on its own. Clients who use the platform keep findings, retests and evidence in one place after we leave."],
  ["What about pricing?", "Priced per product and estate size. Book a demo for a quote."],
];

export default function PlatformPage() {
  return (
    <>
      <JsonLd data={[service({ name: "Resilient Privacy Platform", description: DESC, path: "/platform", serviceType: "Security software" }), breadcrumbs([["Home", "/"], ["Platform", "/platform"]])]} />
      <Hero />
      <Overview />
      <Showcase />
      <Results />
      <Divisions />
      <Section tone="mist" labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4"><SectionHeading id="faq-title" eyebrow="FAQ" title="Questions about the platform." /></Reveal>
          <div className="lg:col-span-8"><Faq items={FAQ} /></div>
        </div>
      </Section>
      <FinalCta title="See the platform on your own environment." lead="A 30-minute walkthrough scoped to your stack, with the products that fit your first problem." />
    </>
  );
}
