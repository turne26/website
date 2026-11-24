import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// AI search and answer engines we want to read and cite Turne (GEO). Listing them explicitly
// makes the permission unambiguous even if a crawler only looks for its own name.
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "meta-externalagent", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/admin/"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
