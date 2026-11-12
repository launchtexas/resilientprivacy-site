import type { Metadata } from "next";
import { aiBySlug } from "@/components/ai/data";
import { Crosswalk } from "@/components/ai/Crosswalk";
import { ServiceView } from "@/components/consulting/ServiceView";
import { Section, SectionHeading } from "@/components/ui";
import { RadarChart, RADAR_AI } from "@/components/charts";
import { ChartBand } from "@/components/consulting/parts";

const s = aiBySlug("governance");
export const metadata: Metadata = { title: "AI Governance (ISO 42001, EU AI Act)", description: s.desc };

export default function Page() {
  return (
    <ServiceView s={s} crumbs={[["AI Security", "/ai-security"]]}>
      <ChartBand id="readiness" eyebrow="AI readiness" title="Score the programme before you build it." lead="We rate six areas against ISO/IEC 42001 and the NIST AI RMF in the first two weeks, then plan the 90 days that close the biggest gaps. Toggle to compare.">
        <RadarChart {...RADAR_AI} />
      </ChartBand>
      <Section tone="mist" labelledBy="cw-title">
        <SectionHeading id="cw-title" eyebrow="Crosswalk" title="Do the work once. Satisfy four frameworks." lead="Pick a control theme to see where it sits in each framework, and the one deliverable that covers all of them. Clause names are public; the mapping is our working method." />
        <Crosswalk className="reveal mt-12" />
        <p className="mt-4 text-micro text-navy-500">Simplified mapping for illustration; we confirm the exact clauses per engagement.</p>
      </Section>
    </ServiceView>
  );
}
