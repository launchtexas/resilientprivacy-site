import type { Metadata } from "next";
import { Badge, Card, CheckList, Section, SectionHeading } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { CONTACT } from "@/lib/nav";
import { Reveal, Spotlight, Stagger } from "@/components/motion";
import { PageHero } from "@/components/resources/parts";

export const metadata: Metadata = {
  title: "Trust center",
  description: "How Resilient Privacy protects customer data: security practices, data handling, subprocessors and team certifications.",
};

const PRACTICES = [
  ["Access control", "Single sign-on and multi-factor authentication for staff, least-privilege roles and periodic access reviews."],
  ["Encryption", "Customer data encrypted in transit and at rest; keys managed in a cloud key management service."],
  ["Secure development", "Peer-reviewed changes, automated code and dependency scanning, and deployments only through CI/CD."],
  ["Monitoring", "Centralized logging and 24/7 monitoring of our own environment by our security operations team."],
  ["Testing", "Independent penetration tests of the platform, with findings tracked to verified fix."],
  ["Incident response", "A documented, exercised incident response plan with customer notification steps."],
  ["People", "Background checks before hire where local law allows, confidentiality agreements, and security awareness training at hire and every year."],
];
const DATA = [
  "We process customer data only to deliver the services in your agreement.",
  "Customer environments are logically separated by tenant.",
  "Data is retained for the period in your agreement, then deleted.",
  "You can request export or deletion of your data at any time.",
  "Staff access to customer data is limited, logged and reviewed.",
];
// Individual certifications held by our team; the company holds no audit report or certification.
const CERTS = [
  ["CISSP", "Security leadership and architecture"],
  ["CISM", "Security program management"],
  ["CISA", "Information systems audit"],
  ["OSCP", "Hands-on penetration testing"],
  ["CEH", "Ethical hacking"],
  ["Security+", "Security fundamentals"],
  ["CCNA", "Networking"],
];

const SUBPROCESSORS = [
  ["Vercel", "Website hosting", "https://vercel.com"],
  ["Resend", "Delivery of website form email", "https://resend.com"],
  ["Binary", "Careers applications", "https://binary.so"],
];

export default function Trust() {
  return (
    <>
      <PageHero eyebrow="Trust center" title="How we protect your data." lead="The controls we run on ourselves, how we handle customer data, who processes it on our behalf, and the certifications our team holds." />
      <Section labelledBy="prac-title" className="pt-0!">
        <Reveal><SectionHeading id="prac-title" eyebrow="Security practices" title="The controls we run on ourselves." lead="The same practices we deliver to clients, applied to our own environment first." /></Reveal>
        <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICES.map(([t, d], i) => (
            <Spotlight key={t} className="h-full rounded-card bg-canvas p-6 shadow-card">
              <span className="font-mono text-micro text-accent">0{i + 1}</span>
              <h3 className="mt-4 text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{d}</p>
            </Spotlight>
          ))}
        </Stagger>
      </Section>
      <Section tone="mist" labelledBy="data-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="data-title" eyebrow="Data handling" title="Your data stays yours." lead="The full terms are in your agreement and data processing addendum (DPA)." className="lg:col-span-5" />
          <CheckList items={DATA} className="text-navy-800 lg:col-span-7" />
        </div>
      </Section>
      <Section labelledBy="comp-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading id="comp-title" eyebrow="Certifications" title="Certified people, not a certified company." lead="Resilient Privacy does not hold a company audit report or certification such as SOC 2 or ISO 27001. Our team holds these individual certifications." />
            <dl className="reveal mt-8 divide-y divide-line rounded-card bg-canvas shadow-card">
              {CERTS.map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <dt className="font-medium text-navy-950">{k}</dt>
                  <dd><Badge>{v}</Badge></dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHeading id="sub-title" eyebrow="Subprocessors" title="Who processes data for us." lead="The vendors that process data for this website and our hiring. Tools used in client engagements are listed in each engagement's agreement. We give notice before adding a subprocessor." />
            <div className="reveal mt-8 overflow-x-auto rounded-card bg-canvas shadow-card">
              <table aria-labelledby="sub-title" className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-mist text-navy-500"><tr><th scope="col" className="px-5 py-3 font-medium">Subprocessor</th><th scope="col" className="px-5 py-3 font-medium">Purpose</th><th scope="col" className="px-5 py-3 font-medium">Website</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {SUBPROCESSORS.map(([c, p, u]) => (
                    <tr key={c}><th scope="row" className="px-5 py-4 font-medium text-navy-950">{c}</th><td className="px-5 py-4 text-navy-600">{p}</td><td className="px-5 py-4"><a href={u} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-hover">{u.slice(8)}<span className="sr-only"> (opens in a new tab)</span></a></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>
      <Section tone="mist" labelledBy="contact-title">
        <Card className="reveal grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:items-center lg:p-10">
          <div className="lg:col-span-8">
            <h2 id="contact-title" className="text-h2 font-semibold tracking-[-0.025em]">Questions, reports or a security review?</h2>
            <p className="mt-3 text-navy-600 text-pretty">Request our security documentation, send a completed questionnaire, or report a vulnerability under our <a href="/legal/security" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">disclosure policy</a>. We reply from a named person.</p>
          </div>
          <a href={`mailto:${CONTACT.security}?subject=Security%20inquiry`} className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-medium text-white transition-colors duration-(--duration-fast) hover:bg-accent-hover lg:col-span-4 lg:justify-self-end">Email the security team</a>
        </Card>
      </Section>
      <FinalCta title="Security your auditors and customers can check." lead="Talk to us about your own security and compliance program." kind="expert" />
    </>
  );
}
