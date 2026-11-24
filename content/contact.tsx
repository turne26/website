/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function ContactContent() {
  return (
    <>
<section className="page-hero" data-hero="">
<div className="wrap">
<nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav>
<h1>Get in touch.</h1>
<p className="lede">Pick the inbox that fits, or send a message below.</p>
</div>
</section>
<section className="band band--tight">
<div className="wrap stack-lg">
<div className="contacts">
<div><b>General</b><span>Questions about Turne or your waitlist spot.</span><a href="mailto:hello@turne.in">hello@turne.in</a></div>
<div><b>Brands</b><span>Events, giveaways and partnerships.</span><a href="mailto:brands@turne.in">brands@turne.in</a></div>
<div><b>Privacy</b><span>Your data, deletion requests and WhatsApp consent.</span><a href="mailto:privacy@turne.in">privacy@turne.in</a></div>
</div>
</div>
</section>
<section className="band" data-hide-sticky="" aria-labelledby="msg-h">
<div className="wrap split">
<div className="stack-lg">
<h2 id="msg-h">Send a message</h2>
<p className="lede">We reply within two working days.</p>
<p className="muted">Looking for a quick answer?{" "}<Link className="textlink" href="/faq/">Check the FAQ</Link></p>
</div>
<form className="form panel" data-api="contact" data-success="Message sent. We'll reply within two working days." noValidate>
<div className="row-2">
<div className="field"><label htmlFor="c-name">Your name</label><input className="input" id="c-name" name="name" autoComplete="name" required /></div>
<div className="field"><label htmlFor="c-email">Email</label><input className="input" id="c-email" name="email" type="email" autoComplete="email" required /></div>
</div>
<div className="field">
<label htmlFor="c-topic">Topic</label>
<select className="select input" id="c-topic" name="topic" required>
<option value="">Choose one</option>
<option>My waitlist spot</option>
<option>Premium</option>
<option>Giveaways</option>
<option>Press</option>
<option>Something else</option>
</select>
</div>
<div className="field"><label htmlFor="c-msg">Message</label><textarea className="textarea" id="c-msg" name="message" required /></div>
<div className="hp" aria-hidden="true"><label htmlFor="c-website">Website</label><input id="c-website" name="website" tabIndex={-1} autoComplete="off" /></div>
<button className="btn btn--ticket" type="submit">Send message</button>
<p data-status="" hidden role="status" />
</form>
</div>
</section>
    </>
  );
}
