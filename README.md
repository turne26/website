# Turne website

Static, multi-page site for turne.in. Plain HTML, CSS and vanilla JS with no framework and no build dependencies beyond Python 3. It deploys to any static host (Vercel, Netlify, Cloudflare Pages, S3, Nginx).

```
src/
  build.py        builds dist/ (production) and preview/ (flat files for previewing)
  layout.py       <head>/SEO, header, footer, shared components, social links
  home.py         Home page (event cards, Premium offer, countdown, quick FAQ; inline SVG art)
  pages.py        Why Turne, How it works, Giveaways, Premium, Brands, FAQ, Contact, Join
  legal.py        Privacy, Terms, 404
  gen_images.py   renders share images (assets/og/*.png) and app icons
  make_logo.py    cuts the logo out of brand/turne-logo.jpg into transparent PNGs
  brand/          logo artwork and large cut-outs (not deployed)
  make_video.py   renders video/turne-explainer.mp4 from the site animation
  assets/
    css/site.css
    js/config.js  <- the only file to edit when connecting the backend
    js/api.js     every network call lives here (with a mock mode)
    js/site.js    menu, live counters, countdown, UTM/referral capture
    js/join.js    SMS OTP signup flow
    js/forms.js   brand enquiry + contact forms
    js/explainer.js  the 3D "How a Turne event works" animation (How it works)
    fonts/        self-hosted Plus Jakarta Sans (woff2)
dist/             production output: deploy this folder
```

## Look and feel

Near-black base (`--night #07070c`), electric violet as the brand colour (`--violet #8b6cff`, used for Premium and highlights) and neon lime as the one action colour (`--lime #c6ff3d`, used for buttons and live states). Everything is set in Plus Jakarta Sans. All colours are tokens at the top of `assets/css/site.css`.

## Explainer animation and video

`explainer()` in `src/layout.py` is a 25-second 3D phone animation in five scenes: a brand hosts an event, every startup gets a room, you explore a room, you take part, you win. Visitors can click any step, pause it, and it respects reduced-motion settings. It only runs while on screen. Startup and brand names in it are made up.

`python3 src/make_video.py` films that same animation frame by frame into `video/turne-explainer.mp4` (1920x1080, 30 fps, about 32 s, silent), with an intro and an end card. Re-run it after changing the animation so the video stays in sync.

## Build and deploy

```bash
python3 src/build.py          # rebuild dist/ and preview/
python3 src/make_logo.py      # only if the logo artwork in src/brand/ changes, then run gen_images.py
python3 src/gen_images.py     # only if you change share-image headlines (needs: pip install playwright && playwright install chromium)
```

Deploy `dist/`. URLs are clean (`/premium/`, `/faq/`). `dist/_redirects` (Netlify, Cloudflare) and `dist/vercel.json` 301-redirect the old `/privacy.html` and `/terms.html`, so existing links and rankings carry over. `.htaccess` does the same on Apache.

On Vercel, import the repo with the default settings: the root `vercel.json` (also written by `build.py`) tells Vercel to skip the build and serve the committed `dist/` folder. Rebuild and push `dist/` after every change.

## Pages

| URL | Page | Notes |
| --- | --- | --- |
| `/` | Home | Built in `src/home.py`: hero with example event cards, giveaways strip, Premium offer, countdown, quick FAQ |
| `/why-turne/` | Why Turne | Today vs With Turne, the Turne loop |
| `/how-it-works/` | How it works | Discover, Participate, Win, Connect, Experience |
| `/giveaways/` | Giveaways | Prize types, 50/50 split, giveaway rules |
| `/premium/` | Premium | First-10,000 offer, live spots, benefits, fine print |
| `/brands/` | For brands | Capabilities and enquiry form |
| `/faq/` | FAQ | 12 questions, FAQPage schema |
| `/contact/` | Contact | Three inboxes and a contact form |
| `/join/` | Join the waitlist | 4-step SMS OTP signup |
| `/privacy/`, `/terms/` | Legal | Full text from the current site |
| `/404.html` | Not found | `noindex` |

## SEO included

- A unique `<title>` (60 characters or fewer) and meta description (160 or fewer) on every page, plus one H1 per page
- Canonical URLs, `hreflang="en-IN"`, Open Graph and Twitter cards with a per-page 1200×630 share image
- JSON-LD on every page: Organization + WebSite (home), WebPage + BreadcrumbList (inner pages), FAQPage (FAQ)
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, favicons and app icons
- Server-rendered HTML: all content is in the page source, not injected by JS
- Self-hosted fonts with preload and `font-display: swap`, no third-party requests

After launch, submit `https://turne.in/sitemap.xml` in Google Search Console.

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

Then set `apiBase` in `src/assets/js/config.js` to `https://<ref>.supabase.co/functions/v1/api`, run `python3 src/build.py` and push.

The function starts in **test mode**: no message is sent, the code is always `123456`, and the site shows the test-code hint. Real codes go through [Message Central VerifyNow](https://www.messagecentral.com/product/verify-now/api), which generates, delivers and checks the code (the backend stores only its `verificationId`). To switch it on, fill in `supabase/functions/.env` (copy it from `.env.example` next to it; git ignores the real one) with `OTP_MODE=messagecentral`, `MC_CUSTOMER_ID`, `MC_PASSWORD` and `MC_FLOW=SMS`, and upload it:

```bash
supabase secrets set --env-file supabase/functions/.env
```

Other optional secrets, all listed in `.env.example`: `LAUNCH_AT` (overrides the countdown date), `PREMIUM_LIMIT` (10000), `MIN_AGE` (13), `ALLOWED_ORIGINS` (extra CORS origins; `turne.in`, `www.turne.in`, `*.vercel.app` and localhost are already allowed).

Signups, brand enquiries and contact messages are in the Table Editor (`members`, `brand_enquiries`, `contact_messages`). `referral_leaderboard` lists who invited the most people.

## Backend integration

Set `apiBase` in `assets/js/config.js` (for example `"https://api.turne.in/v1"`). While it's empty the site runs in **mock mode**: nothing leaves the browser and OTP `123456` is accepted. That's how the preview works.

All requests are JSON with `credentials: "include"`. Allow CORS from `https://turne.in` if the API is on another origin. Errors should return a non-2xx status with:

```json
{ "error": { "code": "otp_invalid", "message": "That code doesn't match. Check the SMS and try again." } }
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
→ `{ "ok": true, "resendAfter": 30 }`. The phone number is 10 digits with no country code (+91 is implied). Send the code by SMS. Enforce rate limits (Privacy §6). Error codes the UI expects: `invalid_phone`, `rate_limited`, `already_registered` (409: the number is already on the waitlist, so no SMS is sent).

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
- Enforce the minimum age server-side too (`minAge` in config.js, currently 13).
- `ref` is the inviter's `inviteCode` from `/?ref=CODE` links; use it for referral tracking.
- `city` is free text when someone picks "Other city".
- Error code `token_invalid` sends the person back to step 1.

### POST `/brands/enquiry`
`{ name, company, email, phone, plan, message, website }` → `{ "ok": true }`. `website` is a honeypot.

### POST `/contact`
`{ name, email, topic, message, website }` → `{ "ok": true }`. `website` is a honeypot.

## Before going live

- [ ] Set `apiBase` and the real `launchAt` in `assets/js/config.js` (the current launch date is a placeholder)
- [ ] Fill the highlighted legal placeholders in `src/legal.py`: entity name, registered address, last-updated date, minimum age, OTP retention days, response days, winner reply days, jurisdiction city
- [ ] Add Instagram and LinkedIn profile URLs in `SOCIAL` in `src/layout.py` (links stay hidden until set)
- [ ] Update `FALLBACK_COUNT` in `src/layout.py` so the page source shows a recent number before JS loads
- [ ] Add your analytics snippet in `head()` in `src/layout.py` if you use one (the Privacy policy §9 already covers it)
