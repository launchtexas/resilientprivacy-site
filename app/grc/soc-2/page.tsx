import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";
import { Donut, CONTROLS } from "@/components/charts";
import { ChartBand } from "@/components/consulting/parts";

const s = GRC["soc-2"];
export const metadata: Metadata = { title: s.name, description: s.lead };
export default function Page() {
  return (
    <ServicePage s={s}>
      <ChartBand id="ready" tone="mist" eyebrow="Control readiness" title="Know how many controls pass before the auditor does." lead="Automated tests run against every control we can check from your systems. Failing ones arrive with an owner and a fix, so the audit window holds no surprises.">
        <Donut {...CONTROLS} centerLabel="passing" />
      </ChartBand>
    </ServicePage>
  );
}
