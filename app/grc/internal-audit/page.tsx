import type { Metadata } from "next";
import { GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";

const s = GRC["internal-audit"];
export const metadata: Metadata = { title: "Internal Audit & Controls Testing", description: "Internal audit services: independent testers check that your controls are designed well and actually operate, with clear findings and a follow-up." };
export default function Page() {
  return <ServicePage s={s} />;
}
