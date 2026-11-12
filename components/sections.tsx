// Page-closing sections shared by the homepage and every division page.
import { CTA_FOR, type CtaKind } from "@/lib/nav";
import { JsonLd, faqPage } from "@/lib/schema";
import { Arrow, Button, cx } from "@/components/ui";

/** FAQ list: native details/summary, no JS, keyboard accessible, emits FAQPage JSON-LD. Use once per page. */
export function Faq({ items, className }: { items: [string, string][]; className?: string }) {
  return (
    <div className={cx("divide-y divide-line rounded-card bg-canvas shadow-card", className)}>
      <JsonLd data={faqPage(items)} />
      {items.map(([q, a]) => (
        <details key={q} className="group px-5 sm:px-6">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-navy-950 [&::-webkit-details-marker]:hidden">
            {q}
            <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-cloud text-navy-600 transition-transform duration-(--duration-fast) group-open:rotate-45 group-hover:bg-accent-soft group-hover:text-accent-ink">+</span>
          </summary>
          <p className="pb-5 text-[0.9375rem] leading-relaxed text-navy-600 text-pretty">{a}</p>
        </details>
      ))}
    </div>
  );
}

/** The page type's CTA set from lib/nav.ts: first is primary (with arrow), the rest secondary (or inverse on navy). */
export function CtaButtons({ kind, inverse }: { kind: CtaKind; inverse?: boolean }) {
  return CTA_FOR[kind].map((c, i) => (
    <Button key={c.href} href={c.href} size="lg" variant={i ? (inverse ? "inverse" : "secondary") : "primary"}>{c.label}{!i && <> <Arrow /></>}</Button>
  ));
}

export function FinalCta({ title, lead, kind = "platform" }: { title: string; lead: string; kind?: CtaKind }) {
  return (
    <section aria-labelledby="cta-title" className="pb-20 lg:pb-28">
      <div className="container-rp">
        <div className="relative overflow-hidden rounded-panel bg-navy-950 px-6 py-14 text-center text-white sm:px-12 lg:py-20">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-[0.08]" />
          <div aria-hidden className="absolute -top-32 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-accent/50 blur-3xl" />
          <div aria-hidden className="absolute -bottom-40 -right-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-h1 font-semibold tracking-[-0.03em] text-balance">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lead text-navy-300">{lead}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CtaButtons kind={kind} inverse />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
