import type { Metadata } from "next";
import { CONTACT } from "@/lib/nav";
import { Card, CheckList, Section, SectionHeading } from "@/components/ui";
import { Faq } from "@/components/sections";
import { PageHero } from "@/components/company/parts";
import { ThreatPipeline } from "@/components/graphics";
import { InquiryForm } from "@/components/company/InquiryForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "See the Resilient Privacy platform, managed SOC, consulting and GRC services in a 30-minute walkthrough tailored to your environment.",
};


const AGENDA = [
  ["5 min", "Your goals", "What you're protecting, what's in place and what's not working."],
  ["15 min", "Live walkthrough", "The console with sample data, mapped to the problems you named."],
  ["5 min", "Services fit", "Where our SOC, testers or GRC team would plug in, if at all."],
  ["5 min", "Next steps", "A trial, a scoped proposal or a follow-up with a specialist."],
];

export default function DemoPage() {
  return (
    <>
      <PageHero badge="Book a demo" title="See it working on" accent="problems like yours." lead="A 30-minute walkthrough with a solutions engineer. No slides you could have read on the website."
        aside={<figure className="mx-auto w-full max-w-lg"><ThreatPipeline /><figcaption className="mt-3 text-center text-micro text-navy-500">Example data</figcaption></figure>} />

      <Section tone="mist" labelledBy="form-title">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <Card className="p-6 sm:p-8 lg:col-span-7">
            <h2 id="form-title" className="text-h3 font-semibold tracking-[-0.015em]">Request your demo</h2>
            <p className="mt-1 mb-6 text-sm text-navy-500">Fields marked * are required. We'll reply with times that work.</p>
            <InquiryForm form="demo" submitLabel="Request demo" />
          </Card>
          <div className="space-y-6 lg:col-span-5">
            <Card className="p-6 lg:p-8">
              <h2 className="text-h3 font-semibold tracking-[-0.015em]">What you'll see</h2>
              <CheckList className="mt-5 text-navy-800" items={[
                "API discovery and exposure findings, ranked by real risk",
                "Alert triage and investigation in the SOC console",
                "How pentest findings flow to fixes and retests",
                "Controls and evidence mapped to SOC 2 and ISO 27001",
              ]} />
            </Card>
            <Card className="p-6 lg:p-8">
              <h2 className="text-h3 font-semibold tracking-[-0.015em]">Prefer email?</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">
                Write to <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Demo request")}`} className="font-medium text-accent hover:text-accent-hover">{CONTACT.email}</a> with a few lines about your environment.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section labelledBy="agenda-title">
        <SectionHeading id="agenda-title" eyebrow="Agenda" title="Thirty minutes, four parts." align="center" />
        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-panel bg-line shadow-hairline sm:grid-cols-2 lg:grid-cols-4">
          {AGENDA.map(([time, t, b]) => (
            <li key={t} className="reveal bg-canvas p-6 lg:p-8">
              <span className="font-mono text-sm text-accent">{time}</span>
              <h3 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="mist" labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Before you book." />
          </div>
          <Faq className="lg:col-span-8" items={[
            ["Do I need to share data before the demo?", "No. We use sample data. If you want a proof of concept on your own environment, we scope that afterwards."],
            ["Who will be on the call?", "A solutions engineer, plus a SOC, consulting or GRC specialist if your interest calls for one."],
            ["Is there a free trial?", "Yes: a 14-day guided pilot on one environment, set up with you after the demo."],
            ["How is pricing structured?", "Priced per product and estate size. We share a quote after the demo."],
          ]} />
        </div>
      </Section>
    </>
  );
}
