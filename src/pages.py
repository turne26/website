"""Page content. Each page: slug, title (<=60 chars), desc (<=160 chars), crumb, body HTML."""
from home import BODY as HOME_BODY
from hiw import BODY as HIW_BODY
from layout import stat, ticket, gate, countdown, closer, phone_feed, icon, crumbs, COUNT, explainer

PAGES = []


def page(**kw):
    PAGES.append(kw)
    return kw


# ---------------------------------------------------------------- HOME (content lives in home.py)
page(
    slug="", crumb="Home", og="home",
    title="Turne | India ka Apna Event Platform",
    desc="Join live online events from top brands, attend exclusive launches and win giveaways. The first 10,000 on the Turne waitlist get Lifetime Premium.",
    og_desc="Discover and join live online events from top brands, attend launches and win giveaways. The first 10,000 get Lifetime Premium.",
    body=HOME_BODY,
)

# ---------------------------------------------------------------- WHY TURNE
page(
    slug="why-turne", crumb="Why Turne", og="why-turne",
    title="Why Turne | Brands Should Be Experienced, Not Just Seen",
    desc="Social media gets brands to an audience. Turne gets the audience to participate: discovery, participation, engagement, reward and retention in one loop.",
    body=f"""
<section class="page-hero" data-hero>
  <div class="wrap">
    {crumbs("Why Turne")}
    <h1>Brands shouldn't just be seen.</h1>
    <p class="lede">They should be experienced. Social media gets brands to the audience. Turne gets the audience to participate.</p>
  </div>
</section>

<section class="band" aria-labelledby="cmp-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="cmp-h">A feed people scroll past, or a loop they come back to</h2>
    </div>
    <div class="compare">
      <section class="today" aria-labelledby="today-h">
        <h3 id="today-h">Today</h3>
        <ol><li>Brand</li><li>Instagram</li><li>Content</li><li>Scroll</li><li>????</li></ol>
        <p>One-way. Hard to measure. Forgotten by tomorrow.</p>
      </section>
      <section class="turne" aria-labelledby="with-h">
        <h3 id="with-h">With Turne</h3>
        <ol><li>Discovery</li><li>Participation</li><li>Engagement</li><li>Reward</li><li>Retention</li></ol>
        <p>A loop people actually want to come back to.</p>
      </section>
    </div>
  </div>
</section>

<section class="band band--ink" aria-labelledby="loop-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="loop-h">The Turne loop</h2>
      <p class="lede">Every event, drop and giveaway on Turne runs through the same five steps.</p>
    </div>
    <ol class="loop">
      <li><b>Discover</b><span>Find what's happening with the brands you care about.</span></li>
      <li><b>Join</b><span>Register for the event, drop or giveaway in a tap.</span></li>
      <li><b>Participate</b><span>Show up and take part, live or online.</span></li>
      <li><b>Get rewarded</b><span>Enter giveaways and unlock rewards for taking part.</span></li>
      <li><b>Come back</b><span>Follow the brand and be first to what's next.</span></li>
    </ol>
    <p class="loop-return"><svg viewBox="0 0 44 18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M42 4v4a6 6 0 0 1-6 6H6"/><path d="M10 10l-4 4 4 4"/></svg>Then it starts again with the next thing worth joining.</p>
  </div>
</section>

<section class="band" aria-labelledby="who-h">
  <div class="wrap split">
    <h2 id="who-h">Built for both sides of the room</h2>
    <div class="stack-lg">
      <div class="stack">
        <h3>For people</h3>
        <p class="muted">Discover events, join experiences, enter giveaways and follow the brands you love, all in one place. No lurking required.</p>
        <a class="textlink" href="{{{{u:how-it-works}}}}">See what you can do</a>
      </div>
      <div class="stack">
        <h3>For brands</h3>
        <p class="muted">Create the experience, fill the room, and finally measure who actually showed up.</p>
        <a class="textlink" href="{{{{u:brands}}}}">Turne for brands</a>
      </div>
    </div>
  </div>
</section>

{closer()}
""",
)

# ---------------------------------------------------------------- HOW IT WORKS (content lives in hiw.py)
page(
    slug="how-it-works", crumb="How it works", og="how-it-works", scripts=["hiw.js"],
    title="How Turne Works | The Expo Floor, Now Online",
    desc="Brands host online events on Turne and every brand and startup runs a live video pod. Hop between pods, watch demos, talk to founders and win giveaways.",
    body=HIW_BODY,
)

# ---------------------------------------------------------------- GIVEAWAYS
page(
    slug="giveaways", crumb="Giveaways", og="giveaways",
    title="Giveaways on Turne | Real Rewards, Fair 50/50 Split",
    desc="Win products, event tickets, coupons, memberships and experiences. Free to enter, drawn at random, and split 50/50 between normal and Premium members.",
    body=f"""
<section class="page-hero" data-hero>
  <div class="wrap">
    {crumbs("Giveaways")}
    <h1>Real rewards. Real participation.</h1>
    <p class="lede">Giveaways on Turne are a participation mechanic, not a lottery ticket. You show up, you join in, and you get a real shot at something worth having.</p>
  </div>
</section>

<section class="band band--tight" aria-labelledby="win-h">
  <div class="wrap">
    <div class="section-head"><h2 id="win-h">What you can win</h2></div>
    <ul class="prizes">
      <li>{icon("box")}<b>Physical products</b><span>Things brands make, shipped to you.</span></li>
      <li>{icon("ticket")}<b>Event tickets</b><span>Entry to gigs, fests and sessions.</span></li>
      <li>{icon("tag")}<b>Discount coupons</b><span>Money off with the brands you follow.</span></li>
      <li>{icon("bolt")}<b>Digital products</b><span>Subscriptions, downloads and in-app items.</span></li>
      <li>{icon("card")}<b>Memberships</b><span>Access to clubs and programmes.</span></li>
      <li>{icon("star")}<b>Experiences</b><span>Meet-ups, workshops and access you can't buy.</span></li>
      <li>{icon("gift")}<b>Brand rewards</b><span>Perks a brand designs for its community.</span></li>
      <li style="background:var(--lime);color:var(--night)"><b>Enter at launch</b><span style="color:var(--night)">Waitlist members are first through the door.</span><a class="textlink" style="color:var(--night);text-decoration-color:var(--night)" href="{{{{u:join}}}}">Join the waitlist</a></li>
    </ul>
  </div>
</section>

<section class="band band--ink" aria-labelledby="fair-h">
  <div class="wrap split" style="align-items:center">
    <div class="stack-lg">
      <h2 id="fair-h">Everyone gets a shot.</h2>
      <p class="lede">For eligible giveaways, opportunities are split evenly. Premium members get access to a dedicated 50% share. It improves your access. It never guarantees a win.</p>
      <p class="fine">Allocation applies to selected eligible giveaways. Winners are drawn within each share.</p>
    </div>
    <div class="split-bar" role="img" aria-label="Giveaway opportunities: 50% for normal members, 50% for Premium members">
      <div class="normal"><b>50%</b><span>Normal members</span></div>
      <div class="premium"><b>50%</b><span>Premium members</span></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="rules-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="rules-h">How a giveaway works</h2>
      <p class="lede">The short version of our giveaway terms.</p>
    </div>
    <ul class="rows">
      <li><h3>Free to enter</h3><p>No purchase, stake or wager. Turne is not a gambling or betting platform.</p><span class="tag">Terms C1</span></li>
      <li><h3>Clear rules</h3><p>Each giveaway states its entry window, eligibility, number of prizes and draw date.</p><span class="tag">Terms C3</span></li>
      <li><h3>Random draw</h3><p>Winners are picked at random from valid entries within each share.</p><span class="tag">Terms C5</span></li>
      <li><h3>WhatsApp notice</h3><p>Winners hear from us on their registered WhatsApp number.</p><span class="tag">Terms C5</span></li>
      <li><h3>Fair play</h3><p>Multiple accounts, false details or automation get entries disqualified.</p><span class="tag">Terms C6</span></li>
    </ul>
    <p style="margin-top:2rem"><a class="textlink" href="{{{{u:terms}}}}#part-c">Read the full giveaway terms</a></p>
  </div>
</section>

{closer()}
""",
)

# ---------------------------------------------------------------- PREMIUM
page(
    slug="premium", crumb="Premium", og="premium",
    title="Turne Premium | The First 10,000 Get It Free for Life",
    desc="Be one of the first 10,000 verified waitlist members and get Turne Premium for life: a dedicated 50% giveaway share, early access and priority.",
    body=f"""
<section class="hero" data-hero aria-labelledby="prem-h">
  <div class="wrap hero-grid">
    <div>
      {crumbs("Premium")}
      <h1 id="prem-h" style="font-size:clamp(2.34rem,6.3vw,5.10rem)">The first <span class="hl-v">10,000</span> get Premium for life.</h1>
      <p class="lede">Be one of the first 10,000 verified members and get Turne Premium for life. No renewal, no catch. You were early.</p>
      <div class="cta-row"><a class="btn btn--ticket" href="{{{{u:join}}}}">Claim my spot</a><span class="small muted">{stat("remaining")} spots left</span></div>
    </div>
    {ticket(variant="premium")}
  </div>
</section>

<section class="band band--ink" aria-label="Premium spots claimed">
  <div class="wrap">{gate("Premium spots claimed")}</div>
</section>

<section class="band" aria-labelledby="ben-h">
  <div class="wrap split">
    <div class="stack">
      <h2 id="ben-h">What Premium includes</h2>
      <p class="fine">Premium benefits may evolve as Turne launches. Premium does not guarantee winning any giveaway.</p>
    </div>
    <ul class="benefits">
      <li>{icon("check")}<div><b>Lifetime Premium membership</b><span>No renewal, no catch. You were early.</span></div></li>
      <li>{icon("check")}<div><b>The Premium 50% giveaway share</b><span>Access to a dedicated half of selected giveaway opportunities.</span></div></li>
      <li>{icon("check")}<div><b>Early access to selected experiences</b><span>Through the door before general access opens.</span></div></li>
      <li>{icon("check")}<div><b>Priority on new opportunities</b><span>As Turne grows, Premium members are first in line.</span></div></li>
    </ul>
  </div>
</section>

<section class="band band--ink" aria-labelledby="share-h">
  <div class="wrap split" style="align-items:center">
    <div class="stack-lg">
      <h2 id="share-h">Better access, never a guaranteed win</h2>
      <p class="lede">Eligible giveaways split their opportunities 50/50. Premium members are drawn from their own half, so your chances depend on how many people enter that share.</p>
      <a class="textlink" href="{{{{u:giveaways}}}}">How giveaways work</a>
    </div>
    <div class="split-bar" role="img" aria-label="Giveaway opportunities: 50% for normal members, 50% for Premium members">
      <div class="normal"><b>50%</b><span>Normal members</span></div>
      <div class="premium"><b>50%</b><span>Premium members</span></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="fine-h">
  <div class="wrap">
    <div class="section-head"><h2 id="fine-h">The fine print, plainly</h2></div>
    <ul class="rows">
      <li><h3>Who qualifies</h3><p>The first 10,000 verified waitlist members, in the order their WhatsApp number is verified. The offer closes at 10,000.</p><span class="tag">Terms B1</span></li>
      <li><h3>"Lifetime"</h3><p>For as long as Turne runs the Premium tier and your membership is in good standing.</p><span class="tag">Terms B2</span></li>
      <li><h3>Just for you</h3><p>Premium is tied to your verified number. It can't be sold, gifted or transferred.</p><span class="tag">Terms B4</span></li>
      <li><h3>Fair use</h3><p>Premium obtained through fraud, automation or duplicate sign-ups can be withdrawn.</p><span class="tag">Terms B5</span></li>
    </ul>
    <p style="margin-top:2rem"><a class="textlink" href="{{{{u:terms}}}}#part-b">Read the full Premium terms</a></p>
  </div>
</section>

{closer("Claim your spot before they're gone.")}
""",
)

# ---------------------------------------------------------------- BRANDS
page(
    slug="brands", crumb="For brands", og="brands", no_sticky=True,
    title="Turne for Brands | Events, Giveaways and Real Participation",
    desc="Create events, manage registrations, run giveaways and measure who actually showed up. Build a community around your brand on Turne.",
    body=f"""
<section class="page-hero" data-hero>
  <div class="wrap">
    {crumbs("For brands")}
    <h1>For brands, it's more than an event.</h1>
    <p class="lede">Create the experience, fill the room, and finally measure who actually showed up.</p>
    <div class="cta-row" style="margin-top:2rem"><a class="btn btn--ticket" href="#enquiry">Talk to us</a><span class="small muted">or email <b style="color:var(--paper)">brands@turne.in</b></span></div>
  </div>
</section>

<section class="band band--tight" aria-labelledby="caps-h">
  <div class="wrap">
    <div class="section-head"><h2 id="caps-h">What you can run on Turne</h2></div>
    <ul class="prizes prizes--3">
      <li><b>Create events</b><span>Demo days, launches and festivals, set up from your phone.</span></li>
      <li><b>Open startup rooms</b><span>Give every startup its own room with a demo, chat and Q&amp;A.</span></li>
      <li><b>Manage registrations</b><span>See who signed up and who turned up.</span></li>
      <li><b>Run giveaways</b><span>Free-to-enter giveaways with clear rules and fair draws.</span></li>
      <li><b>Measure participation</b><span>See who joined, which rooms they visited and who came back.</span></li>
      <li><b>Build community</b><span>Turn one-off attendees into people who follow you.</span></li>
    </ul>
  </div>
</section>

<section class="band band--ink" aria-labelledby="vs-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="vs-h">Reach is not the same as participation</h2>
      <p class="lede">Social media gets brands to the audience. Turne gets the audience to participate.</p>
    </div>
    <div class="compare">
      <section class="today" aria-label="Today"><h3>Today</h3><ol><li>Brand</li><li>Instagram</li><li>Content</li><li>Scroll</li><li>????</li></ol><p>One-way. Hard to measure. Forgotten by tomorrow.</p></section>
      <section class="turne" aria-label="With Turne"><h3>With Turne</h3><ol><li>Discovery</li><li>Participation</li><li>Engagement</li><li>Reward</li><li>Retention</li></ol><p>A loop people actually want to come back to.</p></section>
    </div>
  </div>
</section>

<section class="band" id="enquiry" data-hide-sticky aria-labelledby="enq-h">
  <div class="wrap split">
    <div class="stack-lg">
      <h2 id="enq-h">Talk to us</h2>
      <p class="lede">Building something people should participate in? Tell us what you're planning and we'll reply within two working days.</p>
      <p class="muted">Prefer email? Write to <b style="color:var(--paper)">brands@turne.in</b></p>
    </div>
    <form class="form panel" data-api="brandEnquiry" data-success="Thanks. Your enquiry is with our brands team, and we'll reply within two working days." novalidate>
      <div class="row-2">
        <div class="field"><label for="b-name">Your name</label><input class="input" id="b-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="b-company">Brand or company</label><input class="input" id="b-company" name="company" autocomplete="organization" required></div>
      </div>
      <div class="row-2">
        <div class="field"><label for="b-email">Work email</label><input class="input" id="b-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="b-phone">Phone <span class="muted">(optional)</span></label><input class="input" id="b-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
      </div>
      <div class="field">
        <label for="b-plan">What are you planning?</label>
        <select class="select input" id="b-plan" name="plan" required>
          <option value="">Choose one</option>
          <option>An event or experience</option>
          <option>A product launch or drop</option>
          <option>A giveaway</option>
          <option>An ongoing campaign or community</option>
          <option>Something else</option>
        </select>
      </div>
      <div class="field"><label for="b-msg">Tell us more</label><textarea class="textarea" id="b-msg" name="message" placeholder="City, dates, audience size, anything useful" required></textarea></div>
      <div class="hp" aria-hidden="true"><label for="b-website">Website</label><input id="b-website" name="website" tabindex="-1" autocomplete="off"></div>
      <button class="btn btn--ticket" type="submit">Send enquiry</button>
      <p data-status hidden role="status"></p>
    </form>
  </div>
</section>
""",
)

# ---------------------------------------------------------------- FAQ
FAQ_GROUPS = [
    ("About Turne", [
        ("What is Turne?", "Turne is a platform for brand-hosted events where every startup gets its own room. You hop between rooms to watch demos, chat with founders, vote, upvote startups and enter giveaways."),
        ("What is a startup room?", "A space inside an event that belongs to one startup, a bit like a server on Discord. It has a live demo, a chat, Q&amp;A and polls, and it can run its own giveaway."),
        ("Can my startup get a room?", "Rooms are opened by the brand hosting each event. If you'd like to showcase at an upcoming Turne event, write to brands@turne.in."),
        ("When is Turne launching?", "Turne is preparing for launch. The countdown on our home page shows the planned launch timeline. Join the waitlist and you'll be first through the door."),
        ("Is Turne free?", "The consumer experience will include a free tier. Premium features and benefits may vary as Turne launches and evolves."),
        ("Which cities can join?", "Anyone in India can join the waitlist. Experiences will roll out city by city."),
    ]),
    ("The waitlist", [
        ("How do I join?", "Verify your WhatsApp number with the 6-digit code we send, add your name, date of birth and city, then tap Join the waitlist. It takes well under a minute."),
        ("What do I get for joining?", "The first 10,000 verified waitlist members receive Lifetime Premium membership."),
        ("Can I register more than one number?", "Each WhatsApp number can hold one waitlist entry. If you register the same number again, you'll see your existing spot."),
        ("Will you share my number with brands?", "No. We don't sell your personal information, and we don't share your phone number with brands or advertisers. See our <a href=\"{{u:privacy}}\">privacy policy</a>."),
        ("How do I stop WhatsApp messages?", "Reply STOP to any message from us, or email privacy@turne.in. Withdrawing consent may mean we can't keep your waitlist entry or Premium eligibility active."),
    ]),
    ("Premium and giveaways", [
        ("What is Premium?", "Premium is Turne's membership experience: additional benefits and access to selected opportunities. Premium benefits may evolve as Turne launches."),
        ("Do Premium members automatically win giveaways?", "No. Premium does not guarantee winning. It provides access to the Premium allocation, a dedicated 50% share, of selected giveaway opportunities."),
        ("Do I have to pay to enter a giveaway?", "No. Giveaways are free to enter for eligible members. There's no purchase, stake or wager of any kind."),
    ]),
]
_faq_flat = [qa for _, qs in FAQ_GROUPS for qa in qs]
_faq_html = "\n".join(
    f'<section class="faq-group" aria-labelledby="fg{i}"><h2 id="fg{i}">{name}</h2><div class="faq">'
    + "".join(f'<details><summary>{q}</summary><div class="answer"><p>{a}</p></div></details>' for q, a in qs)
    + "</div></section>"
    for i, (name, qs) in enumerate(FAQ_GROUPS)
)

page(
    slug="faq", crumb="FAQ", og="faq", faq=_faq_flat,
    title="Turne FAQ | Waitlist, Premium, Giveaways and Launch",
    desc="Answers about Turne: what it is, when it launches, how to join the waitlist, what Lifetime Premium includes, how giveaways work and which cities can join.",
    body=f"""
<section class="page-hero" data-hero>
  <div class="wrap">
    {crumbs("FAQ")}
    <h1>The details.</h1>
    <p class="lede">Quick answers about Turne, the waitlist, Premium and giveaways.</p>
  </div>
</section>
<section class="band band--tight">
  <div class="wrap split split--wide-left" style="align-items:start">
    <div>{_faq_html}</div>
    <aside class="panel stack" style="position:sticky;top:110px">
      <h2 class="display" style="font-size:1.6rem">Still stuck?</h2>
      <p class="muted">Write to <b style="color:var(--paper)">hello@turne.in</b> or send us a message and we'll get back to you.</p>
      <a class="textlink" href="{{{{u:contact}}}}">Contact Turne</a>
    </aside>
  </div>
</section>
{closer()}
""",
)

# ---------------------------------------------------------------- CONTACT
page(
    slug="contact", crumb="Contact", og="contact", no_sticky=True, schema_type="ContactPage",
    title="Contact Turne | Waitlist, Brands and Privacy",
    desc="Get in touch with Turne. Email hello@turne.in for general questions, brands@turne.in for partnerships, or privacy@turne.in about your data.",
    body=f"""
<section class="page-hero" data-hero>
  <div class="wrap">
    {crumbs("Contact")}
    <h1>Get in touch.</h1>
    <p class="lede">Pick the inbox that fits, or send a message below.</p>
  </div>
</section>
<section class="band band--tight">
  <div class="wrap stack-lg">
    <div class="contacts">
      <div><b>General</b><span>Questions about Turne or your waitlist spot.</span><a href="mailto:hello@turne.in">hello@turne.in</a></div>
      <div><b>Brands</b><span>Events, giveaways and partnerships.</span><a href="mailto:brands@turne.in">brands@turne.in</a></div>
      <div><b>Privacy</b><span>Your data, deletion requests and WhatsApp consent.</span><a href="mailto:privacy@turne.in">privacy@turne.in</a></div>
    </div>
  </div>
</section>
<section class="band" data-hide-sticky aria-labelledby="msg-h">
  <div class="wrap split">
    <div class="stack-lg">
      <h2 id="msg-h">Send a message</h2>
      <p class="lede">We reply within two working days.</p>
      <p class="muted">Looking for a quick answer? <a class="textlink" href="{{{{u:faq}}}}">Check the FAQ</a></p>
    </div>
    <form class="form panel" data-api="contact" data-success="Message sent. We'll reply within two working days." novalidate>
      <div class="row-2">
        <div class="field"><label for="c-name">Your name</label><input class="input" id="c-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="field">
        <label for="c-topic">Topic</label>
        <select class="select input" id="c-topic" name="topic" required>
          <option value="">Choose one</option>
          <option>My waitlist spot</option>
          <option>Premium</option>
          <option>Giveaways</option>
          <option>Press</option>
          <option>Something else</option>
        </select>
      </div>
      <div class="field"><label for="c-msg">Message</label><textarea class="textarea" id="c-msg" name="message" required></textarea></div>
      <div class="hp" aria-hidden="true"><label for="c-website">Website</label><input id="c-website" name="website" tabindex="-1" autocomplete="off"></div>
      <button class="btn btn--ticket" type="submit">Send message</button>
      <p data-status hidden role="status"></p>
    </form>
  </div>
</section>
""",
)

# ---------------------------------------------------------------- JOIN
from layout import COUNT as _C  # noqa: E402
_city_opts = "".join(f"<option>{c}</option>" for c in [
    "Delhi", "Gurugram", "Noida", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai",
    "Kolkata", "Jaipur", "Ahmedabad", "Lucknow", "Chandigarh", "Indore", "Kochi", "Bhopal"])

page(
    slug="join", crumb="Join the waitlist", og="join", no_sticky=True, scripts=["join.js"],
    title="Join the Turne Waitlist | First 10,000 Get Lifetime Premium",
    desc="Join the Turne waitlist in under a minute with your WhatsApp number. The first 10,000 verified members get Lifetime Premium.",
    body=f"""
<section class="band" style="padding-top:clamp(2.5rem,6vw,4.5rem)">
  <div class="wrap join">
    <div class="stack-lg">
      {crumbs("Join the waitlist")}
      <h1 style="font-size:clamp(2.16rem,5.6vw,4.42rem)">Join the waitlist.</h1>
      <p class="lede">It takes under a minute. The first 10,000 verified members get Lifetime Premium.</p>
      {ticket()}
      <div>
        <div class="ticks" data-ticks data-cells="50" role="img" aria-label="Lifetime Premium spots claimed"></div>
        <div class="ticks-key"><span><strong>{stat("count")}</strong> claimed</span><span><strong>{stat("remaining")}</strong> Premium spots left</span></div>
      </div>
    </div>

    <div id="join-flow" class="panel" aria-live="polite">
      <ol class="steps" aria-label="Sign-up progress">
        <li>WhatsApp number</li><li>Verify</li><li>Your details</li>
      </ol>

      <form id="step-phone" novalidate>
        <h2>What's your WhatsApp?</h2>
        <p>We'll send a 6-digit code on WhatsApp to confirm it's really you. No spam, ever.</p>
        <div class="form">
          <div class="field">
            <label for="wa-number">WhatsApp number</label>
            <div class="phone-input"><span class="prefix">+91</span><input class="input" id="wa-number" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" maxlength="14" aria-describedby="phone-error"></div>
            <p class="error" id="phone-error" hidden></p>
          </div>
          <button class="btn btn--ticket btn--block" type="submit">Send code</button>
          <p class="consent">By continuing you agree to our <a href="{{{{u:terms}}}}">Terms</a> and <a href="{{{{u:privacy}}}}">Privacy policy</a>, and to receive WhatsApp messages from Turne about your waitlist spot.</p>
        </div>
      </form>

      <form id="step-otp" novalidate hidden>
        <h2>Check your WhatsApp.</h2>
        <p>Enter the 6-digit code we sent to <b id="otp-target" style="color:var(--paper)">your number</b>.</p>
        <div class="form">
          <fieldset class="field" style="border:0;padding:0;margin:0">
            <legend class="label" style="margin-bottom:.45rem">6-digit code</legend>
            <div class="otp">
              <input class="input" id="otp-1" inputmode="numeric" autocomplete="one-time-code" maxlength="1" aria-label="Digit 1">
              <input class="input" id="otp-2" inputmode="numeric" maxlength="1" aria-label="Digit 2">
              <input class="input" id="otp-3" inputmode="numeric" maxlength="1" aria-label="Digit 3">
              <input class="input" id="otp-4" inputmode="numeric" maxlength="1" aria-label="Digit 4">
              <input class="input" id="otp-5" inputmode="numeric" maxlength="1" aria-label="Digit 5">
              <input class="input" id="otp-6" inputmode="numeric" maxlength="1" aria-label="Digit 6">
            </div>
          </fieldset>
          <p class="error" id="otp-error" hidden></p>
          <p class="notice" id="otp-mock" hidden>Demo mode: no message is sent. Use code 123456.</p>
          <button class="btn btn--ticket btn--block" type="submit">Verify and continue</button>
          <div class="cta-row small" style="justify-content:space-between">
            <button class="linkbtn" type="button" id="resend" disabled>Resend code in 30s</button>
            <button class="linkbtn" type="button" id="change-number">Change number</button>
          </div>
        </div>
      </form>

      <form id="step-details" novalidate hidden>
        <h2>Make it official.</h2>
        <p>Three quick fields and your spot is locked in.</p>
        <div class="form">
          <div class="field"><label for="full-name">Full name</label><input class="input" id="full-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="dob">Date of birth</label><input class="input" id="dob" name="dob" type="date" autocomplete="bday" required><span class="hint">Some giveaways and experiences have a minimum age.</span></div>
          <div class="field">
            <label for="city">City</label>
            <select class="select input" id="city" name="city" required>
              <option value="">Choose your city</option>{_city_opts}<option value="__other">Other city</option>
            </select>
          </div>
          <div class="field" id="city-other-wrap" hidden><label for="city-other">Your city</label><input class="input" id="city-other" name="cityOther" autocomplete="address-level2"></div>
          <div class="hp" aria-hidden="true"><label for="company">Company</label><input id="company" name="company" tabindex="-1" autocomplete="off"></div>
          <p class="error" id="details-error" hidden></p>
          <button class="btn btn--ticket btn--block" type="submit">Join the waitlist</button>
        </div>
      </form>

      <div id="step-done" hidden>
        <h2 id="done-title">You're in.</h2>
        <p id="done-lede">Your spot is locked. We'll message you on WhatsApp before launch.</p>
        <div class="stack-lg">
          <div class="ticket" id="done-ticket" style="justify-self:start;transform:rotate(-1.5deg)">
            <div class="ticket__main">
              <div class="ticket__brand"><b>TURNE</b><span>Waitlist</span></div>
              <div class="ticket__title" id="done-tier">Lifetime Premium</div>
              <dl class="ticket__rows">
                <div><dt>Your spot</dt><dd data-done-position>#0</dd></div>
                <div><dt>Status</dt><dd>Verified</dd></div>
                <div><dt>Valid for</dt><dd>Life</dd></div>
              </dl>
              <div class="ticket__barcode" aria-hidden="true"></div>
            </div>
            <div class="ticket__stub" aria-hidden="true"><span data-done-position>#0</span></div>
          </div>
          <p id="done-premium" class="notice notice--ok">Lifetime Premium unlocked. You made the first 10,000.</p>
          <p id="done-standard" class="notice" hidden>The 10,000 Premium spots are taken, but you're on the list and will be first through the door at launch.</p>
          <div class="stack">
            <p style="font-weight:600">Bring your people in too. Spots are going.</p>
            <div class="share-row"><a class="btn btn--ticket" id="share-wa" href="https://wa.me/" target="_blank" rel="noopener">Share on WhatsApp</a></div>
            <div class="field"><label for="invite-link">Your invite link</label><div class="invite"><input class="input" id="invite-link" readonly><button class="btn btn--ghost" type="button" id="copy-invite">Copy link</button></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
""",
)
