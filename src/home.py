"""Home page: hero with event cards, giveaway strip, Premium offer, countdown, quick FAQ.

All artwork is inline SVG so the page needs no image files. Brands on the event cards are made up.
"""
import math

from layout import stat, ARROW

# ---------------------------------------------------------------- small icons
_I = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
ICON = {
    "gift": f'<svg {_I}><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.2 6.8 6.8 7 8.4 12 8.5 12 8.5zm0 0c1.5-4.5 5.5-4.3 5.2-1.7C17 8.4 12 8.5 12 8.5z"/></svg>',
    "bolt": f'<svg {_I}><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/></svg>',
    "play": f'<svg {_I}><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/></svg>',
    "star": f'<svg {_I}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    "gem": f'<svg {_I}><path d="M6.5 4h11L21 9l-9 11L3 9z"/><path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5"/></svg>',
    "cal": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    "yt": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="m10 9 5 3-5 3z" fill="#1a0f2e"/></svg>',
}


def tile(name):
    return f'<span class="h-tile">{ICON[name]}</span>'


# ---------------------------------------------------------------- artwork
def art_headphones():
    return """<svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<radialGradient id="hp-cup" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#4a3670"/><stop offset=".6" stop-color="#1d1430"/><stop offset="1" stop-color="#0c0816"/></radialGradient>
<linearGradient id="hp-band" x1="0" x2="1"><stop offset="0" stop-color="#2a1d42"/><stop offset=".5" stop-color="#4b3678"/><stop offset="1" stop-color="#1a1129"/></linearGradient>
<filter id="hp-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>
<ellipse cx="110" cy="142" rx="80" ry="6" fill="#8b5cff" opacity=".35" filter="url(#hp-glow)"/>
<path d="M50 104C46 40 80 14 112 14s66 26 60 90" fill="none" stroke="url(#hp-band)" stroke-width="15" stroke-linecap="round"/>
<path d="M56 100C54 46 84 22 112 22s58 24 54 78" fill="none" stroke="#b58bff" stroke-width="1.6" opacity=".7"/>
<g><ellipse cx="58" cy="106" rx="28" ry="34" fill="url(#hp-cup)"/>
<ellipse cx="62" cy="106" rx="19" ry="25" fill="none" stroke="#b77dff" stroke-width="4" filter="url(#hp-glow)"/>
<ellipse cx="62" cy="106" rx="19" ry="25" fill="none" stroke="#d8b8ff" stroke-width="1.6"/></g>
<g><ellipse cx="162" cy="106" rx="28" ry="34" fill="url(#hp-cup)"/>
<ellipse cx="158" cy="106" rx="19" ry="25" fill="none" stroke="#b77dff" stroke-width="4" filter="url(#hp-glow)"/>
<ellipse cx="158" cy="106" rx="19" ry="25" fill="none" stroke="#d8b8ff" stroke-width="1.6"/></g>
</svg>"""


def art_hoodie():
    return """<svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<linearGradient id="hd-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c3b0ff"/><stop offset=".55" stop-color="#d6a4e6"/><stop offset="1" stop-color="#f3a9c4"/></linearGradient>
<linearGradient id="hd-shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>
<path d="M66 50 36 74c-7 6-9 14-9 24v52h28l5-58z" fill="url(#hd-body)"/>
<path d="M154 50l30 24c7 6 9 14 9 24v52h-28l-5-58z" fill="url(#hd-body)"/>
<path d="M64 48c8-6 22-10 46-10s38 4 46 10l4 102H60z" fill="url(#hd-body)"/>
<path d="M64 48c8-6 22-10 46-10s38 4 46 10l4 102H60z" fill="url(#hd-shade)"/>
<path d="M76 56c0-30 14-46 34-46s34 16 34 46c-10-8-21-12-34-12s-24 4-34 12z" fill="#b39af0"/>
<ellipse cx="110" cy="56" rx="26" ry="13" fill="#5e4691"/>
<path d="M102 64c-1 12-2 22-3 32M118 64c1 12 2 22 3 32" stroke="#f6eefe" stroke-width="2.4" stroke-linecap="round"/>
<path d="m110 84 6 10h-12z" fill="none" stroke="#4b3778" stroke-width="2"/>
<path d="M80 120h60l6 30H74z" fill="#000" opacity=".1"/>
</svg>"""


def art_beauty():
    return """<svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<linearGradient id="bt-a" x1="0" x2="1"><stop offset="0" stop-color="#ffb3d3"/><stop offset=".5" stop-color="#ff7fb0"/><stop offset="1" stop-color="#c94d80"/></linearGradient>
<linearGradient id="bt-b" x1="0" x2="1"><stop offset="0" stop-color="#ffd0e3"/><stop offset="1" stop-color="#e888ae"/></linearGradient>
<filter id="bt-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>
<ellipse cx="118" cy="144" rx="90" ry="6" fill="#ff7fb0" opacity=".35" filter="url(#bt-glow)"/>
<rect x="138" y="14" width="8" height="14" rx="2" fill="#d65c8e"/><rect x="144" y="16" width="20" height="5" rx="2" fill="#d65c8e"/>
<rect x="132" y="26" width="20" height="22" rx="3" fill="#e57aa6"/>
<rect x="120" y="46" width="44" height="98" rx="9" fill="url(#bt-a)"/>
<rect x="126" y="52" width="6" height="84" rx="3" fill="#fff" opacity=".35"/>
<text x="142" y="98" text-anchor="middle" font-size="7" font-weight="700" fill="#8a2a55" letter-spacing="1">GLOWRA</text>
<rect x="174" y="66" width="18" height="18" rx="3" fill="#d65c8e"/>
<rect x="170" y="82" width="28" height="62" rx="6" fill="url(#bt-b)"/>
<rect x="36" y="94" width="86" height="16" rx="5" fill="#f6b3cd"/>
<rect x="40" y="108" width="78" height="36" rx="7" fill="url(#bt-b)"/>
<rect x="44" y="112" width="5" height="28" rx="2.5" fill="#fff" opacity=".4"/>
<text x="79" y="129" text-anchor="middle" font-size="7" font-weight="700" fill="#8a2a55" letter-spacing="1">GLOWRA</text>
</svg>"""


def _laurel(side):
    leaves = []
    cx, cy, r = 130, 98, 92
    for i in range(9):
        a = math.radians(150 + i * 11) if side < 0 else math.radians(30 - i * 11)
        x, y = cx + r * math.cos(a), cy + r * math.sin(a) * -1 + 12
        rot = math.degrees(a) * -1 + (90 if side < 0 else -90) + (25 * side * -1)
        leaves.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="11" ry="4.6" transform="rotate({rot:.1f} {x:.1f} {y:.1f})"/>')
    return "".join(leaves)


def art_crown():
    return f"""<svg class="h-crown" viewBox="0 0 260 200" role="img" aria-label="Premium Lifetime crown"><defs>
<linearGradient id="cr-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".45" stop-color="#f6b93b"/><stop offset="1" stop-color="#c7781a"/></linearGradient>
<linearGradient id="cr-ped" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1d45"/><stop offset="1" stop-color="#140d24"/></linearGradient>
<filter id="cr-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
<g fill="#8b5cff" opacity=".9">{_laurel(-1)}{_laurel(1)}</g>
<ellipse cx="130" cy="72" rx="58" ry="34" fill="#f6b93b" opacity=".25" filter="url(#cr-glow)"/>
<path d="M82 104 74 50l30 26 26-44 26 44 30-26-8 54z" fill="url(#cr-gold)" stroke="#a8601a" stroke-width="1"/>
<rect x="80" y="100" width="100" height="16" rx="4" fill="url(#cr-gold)" stroke="#a8601a" stroke-width="1"/>
<circle cx="74" cy="48" r="6" fill="url(#cr-gold)"/><circle cx="130" cy="30" r="7" fill="url(#cr-gold)"/><circle cx="186" cy="48" r="6" fill="url(#cr-gold)"/>
<circle cx="130" cy="82" r="7" fill="#9b5cff" stroke="#fff3c4" stroke-width="1.5"/><circle cx="104" cy="90" r="4.5" fill="#9b5cff"/><circle cx="156" cy="90" r="4.5" fill="#9b5cff"/>
<ellipse cx="130" cy="186" rx="112" ry="9" fill="#8b5cff" opacity=".7" filter="url(#cr-glow)"/>
<path d="M54 126h152l-10 54H64z" fill="url(#cr-ped)" stroke="#5b3fa0" stroke-width="1.2"/>
<ellipse cx="130" cy="126" rx="76" ry="7" fill="#33245a" stroke="#7c5cd6" stroke-width="1"/>
<path d="M64 180h132" stroke="#c9a8ff" stroke-width="2.2" stroke-linecap="round"/>
<text x="130" y="152" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" letter-spacing="1">PREMIUM</text>
<text x="130" y="169" text-anchor="middle" font-size="10.5" font-weight="600" fill="#d9ccff" letter-spacing="3.5">LIFETIME</text>
</svg>"""


def avatars():
    people = [("#f2c09a", "#2b1a12", "#6d4bd6"), ("#c98c62", "#1b120c", "#a35bd8"),
              ("#e0a87e", "#3b2416", "#5e7be0"), ("#b9784e", "#140d09", "#c9659a")]
    out = []
    for i, (skin, hair, bg) in enumerate(people):
        out.append(f'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="{bg}"/>'
                   f'<path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="#ece6f7"/>'
                   f'<circle cx="20" cy="17" r="8" fill="{skin}"/>'
                   f'<path d="M11.5 16c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z" fill="{hair}"/></svg>')
    return f'<span class="h-avatars">{"".join(out)}</span>'


def brand_logo(kind):
    if kind == "flower":
        petals = "".join(f'<circle cx="{12 + 4.2 * math.cos(math.radians(a)):.1f}" cy="{12 + 4.2 * math.sin(math.radians(a)):.1f}" r="3.6"/>' for a in range(-90, 270, 72))
        return f'<i class="h-blogo h-blogo--pink"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">{petals}<circle cx="12" cy="12" r="2.4" fill="#ff7fb0"/></svg></i>'
    return f'<i class="h-blogo">{kind}</i>'


EVENTS = [
    ("Live Event", "Mar 05", art_headphones, "S", "SoundX", "3.0 Headphone Launch Event", "30 Headphones Giveaway"),
    ("Upcoming", "Mar 08", art_hoodie, "UT", "UrbanThread", "New Collection Launch", "50 Fashion Goodies Giveaway"),
    ("Upcoming", "Mar 12", art_beauty, "flower", "Glowra Beauty", "Beauty Essentials Live Showcase", "100 Beauty Hampers Giveaway"),
]


def event_cards():
    cards = []
    for i, (badge, date, art, logo, brand, title, prize) in enumerate(EVENTS):
        live = " h-card--live" if badge == "Live Event" else ""
        cards.append(f"""<article class="h-card{live}" aria-label="{title} by {brand}">
  <div class="h-card__top"><span class="h-badge">{badge}</span><span class="h-date">{ICON["cal"]}{date}</span></div>
  <div class="h-card__art">{art()}</div>
  <p class="h-card__brand">{brand_logo(logo)}{brand}</p>
  <h3>{title}</h3>
  <p class="h-card__prize">{ICON["gift"]}{prize}</p>
  <a class="pill pill--ghost pill--sm" href="{{{{u:join}}}}">Join the Event {ARROW}</a>
</article>""")
    cur = ' aria-current="true"'
    dots = "".join(f'<button type="button" aria-label="Show event {i + 1}"{cur if i == 0 else ""}></button>' for i in range(len(EVENTS)))
    return f"""<div class="h-cards-wrap">
  <div class="h-cards" data-carousel>{"".join(cards)}</div>
  <div class="h-dots" data-dots>{dots}</div>
  <p class="h-note">Example events for illustration. Brands shown are not partners.</p>
</div>"""


FAQ = [
    ("What is Turne?", "Turne is a digital event and brand engagement platform where you discover events, participate in experiences, enter giveaways and connect with brands."),
    ("When is Turne launching?", "Turne is preparing for launch. The countdown on this page shows the planned launch timeline. Join the waitlist and you'll be first through the door."),
    ("What do I get for joining?", "The first 10,000 verified waitlist members receive Lifetime Premium membership."),
    ("What is Premium?", "Premium is Turne's membership experience: additional benefits and access to selected opportunities. Premium benefits may evolve as Turne launches."),
    ("Do Premium members automatically win giveaways?", "No. Premium does not guarantee winning. It provides access to the Premium allocation, a dedicated 50% share, of selected giveaway opportunities."),
]

SPARK = '<svg class="h-spark" viewBox="0 0 40 50" aria-hidden="true"><path d="M8 8l14 12M4 26h20M8 44l14-10" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>'


def countdown():
    unit = lambda k, label: f'<div class="h-cd__box"><b data-cd="{k}">--</b><span>{label}</span></div>'
    sep = '<i class="h-cd__sep" aria-hidden="true">:</i>'
    return (f'<div class="h-cd__row">{SPARK}<div class="h-cd__boxes" data-countdown role="timer" aria-label="Time until Turne launches">'
            f'{unit("d", "Days")}{sep}{unit("h", "Hrs")}{sep}{unit("m", "Min")}{sep}{unit("s", "Sec")}</div>'
            f'<span class="h-spark--r">{SPARK}</span></div>')


faq_items = "".join(
    f'<details{" open" if i == 0 else ""}><summary>{q}<i aria-hidden="true"></i></summary><p>{a}</p></details>'
    for i, (q, a) in enumerate(FAQ))

BODY = f"""
<div class="h-page">
<section class="h-hero" data-hero aria-labelledby="hero-h">
  <div class="wrap h-hero__grid">
    <div class="h-hero__copy">
      <p class="h-chip"><span class="h-chip__ico">{ICON["yt"]}</span>Online Events <i></i> Brand Launches <i></i> Real Giveaways</p>
      <h1 id="hero-h">India ka Apna <span class="g-violet">Event Platform</span></h1>
      <p class="h-lede">Discover &amp; join live online events from top brands, attend exclusive launch events, interact with them and win guaranteed giveaways.</p>
      <a class="pill pill--lime pill--lg" href="{{{{u:join}}}}">Join the Waitlist {ARROW}</a>
      <p class="h-proof">{avatars()}<span><b>{stat("count")}+</b> people already joined the waitlist</span></p>
    </div>
    {event_cards()}
  </div>
</section>

<section class="wrap" aria-labelledby="give-h">
  <div class="h-panel h-feats">
    <div class="h-feats__head">
      <h2 id="give-h">Every Event Comes with <span class="g-lime">Guaranteed</span> <span class="g-violet">Giveaways</span></h2>
      <p>Join exciting online events from top brands and get your chance to win real prizes, always!</p>
    </div>
    <ul class="h-feats__list">
      <li>{tile("gift")}<b>Guaranteed Giveaways</b><span>Real prizes in every event</span></li>
      <li>{tile("bolt")}<b>100% Free to Join</b><span>No entry fee, no hidden cost</span></li>
      <li>{tile("play")}<b>Live &amp; Interactive Events</b><span>Product launches, Q&amp;A and more</span></li>
    </ul>
  </div>
</section>

<section class="wrap" aria-labelledby="prem-h">
  <div class="h-panel h-prem">
    <div class="h-prem__crown">{art_crown()}</div>
    <div class="h-prem__copy">
      <p class="h-offer"><span aria-hidden="true">&#127881;</span>Founding Members Offer</p>
      <h2 id="prem-h">First 10,000 Waitlist Users Get <span class="g-violet">Lifetime Premium Membership</span></h2>
      <p>Be early, unlock premium benefits for life, and get higher chances to win in every event.</p>
    </div>
    <ul class="h-prem__list">
      <li>{tile("gift")}<div><b>Higher Chances to Win</b><span>50% of every giveaway is reserved for Premium users (50% for normal users)</span></div></li>
      <li>{tile("star")}<div><b>Early Access to Big Events</b><span>Be the first to join exclusive events from top &amp; premium brands</span></div></li>
      <li>{tile("gem")}<div><b>Specialised Premium Events</b><span>Access to curated events, workshops and brand sessions only for Premium users</span></div></li>
    </ul>
    <a class="pill pill--lime h-prem__cta" href="{{{{u:join}}}}">Get Lifetime Premium for Free {ARROW}</a>
  </div>
</section>

<section class="h-cd" aria-labelledby="cd-h">
  <div class="wrap">
    <h2 id="cd-h">We are <span class="g-violet">going live</span> in</h2>
    {countdown()}
    <a class="pill pill--lime pill--lg" href="{{{{u:join}}}}">Join the Waitlist {ARROW}</a>
  </div>
</section>

<section class="h-faq" aria-labelledby="faq-h">
  <div class="wrap h-faq__grid">
    <div>
      <p class="h-kicker">08 / Quick answers</p>
      <h2 id="faq-h">The <span class="g-violet">Details.</span></h2>
    </div>
    <div class="h-faq__list">{faq_items}</div>
  </div>
</section>
</div>
"""
