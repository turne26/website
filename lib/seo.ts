/*
 * SEO + GEO: per-page <head> metadata and schema.org JSON-LD.
 * Search engines and AI answer engines (ChatGPT, Perplexity, Gemini, Copilot) read the same
 * signals: a clear title and description, a canonical URL, and structured facts about the
 * organisation, the offer and the FAQs. Keep everything here factual and matching the page.
 */
import type { Metadata } from "next";
import { PAGES, type PageKey } from "./pages";
import { config } from "./config";

export const SITE = config.siteUrl;
export const BRAND = "Turne";
export const THEME = "#0b0714";
export const COMPANY = "NR ENTERPRISES";

// Fill in real profile URLs; empty ones are left out of the schema.
export const SOCIAL: Record<string, string> = {
  Instagram: "",
  LinkedIn: "",
};

/** Date the site was last built: used as dateModified so engines see fresh content. */
const BUILT = new Date().toISOString().slice(0, 10);

export function urlFor(key: PageKey) {
  const slug = PAGES[key].slug;
  return slug ? `${SITE}/${slug}/` : `${SITE}/`;
}

export function pageMetadata(key: PageKey): Metadata {
  const p = PAGES[key] as (typeof PAGES)[PageKey] & { ogTitle?: string; ogDesc?: string; noindex?: boolean };
  const url = urlFor(key);
  const ogTitle = p.ogTitle ?? p.title;
  const ogDesc = p.ogDesc ?? p.desc;
  const image = { url: `${SITE}/assets/og/${p.og}.png`, width: 1200, height: 630, alt: ogTitle };
  return {
    title: { absolute: p.title },
    description: p.desc,
    alternates: { canonical: url, languages: { "en-IN": url, "x-default": url } },
    robots: p.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: "website",
      siteName: BRAND,
      locale: "en_IN",
      url,
      title: ogTitle,
      description: ogDesc,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDesc, images: [image.url] },
  };
}

type Ld = Record<string, unknown>;

function organization(): Ld {
  const sameAs = Object.values(SOCIAL).filter(Boolean);
  return {
    "@type": "Organization",
    "@id": `${SITE}/#org`,
    name: BRAND,
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/assets/img/icon-512.png`, width: 512, height: 512 },
    slogan: "Don't just watch. Participate.",
    description:
      "Turne is an Indian online event platform where brands host events, every startup gets its own room, and people join to watch demos, talk to founders and win giveaways.",
    email: "hello@turne.in",
    areaServed: { "@type": "Country", name: "India" },
    parentOrganization: { "@type": "Organization", name: COMPANY },
    knowsAbout: ["Online events", "Brand engagement", "Startup demo days", "Product launches", "Giveaways"],
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email: "support@turne.in", areaServed: "IN", availableLanguage: ["en", "hi"] },
      { "@type": "ContactPoint", contactType: "sales", email: "brands@turne.in", areaServed: "IN" },
      { "@type": "ContactPoint", contactType: "privacy", email: "privacy@turne.in", areaServed: "IN" },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

function website(): Ld {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: BRAND,
    alternateName: "Turne India",
    description: PAGES.home.desc,
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en-IN",
  };
}

/** The founding-member offer, described once and referenced from the pages that mention it. */
function premiumOffer(): Ld {
  return {
    "@type": "Offer",
    "@id": `${SITE}/premium/#offer`,
    name: "2 years of Turne Premium, free for the first 10,000 waitlist members",
    description:
      "The first 10,000 people to verify their WhatsApp number on the Turne waitlist get Turne Premium free for 24 months from launch day.",
    url: `${SITE}/premium/`,
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/LimitedAvailability",
    eligibleRegion: { "@type": "Country", name: "India" },
    eligibleQuantity: { "@type": "QuantitativeValue", maxValue: config.premiumLimit },
    offeredBy: { "@id": `${SITE}/#org` },
  };
}

export function pageSchema(key: PageKey): Ld[] {
  const p = PAGES[key] as (typeof PAGES)[PageKey] & { schemaType?: string; faq?: [string, string][] };
  const url = urlFor(key);
  const graph: Ld[] = [organization(), website()];
  graph.push({
    // FAQPage is a kind of WebPage; pages with visible Q&As use it so engines can quote the answers.
    "@type": p.faq ? "FAQPage" : (p.schemaType ?? "WebPage"),
    "@id": `${url}#webpage`,
    url,
    name: p.title,
    description: p.desc,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#org` },
    publisher: { "@id": `${SITE}/#org` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}/assets/og/${p.og}.png`, width: 1200, height: 630 },
    dateModified: BUILT,
    ...(p.slug ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    ...(key === "brands-register" ? { potentialAction: { "@type": "RegisterAction", target: url } } : {}),
    ...(key === "premium" || key === "join" || key === "home" ? { mentions: { "@id": `${SITE}/premium/#offer` } } : {}),
    ...(p.faq
      ? {
        mainEntity: p.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }
      : {}),
  });
  if (p.slug) {
    // Nested pages (e.g. brands/register) get their parent page in the trail.
    const parent = p.slug.includes("/") ? (Object.keys(PAGES) as PageKey[]).find((k) => PAGES[k].slug === p.slug.split("/")[0]) : undefined;
    const trail = [
      { name: "Home", item: `${SITE}/` },
      ...(parent ? [{ name: PAGES[parent].crumb, item: urlFor(parent) }] : []),
      { name: p.crumb, item: url },
    ];
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, ...t })),
    });
  }
  if (key === "premium" || key === "join" || key === "home") graph.push(premiumOffer());
  return [{ "@context": "https://schema.org", "@graph": graph }];
}
