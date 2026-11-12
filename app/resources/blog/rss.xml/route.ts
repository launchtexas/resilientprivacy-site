// RSS 2.0 feed of blog posts, built at build time. Linked from the blog index via metadata alternates.
import { AUTHOR, POSTS } from "@/components/resources/data";
import { SITE_NAME, SITE_URL } from "@/lib/schema";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

export function GET() {
  const blog = `${SITE_URL}/resources/blog`;
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const items = posts.map((p) => {
    const url = `${blog}/${p.slug}`;
    return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${rfc822(p.date)}</pubDate><category>${esc(p.category)}</category><dc:creator>${esc(AUTHOR)}</dc:creator><description>${esc(p.excerpt)}</description></item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${esc(SITE_NAME)} blog</title><link>${blog}</link><description>Practical writing on AI security, offensive security, exposure management and compliance from ${esc(AUTHOR)}.</description><language>en-us</language><lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate><atom:link href="${blog}/rss.xml" rel="self" type="application/rss+xml"/>${items.join("")}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
