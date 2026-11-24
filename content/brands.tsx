/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function BrandsContent() {
  return (
    <>
<section className="page-hero" data-hero="">
<div className="wrap">
<nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">For brands</span></nav>
<h1>For brands, it's more than an event.</h1>
<p className="lede">Create the experience, fill the room, and finally measure who actually showed up.</p>
<div className="cta-row" style={{ marginTop: "2rem" }}><a className="btn btn--ticket" href="#enquiry">Talk to us</a><span className="small muted">or email{" "}<b style={{ color: "var(--paper)" }}>brands@turne.in</b></span></div>
</div>
</section>
<section className="band band--tight" aria-labelledby="caps-h">
<div className="wrap">
<div className="section-head"><h2 id="caps-h">What you can run on Turne</h2></div>
<ul className="prizes prizes--3">
<li><b>Create events</b><span>Demo days, launches and festivals, set up from your phone.</span></li>
<li><b>Open startup rooms</b><span>Give every startup its own room with a demo, chat and Q&amp;A.</span></li>
<li><b>Manage registrations</b><span>See who signed up and who turned up.</span></li>
<li><b>Run giveaways</b><span>Free-to-enter giveaways with clear rules and fair draws.</span></li>
<li><b>Measure participation</b><span>See who joined, which rooms they visited and who came back.</span></li>
<li><b>Build community</b><span>Turn one-off attendees into people who follow you.</span></li>
</ul>
</div>
</section>
<section className="band band--ink" aria-labelledby="vs-h">
<div className="wrap">
<div className="section-head">
<h2 id="vs-h">Reach is not the same as participation</h2>
<p className="lede">Social media gets brands to the audience. Turne gets the audience to participate.</p>
</div>
<div className="compare">
<section className="today" aria-label="Today"><h3>Today</h3><ol><li>Brand</li><li>Instagram</li><li>Content</li><li>Scroll</li><li>????</li></ol><p>One-way. Hard to measure. Forgotten by tomorrow.</p></section>
<section className="turne" aria-label="With Turne"><h3>With Turne</h3><ol><li>Discovery</li><li>Participation</li><li>Engagement</li><li>Reward</li><li>Retention</li></ol><p>A loop people actually want to come back to.</p></section>
</div>
</div>
</section>
<section className="band" id="enquiry" data-hide-sticky="" aria-labelledby="enq-h">
<div className="wrap split">
<div className="stack-lg">
<h2 id="enq-h">Talk to us</h2>
<p className="lede">Building something people should participate in? Tell us what you're planning and we'll reply within two working days.</p>
<p className="muted">Prefer email? Write to{" "}<b style={{ color: "var(--paper)" }}>brands@turne.in</b></p>
</div>
<form className="form panel" data-api="brandEnquiry" data-success="Thanks. Your enquiry is with our brands team, and we'll reply within two working days." noValidate>
<div className="row-2">
<div className="field"><label htmlFor="b-name">Your name</label><input className="input" id="b-name" name="name" autoComplete="name" required /></div>
<div className="field"><label htmlFor="b-company">Brand or company</label><input className="input" id="b-company" name="company" autoComplete="organization" required /></div>
</div>
<div className="row-2">
<div className="field"><label htmlFor="b-email">Work email</label><input className="input" id="b-email" name="email" type="email" autoComplete="email" required /></div>
<div className="field"><label htmlFor="b-phone">Phone{" "}<span className="muted">(optional)</span></label><input className="input" id="b-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" /></div>
</div>
<div className="field">
<label htmlFor="b-plan">What are you planning?</label>
<select className="select input" id="b-plan" name="plan" required>
<option value="">Choose one</option>
<option>An event or experience</option>
<option>A product launch or drop</option>
<option>A giveaway</option>
<option>An ongoing campaign or community</option>
<option>Something else</option>
</select>
</div>
<div className="field"><label htmlFor="b-msg">Tell us more</label><textarea className="textarea" id="b-msg" name="message" placeholder="City, dates, audience size, anything useful" required /></div>
<div className="hp" aria-hidden="true"><label htmlFor="b-website">Website</label><input id="b-website" name="website" tabIndex={-1} autoComplete="off" /></div>
<button className="btn btn--ticket" type="submit">Send enquiry</button>
<p data-status="" hidden role="status" />
</form>
</div>
</section>
    </>
  );
}
