import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/lib/nav";
import { Reveal, Stagger } from "@/components/motion";
import { Arrow, Button, Card, Section, SectionHeading } from "@/components/ui";
import { ContactCard, PageHero } from "@/components/company/parts";
import { InquiryForm, type Field } from "@/components/company/InquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to a Resilient Privacy practitioner about consulting, AI security, managed SOC and NOC, the platform or compliance. Email info@resilientprivacy.com.",
};

// ?topic=<word> / ?intent=<word> in the URL preselect the option containing that word (InquiryForm), e.g. ?intent=engagement from CTA.scope.
const INTENTS = ["Talk to an expert", "Scope an engagement", "Ask a question"];
const TOPICS = ["Consulting & penetration testing", "AI security", "Managed SOC & NOC", "Security platform", "Risk & compliance (GRC)", "Partnerships", "Something else"];

const FIELDS: Field[] = [
  { name: "name", label: "Full name", required: true, autoComplete: "name" },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
  { name: "company", label: "Company", required: true, autoComplete: "organization" },
  { name: "phone", label: "Phone", autoComplete: "tel" },
  { name: "intent", label: "I'd like to", type: "select", required: true, options: INTENTS },
  { name: "topic", label: "Topic", type: "select", required: true, options: TOPICS },
  { name: "message", label: "Message", type: "textarea", required: true },
];

export default function ContactPage() {
  return (
    <>
      <PageHero badge="Contact" title="Talk to a person," accent="not a queue." lead="Tell us what you're working on. A practitioner from the right team replies by email within 2 business days. We serve clients in 15+ countries from our USA headquarters, with support teams in the USA and India." />

      <Section tone="mist" labelledBy="form-title">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <Card className="p-6 sm:p-8 lg:col-span-7">
            <h2 id="form-title" className="text-h3 font-semibold tracking-[-0.015em]">Send us a message</h2>
            <p className="mt-1 mb-6 text-sm text-navy-500">Fields marked * are required. We reply within 2 business days.</p>
            <InquiryForm fields={FIELDS} subject="Website inquiry" submitLabel="Send message" />
          </Card>
          <div className="space-y-6 lg:col-span-5">
            <ContactCard />
            <Card className="p-6 lg:p-8">
              <h2 className="text-h3 font-semibold tracking-[-0.015em]">Under attack right now?</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Clients get a response to critical incidents in under 15 minutes, 24/7, through the incident contact named in their agreement. Not a client yet? Email us with "URGENT" in the subject.</p>
              <Link href="/managed-services/incident-response" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">Incident response <Arrow /></Link>
            </Card>
          </div>
        </div>
      </Section>

      <Section labelledBy="other-title">
        <Reveal><SectionHeading id="other-title" eyebrow="Other ways in" title="Looking for something specific?" /></Reveal>
        <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["See the product", "A 30-minute walkthrough tailored to your environment.", CTA.demo.href, CTA.demo.label],
            ["Report a vulnerability", "Our disclosure policy covers how to report, scope, safe harbor and what to expect.", "/legal/security", "Security policy"],
            ["Join the team", "Consultants, AI red teamers, analysts and engineers who see a fix through.", "/company/careers", "Careers"],
          ].map(([t, b, href, cta]) => (
            <Card key={t} className="flex h-full flex-col p-6">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
                <Button href={href} variant="secondary" className="mt-6 w-fit">{cta}</Button>
            </Card>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
