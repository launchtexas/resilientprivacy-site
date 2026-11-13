import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaButtons } from "@/components/sections";
import { Arrow, Button, Card, Section, SectionHeading } from "@/components/ui";
import { ContactCard, Icon, ICONS, PageHero } from "@/components/company/parts";
import { Reveal, Spotlight, Stagger } from "@/components/motion";
import { DivisionOrbit } from "@/components/graphics";
import { ENGAGEMENT, RadarChart, Timeline } from "@/components/charts";
import { founder, JsonLd } from "@/lib/schema";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: "About",
  description: "Resilient Privacy is a cybersecurity and AI security consultancy, backed by its own 24/7 SOC and security platform. Who we are and how we work.",
};

// Consulting and AI security lead; operations and software are why the advice sticks (audit v3, G8).
const DIVISIONS = [
  { icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4", kicker: "Consulting", name: "Security Consulting", body: "Penetration testing, red teaming, application security, vCISO advisory, and risk and compliance work for SOC 2 and ISO 27001.", href: "/consulting" },
  { icon: "M12 3v3M12 18v3M3 12h3M18 12h3M7 7h10v10H7zM10 10h4v4h-4z", kicker: "AI security", name: "AI Security", body: "Red teaming of models, agents, RAG pipelines and MCP tool chains, and AI governance under ISO/IEC 42001, NIST AI RMF and the EU AI Act.", href: "/ai-security" },
  { icon: ICONS.shield, kicker: "Operations", name: "Managed SOC & NOC", body: "Findings become detections: 24/7 analysts who monitor, investigate and respond inside your environment.", href: "/managed-services" },
  { icon: "M4 5h16v10H4zM8 19h8M12 15v4", kicker: "Platform", name: "Security Platform", body: "Keeps every fix in view: API protection, exposure management and compliance evidence in one console.", href: "/platform" },
];

// The team's own rating of its depth per practice area, 0 to 5 (a self-assessment, captioned as such).
const DEPTH = {
  title: "Where the team is deepest",
  desc: "Our self-assessed depth by practice area, 2026. 5 means we lead the work and publish on it; 3 means we deliver it with a partner specialist.",
  placeholder: false,
  axes: ["Offensive", "AI security", "Cloud", "Advisory", "Compliance", "Detection"],
  max: 5,
  series: [{ name: "Practice depth", values: [5, 4.5, 4, 4, 4, 3.5] }],
};

const PRINCIPLES = [
  ["One accountable team", "Software, operations, testing and audit work from the same findings, so nothing falls between vendors."],
  ["Privacy by default", "We collect the least data we need, keep it in your environment where we can, and say plainly what we hold."],
  ["Evidence over claims", "Every alert, finding and control comes with proof your engineers and auditors can check."],
  ["One named lead", "The practitioner who scopes the work does the work, and stays from kickoff to the retest and the auditor's sign-off."],
];

export default function CompanyPage() {
  return (
    <>
      <JsonLd data={founder()} />
      <PageHero
        badge="About Resilient Privacy"
        title="Cybersecurity and AI security consulting,"
        accent="from first test to final evidence."
        lead="Resilient Privacy Inc. is a cybersecurity and AI security consultancy, backed by our own SOC and platform. Headquartered in the USA, we serve clients in 15+ countries. We break, secure and govern the systems and the AI you run, then stay until the fix is shipped, monitored and proven to an auditor."
        aside={<DivisionOrbit core="One named lead" className="max-w-sm" />}
      >
        <CtaButtons kind="expert" />
      </PageHero>

      <Section tone="mist" labelledBy="mission-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="mission-title" eyebrow="Mission" title="Make strong security and privacy the default, not a project." />
          </div>
          <div className="reveal space-y-4 text-lead text-navy-600 text-pretty lg:col-span-7">
            <p>Most organizations buy a scanner from one vendor, a SOC from another, a pentest from a third and an audit from a fourth. Each sees part of the picture, and the gaps between them are where incidents happen.</p>
            <p>We start where the risk is found: testing your applications, cloud, identity and AI systems like an attacker would. Then we keep going. Findings become detections in our SOC, fixes are retested, and the evidence lands in your audit file, with the same practitioners on the work from start to finish.</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="div-title">
        <Reveal><SectionHeading id="div-title" eyebrow="What we do" title="Consulting first, with operations and software behind it." lead="Two consulting practices lead every engagement. Our SOC and platform are the reason the advice sticks." /></Reveal>
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIVISIONS.map((d) => (
            <Spotlight key={d.href} className="h-full rounded-card">
              <Link href={d.href} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={d.icon} /></span>
                  <p className="mt-6 font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{d.kicker}</p>
                  <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em]">{d.name}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{d.body}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore<span className="sr-only"> {d.name}</span> <Arrow /></span>
                </Card>
              </Link>
            </Spotlight>
          ))}
        </Stagger>
        <div className="mt-4 grid grid-cols-1 items-start gap-8 rounded-panel bg-mist p-5 sm:p-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:sticky lg:top-28 lg:col-span-5">
            <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">Depth where the risk is.</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Offensive and AI security are where we lead and publish. Advisory, compliance and detection are built on the same findings, so the team that tests your systems also governs and watches them.</p>
          </Reveal>
          <RadarChart className="min-w-0 lg:col-span-7" {...DEPTH} />
        </div>
      </Section>

      <Section tone="mist" labelledBy="founder-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div aria-hidden className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-accent-soft to-transparent" />
              <Image src="/team/vishva-patel.png" alt="Portrait of Vishva Patel, Founder and CEO of Resilient Privacy" width={1254} height={1254} sizes="(min-width: 1024px) 420px, 90vw" className="relative aspect-square w-full rounded-panel object-cover shadow-card" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading id="founder-title" eyebrow="Founder" title="Vishva Patel" lead="Founder & CEO. Ethical hacker. Serial entrepreneur, investor and advisor." />
            <div id="vishva-patel" className="reveal mt-6 space-y-4 text-navy-700 text-pretty">
              <p>Vishva has spent more than ten years in cybersecurity, much of it as an ethical hacker: breaking into systems, with permission, so the people who own them find the weak points before an attacker does. That instinct runs every Resilient Privacy engagement. Test it like an adversary. Fix it. Prove the fix.</p>
              <p>As a serial entrepreneur, investor and advisor, Vishva has watched organizations buy security from a stack of vendors that never talk to each other, and pay for the gaps between them. Resilient Privacy exists to end that: one accountable partner, from the first test to the auditor&apos;s sign-off.</p>
              <p>Vishva also mentors the next generation of security practitioners, and holds the firm to the same bar: the person who scopes your work does the work, and stays until it is proven.</p>
            </div>
            <dl className="reveal mt-8 grid grid-cols-2 gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <dt className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">In cybersecurity</dt>
                <dd className="mt-1 text-h3 font-semibold tracking-[-0.015em] text-navy-950">10+ years</dd>
              </div>
              <div>
                <dt className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">Certifications</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Security+", "CCNA", "CISA", "CISM"].map((c) => <span key={c} className="rounded-full bg-canvas px-3 py-1 text-sm font-medium text-navy-900 shadow-hairline">{c}</span>)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section labelledBy="values-title">
        <Reveal><SectionHeading id="values-title" eyebrow="How we work" title="Principles we hold ourselves to." align="center" /></Reveal>
        <ol className="reveal mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-panel bg-line shadow-hairline sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(([t, b], i) => (
            <li key={t} className="bg-canvas p-6 lg:p-8">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 grid grid-cols-1 items-start gap-8 rounded-panel bg-mist p-5 sm:p-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:sticky lg:top-28 lg:col-span-4">
            <h3 className="text-h3 font-semibold tracking-[-0.015em] text-navy-950">One engagement, end to end.</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Scoping to retest in nine weeks, with the same named lead throughout. Critical findings reach you the day we confirm them, not at the reporting phase.</p>
          </Reveal>
          <Timeline className="min-w-0 lg:col-span-8" {...ENGAGEMENT} title="A typical engagement, week by week" />
        </div>
      </Section>

      <Section labelledBy="reach-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="reach-title" eyebrow="Get in touch" title="Talk to the team." lead="Engagements, partnerships and general questions go to one inbox, read by people. Security reports go straight to the security team. Critical incidents get a response in under 15 minutes, 24/7." />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButtons kind="expert" />
            </div>
            <p className="mt-8 text-[0.9375rem] leading-relaxed text-navy-600">
              Want to join us? See <Link href="/company/careers" className="font-medium text-accent hover:text-accent-hover">open roles</Link> or email <a href={`mailto:${CONTACT.careers}`} className="font-medium text-accent hover:text-accent-hover">{CONTACT.careers}</a>.
            </p>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Resilient Privacy on LinkedIn (opens in a new tab)" className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
              <Image src="/logos/linkedin-in-bug.png" alt="" width={28} height={24} unoptimized />
              Follow us on LinkedIn <Arrow />
            </a>
          </div>
          <ContactCard className="reveal lg:col-span-7" />
        </div>
      </Section>

    </>
  );
}
