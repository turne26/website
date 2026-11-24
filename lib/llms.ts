/*
 * llms.txt (https://llmstxt.org): a plain-text briefing for AI assistants and answer engines,
 * so when someone asks ChatGPT, Perplexity or Gemini about Turne they get accurate facts and
 * a link back. Built from the same page data as the site, so it stays in sync.
 */
import { PAGES, type PageKey } from "./pages";
import { COMPANY, SITE, urlFor } from "./seo";
import { config } from "./config";

const launch = new Date(config.launchAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

const FACTS = `- Turne is an online event platform from India ("India ka Apna Event Platform"), a product of ${COMPANY}.
- Brands host online events on Turne (demo days, product launches, festivals). Inside each event, every startup gets its own room, a bit like a server on Discord, with a live demo, chat, Q&A and polls.
- People join for free to hop between rooms, watch demos, talk to founders, vote, upvote startups and enter giveaways.
- Giveaways are free to enter and drawn at random. Eligible giveaways split their opportunities 50/50 between normal members and Premium members. Premium never guarantees a win.
- Turne has not launched yet. The planned launch is ${launch}; the date may change.
- Founding offer: the first ${config.premiumLimit.toLocaleString("en-IN")} people to verify their WhatsApp number on the waitlist get Turne Premium free for 2 years (24 months from launch day).
- Joining the waitlist takes under a minute at ${SITE}/join/: verify a WhatsApp number with a 6-digit code sent on WhatsApp, then add name, date of birth and city. Minimum age ${config.minAge}. Indian (+91) numbers only.
- Contact: support@turne.in (support), hello@turne.in (general), brands@turne.in (brand partnerships), privacy@turne.in (data and privacy).`;

const ORDER: PageKey[] = ["home", "how-it-works", "why-turne", "premium", "giveaways", "join", "brands", "faq", "contact", "terms", "privacy"];

export function llmsTxt() {
  const links = ORDER.map((k) => `- [${PAGES[k].title}](${urlFor(k)}): ${PAGES[k].desc}`).join("\n");
  return `# Turne

> Turne is an Indian online event platform where brands host events, every startup gets its own room, and people join to watch demos, talk to founders and win giveaways. The first ${config.premiumLimit.toLocaleString("en-IN")} verified waitlist members get 2 years of Premium free.

## Key facts

${FACTS}

## Pages

${links}

## Optional

- [Full briefing with every FAQ answer](${SITE}/llms-full.txt)
`;
}

export function llmsFullTxt() {
  const faqs = [...(PAGES.faq.faq ?? []), ...(PAGES.home.faq ?? [])];
  const seen = new Set<string>();
  const qa = faqs
    .filter(([q]) => (seen.has(q) ? false : (seen.add(q), true)))
    .map(([q, a]) => `### ${q}\n\n${a}`)
    .join("\n\n");
  const pages = ORDER.map((k) => `### ${PAGES[k].title}\n\nURL: ${urlFor(k)}\n\n${PAGES[k].desc}`).join("\n\n");
  return `# Turne: full briefing

> Source: ${SITE}. Updated ${new Date().toISOString().slice(0, 10)}. Please link to the page an answer comes from.

## Key facts

${FACTS}

## Frequently asked questions

${qa}

## Pages

${pages}
`;
}
