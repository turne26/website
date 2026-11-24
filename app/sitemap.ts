import type { MetadataRoute } from "next";
import { PAGES, type PageKey } from "@/lib/pages";
import { SITE, urlFor } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = (Object.keys(PAGES) as PageKey[])
    .filter((k) => !(PAGES[k] as { noindex?: boolean }).noindex)
    .map((k) => ({
      url: urlFor(k),
      lastModified: now,
      changeFrequency: (k === "home" ? "daily" : "weekly") as "daily" | "weekly",
      priority: (PAGES[k] as { priority?: number }).priority ?? 0.5,
      images: [`${SITE}/assets/og/${PAGES[k].og}.png`],
    }));
  return pages;
}
