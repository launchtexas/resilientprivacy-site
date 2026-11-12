// Company, contact, demo and legal building blocks. Faq and FinalCta live in components/sections.tsx.
import type { ReactNode } from "react";
import { CONTACT } from "@/lib/nav";
import { Card, Eyebrow, cx } from "@/components/ui";

/** Inner-page hero: mono eyebrow (`badge` prop), H1 (accent tail optional), lead, optional actions. */
export function PageHero({ badge, title, accent, lead, children, aside }: { badge: string; title: string; accent?: string; lead: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
      <div className={cx("container-rp relative pt-12 pb-14 lg:pt-20 lg:pb-20", !!aside && "grid grid-cols-1 items-center gap-10 lg:grid-cols-12")}>
        <div className={aside ? "lg:col-span-7" : "max-w-3xl"}>
          <Eyebrow>{badge}</Eyebrow>
          <h1 id="hero-title" className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">
            {title} {accent && <span className="text-accent">{accent}</span>}
          </h1>
          <p className="mt-5 max-w-2xl text-lead text-navy-600 text-pretty">{lead}</p>
          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}

export function Icon({ d, className = "size-5" }: { d: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export const ICONS = {
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  building: "M4 21V5l8-2v18M12 8h8v13M4 21h16M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01",
  shield: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4",
};

/** Address + email card, from CONTACT. */
export function ContactCard({ className }: { className?: string }) {
  return (
    <Card className={cx("p-6 lg:p-8", className)}>
      <div className="space-y-6">
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={ICONS.mail} /></span>
          <dl>
            <dt className="text-sm font-medium text-navy-500">Email</dt>
            <dd className="mt-0.5"><a href={`mailto:${CONTACT.email}`} className="font-medium text-accent hover:text-accent-hover">{CONTACT.email}</a></dd>
          </dl>
        </div>
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={ICONS.shield} /></span>
          <dl>
            <dt className="text-sm font-medium text-navy-500">Vulnerability reports</dt>
            <dd className="mt-0.5"><a href="/legal/security" className="font-medium text-accent hover:text-accent-hover">Report a vulnerability</a></dd>
          </dl>
        </div>
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={ICONS.pin} /></span>
          <dl>
            <dt className="text-sm font-medium text-navy-500">Headquarters</dt>
            <dd className="mt-0.5 text-navy-900"><address className="not-italic">{CONTACT.legalName}<br />{CONTACT.address.map((l) => <span key={l} className="block">{l}</span>)}</address></dd>
          </dl>
        </div>
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={ICONS.building} /></span>
          <dl>
            <dt className="text-sm font-medium text-navy-500">Support</dt>
            <dd className="mt-0.5 text-navy-900">24/7, follow-the-sun from the USA and India.</dd>
          </dl>
        </div>
      </div>
    </Card>
  );
}

/** Legal document shell: draft banner, H1, effective date, table of contents and numbered sections. */
export function LegalPage({ title, intro, sections }: { title: string; intro: ReactNode; sections: [string, ReactNode][] }) {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <>
      <div role="note" className="border-b border-medium/30 bg-medium-soft">
        <p className="container-rp py-3 text-sm font-medium text-medium-ink">
          Draft, pending legal review. This document is not yet in effect and may change before publication.
        </p>
      </div>
      <section aria-labelledby="hero-title" className="container-rp pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <header className="lg:col-span-12">
            <p className="font-mono text-xs font-medium tracking-[0.08em] text-accent uppercase">Legal</p>
            <h1 id="hero-title" className="mt-3 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">{title}</h1>
          </header>
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-semibold text-navy-950">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {sections.map(([h], i) => (
                  <li key={h}><a href={`#${slug(h)}`} className="text-navy-600 hover:text-accent">{i + 1}. {h}</a></li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="max-w-[72ch] text-[0.9375rem] leading-relaxed text-navy-700 lg:col-span-9 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_strong]:text-navy-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <div className="text-lead text-navy-600 text-pretty">{intro}</div>
            {sections.map(([h, body], i) => (
              <section key={h} aria-labelledby={slug(h)} className="mt-10 scroll-mt-24">
                <h2 id={slug(h)} className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">{i + 1}. {h}</h2>
                <div className="mt-3">{body}</div>
              </section>
            ))}
            <section aria-labelledby="legal-contact" className="mt-12 rounded-card bg-mist p-6">
              <h2 id="legal-contact" className="text-base font-semibold text-navy-950">Contact</h2>
              <p className="mt-2">
                {CONTACT.legalName}, {CONTACT.address.slice(0, 2).join(", ")}. Legal and privacy notices:{" "}
                <a href={`mailto:${CONTACT.legal}`}>{CONTACT.legal}</a>. Security reports:{" "}
                <a href={`mailto:${CONTACT.security}`}>{CONTACT.security}</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
