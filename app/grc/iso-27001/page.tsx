import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";
import { Donut, INK, SEV } from "@/components/charts";
import { ChartBand } from "@/components/consulting/parts";

const s = GRC["iso-27001"];
export const metadata: Metadata = { title: s.name, description: s.lead };
export default function Page() {
  return (
    <ServicePage s={s}>
      <ChartBand id="ready" tone="mist" eyebrow="Control readiness" title="All 93 Annex A controls, one status each." lead="The Statement of Applicability starts as a live list: implemented, in progress or a gap with an owner. You see the share move week by week until stage 1.">
        <Donut
          title="ISO 27001 Annex A controls"
          desc="Status of the 93 Annex A controls at the mid-project checkpoint; 5 excluded with a reason."
          centerLabel="implemented"
          segments={[
            { label: "Implemented", value: 70, color: "#138a52" },
            { label: "In progress", value: 12, color: SEV.medium },
            { label: "Gap", value: 6, color: SEV.critical },
            { label: "Not applicable", value: 5, color: INK.soft },
          ]}
        />
      </ChartBand>
    </ServicePage>
  );
}
