import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Badge, Card, Section, SectionHeading } from "@/components/ui";
import { Stagger } from "@/components/motion";
import { FRAMEWORKS, GRC } from "@/components/grc/data";
import { ServicePage } from "@/components/grc/ServicePage";

const s = GRC.frameworks;
export const metadata: Metadata = { title: "Compliance Framework Consulting", description: "Compliance framework consulting for healthcare, payments, government, EU regulation and AI: map your controls once, reuse the work for each framework." };
export default function Page() {
  return (
    <ServicePage s={s}>
      <Section labelledBy="fw-title">
        <SectionHeading id="fw-title" eyebrow="Coverage" title="Industry, government, EU and AI frameworks." lead="SOC 2, ISO 27001 and privacy have their own pages. Here is everything else we prepare you for. AI frameworks link to our AI governance practice." />
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FRAMEWORKS.map(([name, sector, body, who, href]) => {
            const card = (
              <Card interactive={!!href} className="flex h-full flex-col p-6">
                <Badge tone="accent" className="w-fit">{sector}</Badge>
                <h3 className="mt-4 text-h3 font-semibold tracking-[-0.015em]">{name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{body}</p>
                <p className="mt-5 border-t border-line pt-4 text-xs text-navy-500">{who}</p>
                {href && <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">AI governance practice <Arrow /></span>}
              </Card>
            );
            return href ? <Link key={name} href={href} className="group block h-full">{card}</Link> : <div key={name}>{card}</div>;
          })}
        </Stagger>
      </Section>
    </ServicePage>
  );
}
