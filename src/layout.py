"""Shared layout pieces: <head>, header, footer, reusable components.

Tokens resolved at build time:
  {{u:slug}}   link to a page ("" = home)        prod: /slug/      preview: slug.html
  {{a}}        assets prefix                      prod: /assets/    preview: assets/
"""
import json

SITE = "https://turne.in"
BRAND = "Turne"
THEME = "#0b0714"
FALLBACK_COUNT = 1121
LIMIT = 10000

# Leave a value empty to hide that link everywhere. Fill in the real profile URLs.
SOCIAL = {
    "Instagram": "",
    "LinkedIn": "",
}

NAV = [
    ("", "Home"),
    ("how-it-works", "How it Works"),
    ("premium", "Premium"),
    ("faq", "FAQ"),
]


def fmt(n):
    """Indian digit grouping, e.g. 12,34,567 (matches Intl en-IN in the browser)."""
    s = str(n)
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ",".join(parts) + "," + tail


COUNT = fmt(FALLBACK_COUNT)
NEXT = fmt(FALLBACK_COUNT + 1)
REMAINING = fmt(LIMIT - FALLBACK_COUNT)
LIMIT_S = fmt(LIMIT)
PERCENT = f"{FALLBACK_COUNT / LIMIT * 100:.2f}%"


def stat(key):
    val = {"count": COUNT, "next": NEXT, "remaining": REMAINING, "limit": LIMIT_S, "percent": PERCENT}[key]
    return f'<span class="num" data-stat="{key}">{val}</span>'


# The Turne logo (mark + wordmark), cut from src/brand/turne-logo.jpg by src/make_logo.py.
LOGO_IMGS = ('<img class="logo__mark" src="{{a}}img/logo-mark.png" width="157" height="120" alt="">'
             '<img class="logo__word" src="{{a}}img/logo-word.png" width="392" height="66" alt="">')


def head(page, mode):
    """Everything that belongs in <head>."""
    canonical = SITE + ("/" if not page["slug"] else f"/{page['slug']}/")
    og_img = f"{SITE}/assets/og/{page.get('og', page['slug'] or 'home')}.png"
    robots = "noindex, follow" if page.get("noindex") else "index, follow, max-image-preview:large"
    title = page["title"]
    if mode == "preview" and page["slug"] == "" :
        title = "Turne Website"
    parts = [
        f"<title>{title}</title>",
    ]
    if mode == "preview":
        parts.append('<meta name="claude:viewport-fit-sides" content="cover">')
    parts += [
        f'<meta name="description" content="{page["desc"]}">',
        f'<link rel="canonical" href="{canonical}">',
        f'<meta name="robots" content="{robots}">',
        f'<meta name="theme-color" content="{THEME}">',
        '<meta name="color-scheme" content="dark">',
        '<meta name="format-detection" content="telephone=no">',
        f'<meta property="og:site_name" content="{BRAND}">',
        f'<meta property="og:type" content="website">',
        '<meta property="og:locale" content="en_IN">',
        f'<meta property="og:title" content="{page.get("og_title", page["title"])}">',
        f'<meta property="og:description" content="{page.get("og_desc", page["desc"])}">',
        f'<meta property="og:url" content="{canonical}">',
        f'<meta property="og:image" content="{og_img}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{page.get("og_title", page["title"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{page.get("og_title", page["title"])}">',
        f'<meta name="twitter:description" content="{page.get("og_desc", page["desc"])}">',
        f'<meta name="twitter:image" content="{og_img}">',
        f'<link rel="alternate" hreflang="en-IN" href="{canonical}">',
        f'<link rel="alternate" hreflang="x-default" href="{canonical}">',
        '<link rel="icon" href="{{a}}img/favicon-32.png" sizes="32x32" type="image/png">',
        '<link rel="apple-touch-icon" href="{{a}}img/apple-touch-icon.png">',
        '<link rel="manifest" href="site.webmanifest">' if mode == "preview" else '<link rel="manifest" href="/site.webmanifest" crossorigin="use-credentials">',
        '<link rel="preload" href="{{a}}fonts/plus-jakarta-sans-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>',
        '<link rel="preload" href="{{a}}fonts/plus-jakarta-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>',
        '<link rel="stylesheet" href="{{a}}css/site.css">',
    ]
    for block in schema_for(page, canonical):
        parts.append('<script type="application/ld+json">' + json.dumps(block, ensure_ascii=False, separators=(",", ":")) + "</script>")
    return "\n".join(parts)


def schema_for(page, canonical):
    org = {
        "@type": "Organization",
        "@id": SITE + "/#org",
        "name": BRAND,
        "url": SITE + "/",
        "logo": SITE + "/assets/img/icon-512.png",
        "slogan": "Don't just watch. Participate.",
        "email": "hello@turne.in",
        "contactPoint": [
            {"@type": "ContactPoint", "contactType": "customer support", "email": "hello@turne.in", "areaServed": "IN", "availableLanguage": ["en"]},
            {"@type": "ContactPoint", "contactType": "sales", "email": "brands@turne.in", "areaServed": "IN"},
        ],
    }
    same_as = [u for u in SOCIAL.values() if u]
    if same_as:
        org["sameAs"] = same_as
    blocks = []
    graph = []
    if page["slug"] == "":
        graph.append(org)
        graph.append({
            "@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": BRAND,
            "description": page["desc"], "publisher": {"@id": SITE + "/#org"}, "inLanguage": "en-IN",
        })
    graph.append({
        "@type": page.get("schema_type", "WebPage"), "@id": canonical + "#webpage", "url": canonical,
        "name": page["title"], "description": page["desc"], "inLanguage": "en-IN",
        "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": SITE + "/#org"},
    })
    if page["slug"]:
        graph.append({
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": page["crumb"], "item": canonical},
            ],
        })
    blocks.append({"@context": "https://schema.org", "@graph": graph})
    if page.get("faq"):
        blocks.append({
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}}
                for q, a in page["faq"]
            ],
        })
    return blocks


def strip_tags(s):
    import re
    return re.sub(r"<[^>]+>", "", s)


def logo():
    """The Turne logo, linking home."""
    return f'<a class="logo" href="{{{{u:}}}}" aria-label="Turne home">{LOGO_IMGS}</a>'


ARROW = '<svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def header(page):
    links = []
    for slug, label in NAV:
        cur = ' aria-current="page"' if page["slug"] == slug else ""
        links.append(f'<a href="{{{{u:{slug}}}}}"{cur}>{label}</a>')
    join_cur = ' aria-current="page"' if page["slug"] == "join" else ""
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    {logo()}
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <div class="nav-links">{"".join(links)}</div>
      <a class="pill pill--outline header-cta" href="{{{{u:join}}}}"{join_cur}>Join the Waitlist</a>
    </nav>
  </div>
</header>"""


def footer(page):
    sticky = "" if page.get("no_sticky") else """
<div class="sticky-join" role="region" aria-label="Join the waitlist">
  <a class="btn btn--ticket btn--block" href="{{u:join}}">Join the waitlist</a>
</div>"""
    mail = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
    return f"""<footer class="site-footer" data-hide-sticky>
  <div class="wrap foot">
    <div class="foot__brand">{logo()}<p>Discover Events. Win Giveaways. Connect with Brands.</p></div>
    <a class="foot__mail" href="mailto:support@turne.in">{mail}support@turne.in</a>
    <nav class="foot__legal" aria-label="Legal"><a href="{{{{u:privacy}}}}">Privacy Policy</a><a href="{{{{u:terms}}}}">Terms of Use</a></nav>
  </div>
</footer>{sticky}"""


def crumbs(label):
    return f'<nav class="crumbs" aria-label="Breadcrumb"><a href="{{{{u:}}}}">Home</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>'


def ticket(title="Lifetime Premium pass", variant=""):
    cls = "ticket" + (" ticket--premium" if variant == "premium" else "")
    return f"""<div class="{cls}" role="img" aria-label="Your next waitlist spot is number {NEXT}">
  <div class="ticket__main">
    <div class="ticket__brand"><b>TURNE</b><span>Early access</span></div>
    <div class="ticket__title">{title}</div>
    <dl class="ticket__rows">
      <div><dt>Next spot</dt><dd>#{stat("next")}</dd></div>
      <div><dt>Spots left</dt><dd>{stat("remaining")}</dd></div>
      <div><dt>Valid for</dt><dd>Life</dd></div>
    </dl>
    <div class="ticket__barcode" aria-hidden="true"></div>
  </div>
  <div class="ticket__stub" aria-hidden="true"><span>No. {stat("next")}</span></div>
</div>"""


def gate(heading="Through the gate so far"):
    return f"""<div class="gate">
  <div>
    <h2 class="display" style="font-size:clamp(1.44rem,2.8vw,2.04rem)">{heading}</h2>
    <div style="margin-top:1.5rem">
      <div class="tally" data-tally aria-label="{COUNT} people on the waitlist"></div>
      <p class="gate__label"><strong>{stat("count")}</strong> people are on the waitlist. Joining takes under a minute.</p>
    </div>
  </div>
  <div>
    <p class="small" style="font-weight:600;margin-bottom:.9rem">Lifetime Premium spots</p>
    <div class="ticks" data-ticks data-cells="50" role="img" aria-label="{COUNT} of {LIMIT_S} Lifetime Premium spots claimed"></div>
    <div class="ticks-key"><span><strong>{stat("count")}</strong> claimed ({stat("percent")})</span><span><strong>{stat("remaining")}</strong> left</span><span>Each block is 200 spots</span></div>
  </div>
</div>"""


def countdown():
    return """<div class="countdown" data-countdown role="timer" aria-label="Time until Turne launches">
  <div><b data-cd="d">--</b><span>days</span></div>
  <div><b data-cd="h">--</b><span>hours</span></div>
  <div><b data-cd="m">--</b><span>minutes</span></div>
  <div><b data-cd="s">--</b><span>seconds</span></div>
</div>"""


def closer(heading="Get in before everyone else.", lede=None):
    lede = lede or f"Only {stat('remaining')} Lifetime Premium spots are left, and the countdown doesn't stop."
    return f"""<section class="band closer" data-hide-sticky aria-labelledby="closer-h">
  <div class="wrap closer-grid">
    <div class="stack">
      <p class="meta">You're early. That's the point.</p>
      <h2 id="closer-h">{heading}</h2>
    </div>
    <div class="stack">
      <p class="lede">{lede}</p>
      <div class="cta-row"><a class="btn btn--ticket" href="{{{{u:join}}}}">Join the waitlist</a><span class="meta">{stat("count")}+ already waiting</span></div>
    </div>
  </div>
</section>"""


def phone_feed():
    return """<figure style="margin:0;display:grid;gap:1rem;justify-items:center">
  <div class="phone" aria-label="Example of the Turne app feed">
    <div class="phone__screen">
      <div class="phone__bar"><img class="phone__logo" src="{{a}}img/logo-word.png" width="392" height="66" alt="Turne"><span>Happening near you</span></div>
      <div class="feed-card">
        <small class="live">Demo event, live now</small>
        <strong>Move different.</strong>
        <div class="foot"><span>2.4K joining</span><span class="pill">Join</span></div>
      </div>
      <div class="feed-card feed-card--paper">
        <small>Demo giveaway</small>
        <strong>Win your setup.</strong>
        <div class="foot"><span>1.2K entries</span><span class="pill">Enter</span></div>
      </div>
      <div class="feed-card">
        <small>Demo event, registered</small>
        <strong>Campus sessions</strong>
        <div class="foot"><span>You're on the list</span><span class="pill pill--done">Registered</span></div>
      </div>
    </div>
  </div>
  <figcaption class="fine" style="text-align:center">Illustrative examples. Brands shown are placeholders, not partners.</figcaption>
</figure>"""


ICONS = {
    "box": '<path d="M4 9l12-5 12 5v14l-12 5-12-5z"/><path d="M4 9l12 5 12-5M16 14v14"/>',
    "ticket": '<path d="M4 9h24v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6z"/><path d="M20 9v14" stroke-dasharray="2 2"/>',
    "tag": '<path d="M4 4h11l13 13-11 11L4 15z"/><circle cx="10" cy="10" r="2"/>',
    "bolt": '<path d="M18 3L7 18h8l-1 11 11-15h-8z"/>',
    "card": '<rect x="4" y="7" width="24" height="18" rx="3"/><path d="M4 13h24M9 20h6"/>',
    "star": '<path d="M16 4l3.6 7.6 8.4 1-6.2 5.8 1.6 8.3L16 22.6 8.6 26.7l1.6-8.3L4 12.6l8.4-1z"/>',
    "gift": '<rect x="5" y="12" width="22" height="16"/><path d="M3 8h26v4H3zM16 8v20M16 8c-2-5-8-5-8-1s8 1 8 1zm0 0c2-5 8-5 8-1s-8 1-8 1z"/>',
    "check": '<path d="M6 17l6 6L26 9"/>',
}


def icon(name):
    return f'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">{ICONS[name]}</svg>'


# ---------------------------------------------------------------- 3D explainer
EX_STEPS = [
    ("Host", "A brand creates the event: a demo day, a launch, a festival."),
    ("Showcase", "Every startup gets its own room to show what it's building."),
    ("Explore", "Walk in and hop between rooms. Watch demos and chat with founders."),
    ("Participate", "Ask questions, vote in polls and upvote the startups you like."),
    ("Win", "Enter each room's giveaway and follow startups for what's next."),
]

EX_ROOMS = [  # made-up startups for the demo
    ("K", "kilnly", "Pricing tool for ceramic studios", "214", "v"),
    ("T", "tiffly", "Home-cooked lunch, delivered", "188", "l"),
    ("O", "orbitra", "Weather data from tiny satellites", "156", "p"),
    ("N", "nestpay", "Rent split for flatmates", "131", "d"),
    ("L", "lumora", "Sleep coach for night-shift workers", "97", "l"),
    ("P", "packwise", "Compostable courier bags", "84", "v"),
]


def _rail(active="K"):
    icons = "".join(f'<i class="ex-ico ex-ico--{c}{" is-on" if l == active else ""}">{l}</i>' for l, *_r, c in EX_ROOMS[:5])
    return f'<div class="ex-rail"><i class="ex-ico ex-ico--ev">FF</i><hr>{icons}<i class="ex-ico ex-ico--add">+</i></div>'


def explainer(heading="How a Turne event works", lede=None, film=False):
    lede = lede or ("Brands host events on Turne. Inside each one, every startup gets its own room, a bit like a "
                    "server on Discord. You drop in, see demos, talk to founders and win giveaways.")
    steps = "".join(
        f'<li><button type="button" class="ex-step" data-step="{i}" aria-pressed="{"true" if i == 0 else "false"}">'
        f'<span class="ex-n">{i + 1}</span><b>{name}</b><span class="ex-d">{desc}</span>'
        f'<span class="ex-bar" aria-hidden="true"><i></i></span></button></li>'
        for i, (name, desc) in enumerate(EX_STEPS))
    layers = "".join(f'<i class="ex-layer" style="--z:{-(i + 1) * 1.4}px"></i>' for i in range(10))
    status = '<div class="ex-status"><span>9:41</span><span class="ex-sig"><i></i><i></i><i></i></span></div>'
    rooms = "".join(
        f'<li class="ex-room{" ex-room--target" if n == "kilnly" else ""}"><i class="ex-ico ex-ico--{c}">{l}</i>'
        f'<div><b># {n}</b><span>{d}</span></div><em>{m}</em></li>'
        for l, n, d, m, c in EX_ROOMS)
    dots = "<i></i>" * 24
    head_html = "" if film else f'<h2 id="ex-h">{heading}</h2><p class="lede">{lede}</p>'
    controls = "" if film else ('<div class="ex-controls"><button type="button" class="linkbtn ex-toggle" aria-pressed="false">Pause</button>'
                                '<span class="fine">Illustrative demo. Brands and startups shown are made up.</span></div>')
    roomhead = '<div class="ex-roomhead"><b># kilnly</b><span><i class="ex-dot"></i>214 here</span></div>'
    return f"""<section class="band explainer{' explainer--film' if film else ''}" data-explainer aria-labelledby="ex-h">
  <div class="wrap ex-grid">
    <div class="ex-copy">
      {head_html}
      <ol class="ex-steps" aria-label="How a Turne event works, step by step">{steps}</ol>
      <p class="ex-caption" aria-hidden="true"></p>
      {controls}
    </div>
    <div class="ex-stage-wrap" aria-hidden="true">
      <div class="ex-stage">
        <div class="ex-shadow"></div>
        <div class="ex-phone">
          {layers}
          <div class="ex-bezel">
            <div class="ex-view">

              <div class="ex-scr" data-scr="0">
                {status}
                <div class="ex-top"><b>New event</b><span class="ex-as"><i class="ex-ico ex-ico--v">SN</i>Studio North</span></div>
                <div class="ex-form">
                  <div class="ex-fld"><small>Event name</small><p><span class="ex-typed"></span><i class="ex-caret"></i></p></div>
                  <div class="ex-row2"><div class="ex-fld"><small>Date</small><p>Sat 14 Nov</p></div><div class="ex-fld"><small>Where</small><p>Online</p></div></div>
                  <div class="ex-fld"><small>Startup rooms</small><p><b class="ex-roomsn">0</b> rooms</p><div class="ex-dots">{dots}</div></div>
                  <div class="ex-fld ex-switch"><div><small>Giveaways</small><p>One in every room</p></div><i class="ex-tog"><i></i></i></div>
                </div>
                <div class="ex-cta ex-publish"><span class="a">Publish event</span><span class="b">Event is live</span></div>
              </div>

              <div class="ex-scr" data-scr="1">
                {status}
                <div class="ex-banner"><span class="ex-badge">Live</span><b>Founders Fest '26</b><span>Hosted by Studio North. <span class="ex-inside">3,412</span> inside</span></div>
                <p class="ex-sec">Startup rooms <span>24</span></p>
                <ul class="ex-rooms">{rooms}</ul>
              </div>

              <div class="ex-scr ex-scr--room" data-scr="2">
                {status}
                <div class="ex-split">{_rail()}
                  <div class="ex-main">
                    {roomhead}
                    <div class="ex-demo"><span class="ex-badge">Demo live</span><div class="ex-app"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="ex-presenter">Ananya is presenting</span></div>
                    <div class="ex-tabs"><span class="on">Chat</span><span class="ex-qatab">Q&amp;A</span><span>Deck</span></div>
                    <div class="ex-msgs">
                      <p class="ex-msg"><b>Ananya <em>Founder</em></b>Kilnly prices a kiln batch in 3 seconds.</p>
                      <p class="ex-msg"><b>Rohan</b>Does it handle glaze costs?</p>
                      <p class="ex-msg"><b>Ananya <em>Founder</em></b>Yes, glazes and firing are built in.</p>
                      <p class="ex-msg ex-msg--you"><b>You</b>Can I try it today?</p>
                      <p class="ex-msg"><b>Ananya <em>Founder</em></b>Yes! The free trial link is in Deck.</p>
                    </div>
                    <div class="ex-compose">Message # kilnly</div>
                  </div>
                </div>
              </div>

              <div class="ex-scr ex-scr--room" data-scr="3">
                {status}
                <div class="ex-split">{_rail()}
                  <div class="ex-main">
                    {roomhead}
                    <div class="ex-tabs"><span>Chat</span><span class="on">Q&amp;A</span><span>Deck</span></div>
                    <div class="ex-poll">
                      <p>Would you pay for Kilnly?</p>
                      <div class="ex-opt ex-opt--a"><i></i><span>Yes, at &#8377;499 a month</span><em>71%</em></div>
                      <div class="ex-opt ex-opt--b"><i></i><span>Not yet</span><em>29%</em></div>
                    </div>
                    <div class="ex-qa">
                      <p><span class="ex-up ex-up--q">&#9650; <b class="ex-qn">31</b></span>Is there an offline mode?</p>
                      <p><span class="ex-up">&#9650; 24</span>Which studios use it already?</p>
                    </div>
                    <div class="ex-rank">Ranked <b class="ex-rankn">#3</b> at Founders Fest</div>
                    <div class="ex-cta ex-cta--inline ex-upvote"><span class="a">&#9650; Upvote Kilnly <span class="ex-votes">1,208</span></span><span class="b">&#9650; Upvoted <span class="ex-votes2">1,209</span></span></div>
                    <div class="ex-react"></div>
                  </div>
                </div>
              </div>

              <div class="ex-scr ex-scr--room" data-scr="4">
                {status}
                <div class="ex-split">{_rail()}
                  <div class="ex-main">
                    {roomhead}
                    <div class="ex-give">
                      <div class="ex-giveart"><b>PRO</b><span>3 months</span></div>
                      <p class="ex-kick">Giveaway in # kilnly</p>
                      <p class="ex-title">3 months of Kilnly Pro</p>
                      <p class="ex-sub"><span class="ex-entries">642</span> entries. Free to enter.</p>
                    </div>
                    <div class="ex-cta ex-cta--inline ex-enter"><span class="a">Enter giveaway</span><span class="b">Entered</span></div>
                    <div class="ex-draw">
                      <div class="ex-drawbar"><span>Normal 50%</span><span>Premium 50%</span><i class="ex-marker"></i></div>
                      <p class="ex-drawlabel">Drawing winners</p>
                    </div>
                  </div>
                </div>
                <div class="ex-win"><b>You won!</b><span>3 months of Kilnly Pro. Details are on WhatsApp.</span>
                  <div class="ex-cta ex-cta--inline ex-follow"><span class="a">Follow Kilnly</span><span class="b">Following</span></div></div>
              </div>

              <div class="ex-tap"><i class="ex-ripple"></i></div>
            </div>
          </div>
          <div class="ex-ticket"><div><small>Online event</small><b>Founders Fest '26</b><span>Sat 14 Nov. 24 startup rooms</span></div><em>LIVE</em></div>
          <div class="ex-float ex-float--1"><i class="ex-ico ex-ico--l">T</i><b># tiffly</b></div>
          <div class="ex-float ex-float--2"><i class="ex-ico ex-ico--p">O</i><b># orbitra</b></div>
          <div class="ex-float ex-float--3"><i class="ex-ico ex-ico--v">P</i><b># packwise</b></div>
          <div class="ex-notif"><i class="ex-ico ex-ico--v">K</i><div><b>Kilnly</b><span>We launch publicly on Friday. You're on the early list.</span></div></div>
          <div class="ex-confetti"></div>
        </div>
      </div>
    </div>
  </div>
</section>"""
