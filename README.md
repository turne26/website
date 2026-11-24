# Turne website

The turne.in site, built with **Next.js (App Router, TypeScript)**. Every page is pre-rendered to static HTML at build time, so it loads fast and search engines and AI crawlers see the full content in the page source. It deploys on Vercel (`vercel.json` sets the framework to Next.js).

```
app/                    routes: one folder per page (page.tsx = metadata + JSON-LD + content)
  layout.tsx            <html>, fonts (next/font), header, footer, live stats provider
  globals.css           all site styles (colour tokens at the top)
  sitemap.ts robots.ts manifest.ts      sitemap.xml, robots.txt, manifest.webmanifest
  llms.txt/ llms-full.txt/              plain-text briefings for AI assistants (GEO)
  not-found.tsx         404 page
content/                the body of each page (JSX). Edit copy here.
components/
  Header, Footer, Logo, StickyJoin      site chrome
  live.tsx              live waitlist count, tally, Premium spot grid, countdown (reads GET /stats)
  JsonLd.tsx            schema.org structured data
  PageScripts.tsx       starts a page's interactive scripts and stops them on navigation
lib/
  config.ts             API URL, launch date, Premium limit, cities: the main settings file
  pages.ts              every page's title, description, share image, breadcrumb and FAQ
  seo.ts                builds <head> metadata and JSON-LD from pages.ts
  llms.ts               builds llms.txt / llms-full.txt from the same data
  api.ts                every network call (with a mock mode when apiBase is empty)
  scripts/              join flow, contact/brand forms, home carousel, explainer and How-it-works animations
public/
  assets/img, og/       logo, icons, 1200x630 share images
  admin/                the /admin/ panel (standalone page; reads public/assets/js/config.js)
brand/                  logo artwork (not deployed)
supabase/               backend: database migrations + the api Edge Function
```

## Develop and deploy

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; fails on type errors
```

Push to `main` and Vercel builds and deploys it. URLs keep the trailing slash (`/premium/`) the site has always used, and `/privacy.html`, `/terms.html`, `/index.html` and `/site.webmanifest` 301-redirect to their new homes, so existing links and rankings carry over.

To change copy, edit the page in `content/`. To change a title, description or FAQ answer that search engines see, edit `lib/pages.ts` (the FAQ answers there feed the FAQ schema and llms.txt, so keep them matching the page).

## Look and feel

Near-black base (`--night #07070c`), electric violet as the brand colour (`--violet #8b6cff`, used for Premium and highlights) and neon lime as the one action colour (`--lime #c6ff3d`, used for buttons and live states). Everything is set in Plus Jakarta Sans, self-hosted through `next/font`. All colours are tokens at the top of `app/globals.css`.

## Pages

| URL | Page | Notes |
| --- | --- | --- |
| `/` | Home | Hero with example event cards, giveaways strip, Premium offer, countdown, quick FAQ |
| `/why-turne/` | Why Turne | Today vs With Turne, the Turne loop |
| `/how-it-works/` | How it works | Live expo floor, inside a pod, the 3D "How a Turne event works" explainer |
| `/giveaways/` | Giveaways | Prize types, 50/50 split, giveaway rules |
| `/premium/` | Premium | First-10,000 offer (2 years free), live spots, benefits, fine print |
| `/brands/` | For brands | Capabilities and enquiry form |
| `/faq/` | FAQ | FAQPage schema |
| `/contact/` | Contact | Three inboxes and a contact form |
| `/join/` | Join the waitlist | 4-step WhatsApp OTP signup |
| `/privacy/`, `/terms/` | Legal | |
| `/admin/` | Admin panel | `noindex`, blocked in robots.txt |

## SEO and GEO

Search engines (Google, Bing) and generative engines (ChatGPT search, Perplexity, Gemini, Copilot, Claude) read the same things, so both are covered in one place, `lib/seo.ts`:

- A unique title and description on every page, one H1 per page, all content in the server-rendered HTML
- Canonical URLs with trailing slash, `hreflang` en-IN + x-default, Open Graph and Twitter cards with a per-page 1200x630 image
- JSON-LD on every page: Organization (with contact points, area served, parent company), WebSite, WebPage with `dateModified`, BreadcrumbList; FAQPage on Home and FAQ; the 2-year Premium Offer on Home, Premium and Join
- `sitemap.xml` (with share images), `robots.txt` that explicitly allows the main AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others) and blocks `/admin/`
- `/llms.txt` and `/llms-full.txt`: a factual briefing on Turne with every FAQ answer and a link to each page, generated from the same data as the site
- Self-hosted fonts with size-matched fallbacks (less layout shift), static pages served from Vercel's edge (fast Core Web Vitals)

After launch: submit `https://turne.in/sitemap.xml` in Google Search Console and Bing Webmaster Tools (Bing also feeds ChatGPT and Copilot search).

## Backend (Supabase)

The API below is implemented in `supabase/`:

```
supabase/
  migrations/20261108000000_turne_backend.sql   tables, locked down with RLS; turne_join() hands out positions
  functions/api/index.ts                        one Edge Function serving every endpoint below
  config.toml                                   turns off JWT checks for the api function
```

Set it up once (Supabase CLI, run from the repo root):

```bash
supabase link --project-ref <ref>
supabase db push                          # creates the tables
supabase functions deploy api --no-verify-jwt
```

Then set `apiBase` in `lib/config.ts` and `public/assets/js/config.js` to `https://<ref>.supabase.co/functions/v1/api` and push.

The function starts in **test mode**: no message is sent, the code is always `123456`, and the site shows the test-code hint. Real codes go out on **WhatsApp through Meta's Cloud API**: the function generates a random 6-digit code, stores only its hash, and sends it with an approved Authentication template.

#### Setting up WhatsApp OTP (one time)

1. **Meta app.** At [developers.facebook.com](https://developers.facebook.com/apps) create an app of type *Business*, attach your Business portfolio, and add the **WhatsApp** product.
2. **Phone number.** In WhatsApp → API Setup, add and verify the number Turne will send from (it must not be registered on the WhatsApp app). Copy its **Phone number ID**.
3. **Business verification.** Business Settings → Security Center → verify your business. Until then you can only message a few numbers and only 250 people a day.
4. **Display name.** Set a display name (e.g. "Turne") and wait for its approval.
5. **Payment method.** WhatsApp Manager → Payment settings: add a card. Authentication messages are billed per delivered message.
6. **Template.** WhatsApp Manager → Message templates → Create → category **Authentication** → *Copy code*. Name it `turne_otp`, language **English (en)**, tick "Add security recommendation" and "Expiration: 10 minutes" if you like, and submit. Use those exact name/language values in `WA_TEMPLATE` / `WA_TEMPLATE_LANG`.
7. **Permanent token.** Business Settings → Users → System users → add an *Admin* system user → Assign assets (your app and WhatsApp account, full control) → Generate token with `whatsapp_business_messaging` and `whatsapp_business_management`, expiry *Never*. That's `WA_ACCESS_TOKEN`.
8. **Webhook.** App dashboard → WhatsApp → Configuration → Webhook → Edit. Callback URL `https://<ref>.supabase.co/functions/v1/api/whatsapp/webhook`, Verify token = your `WA_VERIFY_TOKEN`. Deploy the function with that secret set *before* clicking Verify and save. Then under Webhook fields, **Subscribe** to `messages`. Meta only sends real (non-test) events once the app is **published** (App dashboard → Publish). The webhook logs failed code deliveries and stores STOP/START replies in `members.whatsapp_opted_out_at`.
9. **Secrets.** Copy `supabase/functions/.env.example` to `supabase/functions/.env` (git ignores it) and fill in `OTP_MODE=whatsapp`, `WA_ACCESS_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_TEMPLATE`, `WA_TEMPLATE_LANG`, `WA_VERIFY_TOKEN`, `WA_APP_SECRET` and `OTP_PEPPER` (`openssl rand -hex 32`). Upload them:

```bash
supabase secrets set --env-file supabase/functions/.env
```

Then apply the migration and redeploy: `supabase db push && supabase functions deploy api --no-verify-jwt`.

While the Meta app is still in development, WhatsApp only delivers to numbers added under API Setup → "To" (up to 5); others fail with error 131030 and the site says it couldn't reach the number. If sends fail, the function logs Meta's error (Supabase → Edge Functions → api → Logs): `190` = token expired/invalid, `132001` = template name or language doesn't match an approved template, `131026` = the number isn't on WhatsApp.

Other optional secrets, all listed in `.env.example`: `LAUNCH_AT` (overrides the countdown date), `PREMIUM_LIMIT` (10000), `MIN_AGE` (13), `ALLOWED_ORIGINS` (extra CORS origins; `turne.in`, `www.turne.in`, `*.vercel.app` and localhost are already allowed).

Signups, brand enquiries and contact messages are in the Table Editor (`members`, `brand_enquiries`, `contact_messages`). `referral_leaderboard` lists who invited the most people.

## Backend integration

Set `apiBase` in `lib/config.ts` (and `public/assets/js/config.js` for the admin panel) (for example `"https://api.turne.in/v1"`). While it's empty the site runs in **mock mode**: nothing leaves the browser and OTP `123456` is accepted. That's how the preview works.

All requests are JSON with `credentials: "include"`. Allow CORS from `https://turne.in` if the API is on another origin. Errors should return a non-2xx status with:

```json
{ "error": { "code": "otp_invalid", "message": "That code doesn't match. Check WhatsApp and try again." } }
```

`message` is shown to the person as-is, so write it for them.

### GET `/stats`
Feeds every live number on the site (tally, spots left, % claimed, countdown). It's polled every 60 s; cache it for 15–30 s.
```json
{ "waitlistCount": 1121, "premiumLimit": 10000, "launchAt": "2027-01-26T10:00:00+05:30" }
```

### POST `/otp/send`
```json
{ "phone": "9876543210" }
```
→ `{ "ok": true, "resendAfter": 30 }`. The phone number is 10 digits with no country code (+91 is implied). Send the code on WhatsApp. Enforce rate limits (Privacy §6). Error codes the UI expects: `invalid_phone`, `rate_limited`, `already_registered` (409: the number is already on the waitlist, so no message is sent).

### POST `/otp/verify`
```json
{ "phone": "9876543210", "code": "123456" }
```
→ `{ "ok": true, "verificationToken": "…", "existing": null }`. If the number is already on the waitlist, return `existing: { "position": 845, "premium": true, "inviteCode": "AB12CD" }`. The site then shows the person their spot (Terms A3). Store OTPs hashed and cap attempts. Error codes: `otp_invalid`, `otp_expired`, `otp_locked`.

### POST `/waitlist`
```json
{
  "verificationToken": "…",
  "name": "Asha Rao",
  "dob": "2001-05-14",
  "city": "Nashik",
  "company": "",
  "ref": "AB12CD",
  "utm": { "source": "instagram", "medium": "paid", "campaign": "launch", "content": null, "term": null },
  "landing": "/premium/"
}
```
→ `{ "position": 1122, "premium": true, "inviteCode": "PX4SJQ" }`

- `company` is a honeypot. If it isn't empty, it's a bot: return a normal-looking 200 and don't save.
- Assign `position` in verification order. Set `premium` = position ≤ 10,000 (Terms B1).
- Enforce the minimum age server-side too (`minAge` in lib/config.ts, currently 13).
- `ref` is the inviter's `inviteCode` from `/?ref=CODE` links; use it for referral tracking.
- `city` is free text when someone picks "Other city".
- Error code `token_invalid` sends the person back to step 1.

### POST `/brands/enquiry`
`{ name, company, email, phone, plan, message, website }` → `{ "ok": true }`. `website` is a honeypot.

### POST `/contact`
`{ name, email, topic, message, website }` → `{ "ok": true }`. `website` is a honeypot.

## Before going live

- [ ] Set the real `launchAt` in `lib/config.ts` (the current launch date is a placeholder; it also appears in llms.txt)
- [ ] Fill the highlighted legal placeholders in `content/privacy.tsx` and `content/terms.tsx`: entity name, registered address, last-updated date, minimum age, OTP retention days, response days, winner reply days, jurisdiction city
- [ ] Add Instagram and LinkedIn profile URLs in `SOCIAL` in `lib/seo.ts` (they become `sameAs` links in the Organization schema)
- [ ] Update `fallbackStats` in `lib/config.ts` so the page source shows a recent number before JS loads
- [ ] Add analytics in `app/layout.tsx` if you use it (the Privacy policy §9 already covers it)
