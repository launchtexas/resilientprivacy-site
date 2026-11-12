import type { Metadata } from "next";
import { Suspense } from "react";
import { POSTS, topicOf } from "@/components/resources/data";
import { DocCard, Newsletter, PageHero } from "@/components/resources/parts";
import { TopicFilter, TopicGrid, type TopicItem } from "@/components/resources/TopicFilter";
import { JsonLd, blog, itemList } from "@/lib/schema";

const DESC = "Practical writing on AI security, offensive security, exposure management and compliance from Resilient Privacy Research.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESC,
  // Replaces the layout's alternates, so canonical is restated.
  alternates: { canonical: "./", types: { "application/rss+xml": [{ url: "/resources/blog/rss.xml", title: "Resilient Privacy blog" }] } },
};

const BASE = "/resources/blog";

export default function BlogIndex() {
  const items: TopicItem[] = POSTS.map((p) => ({
    key: p.slug,
    topic: topicOf(p),
    card: <DocCard d={p} base={BASE} />,
    large: <DocCard d={p} base={BASE} large />,
  }));
  const posts = POSTS.map((p) => ({ headline: p.title, path: `${BASE}/${p.slug}`, datePublished: p.date }));
  return (
    <>
      <JsonLd data={[blog({ name: "Resilient Privacy blog", description: DESC, path: BASE, posts }), itemList(posts.map((p) => [p.headline, p.path]))]} />
      <PageHero eyebrow="Blog" title="Notes from the people doing the work." lead="Practical writing on AI security, offensive security, exposure management and compliance. No vendor fluff." />
      <section aria-labelledby="list-title" className="pb-20 lg:pb-28">
        <h2 id="list-title" className="sr-only">Articles</h2>
        <div className="container-rp">
          {/* Static HTML lists every article; the client reads ?topic=… and filters. */}
          <Suspense fallback={<TopicGrid items={items} base={BASE} topic={null} />}>
            <TopicFilter items={items} base={BASE} />
          </Suspense>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
