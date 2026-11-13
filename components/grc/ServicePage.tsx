import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, Badge, Button, Card, CheckList, Eyebrow, Section, SectionHeading, type Tone } from "@/components/ui";
import { AppSidebar, AppWindow, DataTable, Panel, StatTile } from "@/components/mockup";
import { CtaButtons, Faq as FaqList, FinalCta } from "@/components/sections";
import { GradientBorder, Reveal, Stagger } from "@/components/motion";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { GRC, type GrcService, type Status } from "./data";
import { ProcessSteps } from "@/components/motion/ProcessSteps";

export const GRC_CTA = { title: "Find out how close you are to audit-ready.", lead: "A 30-minute readiness conversation with a Risk & Compliance lead, scoped to the frameworks you are asked for.", kind: "practice" } as const;
export const AI_GOV = "/ai-security/governance";
export const PLACEHOLDER_NOTE = "Simulated environment, real workflow.";
const STATUS: Record<Status, [Tone, string]> = { pass: ["ok", "Passing"], progress: ["medium", "In progress"], gap: ["critical", "Gap"], todo: ["neutral", "Not started"] };

/* ---------- Control-progress mockup ---------- */
export function ControlMockup({ m, label }: { m: GrcService["mockup"]; label: string }) {
  return (
    <AppWindow title={m.url} label={label} sidebar={<AppSidebar items={["Overview", "Frameworks", "Controls", "Evidence", "Risks", "Vendors", "Audits"]} active={2} />}>
      <div className="bg-mist p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-navy-950">{m.heading}</p>
            <p className="text-xs text-navy-500">Evidence synced from 14 integrations</p>
          </div>
          <Badge tone="accent" dot>Audit-ready view</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {m.stats.map(([l, v, d], i) => (
            <StatTile key={l} label={l} value={v} delta={d} good={i < 2} className={i === 2 ? "hidden md:block" : undefined} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <Panel title="Progress by area">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {m.families.map(([f, v]) => (
                <li key={f}>
                  <div className="mb-1 flex justify-between gap-2 text-xs"><span className="truncate text-navy-600">{f}</span><span className="tabular-nums font-medium text-navy-950">{v}%</span></div>
                  <div className="h-1.5 rounded-full bg-cloud"><div className="h-full rounded-full bg-accent" style={{ width: `${v}%` }} /></div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Controls" action={<span className="text-micro font-medium text-accent">View all</span>}>
            <DataTable
              className="-mx-3"
              columns={["ID", "Control", "Owner", "Status"]}
              rows={m.controls.map(([id, c, o, s, ev]) => [
                <span key="id" className="font-mono text-xs whitespace-nowrap">{id}</span>,
                <span key="c">{c}{ev && <span className="block font-mono text-micro text-navy-500">{ev}</span>}</span>,
                o,
                <Badge key="s" tone={STATUS[s][0]} dot>{STATUS[s][1]}</Badge>,
              ])}
            />
          </Panel>
        </div>
      </div>
    </AppWindow>
  );
}


/* ---------- FAQ (native disclosure, no JS) ---------- */
export function Faq({ items, tone = "canvas" }: { items: [string, string][]; tone?: "canvas" | "mist" }) {
  return (
    <Section tone={tone} labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <SectionHeading id="faq-title" eyebrow="FAQ" title="Straight answers." className="lg:col-span-4" />
        <FaqList items={items} className="lg:col-span-8" />
      </div>
    </Section>
  );
}

/* ---------- Detail page template ---------- */
export function ServicePage({ s, children }: { s: GrcService; children?: ReactNode }) {
  const path = `/grc/${s.slug}`;
  return (
    <>
      <JsonLd data={[
        service({ name: s.name, description: s.lead, path, serviceType: `${s.name} compliance consulting` }),
        breadcrumbs([["Home", "/"], ["Consulting", "/consulting"], ["Risk & Compliance", "/grc"], [s.name, path]]),
      ]} />
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[480px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
        <div className="container-rp relative pt-10 pb-16 lg:pt-16 lg:pb-24">
          <nav aria-label="Breadcrumb" className="text-xs text-navy-500">
            <Link href="/consulting" className="hover:text-navy-950">Consulting</Link> <span aria-hidden>/</span>{" "}
            <Link href="/grc" className="hover:text-navy-950">Risk & Compliance</Link> <span aria-hidden>/</span> <span className="text-navy-700">{s.name}</span>
          </nav>
          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h1 id="hero-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">{s.title}</h1>
              <p className="mt-5 text-lead text-navy-600 text-pretty">{s.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaButtons kind="practice" />
              </div>
              <p className="mt-5 text-xs text-navy-500">{s.forWho}</p>
            </div>
            <div className="lg:col-span-7">
              <ControlMockup m={s.mockup} label={`${s.name} control-progress dashboard with readiness stats, progress by control area and a list of controls with status.`} />
              <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
            </div>
          </div>
        </div>
      </section>

      {children}

      {/* AI tie-in: every service names where AI lands and hands off to the AI governance practice */}
      <section aria-labelledby="ai-title" className="container-rp -mt-4 pb-16 lg:-mt-8 lg:pb-24">
        <Reveal>
          <GradientBorder className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <Badge tone="accent" className="w-fit">AI in scope</Badge>
              <h2 id="ai-title" className="mt-3 text-h3 font-semibold tracking-[-0.015em] text-navy-950">Where AI lands in {s.name}.</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600 text-pretty">{s.ai}</p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link href={AI_GOV} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent">AI governance: ISO 42001, EU AI Act <Arrow /></Link>
            </div>
          </GradientBorder>
        </Reveal>
      </section>

      {/* Readiness steps */}
      <Section tone="mist" labelledBy="steps-title">
        <SectionHeading id="steps-title" eyebrow={s.stepsHead?.[0] ?? "How readiness works"} title={s.stepsHead?.[1] ?? "Five steps from first call to audit-ready."} />
        <ProcessSteps steps={s.steps} className="mt-12" />
      </Section>

      {/* Deliverables + timeline */}
      <Section labelledBy="deliv-title">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="deliv-title" eyebrow="Deliverables" title="What you keep when we are done." lead="Documents and systems your team owns and runs, not a binder that goes stale." />
            <Reveal delay={100}><CheckList items={s.deliverables} className="mt-8 text-navy-800" /></Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={150}><Card className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">Typical timeline</h3>
                <Badge>Varies with scope</Badge>
              </div>
              <ol className="relative mt-6 space-y-6 border-l border-line pl-6">
                {s.timeline.map(([p, span, b]) => (
                  <li key={p} className="relative">
                    <span aria-hidden className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-accent ring-4 ring-canvas" />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-semibold text-navy-950">{p}</p>
                      <p className="font-mono text-micro text-navy-500 uppercase">{span}</p>
                    </div>
                    <p className="mt-1 text-[0.9375rem] text-navy-600">{b}</p>
                  </li>
                ))}
              </ol>
            </Card></Reveal>
          </div>
        </div>
      </Section>

      <Faq items={s.faq} tone="mist" />

      {/* Related */}
      <Section labelledBy="rel-title">
        <SectionHeading id="rel-title" eyebrow="Related" title="Often paired with." />
        <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {s.related.map((k) => GRC[k]).map((r) => (
              <Link key={r.slug} href={`/grc/${r.slug}`} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{r.eyebrow}</p>
                  <h3 className="mt-2 text-h3 font-semibold tracking-[-0.015em]">{r.name}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{r.title}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
                </Card>
              </Link>
          ))}
        </Stagger>
      </Section>

      <FinalCta {...GRC_CTA} />
    </>
  );
}
