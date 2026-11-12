import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, guideBySlug } from "@/components/resources/data";
import { DocPage } from "@/components/resources/parts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = guideBySlug((await params).slug);
  return p ? { title: p.seo ?? p.title, description: p.excerpt, authors: [{ name: "Resilient Privacy Research" }] } : {};
}

export default async function Guide({ params }: Props) {
  const p = guideBySlug((await params).slug);
  if (!p) notFound();
  return <DocPage d={p} check crumb={["Guides & reports", "/resources/guides"]} />;
}
