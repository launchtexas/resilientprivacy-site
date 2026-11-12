import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbs, service } from "@/lib/schema";
import { Arrow, Badge, Button, Card, CheckList, Eyebrow, ILLUSTRATIVE, Section, SectionHeading } from "@/components/ui";
import { CtaButtons, Faq, FinalCta } from "@/components/sections";
import { GradientBorder, Marquee, Spotlight, Stagger } from "@/components/motion";
import { AI_SERVICES, MCP_REVIEW } from "@/components/ai/data";
import { SurfaceMap } from "@/components/ai/SurfaceMap";
import { Icon } from "@/components/consulting/parts";
import { hrefOf } from "@/components/consulting/data";
import { AiAttackMethod, AiGatewayStream } from "@/components/graphics";

const DESC = "AI security consulting: red teaming for LLMs, agents and MCP, AI governance for ISO/IEC 42001, NIST AI RMF and the EU AI Act, and secure AI adoption.";
export const metadata: Metadata = { title: "AI Security Consulting", description: DESC };

const METHOD: [string, string][] = [
  ["Recon", "Inventory models, agents, tools and data. Find where untrusted text gets in."],
  ["Inject", "Direct and indirect prompt injection, jailbreaks and context manipulation."],
  ["Abuse tools", "Turn an injection into a real action through tools and MCP servers."],
  ["Exfiltrate", "Prove what data leaves: prompts, documents, other users' records."],
  ["Retest and map", "Replay every chain after the fix, and map it to the governance control it proves."],
];

const FRAMEWORKS = ["OWASP Top 10 for LLM Applications (2025)", "MITRE ATLAS", "OWASP Agentic Security", "ISO/IEC 42001", "NIST AI RMF", "NIST AI 600-1", "EU AI Act", "ISO/IEC 27001", "SOC 2"];

const FAQ: [string, string][] = [
  ["What does an AI red team actually test?", "How your AI product behaves under attack: prompt injection (direct and through documents or tool output), data leakage, what an agent's tools can be made to do, poisoned retrieval sources and the model supply chain. We map every finding to the OWASP LLM Top 10 and MITRE ATLAS."],
  ["When do EU AI Act obligations apply to us?", "They phase in over several years, with different dates for prohibited practices, general-purpose models and high-risk systems, and some dates have been under review. We work from the current official timeline and start with your role and risk class per system."],
  ["ISO/IEC 42001 or ISO 27001: which do we need?", "ISO 27001 covers information security; ISO/IEC 42001 covers how you govern AI systems, including impact and life-cycle controls. They share a structure, so if you have 27001, 42001 builds on it rather than starting over."],
  ["Why review MCP servers separately?", "Each MCP server hands an agent new powers, often with a broad token. One poisoned tool description or injected instruction can use all of them. A permission review is the fastest way to shrink that blast radius."],
  ["Do you build AI, or only secure it?", "We secure it. We review the architecture, test it and govern it, and stay independent of the model and tool vendors you choose."],
];

export default function AiSecurityPage() {
  return (
    <>
      <JsonLd data={[service({ name: "AI Security practice", description: DESC, path: "/ai-security", type: "ProfessionalService", serviceType: "AI security consulting" }), breadcrumbs([["Home", "/"], ["AI Security", "/ai-security"]])]} />

      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
        <div aria-hidden className="absolute -top-48 left-1/2 h-96 w-[880px] -translate-x-1/2 rounded-full bg-accent-soft blur-3xl" />
        <div className="container-rp relative pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>AI Security practice</Eyebrow>
            <h1 id="hero-title" className="mt-6 text-display font-semibold tracking-[-0.04em] text-balance text-navy-950">
              Secure the AI you build <span className="text-accent">and the AI you buy.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lead text-navy-600 text-pretty">
              We red-team LLM apps, agents and MCP tool chains, govern them under ISO/IEC 42001, the NIST AI RMF and the EU AI Act, and help your company adopt AI without losing track of its data.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <CtaButtons kind="practice" />
            </div>
          </div>
          <div className="relative mx-auto mt-14 max-w-[1120px] lg:mt-16">
            <SurfaceMap />
            <p className="mt-3 text-center text-micro text-navy-500">Attack classes from the OWASP Top 10 for LLM Applications (2025) and MITRE ATLAS.</p>
          </div>
        </div>
      </section>

      <Section tone="mist" labelledBy="svc-title">
        <SectionHeading id="svc-title" eyebrow="Services" title="Test it, govern it, adopt it safely." lead="Three services from one team, so a red-team finding arrives with the control it proves and the policy that prevents it next time." />
        <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {AI_SERVICES.map((s) => (
            <Spotlight key={s.slug} tilt className="h-full rounded-card">
              <Link href={hrefOf(s)} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <span className="grid size-10 place-items-center rounded-control bg-accent-soft text-accent"><Icon d={s.icon} /></span>
                  <p className="mt-6 font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">{s.kicker}</p>
                  <h3 className="mt-1 text-h3 font-semibold tracking-[-0.015em]">{s.name}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{s.card}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore <Arrow /></span>
                </Card>
              </Link>
            </Spotlight>
          ))}
        </Stagger>
        <GradientBorder className="reveal mt-4">
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:items-center lg:p-8">
            <div className="lg:col-span-5">
              <Badge tone="accent" dot>Named offering</Badge>
              <h3 className="mt-4 text-h3 font-semibold tracking-[-0.015em]">{MCP_REVIEW.name}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{MCP_REVIEW.lead}</p>
              <Link href="/ai-security/red-teaming#mcp-review" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">See what we check <Arrow /></Link>
            </div>
            <CheckList className="text-navy-800 sm:columns-2 sm:gap-8 sm:space-y-0 sm:[&>li]:mb-2.5 sm:[&>li]:break-inside-avoid lg:col-span-7" items={MCP_REVIEW.checks} />
          </div>
        </GradientBorder>
      </Section>

      <Section labelledBy="method-title">
        <SectionHeading id="method-title" eyebrow="Method" title={<>Our AI attack method</>} lead="Five steps, published so you can check our work. Each step maps to public frameworks, and the last one turns findings into governance evidence." />
        <AiAttackMethod steps={METHOD} className="mt-12" />
        <p className="mt-3 text-micro text-navy-500 lg:text-right">{ILLUSTRATIVE}</p>
        <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="reveal lg:sticky lg:top-28 lg:col-span-4">
            <h3 className="text-h3 font-semibold tracking-[-0.015em]">Attacks in, blocked, logged as evidence.</h3>
            <p className="mt-3 text-navy-600 text-pretty">After the retest, the guardrails we helped deploy keep working. Every blocked attempt is logged against the control it proves, so the audit trail builds itself.</p>
          </div>
          <div className="min-w-0 rounded-card bg-canvas p-4 shadow-card ring-1 ring-line sm:p-6 lg:col-span-8">
            <AiGatewayStream />
          </div>
        </div>
        <Marquee label="Frameworks we map our work to" className="mt-12">
          {FRAMEWORKS.map((f) => <span key={f} className="rounded-chip bg-cloud px-3 py-1.5 font-mono text-micro whitespace-nowrap text-navy-700">{f}</span>)}
        </Marquee>
      </Section>

      <Section tone="mist" labelledBy="ev-title">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <SectionHeading id="ev-title" eyebrow="Test once, prove everywhere" title="A red-team finding is also governance evidence." lead="Big firms sell testing and AI governance from separate teams. We file each finding and retest against the ISO/IEC 42001, NIST AI RMF and EU AI Act controls it proves." />
            <Link href="/ai-security/governance" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">See the framework crosswalk <Arrow /></Link>
          </div>
          <Card className="reveal p-5 sm:p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-micro text-navy-500">AI-0115-01 · Ticket text can make the agent issue refunds</p>
              <Badge tone="ok" dot>Retest passed</Badge>
            </div>
            <dl className="mt-4 divide-y divide-line text-sm">
              {[["OWASP LLM", "LLM01 Prompt injection · LLM06 Excessive agency"], ["ISO/IEC 42001", "A.9 Use of AI systems"], ["NIST AI RMF", "GOVERN 3.2 · MEASURE 2.7"], ["EU AI Act", "Art. 14 Human oversight · Art. 15 Cybersecurity"]].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
                  <dt className="w-32 shrink-0 font-mono text-micro tracking-[0.06em] text-navy-500 uppercase">{k}</dt>
                  <dd className="text-navy-900">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-micro text-navy-500">Illustrative finding</p>
          </Card>
        </div>
      </Section>

      <Section labelledBy="res-title">
        <SectionHeading id="res-title" eyebrow="Research" title="Notes from our AI red team." lead="We publish how we test, so you can judge the method before you hire us." />
        <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link href="/resources/blog/llm-application-security" className="group block h-full">
            <Card interactive className="flex h-full flex-col p-6">
              <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">Article</p>
              <h3 className="mt-2 text-h3 font-semibold tracking-[-0.015em]">Securing LLM applications: a threat model that fits on one page</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">Prompt injection is not a bug you patch once. Treat the model as an untrusted component and design the controls around what it can reach.</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Read <Arrow /></span>
            </Card>
          </Link>
          <Link href="/resources/blog?topic=ai" className="group block h-full">
            <Card interactive className="flex h-full flex-col p-6">
              <p className="font-mono text-micro tracking-[0.08em] text-navy-500 uppercase">Series</p>
              <h3 className="mt-2 text-h3 font-semibold tracking-[-0.015em]">All AI security research</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">Agent and MCP threat models, red-team checklists and EU AI Act readiness notes.</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Browse <Arrow /></span>
            </Card>
          </Link>
        </Stagger>
      </Section>

      <Section tone="mist" labelledBy="faq-title">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions we hear most." className="lg:col-span-4" />
          <Faq items={FAQ} className="lg:col-span-8" />
        </div>
      </Section>

      <div className="pt-20 lg:pt-28">
        <FinalCta kind="practice" title="Find out what your agent would do for an attacker." lead="A 30-minute call with an AI red teamer. You leave with a scope, a timeline and a fixed quote." />
      </div>
    </>
  );
}
