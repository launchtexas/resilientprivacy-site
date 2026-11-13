// Building blocks shared by the Managed Services division pages only.
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

type Tone = "canvas" | "mist";
import { NAV, type CtaKind } from "@/lib/nav";
import { Arrow, Badge, Button, Card, Section, SectionHeading, cx } from "@/components/ui";
import { DataTable } from "@/components/mockup";
import { CtaButtons, Faq as FaqList, FinalCta } from "@/components/sections";
import { Reveal, Scene, Stagger } from "@/components/motion";
import { Check, Chip, lag } from "@/components/graphics/kit";
import "./managed.css";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";

export const PLACEHOLDER_NOTE = "Simulated environment, real workflow.";

/* ---------- icons (24px grid, 1.6 stroke, same style as homepage) ---------- */
const ICONS = {
  shield: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  network: "M12 4v5M5 20v-4h14v4M12 9v7M9 4h6M3 20h4M17 20h4",
  siren: "M7 18v-6a5 5 0 0 1 10 0v6M5 18h14v3H5zM12 3v2M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4",
  search: "M11 11m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M20 20l-4.5-4.5",
  identity: "M12 8m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5",
  platform: "M4 5h16v10H4zM8 19h8M12 15v4",
  consult: "M4 18l5-5 3 3 8-8M15 8h5v5",
  grc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  plus: "M12 5v14M5 12h14",
} as const;
export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

/* ---------- hero ---------- */
export function PageHero({ eyebrow, title, lead, note, crumb = true, center = false, kind = "expert", children }: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  note?: string;
  crumb?: boolean;
  /** Practice-hub template: centered copy above the full-width mockup. */
  center?: boolean;
  kind?: CtaKind;
  /** The product mockup shown under the copy. */
  children: ReactNode;
}) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
      <div className="container-rp relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className={cx("max-w-3xl", center && "mx-auto text-center")}>
          {crumb && (
            <Link href="/managed-services" className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-950">
              <span aria-hidden className="rotate-180"><Arrow /></span> Managed services
            </Link>
          )}
          <p className="font-mono text-xs font-medium tracking-[0.08em] text-accent uppercase">{eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">{title}</h1>
          <p className={cx("mt-5 max-w-2xl text-lead text-navy-600 text-pretty", center && "mx-auto")}>{lead}</p>
          <div className={cx("mt-8 flex flex-col gap-3 sm:flex-row", center && "sm:justify-center")}>
            <CtaButtons kind={kind} />
          </div>
          {note && <p className="mt-5 text-xs text-navy-500">{note}</p>}
        </div>
        <div className="relative mt-14 lg:mt-16">
          <div aria-hidden className="absolute -inset-x-6 -top-6 bottom-12 rounded-[32px] bg-gradient-to-b from-accent-soft to-transparent" />
          <div className="relative">{children}</div>
          <p className={cx("relative mt-3 text-micro text-navy-500", center && "text-center")}>{PLACEHOLDER_NOTE}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- operating model: coverage, escalation flow, SLAs ---------- */
/** `clock` = [time on the case clock, what happened then] for one illustrative critical case. */
export type Step = { title: string; body: string; when: string; clock: [time: string, event: string] };
export type SlaRow = [severity: "Critical" | "High" | "Medium" | "Low", ...cells: string[]];
const SEV_TONE = { Critical: "critical", High: "high", Medium: "medium", Low: "neutral" } as const;

/** Escalation flow as a live incident clock: a case token moves across 4 stops while the clock steps on (DESIGN.md › Motion: base CSS = final frame). */
function IncidentClock({ steps, stamp }: { steps: Step[]; stamp?: number }) {
  const n = steps.length; // layout assumes 4 stops (every managed service has 4)
  return (
    <Scene beats={steps.map((_, i) => 400 + i * 1300)} className="ic @container mt-5">
      <div className="flex min-h-7 flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">Case clock</span>
        <span aria-hidden className="rp-stack min-w-[4.5rem] rounded-control bg-navy-950 px-2.5 py-1 text-center font-mono text-sm text-white tabular-nums">
          <span data-until={1}>00:00</span>
          {steps.map((s, i) => <span key={i} data-at={i + 1} data-until={i < n - 1 ? i + 2 : undefined} className="rp-pop">{s.clock[0]}</span>)}
        </span>
        {stamp != null && (
          <span data-at={stamp + 1} className="rp-pop"><Chip tone="ok" className="text-xs"><Check className="size-3" /> Within the 15-minute commitment</Chip></span>
        )}
      </div>
      <ol className="relative mt-6 grid grid-cols-1 gap-6 @2xl:grid-cols-4 @2xl:gap-0">
        <span aria-hidden className="ic-token pointer-events-none absolute top-0 left-0 hidden h-8 w-1/4 @2xl:block">
          <span data-at={1} className="rp-pop block size-8 rounded-full ring-4 ring-accent/25" />
        </span>
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 @2xl:block @2xl:pr-5">
            {i < n - 1 && (
              <span aria-hidden className="absolute top-10 bottom-[-1.25rem] left-[0.9375rem] w-0.5 overflow-hidden rounded-full bg-line @2xl:top-[0.9375rem] @2xl:right-1 @2xl:bottom-auto @2xl:left-10 @2xl:h-0.5 @2xl:w-auto">
                <span data-at={i + 2} className="ic-fill block size-full bg-accent" />
              </span>
            )}
            <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-cloud font-mono text-xs font-medium text-navy-600">
              {i + 1}
              <span aria-hidden data-at={i + 1} className="rp-pop absolute inset-0 grid place-items-center rounded-full bg-accent text-white">{i + 1}</span>
            </span>
            <div className="min-w-0 @2xl:mt-4">
              <p data-at={i + 1} className="rp-pop inline-block font-mono text-micro font-medium text-accent-ink tabular-nums">{s.clock[0]} · {s.clock[1]}</p>
              <p className="mt-1 font-semibold text-navy-950">{s.title}</p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-navy-600">{s.body}</p>
              <p className="mt-2 font-mono text-micro text-navy-500">{s.when}</p>
            </div>
          </li>
        ))}
      </ol>
    </Scene>
  );
}

/** "clock starts → clock stops", drawn as a line that grows once in view. A leading "target: " part shows as a chip. */
function Commits({ rows }: { rows: [string, string][] }) {
  return (
    <Scene beats={[300]} className="mt-5">
      <dl className="divide-y divide-line border-t border-line">
        {rows.map(([m, v], i) => {
          const [target, clock] = v.includes(": ") ? [v.slice(0, v.indexOf(": ")), v.slice(v.indexOf(": ") + 2)] : [null, v];
          const [start, stop] = clock.split(" → ");
          return (
            <div key={m} className="grid gap-1.5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-[0.9375rem] font-medium text-navy-950">{m}</dt>
              <dd className="text-[0.9375rem] text-navy-600">
                {target && <Chip tone="ok" className="mb-1.5 text-xs">{target}</Chip>}
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="sr-only">Clock starts: </span>
                  <span>{start}</span>
                  <span aria-hidden className="flex w-8 shrink-0 items-center text-accent">
                    <span data-at={1} style={lag(i * 140)} className="rp-grow-x h-px flex-1 bg-current" />
                    <svg viewBox="0 0 6 8" className="h-2 w-1.5 fill-current"><path d="M0 0l6 4-6 4z" /></svg>
                  </span>
                  <span className="sr-only">Clock stops: </span>
                  <span className="text-navy-900">{stop}</span>
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </Scene>
  );
}

export function OperatingModel({ title = "How the work actually runs.", lead, coverage, steps, stamp, commits, slaColumns, slas }: {
  title?: string;
  /** Index of the step where the published 15-minute critical response is met; shows the stamp. Omit for services without it. */
  stamp?: number;
  /** Service-level metrics named in the contract: [metric, clock starts → stops]. Only the published critical-response time (under 15 minutes) carries a value; the rest are set per contract. */
  commits: [metric: string, measures: string][];
  lead: string;
  coverage: [label: string, value: string][];
  steps: Step[];
  slaColumns: string[];
  slas: SlaRow[];
}) {
  return (
    <Section tone="mist" labelledBy="model-title">
      <Reveal><SectionHeading id="model-title" eyebrow="Operating model" title={title} lead={lead} /></Reveal>
      <Stagger className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-4 lg:p-8">
          <h3 className="text-h3 font-semibold tracking-[-0.015em]">Coverage</h3>
          <dl className="mt-5 divide-y divide-line">
            {coverage.map(([l, v]) => (
              <div key={l} className="py-3 first:pt-0 last:pb-0">
                <dt className="font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">{l}</dt>
                <dd className="mt-1 text-[0.9375rem] text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="p-6 lg:col-span-8 lg:p-8">
          <h3 className="text-h3 font-semibold tracking-[-0.015em]">Escalation flow</h3>
          <IncidentClock steps={steps} stamp={stamp} />
          <p className="mt-6 text-micro text-navy-500">Clock times show one illustrative case. Your SOW sets the target for each stage.</p>
        </Card>
        <Card className="p-6 lg:col-span-7 lg:p-8">
          <h3 className="text-h3 font-semibold tracking-[-0.015em]">What we commit to in your contract</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Each metric gets a target per severity in your statement of work (SOW), and every monthly review reports our times against it.</p>
          <Commits rows={commits} />
        </Card>
        <Card className="p-6 lg:col-span-5 lg:p-8">
          <h3 className="text-h3 font-semibold tracking-[-0.015em]">How each severity reaches you</h3>
          <DataTable
            className="mt-4 -mx-3 hidden sm:block"
            columns={["Severity", ...slaColumns]}
            rows={slas.map(([sev, ...cells]) => [<Badge key={sev} tone={SEV_TONE[sev]} dot>{sev}</Badge>, ...cells])}
          />
          {/* phones: one card per severity instead of a clipped 3-column table */}
          <ul className="mt-4 space-y-3 sm:hidden">
            {slas.map(([sev, ...cells]) => (
              <li key={sev} className="rounded-control bg-mist p-3.5 text-[0.8125rem] text-navy-800">
                <Badge tone={SEV_TONE[sev]} dot>{sev}</Badge>
                {cells.map((c, i) => <p key={i} className="mt-1.5"><span className="font-medium text-navy-950">{slaColumns[i]}:</span> {c}</p>)}
              </li>
            ))}
          </ul>
        </Card>
      </Stagger>
    </Section>
  );
}

/* ---------- what you get every month ---------- */
export function Monthly({ title = "What lands on your desk.", lead, items, tone }: { title?: string; lead: string; items: [title: string, body: string][]; tone?: "canvas" | "mist" }) {
  return (
    <Section tone={tone} labelledBy="monthly-title">
      <Reveal><SectionHeading id="monthly-title" eyebrow="Every month" title={title} lead={lead} /></Reveal>
      <Stagger className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-panel bg-line shadow-hairline sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([t, b], i) => (
          <div key={t} className="bg-canvas p-6 lg:p-8">
            <span className="font-mono text-sm text-accent">0{i + 1}</span>
            <h3 className="mt-5 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}

/* ---------- FAQ (native details/summary: no JS, keyboard accessible) ---------- */
export function Faq({ items, tone = "mist" }: { items: [q: string, a: string][]; tone?: "canvas" | "mist" }) {
  return (
    <Section tone={tone} labelledBy="faq-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4"><SectionHeading id="faq-title" eyebrow="FAQ" title="Questions buyers ask us." lead="Anything else, ask an expert. You will talk to an analyst, not a script." /></Reveal>
        <FaqList items={items} className="lg:col-span-8" />
      </div>
    </Section>
  );
}

/* ---------- other managed services (reads the nav, so it stays in sync) ---------- */
const MANAGED = NAV.find((m) => m.href === "/managed-services")!.groups.flatMap((g) => g.links);

export function RelatedServices({ current, tone }: { current: string; tone?: "canvas" | "mist" }) {
  const others = MANAGED.filter((l) => l.href !== current);
  return (
    <Section tone={tone} labelledBy="related-title">
      <Reveal><SectionHeading id="related-title" eyebrow="Managed services" title="Runs alongside the rest of the team." /></Reveal>
      <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((l) => (
          <div key={l.href}>
            <Link href={l.href} className="group block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">{l.label}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] text-navy-600">{l.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Learn more <Arrow /></span>
              </Card>
            </Link>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}

/* ---------- proof band: one signature graphic + how consulting feeds the service ---------- */
export type Proof = { eyebrow: string; title: string; lead: string; points: string[]; graphic: ReactNode; caption?: string; tone?: "canvas" | "mist" };

export function ProofBand({ eyebrow, title, lead, points, graphic, caption = PLACEHOLDER_NOTE, tone }: Proof) {
  return (
    <Section tone={tone} labelledBy="proof-title">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal><SectionHeading id="proof-title" eyebrow={eyebrow} title={title} lead={lead} /></Reveal>
          <Stagger className="mt-8 space-y-3">
            {points.map((t) => (
              <p key={t} className="flex gap-3 text-[0.9375rem] leading-relaxed text-navy-800">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{t}
              </p>
            ))}
          </Stagger>
        </div>
        <figure className="lg:col-span-7">
          {graphic}
          <figcaption className="mt-3 text-micro text-navy-500">{caption}</figcaption>
        </figure>
      </div>
    </Section>
  );
}


/* ---------- metrics band: animated charts that back the copy (each plays once in view) ---------- */
export type Metrics = { eyebrow: string; title: string; lead: string; charts: ReactNode[]; tone?: "canvas" | "mist" };

export const ChartCard = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cx("min-w-0 rounded-card bg-canvas p-4 shadow-card ring-1 ring-line sm:p-6", className)}>{children}</div>
);

export function MetricsBand({ eyebrow, title, lead, charts, tone }: Metrics) {
  return (
    <Section tone={tone} labelledBy="metrics-title">
      <Reveal><SectionHeading id="metrics-title" eyebrow={eyebrow} title={title} lead={lead} /></Reveal>
      <div className={cx("mt-12 grid grid-cols-1 gap-4", charts.length > 1 && "lg:grid-cols-2")}>
        {charts.map((c, i) => <ChartCard key={i}>{c}</ChartCard>)}
      </div>
    </Section>
  );
}

/* ---------- a full detail page from data ---------- */
export type ServiceData = {
  href: string;
  /** Service name for JSON-LD and breadcrumbs. */
  name: string;
  proof?: Proof;
  metrics?: Omit<Metrics, "tone">;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  note?: string;
  model: Parameters<typeof OperatingModel>[0];
  monthly: Parameters<typeof Monthly>[0];
  faq: [string, string][];
  cta: { title: string; lead: string };
};

export function ServicePage({ data, mockup }: { data: ServiceData; mockup: ReactNode }) {
  return (
    <>
      <JsonLd data={[service({ name: data.name, description: data.lead, path: data.href, serviceType: data.name }), breadcrumbs([["Home", "/"], ["Managed Services", "/managed-services"], [data.name, data.href]])]} />
      <PageHero eyebrow={data.eyebrow} title={data.title} lead={data.lead} note={data.note}>{mockup}</PageHero>
      <OperatingModel {...data.model} />
      {/* bands after the mist operating model alternate canvas / mist */}
      {[
        data.metrics && ((tone: Tone) => <MetricsBand {...data.metrics!} tone={tone} />),
        data.proof && ((tone: Tone) => <ProofBand {...data.proof!} tone={tone} />),
        (tone: Tone) => <Monthly {...data.monthly} tone={tone} />,
        (tone: Tone) => <Faq items={data.faq} tone={tone} />,
        (tone: Tone) => <RelatedServices current={data.href} tone={tone} />,
      ].flatMap((b) => (b ? [b] : [])).map((band, i) => <Fragment key={i}>{band(i % 2 ? "mist" : "canvas")}</Fragment>)}
      <FinalCta {...data.cta} kind="expert" />
    </>
  );
}
