import type { Metadata } from "next";
import { aiBySlug } from "@/components/ai/data";
import { ServiceView } from "@/components/consulting/ServiceView";
import { AiAttackSurface } from "@/components/graphics";

const s = aiBySlug("secure-adoption");
export const metadata: Metadata = { title: "Secure AI Adoption Consulting", description: s.desc };

export default function Page() {
  return (
    <ServiceView
      s={s}
      crumbs={[["AI Security", "/ai-security"]]}
      graphic={{
        title: "Guardrails where untrusted input meets your data.",
        lead: "Every AI tool you approve gets the same three checks: what can reach it, what it can see, and what it can do on someone's behalf.",
        node: <AiAttackSurface className="mx-auto max-w-xl" />,
      }}
    />
  );
}
