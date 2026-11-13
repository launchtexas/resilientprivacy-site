import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POSTS, postBySlug } from "@/components/resources/data";
import { DocPage } from "@/components/resources/parts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  return p ? { title: p.seo ?? p.title, description: p.seoDescription ?? p.excerpt, authors: [{ name: "Resilient Privacy Research" }] } : {};
}

export default async function Post({ params }: Props) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  return <DocPage d={p} crumb={["Blog", "/resources/blog"]} />;
}
