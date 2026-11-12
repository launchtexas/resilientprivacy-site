import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";
import { RadarChart, RADAR_VENDOR } from "@/components/charts";
import { ChartBand } from "@/components/consulting/parts";

const s = GRC["vendor-risk"];
export const metadata: Metadata = { title: s.name, description: s.lead };
export default function Page() {
  return (
    <ServicePage s={s}>
      <ChartBand id="profile" tone="mist" eyebrow="Vendor profile" title="Compare vendors on the risks that matter to you." lead="Each vendor is scored on the same five domains, AI use included, so procurement can see the trade-off at a glance. Toggle a vendor to bring its profile forward.">
        <RadarChart {...RADAR_VENDOR} />
      </ChartBand>
    </ServicePage>
  );
}
