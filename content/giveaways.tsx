/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Stat } from "@/components/live";

export default function GiveawaysContent() {
  return (
    <>
<section className="page-hero" data-hero="">
<div className="wrap">
<nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Giveaways</span></nav>
<h1>Real rewards. Real participation.</h1>
<p className="lede">Giveaways on Turne are a participation mechanic, not a lottery ticket. You show up, you join in, and you get a real shot at something worth having.</p>
</div>
</section>
<section className="band band--tight" aria-labelledby="win-h">
<div className="wrap">
<div className="section-head"><h2 id="win-h">What you can win</h2></div>
<ul className="prizes">
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M4 9l12-5 12 5v14l-12 5-12-5z" /><path d="M4 9l12 5 12-5M16 14v14" /></svg><b>Physical products</b><span>Things brands make, shipped to you.</span></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M4 9h24v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6z" /><path d="M20 9v14" strokeDasharray="2 2" /></svg><b>Event tickets</b><span>Entry to gigs, fests and sessions.</span></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M4 4h11l13 13-11 11L4 15z" /><circle cx="10" cy="10" r="2" /></svg><b>Discount coupons</b><span>Money off with the brands you follow.</span></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M18 3L7 18h8l-1 11 11-15h-8z" /></svg><b>Digital products</b><span>Subscriptions, downloads and in-app items.</span></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><rect x="4" y="7" width="24" height="18" rx="3" /><path d="M4 13h24M9 20h6" /></svg><b>Memberships</b><span>Access to clubs and programmes.</span></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M16 4l3.6 7.6 8.4 1-6.2 5.8 1.6 8.3L16 22.6 8.6 26.7l1.6-8.3L4 12.6l8.4-1z" /></svg><b>Experiences</b><span>Meet-ups, workshops and access you can't buy.</span></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><rect x="5" y="12" width="22" height="16" /><path d="M3 8h26v4H3zM16 8v20M16 8c-2-5-8-5-8-1s8 1 8 1zm0 0c2-5 8-5 8-1s-8 1-8 1z" /></svg><b>Brand rewards</b><span>Perks a brand designs for its community.</span></li>
<li style={{ background: "var(--lime)", color: "var(--night)" }}><b>Enter at launch</b><span style={{ color: "var(--night)" }}>Waitlist members are first through the door.</span><Link className="textlink" style={{ color: "var(--night)", textDecorationColor: "var(--night)" }} href="/join/">Join the waitlist</Link></li>
</ul>
</div>
</section>
<section className="band band--ink" aria-labelledby="fair-h">
<div className="wrap split" style={{ alignItems: "center" }}>
<div className="stack-lg">
<h2 id="fair-h">Everyone gets a shot.</h2>
<p className="lede">For eligible giveaways, opportunities are split evenly. Premium members get access to a dedicated 50% share. It improves your access. It never guarantees a win.</p>
<p className="fine">Allocation applies to selected eligible giveaways. Winners are drawn within each share.</p>
</div>
<div className="split-bar" role="img" aria-label="Giveaway opportunities: 50% for normal members, 50% for Premium members">
<div className="normal"><b>50%</b><span>Normal members</span></div>
<div className="premium"><b>50%</b><span>Premium members</span></div>
</div>
</div>
</section>
<section className="band" aria-labelledby="rules-h">
<div className="wrap">
<div className="section-head">
<h2 id="rules-h">How a giveaway works</h2>
<p className="lede">The short version of our giveaway terms.</p>
</div>
<ul className="rows">
<li><h3>Free to enter</h3><p>No purchase, stake or wager. Turne is not a gambling or betting platform.</p><span className="tag">Terms C1</span></li>
<li><h3>Clear rules</h3><p>Each giveaway states its entry window, eligibility, number of prizes and draw date.</p><span className="tag">Terms C3</span></li>
<li><h3>Random draw</h3><p>Winners are picked at random from valid entries within each share.</p><span className="tag">Terms C5</span></li>
<li><h3>WhatsApp notice</h3><p>Winners hear from us on their registered WhatsApp number.</p><span className="tag">Terms C5</span></li>
<li><h3>Fair play</h3><p>Multiple accounts, false details or automation get entries disqualified.</p><span className="tag">Terms C6</span></li>
</ul>
<p style={{ marginTop: "2rem" }}><Link className="textlink" href="/terms/#part-c">Read the full giveaway terms</Link></p>
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
