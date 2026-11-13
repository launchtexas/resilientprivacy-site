import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";

const s = GRC["privacy"];
export const metadata: Metadata = { title: "GDPR & CCPA Privacy Compliance", description: "GDPR and CCPA privacy consulting: we map the personal data you hold, write the records regulators expect and set up request and breach processes." };
export default function Page() {
  return <ServicePage s={s} />;
}
