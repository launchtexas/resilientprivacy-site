import type { MetadataRoute } from "next";
import { REAL } from "@/lib/routes";
import { GUIDES, POSTS } from "@/components/resources/data";
import { SITE_URL } from "@/lib/schema";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...REAL, ...POSTS.map((p) => `/resources/blog/${p.slug}`), ...GUIDES.map((g) => `/resources/guides/${g.slug}`)];
  return paths.map((h) => ({ url: `${SITE_URL}${h === "/" ? "" : h}` }));
}
