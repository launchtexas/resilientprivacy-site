import type { Metadata } from "next";
import { GUIDES } from "@/components/resources/data";
import { DocCard, Newsletter, PageHero } from "@/components/resources/parts";
import { Stagger } from "@/components/motion";
import { JsonLd, itemList } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Guides & reports",
  description: "Checklists and buyer's guides: SOC 2 readiness and choosing a managed detection and response provider.",
};

export default function GuidesIndex() {
  return (
    <>
      <JsonLd data={itemList(GUIDES.map((g) => [g.title, `/resources/guides/${g.slug}`]))} />
      <PageHero eyebrow="Guides & reports" title="Checklists and buyer's guides you can use this week." lead="Longer, structured pieces for planning an audit or a purchase. Free to read, no form to fill, and printable from each guide." />
      <section aria-labelledby="list-title" className="pb-20 lg:pb-28">
        <h2 id="list-title" className="sr-only">Guides</h2>
        <Stagger className="container-rp grid grid-cols-1 gap-4 md:grid-cols-2">
          {GUIDES.map((g) => <DocCard key={g.slug} d={g} base="/resources/guides" large />)}
        </Stagger>
      </section>
      <Newsletter />
    </>
  );
}
