// Phase-2 stub routes: every nav href renders this until a real page exists at that path.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA } from "@/lib/nav";
import { STUBS } from "@/lib/routes";
import { Button, Eyebrow, Section } from "@/components/ui";

const nameOf = (slug: string[]) => slug[slug.length - 1].replace(/-/g, " ");

export const dynamicParams = false;
export const generateStaticParams = () => STUBS.map((h) => ({ slug: h.slice(1).split("/") }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const name = nameOf((await params).slug);
  return { title: name[0].toUpperCase() + name.slice(1), description: "This page is being built.", robots: { index: false } };
}

export default async function Stub({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!STUBS.includes(`/${slug.join("/")}`)) notFound();
  const name = nameOf(slug);
  return (
    <Section>
      <div className="max-w-2xl py-10">
        <Eyebrow>Coming soon</Eyebrow>
        <h1 className="mt-4 text-h1 font-semibold tracking-[-0.03em] capitalize">{name}</h1>
        <p className="mt-4 text-lead text-navy-600">This page is being built. In the meantime, our team can walk you through it.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={CTA.demo.href}>{CTA.demo.label}</Button>
          <Button href="/" variant="secondary">Back to home</Button>
        </div>
      </div>
    </Section>
  );
}
