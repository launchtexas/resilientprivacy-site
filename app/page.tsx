import { FinalCta } from "@/components/sections";
import { Hero } from "@/components/home/Hero";
import { AiSecurity, HowWeWork, Managed, Outcomes, Platform, Practices, Proof, Research, TestToEvidence } from "@/components/home/sections";
import { JsonLd, service } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <JsonLd
        data={service({
          type: "ProfessionalService",
          name: "Cybersecurity and AI security consulting",
          description: "Offensive security, AI security, security advisory and risk & compliance, backed by 24/7 managed operations and our own platform.",
          path: "/",
        })}
      />
      <Hero />
      <Proof />
      <Practices />
      <AiSecurity />
      <TestToEvidence />
      <Outcomes />
      <Managed />
      <Platform />
      <Research />
      <HowWeWork />
      <FinalCta kind="practice" title="Tell us what you need tested, governed or proven." lead="A 30-minute call with a practitioner. You leave with a scope, a team and a timeline, whether or not you hire us." />
    </>
  );
}
