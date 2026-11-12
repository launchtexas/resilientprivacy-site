// Detail page template shared by /consulting/<slug> and /ai-security/<slug>. Pages pass the service, crumbs and an optional signature graphic.
import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { Arrow, Button, Card, CheckList, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { CtaButtons, Faq, FinalCta } from "@/components/sections";
import { Spotlight, Stagger } from "@/components/motion";
import { AI_SERVICES } from "@/components/ai/data";
import { SERVICES, hrefOf, type Service } from "./data";
import { Icon, PLACEHOLDER_NOTE, ReportMockup } from "./parts";
import { ProcessSteps } from "@/components/motion/ProcessSteps";

type CardInfo = { name: string; card: string; icon: string };
const OTHER: Record<string, CardInfo> = {
  "/managed-services/threat-hunting": { name: "Threat Hunting", card: "Red-team techniques become hunts and detections our 24/7 SOC runs.", icon: "M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M21 21l-5-5" },
  "/consulting/how-we-work": { name: "How we work", card: "Our method, engagement models, severity rubric and retest policy, in the open.", icon: "M4 6h16M4 12h10M4 18h7" },
  "/grc": { name: "Risk & Compliance", card: "SOC 2, ISO 27001, privacy and audit readiness from the same team.", icon: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" },
  "/grc/iso-27001": { name: "ISO 27001", card: "Build the ISMS your AI management system can share.", icon: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" },
  "/grc/vendor-risk": { name: "Vendor Risk", card: "Third-party due diligence, including the AI vendors you buy from.", icon: "M4 7h16v12H4zM9 7V4h6v3" },
};
const CATALOG: Record<string, CardInfo> = { ...OTHER, ...Object.fromEntries([...SERVICES, ...AI_SERVICES].map((s) => [hrefOf(s), s])) };

export function ServiceView({ s, crumbs, graphic, children }: {
  s: Service;
  /** Parent crumbs below Home, e.g. [["Consulting", "/consulting"]]. */
  crumbs: [string, string][];
  /** Signature graphic shown beside the methodology. */
  graphic?: { title: string; lead: string; node: ReactNode };
  /** Extra sections after the methodology. */
  children?: ReactNode;
}) {
  const path = hrefOf(s);
  const trail: [string, string][] = [["Home", "/"], ...crumbs, [s.name, path]];
  return (
    <>
      <JsonLd data={[service({ name: s.name, description: s.desc, path }), breadcrumbs(trail)]} />

      <section aria-labelledby="svc-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-60" />
        <div aria-hidden className="absolute -top-40 right-0 h-80 w-[560px] rounded-full bg-accent-soft blur-3xl" />
        <div className="container-rp relative pt-10 pb-16 lg:pt-16 lg:pb-24">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-500">
              {trail.slice(1, -1).map(([l, h]) => (
                <li key={h} className="flex items-center gap-1.5"><Link href={h} className="hover:text-navy-950">{l}</Link><span aria-hidden>/</span></li>
              ))}
              <li aria-current="page" className="text-navy-800">{s.name}</li>
            </ol>
          </nav>
          <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Eyebrow>{s.kicker} · {s.name}</Eyebrow>
              <h1 id="svc-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">{s.title}</h1>
              <p className="mt-5 text-lead text-navy-600 text-pretty">{s.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaButtons kind="practice" />
              </div>
              <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-line shadow-hairline sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {s.glance.map(([k, v]) => (
                  <div key={k} className="bg-canvas p-4">
                    <dt className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">{k}</dt>
                    <dd className="mt-1 text-sm font-medium text-navy-950">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-7">
              <ReportMockup s={s} />
              <p className="mt-3 text-micro text-navy-500">{PLACEHOLDER_NOTE}</p>
            </div>
          </div>
        </div>
      </section>

      <Section tone="mist" labelledBy="scope-title">
        <SectionHeading id="scope-title" eyebrow="Scope" title="What we cover." lead="Pick what matters for this engagement. We help you scope it in the first call." />
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.scope.map(([t, b]) => (
            <Spotlight key={t} className="h-full rounded-card">
              <Card className="h-full p-6">
                <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={s.icon} /></span>
                <h3 className="mt-5 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
              </Card>
            </Spotlight>
          ))}
        </Stagger>
      </Section>

      <Section labelledBy="method-title">
        <SectionHeading id="method-title" eyebrow="Methodology" title="How the engagement runs." lead={graphic ? undefined : "Five steps, the same on every engagement, with a named lead from scoping to sign-off."} />
        <ProcessSteps steps={s.steps} className="mt-12" />
        {graphic && (
          <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="reveal lg:sticky lg:top-28 lg:col-span-4">
              <h3 className="text-h3 font-semibold tracking-[-0.015em]">{graphic.title}</h3>
              <p className="mt-3 text-navy-600 text-pretty">{graphic.lead}</p>
            </div>
            <div className="min-w-0 lg:col-span-8">{graphic.node}</div>
          </div>
        )}
      </Section>

      {children}

      <Section tone="mist" labelledBy="deliv-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeading id="deliv-title" eyebrow="Deliverables" title="What you walk away with." lead="Written for the engineers who fix things and the leaders who fund them." />
            <CheckList items={["Named lead for the whole engagement", "Critical issues flagged the same day", "Retest included"]} className="mt-8 text-navy-800" />
            <Link href="/consulting/how-we-work" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">How we work <Arrow /></Link>
          </div>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {s.deliverables.map(([t, b], i) => (
              <Card key={t} className="h-full p-6">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
              </Card>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear most." className="lg:col-span-4" />
          <Faq items={s.faq} className="lg:col-span-8" />
        </div>
      </Section>

      <Section tone="mist" labelledBy="rel-title">
        <SectionHeading id="rel-title" eyebrow="Related" title="Often paired with." />
        <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {s.related.map((h) => {
            const r = CATALOG[h];
            return (
              <Link key={h} href={h} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={r.icon} /></span>
                  <h3 className="mt-5 text-h3 font-semibold tracking-[-0.015em]">{r.name}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{r.card}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
                </Card>
              </Link>
            );
          })}
        </Stagger>
      </Section>

      <div className="pt-20 lg:pt-28">
        <FinalCta kind="engagement" title={`Scope your ${s.name} engagement.`} lead="A 30-minute call with a senior practitioner. You leave with a scope, a timeline and a fixed quote." />
      </div>
    </>
  );
}
