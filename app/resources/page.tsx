import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Badge, Card, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { Reveal, Spotlight, Stagger, Terminal, type TermLine } from "@/components/motion";
import { AiAttackSurface } from "@/components/graphics";
import { GUIDES, POSTS, STORIES, STORY_LABEL, fmtDate, topicOf } from "@/components/resources/data";
import { DocCard, Newsletter } from "@/components/resources/parts";
import { TopicChips } from "@/components/resources/TopicFilter";

export const metadata: Metadata = {
  title: "Resources",
  description: "AI security research, offensive security notes, compliance guides and the Resilient Privacy trust center, written by practitioners.",
};

const CATEGORIES = [
  ["Blog", "/resources/blog", `${POSTS.length} articles on AI security, offensive security, exposure management and compliance.`],
  ["Guides & reports", "/resources/guides", `${GUIDES.length} printable checklists and buyer's guides for audits and purchases.`],
  ["Case studies", "/resources/case-studies", "Illustrative stories of testing, operations and compliance working together."],
  ["Documentation", "/resources/docs", "Getting started, integrations and the API reference outline."],
  ["Trust center", "/resources/trust", "The controls we run on ourselves, data handling and compliance status."],
];

// Hero terminal lists the real catalogue; lines stay ≤ 40 characters for 375px.
const LINES: TermLine[] = [
  { text: "$ rp research --latest", tone: "prompt" },
  ...POSTS.map((p): TermLine => ({ text: `→ ${p.category} · ${fmtDate(p.date)}`, tone: topicOf(p) === "ai" ? "accent" : "plain" })),
  { text: `✓ ${POSTS.length} articles · ${GUIDES.length} guides`, tone: "muted", pause: 0 },
];

export default function ResourcesHub() {
  const ai = POSTS.filter((p) => topicOf(p) === "ai");
  const rest = POSTS.filter((p) => topicOf(p) !== "ai");
  return (
    <>
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" />
        <div className="container-rp relative grid grid-cols-1 items-center gap-10 pt-12 pb-12 lg:grid-cols-12 lg:pt-20 lg:pb-16">
          <div className="lg:col-span-7">
            <Eyebrow>Resilient Privacy Research</Eyebrow>
            <h1 id="hero-title" className="mt-6 text-h1 font-semibold tracking-[-0.03em] text-balance text-navy-950">Research from the people who break, secure and govern AI.</h1>
            <p className="mt-5 text-lead text-navy-600 text-pretty">What our testers, analysts and auditors learn on engagements, written down so your team can use it: threat models, checklists and buyer&rsquo;s guides.</p>
            <TopicChips base="/resources/blog" active={null} className="mt-8" />
          </div>
          <Terminal label={`Latest research: ${POSTS.length} articles and ${GUIDES.length} guides.`} title="research" lines={LINES} className="lg:col-span-5" />
        </div>
      </section>

      <Section tone="mist" labelledBy="ai-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>AI security series</Eyebrow>
              <h2 id="ai-title" className="mt-3 text-h2 font-semibold tracking-[-0.025em] text-balance">Where AI systems actually break.</h2>
              <p className="mt-3 text-navy-600 text-pretty">Prompt injection, data leakage through retrieval and agent tool misuse, mapped to the OWASP Top 10 for LLM Applications and MITRE ATLAS. Start with the one-page threat model.</p>
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-4">
              {ai.map((p) => <li key={p.slug}><DocCard d={p} base="/resources/blog" /></li>)}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
              <Link href="/resources/blog?topic=ai" className="group inline-flex items-center gap-1.5 text-accent hover:text-accent-hover">All AI security research <Arrow /></Link>
              <Link href="/ai-security" className="group inline-flex items-center gap-1.5 text-accent hover:text-accent-hover">AI security practice <Arrow /></Link>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-lg lg:col-span-6">
            <AiAttackSurface />
            <figcaption className="mt-3 text-center text-micro text-navy-500">Simulated environment, real workflow.</figcaption>
          </figure>
        </div>
      </Section>

      <Section labelledBy="latest-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal><SectionHeading id="latest-title" eyebrow="Latest" title="More from the blog and guides." /></Reveal>
          <Link href="/resources/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover">All articles <Arrow /></Link>
        </div>
        <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => <DocCard key={p.slug} d={p} base="/resources/blog" />)}
          {GUIDES.map((g) => <DocCard key={g.slug} d={g} base="/resources/guides" />)}
        </Stagger>
        <Link href={`/resources/case-studies#${STORIES[0].slug}`} className="group reveal mt-4 block">
          <Card interactive className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-12 lg:items-center lg:p-8">
            <div className="lg:col-span-9">
              <Badge tone="medium">{STORY_LABEL}</Badge>
              <h3 className="mt-4 text-h3 font-semibold tracking-[-0.015em]">{STORIES[0].title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-navy-600">{STORIES[0].challenge}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent lg:col-span-3 lg:justify-self-end">Read the story <Arrow /></span>
          </Card>
        </Link>
      </Section>

      <Newsletter />
      <Section labelledBy="cat-title">
        <Reveal><SectionHeading id="cat-title" eyebrow="Browse" title="Find what you need." /></Reveal>
        <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map(([t, h, d]) => (
            <Spotlight key={h} className="h-full rounded-card">
              <Link href={h} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <h3 className="text-h3 font-semibold tracking-[-0.015em]">{t}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-navy-600">{d}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">Open<span className="sr-only"> {t}</span> <Arrow /></span>
                </Card>
              </Link>
            </Spotlight>
          ))}
        </Stagger>
      </Section>

      <FinalCta title="Rather talk it through?" lead="Book time with the practitioner behind the research that fits your question." kind="expert" />
    </>
  );
}
