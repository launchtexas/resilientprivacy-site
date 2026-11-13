import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Badge, Card, CheckList, Eyebrow } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { STORIES, STORY_LABEL } from "@/components/resources/data";
import { PageHero } from "@/components/resources/parts";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Illustrative engagements showing how API protection, compliance and managed detection work together. Sector only, no client names, typical outcomes.",
};

export default function CaseStudies() {
  return (
    <>
      <PageHero eyebrow="Case studies" title="How the work fits together, end to end." lead="Three illustrative engagements that show how our platform, managed services, consulting and GRC teams combine. Each names a sector only, with no client names, logos or quotes, and describes the outcomes this kind of engagement typically delivers." />
      <section aria-label="Stories" className="pb-20 lg:pb-28">
        <div className="container-rp space-y-6">
          {STORIES.map((s) => (
            <Card key={s.slug} id={s.slug} className="reveal scroll-mt-24 p-6 lg:p-10">
              <article aria-labelledby={`${s.slug}-t`} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="medium">{STORY_LABEL}</Badge>
                    <Badge>{s.sector}</Badge>
                  </div>
                  <h2 id={`${s.slug}-t`} className="mt-5 text-h2 font-semibold tracking-[-0.025em] text-balance">{s.title}</h2>
                  <p className="mt-4 leading-relaxed text-navy-600 text-pretty">{s.challenge}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                    {s.services.map(([l, h]) => (
                      <li key={h}><Link href={h} className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">{l} <Arrow /></Link></li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
                  <div className="rounded-card bg-mist p-5">
                    <Eyebrow>What we did</Eyebrow>
                    <CheckList items={s.approach} className="mt-4 text-navy-800" />
                  </div>
                  <div className="rounded-card bg-mist p-5">
                    <Eyebrow>Typical outcome</Eyebrow>
                    <CheckList items={s.outcome} className="mt-4 text-navy-800" />
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </div>
      </section>
      <FinalCta title="Have a problem that looks like one of these?" lead="Tell us about your environment and we will suggest where to start." kind="expert" />
    </>
  );
}
