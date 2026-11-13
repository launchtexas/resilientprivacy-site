import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

// Search and AI answer crawlers are welcome by name; nobody crawls the form API.
const BOTS = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended"];

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: BOTS, allow: "/", disallow: "/api/" }, { userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
