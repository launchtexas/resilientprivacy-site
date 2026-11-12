import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";

const s = GRC["privacy"];
export const metadata: Metadata = { title: s.name, description: s.lead };
export default function Page() {
  return <ServicePage s={s} />;
}
