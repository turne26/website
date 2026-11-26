/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Stat } from "@/components/live";

export default function WhyTurneContent() {
  return (
    <>
<section className="page-hero" data-hero="">
<div className="wrap">
<nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Why Turne</span></nav>
<h1>Brands shouldn't just be seen.</h1>
<p className="lede">They should be experienced. Social media gets brands to the audience. Turne gets the audience to participate.</p>
</div>
</section>
<section className="band" aria-labelledby="cmp-h">
<div className="wrap">
<div className="section-head">
<h2 id="cmp-h">A feed people scroll past, or a loop they come back to</h2>
</div>
<div className="compare">
<section className="today" aria-labelledby="today-h">
<h3 id="today-h">Today</h3>
<ol><li>Brand</li><li>Instagram</li><li>Content</li><li>Scroll</li><li>????</li></ol>
<p>One-way. Hard to measure. Forgotten by tomorrow.</p>
</section>
<section className="turne" aria-labelledby="with-h">
<h3 id="with-h">With Turne</h3>
<ol><li>Discovery</li><li>Participation</li><li>Engagement</li><li>Reward</li><li>Retention</li></ol>
<p>A loop people actually want to come back to.</p>
</section>
</div>
</div>
</section>
<section className="band band--ink" aria-labelledby="loop-h">
<div className="wrap">
<div className="section-head">
<h2 id="loop-h">The Turne loop</h2>
<p className="lede">Every event, drop and giveaway on Turne runs through the same five steps.</p>
</div>
<ol className="loop">
<li><b>Discover</b><span>Find what's happening with the brands you care about.</span></li>
<li><b>Join</b><span>Register for the event, drop or giveaway in a tap.</span></li>
<li><b>Participate</b><span>Show up and take part, live or online.</span></li>
<li><b>Get rewarded</b><span>Enter giveaways and unlock rewards for taking part.</span></li>
<li><b>Come back</b><span>Follow the brand and be first to what's next.</span></li>
</ol>
<p className="loop-return"><svg viewBox="0 0 44 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M42 4v4a6 6 0 0 1-6 6H6" /><path d="M10 10l-4 4 4 4" /></svg>Then it starts again with the next thing worth joining.</p>
</div>
</section>
<section className="band" aria-labelledby="who-h">
<div className="wrap split">
<h2 id="who-h">Built for both sides of the room</h2>
<div className="stack-lg">
<div className="stack">
<h3>For people</h3>
<p className="muted">Discover events, join experiences, enter giveaways and follow the brands you love, all in one place. No lurking required.</p>
<Link className="textlink" href="/how-it-works/">See what you can do</Link>
</div>
<div className="stack">
<h3>For brands</h3>
<p className="muted">Create the experience, fill the room, and finally measure who actually showed up.</p>
<Link className="textlink" href="/brands/">Turne for brands</Link>
</div>
</div>
</div>
</section>
<section className="band closer" data-hide-sticky="" aria-labelledby="closer-h">
<div className="wrap closer-grid">
<div className="stack">
<p className="meta">You're early. That's the point.</p>
<h2 id="closer-h">Get in before everyone else.</h2>
</div>
<div className="stack">
<p className="lede">Only{" "}<Stat k="remaining" className="num" />{" "}2-Year Premium spots are left, and the countdown doesn't stop.</p>
<div className="cta-row"><Link className="btn btn--ticket" href="/join/">Join the waitlist</Link><span className="meta">Next spot #<Stat k="next" className="num" /></span></div>
</div>
</div>
</section>
    </>
  );
}
