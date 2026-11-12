import type { Metadata } from "next";
import { Arrow, Card, Section, SectionHeading } from "@/components/ui";
import { Faq, FinalCta } from "@/components/sections";
import { PageHero } from "@/components/company/parts";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Resilient Privacy: security engineers, SOC analysts, penetration testers and GRC consultants working as one team.",
};

const CAREERS_URL = "https://resilientprivacy.notion.site/Resilient-Privacy-Careers-24b57ead966880b9b019f3d65c3e3efe";

const VALUES = [
  ["Own the outcome", "You scope it, you do it, you see it through. Nobody hands work over a wall."],
  ["Write it down", "Findings, runbooks and decisions are written so the next person can act without a meeting."],
  ["Respect the data", "We treat customer data the way we tell customers to treat theirs."],
  ["Keep learning", "Time for research, training and certifications is part of the job."],
];

const STEPS = [
  ["Apply", "Send your application through our careers page. A person reads every one."],
  ["Intro call", "30 minutes with the hiring manager about the role, your goals and how we work."],
  ["Practical exercise", "A short, paid or time-boxed task that looks like the real work. No trick questions."],
  ["Team conversation", "Meet the people you'd work with, ask anything, then get a decision quickly."],
];

// Teams, not invented openings: live roles are on CAREERS_URL.
const TEAMS: [string, string][] = [
  ["Offensive Security", "Penetration testers and red teamers across web, API, cloud and identity."],
  ["AI Security", "AI red teamers and AI security consultants testing models, agents, RAG pipelines and MCP tool chains."],
  ["Risk & Compliance", "Consultants who build control sets for SOC 2, ISO 27001 and ISO/IEC 42001 and carry them to audit."],
  ["Managed SOC & NOC", "Analysts and detection engineers who turn findings into detections, around the clock."],
  ["Platform Engineering", "Engineers who build the software our consultants and analysts run on."],
];

export default function CareersPage() {
  return (
    <>
      <PageHero badge="Careers" title="Do the security work" accent="you'd want done for you." lead="We hire engineers, analysts, testers and auditors who like seeing a problem through from first finding to verified fix.">
        <a href={CAREERS_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 font-medium text-white transition-colors duration-(--duration-fast) hover:bg-accent-hover">
          See open roles <Arrow /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </PageHero>

      <Section tone="mist" labelledBy="values-title">
        <SectionHeading id="values-title" eyebrow="Values" title="What working here is like." />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([t, b]) => (
            <li key={t}>
              <Card className="h-full p-6">
                <h3 className="text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
              </Card>
            </li>
          ))}
        </ul>
        <Card className="reveal mt-4 grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:items-center lg:p-8">
          <div className="lg:col-span-12">
            <h3 className="text-h3 font-semibold tracking-[-0.015em]">Benefits</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">Benefits, time off, working location and the training budget are set out in each offer letter. Ask us during the first call and we will tell you what applies to the role.</p>
          </div>
        </Card>
      </Section>

      <Section labelledBy="hire-title">
        <SectionHeading id="hire-title" eyebrow="How we hire" title="Four steps, no surprises." align="center" />
        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-panel bg-line shadow-hairline sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, b], i) => (
            <li key={t} className="reveal bg-canvas p-6 lg:p-8">
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-6 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="mist" labelledBy="roles-title">
        <SectionHeading id="roles-title" eyebrow="Open roles" title="Teams we hire for." lead="Open roles, with full descriptions and locations, are listed on our careers page." />
        <Card className="reveal mt-10 divide-y divide-line">
          {TEAMS.map(([team, body]) => (
            <div key={team} className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <p className="font-medium text-navy-950 sm:w-56 sm:shrink-0">{team}</p>
              <p className="text-[0.9375rem] leading-relaxed text-navy-600 sm:flex-1">{body}</p>
            </div>
          ))}
        </Card>
        <a href={CAREERS_URL} target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">
          View all roles on our careers page <Arrow /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions candidates ask." />
          </div>
          <Faq className="lg:col-span-8" items={[
            ["Don't see a role that fits?", "Send a short note and your résumé through the careers page. We keep strong profiles on file and reach out when a fit opens."],
            ["Do you sponsor visas?", "It depends on the role. Ask us in your first call and we will give you a straight answer."],
            ["Is the work remote?", "It depends on the role, and each posting says so. Our headquarters is in Richardson, Texas."],
            ["Do I need certifications?", "No. Practical skill matters more than letters. We support certifications once you're here."],
          ]} />
        </div>
      </Section>

      <FinalCta title="Want to see the work first?" lead="Talk to one of our practitioners about how we test, advise and operate." kind="expert" />
    </>
  );
}
