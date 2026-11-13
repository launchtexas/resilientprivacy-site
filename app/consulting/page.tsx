import type { Metadata } from "next";
import Link from "next/link";
import { Tabs } from "@/components/Tabs";
import { Arrow, Badge, Button, Card, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { AppSidebar, AppWindow, DataTable, Legend, Panel, Progress, SeverityBars, StatTile } from "@/components/mockup";
import { SERVICES, bySlug, hrefOf, type Service } from "@/components/consulting/data";
import { AI_SERVICES, aiBySlug } from "@/components/ai/data";
import { CtaButtons, Faq, FinalCta } from "@/components/sections";
import { Icon, PLACEHOLDER_NOTE, ReportMockup } from "@/components/consulting/parts";
import { TestToEvidence } from "@/components/consulting/TestToEvidence";
import { Spotlight, Stagger, TabUnderline } from "@/components/motion";
import { JsonLd, SITE_URL, breadcrumbs, service } from "@/lib/schema";
import { NAV } from "@/lib/nav";
import { ProcessSteps } from "@/components/motion/ProcessSteps";

const DESC = "Cybersecurity and AI security consulting: penetration testing, red teaming, AI security, advisory and compliance from practitioners who stay until fixes ship.";
export const metadata: Metadata = { title: "Cybersecurity Consulting Services", description: DESC };

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
      <div className="container-rp relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>Cybersecurity and AI security consulting</Eyebrow>
          <h1 id="hero-title" className="mt-6 text-display font-semibold tracking-[-0.04em] text-balance text-navy-950">
            Practitioners who test, advise <span className="text-accent">and stay until the fix ships.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lead text-navy-600 text-pretty">
            Offensive security, AI security, advisory and compliance from one team. The people who find the weakness are the people who help you fix it, prove it and keep it fixed.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaButtons kind="practice" />
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-[1120px] lg:mt-20">
          <div aria-hidden className="absolute -inset-x-6 -top-6 bottom-12 rounded-[32px] bg-gradient-to-b from-accent-soft to-transparent" />
          <AppWindow
            title="app.resilientprivacy.com/engagements"
            label="Engagement portal showing open findings, fix rate and active engagements, findings by severity per month, and a table of engagements with progress."
            className="relative"
            sidebar={<AppSidebar items={["Overview", "Engagements", "Findings", "Retests", "Reports", "Attestations"]} active={1} />}
          >
            <div className="bg-mist p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-navy-950">Engagements</p>
                  <p className="text-xs text-navy-500">All business units · this year</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-micro font-medium text-navy-700 shadow-card">
                  <span className="pulse-dot size-1.5 rounded-full bg-accent" /> 2 tests live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatTile label="Open findings" value="14" delta="−9 this month" good spark={[31, 28, 26, 22, 19, 17, 14]} />
                <StatTile label="Fixed and verified" value="86%" delta="+11 pts" good spark={[61, 66, 70, 74, 79, 83, 86]} />
                <StatTile label="Median time to fix (critical)" value="6d" delta="−4d" good className="hidden sm:block" />
                <StatTile label="Active engagements" value="4" className="hidden lg:block" />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
                <Panel title="New findings by month" action={<Legend items={[["bg-critical", "Critical"], ["bg-high", "High"], ["bg-medium/70", "Medium"]]} />} className="lg:col-span-2">
                  <SeverityBars rows={[[3, 8, 12], [2, 9, 10], [4, 6, 11], [1, 5, 9], [1, 4, 7], [0, 3, 6]]} labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]} />
                </Panel>
                <Panel title="Engagements" action={<span className="text-micro font-medium text-accent">View all</span>} className="lg:col-span-3">
                  <DataTable
                    columns={["Engagement", "Type", "Status", "Fixed"]}
                    rows={[
                      ["Customer portal", "Web & API", <Badge key="a" tone="accent" dot>Testing</Badge>, <Progress key="pa" value={40} />],
                      ["Support assistant", "AI / LLM", <Badge key="b" tone="medium" dot>Reporting</Badge>, <Progress key="pb" value={65} />],
                      ["Cardholder env.", "Red team", <Badge key="c" tone="high" dot>Replay</Badge>, <Progress key="pc" value={72} />],
                      ["AWS production", "Cloud", <Badge key="d" tone="ok" dot>Retested</Badge>, <Progress key="pd" value={100} tone="bg-ok" />],
                    ]}
                  />
                </Panel>
              </div>
            </div>
          </AppWindow>
          <p className="mt-3 text-center text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
        </div>
      </div>
    </section>
  );
}

const svcCard = (s: Service): Pick<Practice["items"][number], "href" | "name" | "card" | "icon"> => ({ href: hrefOf(s), name: s.name, card: s.card, icon: s.icon });
type Practice = { id: string; name: string; lead: string; href: string; items: { href: string; name: string; card: string; icon: string }[] };
const GRC_LINKS = NAV.find((n) => n.label === "Consulting")!.groups.find((g) => g.title === "Risk & Compliance")!.links.slice(1);
const PRACTICES: Practice[] = [
  { id: "offensive", name: "Offensive Security", lead: "Attack your apps, infrastructure and people the way a real adversary would.", href: "/consulting/penetration-testing", items: ["penetration-testing", "red-team", "appsec"].map((x) => svcCard(bySlug(x)!)) },
  { id: "ai", name: "AI Security", lead: "Test, govern and safely adopt models, agents and MCP tool chains.", href: "/ai-security", items: AI_SERVICES.map(svcCard) },
  { id: "advisory", name: "Security Advisory", lead: "Senior judgment on architecture, leadership and what to fund first.", href: "/consulting/vciso", items: [...["architecture", "vciso"].map((x) => svcCard(bySlug(x)!)), { href: "/consulting/how-we-work", name: "How we work", card: "Method, engagement models, severity rubric and retest policy, in the open.", icon: "M4 6h16M4 12h10M4 18h7" }] },
];

function Practices() {
  return (
    <Section tone="mist" labelledBy="off-title">
      <SectionHeading id="off-title" eyebrow="Practices" title="Four practices. One team behind every engagement." lead="Every engagement has a named lead, a fixed scope and findings your engineers can act on the same day." />
      <div className="mt-12 space-y-12">
        {PRACTICES.map((p) => (
          <div key={p.id} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="reveal lg:col-span-3">
              <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">{p.name}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{p.lead}</p>
              {p.id === "ai" && <Link href="/ai-security" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">AI Security practice <Arrow /></Link>}
            </div>
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-9">
              {p.items.map((s) => (
                <Spotlight key={s.href} className="h-full rounded-card">
                  <Link href={s.href} className="group block h-full">
                    <Card interactive className="flex h-full flex-col p-6">
                      <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={s.icon} /></span>
                      <h4 className="mt-5 text-h3 font-semibold tracking-[-0.015em]">{s.name}</h4>
                      <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{s.card}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
                    </Card>
                  </Link>
                </Spotlight>
              ))}
            </Stagger>
          </div>
        ))}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="reveal lg:col-span-3">
            <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">Risk & Compliance</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Readiness, evidence and audits, fed by the testing above.</p>
            <Link href="/grc" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Risk & Compliance overview <Arrow /></Link>
          </div>
          <Stagger className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
            {GRC_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="group flex h-full flex-col rounded-card bg-canvas p-4 shadow-card transition-[translate,box-shadow] duration-(--duration-fast) hover:-translate-y-0.5 hover:shadow-lift">
                <span className="text-sm font-semibold text-navy-950 group-hover:text-accent">{l.label}</span>
                <span className="mt-1 text-[0.8125rem] text-navy-600">{l.desc}</span>
              </Link>
            ))}
          </Stagger>
        </div>
      </div>
      <Card className="reveal mt-12 grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:items-center lg:p-8">
        <div className="lg:col-span-5">
          <h3 className="text-h3 font-semibold tracking-[-0.015em]">Readiness exercises</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Practice the bad day before it happens, and check what you are buying before you buy it.</p>
        </div>
        <CheckList className="text-navy-800 sm:columns-2 sm:gap-8 sm:[&>li]:break-inside-avoid sm:[&>li]:mb-2.5 sm:space-y-0 lg:col-span-7" items={["Ransomware tabletop exercises", "Breach and crisis simulations", "M&A cyber due diligence", "Post-quantum readiness reviews"]} />
      </Card>
    </Section>
  );
}

function Showcase() {
  const picks = [bySlug("penetration-testing")!, bySlug("red-team")!, aiBySlug("red-teaming"), bySlug("vciso")!];
  const tabLabel: Record<string, string> = { "penetration-testing": "Pentest", "red-team": "Red team", "red-teaming": "AI / LLM", vciso: "vCISO" };
  return (
    <Section labelledBy="show-title">
      <SectionHeading id="show-title" eyebrow="Reports" title="Findings your engineers can fix on day one." lead="Every report uses the same format: impact, evidence, a specific fix and a verified status. Results sync to your tracker and the Resilient Privacy console." />
      <TabUnderline className="reveal mt-10">
      <Tabs
        listClassName="w-fit max-w-full"
        items={picks.map((s) => ({
          label: tabLabel[s.slug],
          icon: <Icon d={s.icon} className="size-4" />,
          content: (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">{s.name}</h3>
                <p className="mt-3 text-navy-600">{s.card}</p>
                <CheckList items={s.deliverables.slice(0, 3).map(([t]) => t)} className="mt-6 text-navy-800" />
                <Link href={hrefOf(s)} className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Learn more<span className="sr-only"> about {s.name}</span> <Arrow /></Link>
              </div>
              <div className="lg:col-span-8">
                <ReportMockup s={s} />
                <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
              </div>
            </div>
          ),
        }))}
      />
      </TabUnderline>
    </Section>
  );
}

function HowWeWork() {
  const steps = [
    ["Scope", "One call with a senior practitioner to agree targets, timing and a fixed quote.", "Fixed quote"],
    ["Test", "Testers and advisors work the plan, and flag anything critical to you the same day.", "Same-day critical flag"],
    ["Fix", "Findings land in your tracker with evidence and a specific fix. We pair on the hard ones.", "Tracker tickets"],
    ["Prove", "We retest, then issue a report and attestation you can share with customers and auditors.", "Attestation letter"],
  ] as const;
  return (
    <Section tone="mist" labelledBy="how-title">
      <SectionHeading id="how-title" eyebrow="How we work" title="From first call to verified fix." align="center" lead={<Link href="/consulting/how-we-work" className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover">Engagement models, severity rubric and retest policy <Arrow /></Link>} />
      <ProcessSteps steps={steps} className="mt-14" />
    </Section>
  );
}

function Stays() {
  return (
    <Section labelledBy="div-title">
      <SectionHeading id="div-title" eyebrow="Advice that stays" title="A finding is not done until it's fixed, watched and proven." lead="Our 24/7 SOC turns red-team results into detections, and our compliance team files the retest as audit evidence. Same people, same finding, start to finish." />
      <TestToEvidence className="mt-12" />
      <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
      <div className="reveal mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        <Link href="/managed-services" className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover">Managed SOC <Arrow /></Link>
        <Link href="/grc" className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover">Risk & Compliance <Arrow /></Link>
        <Link href="/platform" className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover">Platform <Arrow /></Link>
      </div>
    </Section>
  );
}

const FAQ: [string, string][] = [
  ["How long is a pentest?", "Typically one to three weeks, depending on scope."],
  ["What do I receive?", "A clear report, an executive summary, fix guidance and a retest."],
  ["Can results go to auditors or customers?", "Yes, in a shareable letter of attestation."],
  ["Do you test AI systems?", "Yes, through our AI Security practice: models, agents, RAG pipelines and MCP tool chains, plus the governance around them."],
  ["How do you price engagements?", "Fixed scope, fixed fee, agreed before work starts. You get a written quote after the scoping call."],
  ["Do you offer continuous testing?", "Yes, on a rolling schedule with a live findings view."],
];

export default function ConsultingPage() {
  return (
    <>
      <JsonLd data={[
        service({ name: "Cybersecurity and AI security consulting", description: DESC, path: "/consulting", type: "ProfessionalService" }),
        breadcrumbs([["Home", "/"], ["Consulting", "/consulting"]]),
        { "@type": "ItemList", name: "Consulting services", itemListElement: [...SERVICES, ...AI_SERVICES].map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: SITE_URL + hrefOf(s) })) },

      ]} />
      <Hero />
      <Practices />
      <Showcase />
      <HowWeWork />
      <Stays />
      <Section tone="mist" labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear most." className="lg:col-span-4" />
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </Section>
      <div className="pt-20 lg:pt-28">
        <FinalCta kind="practice" title="Find out what an attacker would find." lead="A 30-minute call with a senior practitioner, scoped to your environment." />
      </div>
    </>
  );
}
