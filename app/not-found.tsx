import type { Metadata } from "next";
import Link from "next/link";
import { CTA, NAV } from "@/lib/nav";
import { Arrow, Button, Eyebrow, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <Section className="bg-hero-wash">
      <div className="max-w-2xl py-10">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 text-h1 font-semibold tracking-[-0.03em] text-balance">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-lead text-navy-600 text-pretty">It may have moved when we reorganised our practices. Start from one of these, or ask us directly.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={CTA.expert.href}>{CTA.expert.label} <Arrow /></Button>
          <Button href="/" variant="secondary">Back to home</Button>
        </div>
      </div>
      <nav aria-label="Practices" className="mt-6">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NAV.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="group block rounded-card bg-canvas p-6 shadow-card transition-shadow duration-(--duration-base) hover:shadow-lift">
                <span className="flex items-center gap-1.5 font-semibold text-navy-950">{m.label} <Arrow /></span>
                <span className="mt-1 block text-[0.9375rem] text-navy-600">{m.intro.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
