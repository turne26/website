/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Stat, Tally, Ticks } from "@/components/live";

export default function PremiumContent() {
  return (
    <>
<section className="hero" data-hero="" aria-labelledby="prem-h">
<div className="wrap hero-grid">
<div>
<nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Premium</span></nav>
<h1 id="prem-h" style={{ fontSize: "clamp(2.34rem,6.3vw,5.10rem)" }}>The first{" "}<span className="hl-v">10,000</span>{" "}get 2 years of Premium.</h1>
<p className="lede">Be one of the first 10,000 verified members and get two years of Turne Premium, free from launch day. No payment, no catch. You were early.</p>
<div className="cta-row"><Link className="btn btn--ticket" href="/join/">Claim my spot</Link><span className="small muted"><Stat k="remaining" className="num" />{" "}spots left</span></div>
</div>
<div className="ticket ticket--premium" role="img" aria-label="Your next waitlist spot is number 1,122">
<div className="ticket__main">
<div className="ticket__brand"><b>TURNE</b><span>Early access</span></div>
<div className="ticket__title">2-Year Premium pass</div>
<dl className="ticket__rows">
<div><dt>Next spot</dt><dd>#<Stat k="next" className="num" /></dd></div>
<div><dt>Spots left</dt><dd><Stat k="remaining" className="num" /></dd></div>
<div><dt>Valid for</dt><dd>2 years</dd></div>
</dl>
<div className="ticket__barcode" aria-hidden="true" />
</div>
<div className="ticket__stub" aria-hidden="true"><span>No.{" "}<Stat k="next" className="num" /></span></div>
</div>
</div>
</section>
<section className="band band--ink" aria-label="Premium spots claimed">
<div className="wrap"><div className="gate">
<div>
<h2 className="display" style={{ fontSize: "clamp(1.44rem,2.8vw,2.04rem)" }}>Premium spots claimed</h2>
<div style={{ marginTop: "1.5rem" }}>
<Tally className="tally" aria-label="1,121 people on the waitlist" />
<p className="gate__label"><strong><Stat k="count" className="num" /></strong>{" "}people are on the waitlist. Joining takes under a minute.</p>
</div>
</div>
<div>
<p className="small" style={{ fontWeight: "600", marginBottom: ".9rem" }}>2-Year Premium spots</p>
<Ticks cells={50} className="ticks" role="img" aria-label="1,121 of 10,000 2-Year Premium spots claimed" />
<div className="ticks-key"><span><strong><Stat k="count" className="num" /></strong>{" "}claimed (<Stat k="percent" className="num" />)</span><span><strong><Stat k="remaining" className="num" /></strong>{" "}left</span><span>Each block is 200 spots</span></div>
</div>
</div></div>
</section>
<section className="band" aria-labelledby="ben-h">
<div className="wrap split">
<div className="stack">
<h2 id="ben-h">What Premium includes</h2>
<p className="fine">Premium benefits may evolve as Turne launches. Premium does not guarantee winning any giveaway.</p>
</div>
<ul className="benefits">
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M6 17l6 6L26 9" /></svg><div><b>2 years of Premium membership</b><span>Free for 24 months from launch day. No payment, no catch.</span></div></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M6 17l6 6L26 9" /></svg><div><b>The Premium 50% giveaway share</b><span>Access to a dedicated half of selected giveaway opportunities.</span></div></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M6 17l6 6L26 9" /></svg><div><b>Early access to selected experiences</b><span>Through the door before general access opens.</span></div></li>
<li><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M6 17l6 6L26 9" /></svg><div><b>Priority on new opportunities</b><span>As Turne grows, Premium members are first in line.</span></div></li>
</ul>
</div>
</section>
<section className="band band--ink" aria-labelledby="share-h">
<div className="wrap split" style={{ alignItems: "center" }}>
<div className="stack-lg">
<h2 id="share-h">Better access, never a guaranteed win</h2>
<p className="lede">Eligible giveaways split their opportunities 50/50. Premium members are drawn from their own half, so your chances depend on how many people enter that share.</p>
<Link className="textlink" href="/giveaways/">How giveaways work</Link>
</div>
<div className="split-bar" role="img" aria-label="Giveaway opportunities: 50% for normal members, 50% for Premium members">
<div className="normal"><b>50%</b><span>Normal members</span></div>
<div className="premium"><b>50%</b><span>Premium members</span></div>
</div>
</div>
</section>
<section className="band" aria-labelledby="fine-h">
<div className="wrap">
<div className="section-head"><h2 id="fine-h">The fine print, plainly</h2></div>
<ul className="rows">
<li><h3>Who qualifies</h3><p>The first 10,000 verified waitlist members, in the order their WhatsApp number is verified. The offer closes at 10,000.</p><span className="tag">Terms B1</span></li>
<li><h3>2 years</h3><p>Premium runs for 24 months from the day Turne launches, while your membership is in good standing.</p><span className="tag">Terms B2</span></li>
<li><h3>Just for you</h3><p>Premium is tied to your verified number. It can't be sold, gifted or transferred.</p><span className="tag">Terms B4</span></li>
<li><h3>Fair use</h3><p>Premium obtained through fraud, automation or duplicate sign-ups can be withdrawn.</p><span className="tag">Terms B5</span></li>
</ul>
<p style={{ marginTop: "2rem" }}><Link className="textlink" href="/terms/#part-b">Read the full Premium terms</Link></p>
</div>
</section>
<section className="band closer" data-hide-sticky="" aria-labelledby="closer-h">
<div className="wrap closer-grid">
<div className="stack">
<p className="meta">You're early. That's the point.</p>
<h2 id="closer-h">Claim your spot before they're gone.</h2>
</div>
<div className="stack">
<p className="lede">Only{" "}<Stat k="remaining" className="num" />{" "}2-Year Premium spots are left, and the countdown doesn't stop.</p>
<div className="cta-row"><Link className="btn btn--ticket" href="/join/">Join the waitlist</Link><span className="meta"><Stat k="count" className="num" />+ already waiting</span></div>
</div>
</div>
</section>
    </>
  );
}
