"""How it works: physical expos and conferences, rebuilt online.

Sections: hero, live expo floor (many brands hosting at once), inside a pod (video call with demo,
chat, 1:1 booking, giveaway), physical vs Turne, why it's better, then the step-by-step explainer.
Animated by assets/js/hiw.js. All brands, startups and people shown are made up.
"""
import html
import json
import os

from layout import ARROW, explainer
from home import ICON, tile, brand_logo, art_headphones, art_hoodie, art_beauty

# skin, hair, tile background
PEOPLE = [
    ("#f2c09a", "#2b1a12", "#4b3685"), ("#c98c62", "#1b120c", "#5a2f6e"), ("#e0a87e", "#3b2416", "#2f3f7a"),
    ("#b9784e", "#140d09", "#6e2f55"), ("#f0b48c", "#5a3a22", "#2f5a6e"), ("#a8693f", "#0f0a07", "#4a4a8a"),
    ("#e8b08a", "#22160f", "#6b3f8f"), ("#c48058", "#2a1a10", "#335c4f"),
]


PEOPLE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img", "people")


def photo(n):
    """Return the published path of person-<n>.(jpg|jpeg|png|webp) if it exists, else None."""
    for ext in ("jpg", "jpeg", "webp", "png"):
        if os.path.exists(os.path.join(PEOPLE_DIR, f"person-{n}.{ext}")):
            return f"{{{{a}}}}img/people/person-{n}.{ext}"
    return None


def face(i, cls=""):
    """A person in a video tile: a real photo from assets/img/people/ when present, else an illustration."""
    src = photo(i % len(PEOPLE) + 1)
    if src:
        return f'<img class="w-photo {cls}" src="{src}" alt="" loading="lazy" decoding="async" width="240" height="240">'
    skin, hair, bg = PEOPLE[i % len(PEOPLE)]
    return (f'<svg class="w-face {cls}" viewBox="0 0 40 40" aria-hidden="true">'
            f'<path d="M7 40c1-9 6-13 13-13s12 4 13 13z" fill="#e9e3f7" opacity=".9"/>'
            f'<circle cx="20" cy="17" r="8" fill="{skin}"/>'
            f'<path d="M11.5 16c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z" fill="{hair}"/></svg>')


def vtile(i, name="", extra=""):
    bg = PEOPLE[i % len(PEOPLE)][2]
    label = f'<span class="w-vt__name">{name}</span>' if name else ""
    return f'<div class="w-vt {extra}" style="--bg:{bg}">{face(i)}{label}</div>'


EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'


# ---------------------------------------------------------------- extra slide art
def art_tiffin():
    return """<svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<linearGradient id="tf-steel" x1="0" x2="1"><stop offset="0" stop-color="#9aa6ba"/><stop offset=".45" stop-color="#eef2f8"/><stop offset="1" stop-color="#8793a8"/></linearGradient></defs>
<path d="M80 30c0-16 60-16 60 0" fill="none" stroke="#c9d1de" stroke-width="6" stroke-linecap="round"/>
<rect x="66" y="34" width="88" height="30" rx="9" fill="url(#tf-steel)"/>
<rect x="66" y="68" width="88" height="30" rx="9" fill="url(#tf-steel)"/>
<rect x="66" y="102" width="88" height="30" rx="9" fill="url(#tf-steel)"/>
<rect x="60" y="62" width="100" height="8" rx="4" fill="#ff9d3d"/><rect x="60" y="96" width="100" height="8" rx="4" fill="#ff9d3d"/>
<path d="M170 40c6-6-6-10 0-16M182 46c6-6-6-10 0-16" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
</svg>"""


def art_orbit():
    return """<svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<radialGradient id="ob-planet" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#7fd4ff"/><stop offset=".55" stop-color="#2f6fe0"/><stop offset="1" stop-color="#16307a"/></radialGradient></defs>
<g fill="#fff" opacity=".7"><circle cx="30" cy="24" r="1.5"/><circle cx="190" cy="30" r="1.2"/><circle cx="170" cy="120" r="1.5"/><circle cx="40" cy="118" r="1.2"/><circle cx="100" cy="14" r="1"/></g>
<circle cx="110" cy="80" r="42" fill="url(#ob-planet)"/>
<path d="M76 66c10 6 30 4 40-4M84 98c14-6 34-2 44 6" stroke="#bfe9ff" stroke-opacity=".45" stroke-width="4" fill="none" stroke-linecap="round"/>
<ellipse cx="110" cy="80" rx="92" ry="26" fill="none" stroke="#c6ff3d" stroke-width="2" stroke-dasharray="5 5" transform="rotate(-14 110 80)"/>
<g transform="translate(184 50) rotate(-14)"><rect x="-6" y="-5" width="12" height="10" rx="2" fill="#eef2f8"/><rect x="-22" y="-3" width="13" height="6" fill="#6aa8ff"/><rect x="9" y="-3" width="13" height="6" fill="#6aa8ff"/></g>
</svg>"""


def art_bars():
    bars = "".join(f'<rect x="{38 + i * 22}" y="{120 - h}" width="14" height="{h}" rx="3" fill="#8b6cff"/>' for i, h in enumerate((40, 62, 48, 80, 58, 92, 70)))
    return f"""<svg viewBox="0 0 220 150" aria-hidden="true"><rect x="22" y="14" width="176" height="122" rx="12" fill="#f6f3ff"/>
<rect x="36" y="26" width="60" height="8" rx="4" fill="#1b1430"/><rect x="150" y="26" width="34" height="8" rx="4" fill="#6a45ff"/>{bars}</svg>"""


# ---------------------------------------------------------------- brands presenting in pods
# p = presenter's person index (photo person-<p+1>), crowd = attendee indexes
BRANDS = {
    "soundx": dict(logo="S", brand="SoundX", room="soundx-3", pod="SoundX 3.0 Launch Stage", event="SoundX Audio Week",
                   tag="Product launch", here=2140, presenter="Rahul", role="Product Lead", p=0, crowd=(1, 4, 7, 3),
                   kicker="Launching today", title="SoundX 3.0", sub="40h battery &middot; Adaptive ANC &middot; &#8377;4,999",
                   art=art_headphones, bg="radial-gradient(120% 120% at 80% 30%, #4a2a8a, #140a28 70%)",
                   chat=[("Isha", 0, "Is the ANC better than 2.0?"), ("Rahul", 1, "Twice as strong, and it adapts to the room."),
                         ("Dev", 0, "What's the launch price?"), ("Rahul", 1, "Rs 4,999 for the first 1,000 orders."),
                         ("You", 0, "Can I hear a sound test?"), ("Rahul", 1, "Playing it live in 2 minutes!"),
                         ("Sana", 0, "Just entered the giveaway \U0001F389")]),
    "urban": dict(logo="UT", brand="UrbanThread", room="drop-07", pod="Drop 07 Preview", event="UrbanThread Live",
                  tag="Live showcase", here=932, presenter="Sara", role="Creative Director", p=3, crowd=(0, 5, 2, 6),
                  kicker="Drop 07", title="Street Classics", sub="12 pieces &middot; Oversized fits &middot; Live today",
                  art=art_hoodie, bg="radial-gradient(120% 120% at 80% 30%, #7a4a9a, #2a1440 70%)",
                  chat=[("Meera", 0, "Does the hoodie come in black?"), ("Sara", 1, "Black and lilac, both in this drop."),
                        ("Kabir", 0, "Sizes for tall people?"), ("Sara", 1, "Yes, up to XXL with a longer fit."),
                        ("You", 0, "When does it go on sale?"), ("Sara", 1, "Right after this showcase ends.")]),
    "glowra": dict(logo="flower", brand="Glowra Beauty", room="glow-routine", pod="Skincare Masterclass", event="Glowra Beauty Expo",
                   tag="Workshop", here=1204, presenter="Neha", role="Skin Expert", p=5, crowd=(3, 1, 6, 4),
                   kicker="Live masterclass", title="Your 3-step glow routine", sub="Cleanse &middot; Treat &middot; Protect",
                   art=art_beauty, bg="radial-gradient(120% 120% at 80% 30%, #8a2f62, #2a0f24 70%)",
                   chat=[("Priya", 0, "Is this okay for oily skin?"), ("Neha", 1, "Yes, the serum is oil-free."),
                         ("Isha", 0, "Morning or night?"), ("Neha", 1, "Both. Sunscreen only in the morning."),
                         ("You", 0, "Can I get a skin-type quiz?"), ("Neha", 1, "Book a 1:1 and I'll do it with you.")]),
    "kilnly": dict(logo="K", brand="Kilnly", room="kilnly", pod="Kilnly", event="Founders Fest '26",
                   tag="Demo in progress", here=214, presenter="Ananya", role="Founder", p=2, crowd=(5, 0, 7, 1),
                   kicker="Startup demo", title="Price a kiln batch in 3 seconds", sub="", share=True,
                   art=art_bars, bg="radial-gradient(120% 120% at 80% 30%, #3a2a6a, #120b22 70%)",
                   chat=[("Rohan", 0, "Does it handle glaze costs?"), ("Ananya", 1, "Yes, glazes and firing are built in."),
                         ("Priya", 0, "Can studios share one account?"), ("Ananya", 1, "Yes, up to 5 seats on the studio plan."),
                         ("You", 0, "Can I try it today?"), ("Ananya", 1, "Yes! Book a 1:1 and I'll set you up.")]),
    "tiffly": dict(logo="T", brand="Tiffly", room="tiffly", pod="Tiffly", event="Founders Fest '26",
                   tag="Q&amp;A live", here=188, presenter="Vikram", role="Founder", p=7, crowd=(2, 4, 0, 5),
                   kicker="Startup demo", title="Home lunch, delivered", sub="From &#8377;99 &middot; 40 home kitchens",
                   art=art_tiffin, bg="radial-gradient(120% 120% at 80% 30%, #8a4a1a, #2a140a 70%)", chat=[]),
    "orbitra": dict(logo="O", brand="Orbitra", room="orbitra", pod="Orbitra", event="Founders Fest '26",
                    tag="Demo in progress", here=156, presenter="Isha", role="Founder", p=4, crowd=(6, 3, 1, 7),
                    kicker="Startup demo", title="Weather data from orbit", sub="12 nano-satellites",
                    art=art_orbit, bg="radial-gradient(120% 120% at 80% 30%, #1d3a8a, #0a1230 70%)", chat=[]),
}
FLOOR_ORDER = ["soundx", "kilnly", "urban", "glowra", "tiffly", "orbitra"]
ROOM_ORDER = ["soundx", "urban", "glowra", "kilnly"]


def pip(b, cls="w-ps__pip"):
    bg = PEOPLE[b["p"] % len(PEOPLE)][2]
    return f'<div class="{cls}" style="--bg:{bg}">{face(b["p"])}</div>'


def crowd(idx):
    faces = "".join(f'<span class="w-cface" style="--bg:{PEOPLE[i % len(PEOPLE)][2]}">{face(i)}</span>' for i in idx)
    return f'<div class="w-crowd">{faces}<span>watching live</span></div>'


def pod(key):
    b = BRANDS[key]
    return f"""<article class="w-pod" data-pod>
  <div class="w-pod__screen" style="--sbg:{b['bg']}">
    <div class="w-ps"><div class="w-ps__copy"><small>{b['kicker']}</small><b>{b['title']}</b></div><div class="w-ps__art">{b['art']()}</div></div>
    {pip(b)}
    <span class="w-live"><i></i>Live</span>
    <span class="w-pod__count">{EYE}<b data-viewers="{b['here']}">{b['here']:,}</b></span>
  </div>
  {crowd(b['crowd'])}
  <div class="w-pod__meta">{brand_logo(b['logo'])}<div><b>{b['pod']}</b><span>{b['presenter']} presenting &middot; {b['event']}</span></div></div>
  <span class="w-pod__tag">{b['tag']}</span>
</article>"""


def floor():
    pods = "".join(pod(k) for k in FLOOR_ORDER)
    return f"""<div class="h-panel w-floor" data-floor>
  <div class="w-floor__bar">
    <span class="w-live w-live--lg"><i></i>Live now</span>
    <span><b data-count="6">6</b> events</span>
    <span><b data-count="142">142</b> pods</span>
    <span><b data-inside="18420">18,420</b> people inside</span>
  </div>
  <div class="w-floor__grid" data-floor-grid>
    {pods}
    <span class="w-you" data-you aria-hidden="true">{face(6)}<b>You</b></span>
  </div>
  <p class="w-feed" data-feed aria-live="off"><span>Rohan joined the Kilnly pod</span></p>
</div>"""


def slide(key, on):
    b = BRANDS[key]
    lines = html.escape(json.dumps([[n, f, t] for n, f, t in b["chat"]]), quote=True)
    meta = (f'data-slide="{key}" data-room="# {b["room"]}" data-ev="{html.escape(b["event"])}" data-here="{b["here"]}" '
            f'data-who="{b["presenter"]}" data-role="{b["role"]}" data-lines="{lines}"')
    if b.get("share"):
        bars = "".join(f'<i style="--h:{h}%"></i>' for h in (42, 64, 50, 78, 58, 88, 70))
        inner = f"""<div class="w-share">
        <div class="w-share__head"><b>Kilnly</b><span>Batch pricing</span><em>&#8377;3,480 per batch</em></div>
        <div class="w-share__bars" data-bars>{bars}</div>
        <div class="w-share__rows"><span>Clay</span><span>Glaze</span><span>Firing</span><span>Labour</span></div>
      </div>"""
        cls = " w-slide--share"
    else:
        sub = f'<span>{b["sub"]}</span>' if b["sub"] else ""
        inner = f'<div class="w-slide__copy"><small>{b["kicker"]}</small><b>{b["title"]}</b>{sub}</div><div class="w-slide__art">{b["art"]()}</div>'
        cls = ""
    return (f'<div class="w-slide{cls}{" is-on" if on else ""}" style="--sbg:{b["bg"]}" {meta}>{inner}'
            f'{pip(b, "w-pip")[:-6]}<span>{b["presenter"]} <em>{b["role"]}</em></span></div></div>')


def call():
    people = [(1, "Rohan", ""), (3, "Priya", "w-vt--hand"), (4, "Arjun", ""), (5, "Meera", "w-vt--muted"),
              (7, "Kabir", ""), (6, "You", "w-vt--you")]
    tiles = "".join(vtile(i, n, x) for i, n, x in people)
    first = BRANDS[ROOM_ORDER[0]]
    slides = "".join(slide(k, i == 0) for i, k in enumerate(ROOM_ORDER))
    tabs = "".join(
        f'<button type="button" role="tab" data-tab="{k}" data-brand="{BRANDS[k]["brand"]}" aria-selected="{"true" if i == 0 else "false"}">{brand_logo(BRANDS[k]["logo"])}{BRANDS[k]["brand"]}</button>'
        for i, k in enumerate(ROOM_ORDER))
    chat = "".join(
        f'<p><b>{n}{" <em>" + first["role"] + "</em>" if f else ""}</b>{html.escape(t)}</p>' for n, f, t in first["chat"][:2])
    mic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>'
    cam = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>'
    return f"""<div class="w-podtabs" role="tablist" aria-label="Switch pod">{tabs}</div>
<div class="w-call" data-call>
  <div class="w-call__top">
    <span class="w-live"><i></i>Live</span>
    <b data-room-name># {first['room']}</b><span class="w-call__ev" data-ev-name>{first['event']}</span>
    <span class="w-call__here">{EYE}<b data-here>{first['here']}</b> here</span>
    <span class="w-call__time" data-timer>12:04</span>
  </div>
  <div class="w-call__body">
    <div class="w-call__stage">
      <div class="w-slides">{slides}</div>
      <span class="w-call__label" data-label>{first['presenter']} is presenting {first['brand']}</span>
      <div class="w-reacts" data-reacts></div>
      <span class="w-mark" style="--x:-6px;--y:-6px">1</span>
      <span class="w-mark" style="--x:calc(100% - 170px);--y:calc(100% - 150px)">2</span>
    </div>
    <div class="w-call__side">
      <div class="w-call__people">{tiles}</div>
      <div class="w-chat" data-chat>{chat}</div>
      <span class="w-mark" style="--x:4%;--y:58%">3</span>
    </div>
  </div>
  <div class="w-call__bar">
    <span class="w-rb">{mic}</span><span class="w-rb">{cam}</span><span class="w-rb" data-hand-btn>&#9995;</span><span class="w-rb">&#128079;</span>
    <span class="w-call__grow"></span>
    <span class="w-btnwrap"><span class="pill pill--lime pill--sm w-book" data-book>Book a 1:1 demo</span><span class="w-mark" style="--x:calc(50% - 13px);--y:-20px">4</span></span>
    <span class="w-btnwrap"><span class="pill pill--ghost pill--sm w-give" data-give>Enter giveaway</span><span class="w-mark" style="--x:calc(50% - 13px);--y:-20px">5</span></span>
  </div>
  <div class="w-toast" data-toast>&#10003; 1:1 demo booked with <span data-toast-who>{first['presenter']}</span> for Sat, 4:30 PM</div>
</div>"""


POINTS = [
    ("Watch the brand present", "Brands and founders present live on screen: launches, lookbooks, demos, just like at a booth."),
    ("Meet face to face", "Turn your camera on, raise your hand and talk to the team on video."),
    ("Ask in the chat", "Drop questions anytime. Founders answer live, and everyone sees it."),
    ("Book a 1:1 demo", "Want a closer look? Book a private video call with the founder."),
    ("Win the giveaway", "Every pod runs a free giveaway. Enter in one tap while you're there."),
]

VS = [
    ("A booth in a big hall", "A live video pod for every brand and startup"),
    ("Walking the floor for hours", "Hop between pods in one tap"),
    ("Queuing for a demo", "Watch it live, or book a 1:1 call"),
    ("Swapping business cards", "Follow the brand and hear first what's next"),
    ("One lucky draw at one booth", "Guaranteed giveaways at every event"),
    ("Travel, tickets and one city", "Free, from anywhere in India"),
]

BETTER = [
    ("bolt", "No travel, no tickets", "Join from your phone or laptop, wherever you are. Always free."),
    ("play", "Hop pods instantly", "Leave a room, walk into the next one. No crowds, no queues."),
    ("star", "See what's live", "Viewer counts and live tags show you where the action is."),
    ("gift", "Win every time you show up", "Every event comes with real giveaways you can enter."),
]

_points = "".join(f'<li><span class="w-num">{i + 1}</span><b>{t}</b><span>{d}</span></li>' for i, (t, d) in enumerate(POINTS))
_vs = "".join(f'<li><span class="w-vs__old">{a}</span><i aria-hidden="true">{ARROW}</i><span class="w-vs__new">{b}</span></li>' for a, b in VS)
_better = "".join(f'<li>{tile(ic)}<b>{t}</b><span>{d}</span></li>' for ic, t, d in BETTER)

BODY = f"""
<div class="h-page w-page">
<section class="w-hero" data-hero aria-labelledby="hiw-h">
  <div class="wrap">
    <p class="h-chip"><span class="h-chip__ico">{ICON["yt"]}</span>Online Expos <i></i> Live Pods <i></i> Real Demos</p>
    <h1 id="hiw-h">The Expo Floor, <span class="g-violet">Now Online.</span></h1>
    <p class="h-lede">We're taking physical events and conferences digital. Brands host events on Turne, every brand and startup runs its own live video pod, and you walk in from your phone to watch demos, talk to founders and win giveaways.</p>
    <div class="w-hero__cta">
      <a class="pill pill--lime pill--lg" href="{{{{u:join}}}}">Join the Waitlist {ARROW}</a>
      <a class="pill pill--ghost pill--lg" href="#floor">See it live</a>
    </div>
  </div>
</section>

<section class="wrap w-sec" id="floor" aria-labelledby="floor-h">
  <div class="w-head">
    <p class="h-kicker">01 / The expo floor</p>
    <h2 id="floor-h">Many brands. <span class="g-violet">All live at once.</span></h2>
    <p>Just like walking an expo hall, Turne is full of events running side by side. Brands showcase launches, startups run demo pods, and people move between them all day.</p>
  </div>
  {floor()}
</section>

<section class="wrap w-sec" aria-labelledby="pod-h">
  <div class="w-head">
    <p class="h-kicker">02 / Inside a pod</p>
    <h2 id="pod-h">Step inside a pod. <span class="g-violet">It's a live video room.</span></h2>
    <p>Each pod is a booth you can actually talk to. Brands and founders present on screen, people join on video, and you can ask, book a call or enter the giveaway without leaving.</p>
  </div>
  {call()}
  <ol class="w-points">{_points}</ol>
</section>

<section class="wrap w-sec" aria-labelledby="vs-h">
  <div class="w-head">
    <p class="h-kicker">03 / Physical vs Turne</p>
    <h2 id="vs-h">Everything you love about events. <span class="g-violet">Without the hall.</span></h2>
  </div>
  <div class="h-panel w-vs">
    <div class="w-vs__cols" aria-hidden="true"><span>At a physical event</span><span></span><span>On Turne</span></div>
    <ul>{_vs}</ul>
  </div>
</section>

<section class="wrap w-sec" aria-labelledby="better-h">
  <div class="h-panel w-better">
    <h2 id="better-h">Better than <span class="g-lime">being there.</span></h2>
    <ul>{_better}</ul>
  </div>
  <p class="h-note">Illustrative demo. Brands, startups and people shown are made up.</p>
</section>
</div>

{explainer("Follow one event, step by step")}

<section class="band" aria-labelledby="steps-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="steps-h">Getting in takes under a minute</h2>
      <p class="lede">Join the waitlist now and you'll be first through the door at launch.</p>
    </div>
    <ol class="loop loop--3">
      <li><b>Verify WhatsApp</b><span>Enter your number. We send a 6-digit code on WhatsApp.</span></li>
      <li><b>Enter the code</b><span>This confirms it's really you. No spam, ever.</span></li>
      <li><b>Add your details</b><span>Name, date of birth and city, and your spot is locked in.</span></li>
    </ol>
  </div>
</section>

<section class="wrap w-sec w-end" data-hide-sticky aria-labelledby="end-h">
  <div class="h-panel w-endpanel">
    <h2 id="end-h">Your spot on the <span class="g-violet">expo floor</span> is waiting.</h2>
    <p>The first 10,000 people on the waitlist get Lifetime Premium.</p>
    <a class="pill pill--lime pill--lg" href="{{{{u:join}}}}">Join the Waitlist {ARROW}</a>
  </div>
</section>
"""
