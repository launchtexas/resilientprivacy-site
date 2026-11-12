import type { Metadata } from "next";
import { CONTACT, CTA } from "@/lib/nav";
import { Arrow, Button, Card, CheckList, Section, SectionHeading } from "@/components/ui";
import { Faq, FinalCta } from "@/components/sections";
import { Icon, PageHero } from "@/components/company/parts";

export const metadata: Metadata = {
  title: "Partners",
  description: "Technology and channel partner programs for integrators, resellers, MSPs and advisory firms working with Resilient Privacy.",
};

const PROGRAMS = [
  {
    icon: "M8 7h8v10H8zM4 10h4M4 14h4M16 10h4M16 14h4",
    name: "Technology partners",
    body: "Build an integration between your product and the Resilient Privacy platform.",
    items: ["API and webhook access for integration builds", "Listing on our integrations page", "Co-authored solution briefs"],
  },
  {
    icon: "M4 19h16M6 15l4-4 3 3 5-6M17 8h1v1",
    name: "Channel partners",
    body: "Resell, refer or deliver our platform and services to your clients.",
    items: ["Referral and resale terms agreed in your partner agreement", "Sales and technical enablement", "Co-delivery with our SOC, consulting and GRC teams"],
  },
];

const TIERS = [
  ["Referral", "Introduce a client; we handle the sale and delivery."],
  ["Reseller", "Sell under your own contract, on pricing set in your partner agreement."],
  ["Managed service provider", "Run the platform for your clients, backed by our 24/7 SOC."],
  ["Advisory & audit firms", "Pair your advisory practice with our testing and tooling."],
];


export default function PartnersPage() {
  return (
    <>
      <PageHero badge="Partners" title="Grow with a partner that" accent="covers the full program." lead="Integrate with our platform, or bring our managed SOC, consulting and GRC services to your clients.">
        <Button href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Partner program inquiry")}`} size="lg">Become a partner <Arrow /></Button>
        <Button href={CTA.expert.href} variant="secondary" size="lg">{CTA.expert.label}</Button>
      </PageHero>

      <Section tone="mist" labelledBy="prog-title">
        <SectionHeading id="prog-title" eyebrow="Programs" title="Two ways to partner." />
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {PROGRAMS.map((p) => (
            <Card key={p.name} className="reveal p-6 lg:p-8">
              <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={p.icon} /></span>
              <h3 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{p.name}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{p.body}</p>
              <CheckList items={p.items} className="mt-6 text-navy-800" />
            </Card>
          ))}
        </div>
      </Section>

      <Section labelledBy="tier-title">
        <SectionHeading id="tier-title" eyebrow="Channel" title="Pick the model that fits your business." align="center" />
        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-panel bg-line shadow-hairline sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map(([t, b], i) => (
            <li key={t} className="reveal bg-canvas p-6 lg:p-8">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Partner questions." />
          </div>
          <Faq className="lg:col-span-8" items={[
            ["How do I apply?", `Email ${CONTACT.email} with your company, the clients you serve and the program you're interested in. We reply to every request.`],
            ["Is there a fee to join?", "Fees and requirements depend on the program and are set out in your partner agreement. Ask us and we will send the current terms."],
            ["Can we white-label the SOC?", "Co-delivery under your brand is discussed per partner and agreed in writing before work starts."],
            ["Who owns the client relationship?", "You do, for referral and resale deals you register. We agree the delivery model in writing before work starts."],
          ]} />
        </div>
      </Section>

      <FinalCta title="Let's build something your clients need." lead="Talk to us about integrations, resale or co-delivery." kind="expert" />
    </>
  );
}
