import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";
import { RadarChart, RiskHeatmap, RADAR_NIST, RISK_MATRIX } from "@/components/charts";
import { ChartBand } from "@/components/consulting/parts";

const s = GRC["risk-assessment"];
export const metadata: Metadata = { title: "Cybersecurity Risk Assessment Services", description: "Cybersecurity risk assessment: we identify threats to your business, rate them against your controls and put a range on the loss. A short list to fund." };
export default function Page() {
  return (
    <ServicePage s={s}>
      <ChartBand id="maturity" tone="mist" eyebrow="Maturity" title="Your NIST CSF 2.0 profile, today and in six months." lead="We score each function against the CSF 2.0 implementation tiers, then agree the target profile the plan has to reach. Toggle to see the gap close.">
        <RadarChart {...RADAR_NIST} />
      </ChartBand>
      <ChartBand id="heat" flip eyebrow="Risk register" title="Every risk placed by likelihood and impact." lead="Each risk gets an owner, a score and a treatment. The top-right cells are where the budget goes first; the rest are accepted or watched, in writing.">
        <RiskHeatmap {...RISK_MATRIX} />
      </ChartBand>
    </ServicePage>
  );
}
