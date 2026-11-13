import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, Badge, Card, Eyebrow, Section, cx } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { AUTHOR, CONTACT, type Body, type Doc, fmtDate, readTime } from "@/components/resources/data";
import { PrintButton } from "@/components/resources/TopicFilter";
import { AiAttackSurface, AttackPath, ComplianceRing, PentestTerminal, SocAlertStream } from "@/components/graphics";
import { CONTROLS, Donut } from "@/components/charts";
import { JsonLd, SITE_URL, article, articleMeta, breadcrumbs } from "@/lib/schema";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Inner-page hero with breadcrumb back to /resources. */
export function PageHero({ crumb, eyebrow, title, lead, children, aside }: { crumb?: [string, string]; eyebrow: string; title: string; lead: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[360px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-60" />
      <div className="container-rp relative pt-10 pb-12 lg:pt-16 lg:pb-16">
        <nav aria-label="Breadcrumb" className="text-sm text-navy-500">
          <Link href="/resources" className="hover:text-navy-950">Resources</Link>
          {crumb && <> <span aria-hidden>/</span> <Link href={crumb[1]} className="hover:text-navy-950">{crumb[0]}</Link></>}
        </nav>
        <div className={cx("mt-8", !!aside ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-12" : "max-w-3xl")}>
          <div className={aside ? "lg:col-span-7" : undefined}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 id="page-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">{title}</h1>
            <p className="mt-5 text-lead text-navy-600 text-pretty">{lead}</p>
            {children}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function Meta({ d }: { d: Doc }) {
  return (
    <p className="text-sm text-navy-500">
      <span className="font-medium text-navy-800">{AUTHOR}</span> · <time dateTime={d.date}>{fmtDate(d.date)}</time> · {readTime(d)}
    </p>
  );
}

/** Card linking to an article or guide. */
export function DocCard({ d, base, large }: { d: Doc; base: string; large?: boolean }) {
  return (
    <Link href={`${base}/${d.slug}`} className="group block h-full">
      <Card interactive className={cx("flex h-full flex-col p-6", large && "lg:p-8")}>
        <Badge tone="accent" className="self-start">{d.category}</Badge>
        <h3 className={cx("mt-5 font-semibold tracking-[-0.015em] text-balance text-navy-950", large ? "text-h2" : "text-h3")}>{d.title}</h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-navy-600 text-pretty">{d.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-micro text-navy-500"><time dateTime={d.date}>{fmtDate(d.date)}</time> · {readTime(d)}</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">Read <Arrow /></span>
        </div>
      </Card>
    </Link>
  );
}

// Inline links in body copy: [label](https://url); every external source opens in a new tab.
const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/; // split() yields text, label, url, text, …
const Linked = ({ t }: { t: string }) => {
  const p = t.split(LINK);
  return p.map((x, i) =>
    i % 3 === 0 ? x : i % 3 === 1 ? (
      <a key={i} href={p[i + 1]} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-ink underline decoration-accent/40 underline-offset-2 [overflow-wrap:anywhere] hover:decoration-accent">{x}</a>
    ) : null,
  );
};

const Item = ({ t }: { t: string }) => {
  const [head, rest] = t.split(/:\s(.+)/s);
  return rest && head.length < 60 ? <><strong className="font-semibold text-navy-950">{head}:</strong> <Linked t={rest} /></> : <Linked t={t} />;
};

export function Prose({ body, check }: { body: Body; check?: boolean }) {
  return body.map((b, i) =>
    typeof b === "string" ? (
      <p key={i} className="mt-4 leading-relaxed text-navy-700 text-pretty"><Linked t={b} /></p>
    ) : (
      <ul key={i} className="mt-4 space-y-3">
        {b.map((t) => (
          <li key={t} className="flex gap-3 leading-relaxed text-navy-700">
            {check ? (
              <span aria-hidden className="mt-1 size-4 shrink-0 rounded-[4px] shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]" />
            ) : (
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
            )}
            <span><Item t={t} /></span>
          </li>
        ))}
      </ul>
    ),
  );
}

// One signature graphic per article, picked by category (theme art, illustrative).
const GRAPHIC: Record<string, () => ReactNode> = {
  "AI security": () => <AiAttackSurface />,
  "Exposure management": () => <AttackPath />,
  "Application security": () => <PentestTerminal />,
  Compliance: () => <Donut {...CONTROLS} title="Where first audits stall: controls by status" centerLabel="controls passing" />,
  Checklist: () => <ComplianceRing />,
  "Buyer's guide": () => <SocAlertStream />,
};
// Charts carry their own "Illustrative data" caption.
const CHARTED = new Set(["Compliance", "Buyer's guide"]);

// Reading progress: CSS scroll timeline, no JS; absent where unsupported or with reduced motion.
const PROGRESS_CSS = `@supports (animation-timeline: scroll()) { @media (prefers-reduced-motion: no-preference) {
.rp-progress { display: block; animation: rp-progress linear both; animation-timeline: scroll(root); }
@keyframes rp-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } } } }`;

/** Full article or guide page: header with graphic, sticky contents, body, related links, CTA. Emits Article + BreadcrumbList JSON-LD. */
export function DocPage({ d, crumb, check }: { d: Doc; crumb: [string, string]; check?: boolean }) {
  const path = `${crumb[1]}/${d.slug}`;
  const graphic = GRAPHIC[d.category];
  return (
    <>
      <JsonLd data={[
        // Bylines are the research team until named authors are confirmed, so author is the Organization, not a Person.
        { ...article({ headline: d.title, description: d.excerpt, path, datePublished: d.date, author: AUTHOR }), author: { "@type": "Organization", name: AUTHOR, url: SITE_URL }, ...articleMeta({ dateModified: d.updated ?? d.date, keywords: d.keywords ?? [d.category] }) },
        breadcrumbs([["Home", "/"], ["Resources", "/resources"], crumb, [d.title, path]]),
      ]} />
      <style>{PROGRESS_CSS}</style>
      <div aria-hidden className="rp-progress fixed inset-x-0 top-0 z-50 hidden h-0.5 origin-left bg-accent print:hidden" />
      <PageHero
        crumb={crumb}
        eyebrow={d.category}
        title={d.title}
        lead={d.excerpt}
        aside={graphic && (
          <figure className="mx-auto max-w-md print:hidden">
            {graphic()}
            {!CHARTED.has(d.category) && <figcaption className="mt-3 text-center text-micro text-navy-500">Simulated environment, real workflow.</figcaption>}
          </figure>
        )}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3"><Meta d={d} />{check && <PrintButton />}</div>
      </PageHero>
      <section aria-label="Article" className="pb-20 lg:pb-28">
        <div className="container-rp grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="lg:col-span-3 lg:order-last print:hidden">
            <nav aria-labelledby="toc-title" className="rounded-card bg-mist p-5 lg:sticky lg:top-24">
              <p id="toc-title" className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {d.sections.map((s) => (
                  <li key={s.h}><a href={`#${slugify(s.h)}`} className="text-navy-700 hover:text-accent">{s.h}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="max-w-[68ch] lg:col-span-8 lg:col-start-1">
            {d.sections.map((s) => (
              <div key={s.h} className="mt-10 first:mt-0">
                <h2 id={slugify(s.h)} className="scroll-mt-24 text-h3 font-semibold tracking-[-0.015em] text-balance text-navy-950">{s.h}</h2>
                <Prose body={s.body} check={check} />
              </div>
            ))}
            <div className="mt-12 rounded-card bg-mist p-6">
              <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">Related</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {d.related.map(([l, h]) => (
                  <li key={h}><Link href={h} className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">{l} <Arrow /></Link></li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
      <FinalCta title="Want a second pair of eyes on this?" lead="Talk to the practitioners behind our research about your environment." kind="expert" />
    </>
  );
}

/** Newsletter sign-up without a backend: the form opens a pre-filled email to info@. */
export function Newsletter() {
  return (
    <Section tone="mist" labelledBy="news-title">
      <Card className="reveal grid grid-cols-1 gap-8 p-6 lg:grid-cols-12 lg:items-center lg:p-10">
        <div className="lg:col-span-6">
          <Eyebrow>Newsletter</Eyebrow>
          <h2 id="news-title" className="mt-3 text-h2 font-semibold tracking-[-0.025em] text-balance">New research, once a month.</h2>
          <p className="mt-3 text-navy-600 text-pretty">Articles, guides and practical notes from our analysts. No spam; unsubscribe by replying.</p>
        </div>
        <form action={`mailto:${CONTACT}`} method="get" className="lg:col-span-6">
          <input type="hidden" name="subject" value="Newsletter" />
          <label htmlFor="news-email" className="text-sm font-medium text-navy-800">Work email</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input id="news-email" name="body" type="email" required maxLength={254} pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}" title="A work email, like name@company.com" autoComplete="email" placeholder="you@company.com" className="h-12 min-w-0 flex-1 rounded-full bg-canvas px-5 text-navy-950 shadow-hairline placeholder:text-navy-500" />
            <button type="submit" className="h-12 rounded-full bg-accent px-6 font-medium text-white transition-colors duration-(--duration-fast) hover:bg-accent-hover">Subscribe</button>
          </div>
          <div className="mt-3 flex items-start gap-2.5 text-sm text-navy-700">
            {/* Clickwrap: no name attribute, so the box gates submission without adding to the email. */}
            <input id="news-agree" type="checkbox" required className="mt-0.5 size-5 shrink-0 accent-accent" />
            <label htmlFor="news-agree">I agree to the <a href="/legal/terms" className="underline hover:text-accent">Terms of Use</a> and have read the <a href="/legal/privacy" className="underline hover:text-accent">Privacy Policy</a>.</label>
          </div>
          <p className="mt-2 text-micro text-navy-500">Opens your email app with a message to {CONTACT}.</p>
        </form>
      </Card>
    </Section>
  );
}
