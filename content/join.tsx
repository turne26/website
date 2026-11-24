/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Stat, Ticks } from "@/components/live";

export default function JoinContent() {
  return (
    <>
<section className="band" style={{ paddingTop: "clamp(2.5rem,6vw,4.5rem)" }}>
<div className="wrap join">
<div className="stack-lg">
<h1 style={{ fontSize: "clamp(2.16rem,5.6vw,4.42rem)" }}>Join the waitlist.</h1>
<p className="lede">It takes under a minute. The first 10,000 verified members get 2 years of Premium free.</p>
<div className="ticket" role="img" aria-label="Your next waitlist spot is number 1,122">
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
<div>
<Ticks cells={50} className="ticks" role="img" aria-label="2-Year Premium spots claimed" />
<div className="ticks-key"><span><strong><Stat k="count" className="num" /></strong>{" "}claimed</span><span><strong><Stat k="remaining" className="num" /></strong>{" "}Premium spots left</span></div>
</div>
</div>
<div id="join-flow" className="panel" aria-live="polite">
<ol className="steps" aria-label="Sign-up progress">
<li>Mobile number</li><li>Verify</li><li>Your details</li>
</ol>
<form id="step-phone" noValidate>
<h2>What's your WhatsApp number?</h2>
<p>We'll send a 6-digit code on WhatsApp to confirm it's really you. No spam, ever.</p>
<div className="form">
<div className="field">
<label htmlFor="wa-number">WhatsApp number</label>
<div className="phone-input"><span className="prefix">+91</span><input className="input" id="wa-number" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={14} aria-describedby="phone-error" /></div>
<p className="error" id="phone-error" hidden />
</div>
<button className="btn btn--ticket btn--block" type="submit">Send code</button>
<p className="consent">By continuing you agree to our{" "}<Link href="/terms/">Terms</Link>{" "}and{" "}<Link href="/privacy/">Privacy policy</Link>, and to receive a verification code and messages on WhatsApp from Turne about your waitlist spot.</p>
</div>
</form>
<form id="step-otp" noValidate hidden>
<h2>Check your WhatsApp.</h2>
<p>Enter the 6-digit code we sent to{" "}<b id="otp-target" style={{ color: "var(--paper)" }}>your number</b>.</p>
<div className="form">
<fieldset className="field" style={{ border: "0", padding: "0", margin: "0" }}>
<legend className="label" style={{ marginBottom: ".45rem" }}>6-digit code</legend>
<div className="otp">
<input className="input" id="otp-1" inputMode="numeric" autoComplete="one-time-code" maxLength={1} aria-label="Digit 1" />
<input className="input" id="otp-2" inputMode="numeric" maxLength={1} aria-label="Digit 2" />
<input className="input" id="otp-3" inputMode="numeric" maxLength={1} aria-label="Digit 3" />
<input className="input" id="otp-4" inputMode="numeric" maxLength={1} aria-label="Digit 4" />
<input className="input" id="otp-5" inputMode="numeric" maxLength={1} aria-label="Digit 5" />
<input className="input" id="otp-6" inputMode="numeric" maxLength={1} aria-label="Digit 6" />
</div>
</fieldset>
<p className="error" id="otp-error" hidden />
<p className="notice" id="otp-mock" hidden>Demo mode: no message is sent. Use code 123456.</p>
<button className="btn btn--ticket btn--block" type="submit">Verify and continue</button>
<div className="cta-row small" style={{ justifyContent: "space-between" }}>
<button className="linkbtn" type="button" id="resend" disabled>Resend code in 30s</button>
<button className="linkbtn" type="button" id="change-number">Change number</button>
</div>
</div>
</form>
<form id="step-details" noValidate hidden>
<h2>Make it official.</h2>
<p>Three quick fields and your spot is locked in.</p>
<div className="form">
<div className="field"><label htmlFor="full-name">Full name</label><input className="input" id="full-name" name="name" autoComplete="name" required /></div>
<div className="field"><label htmlFor="dob">Date of birth</label><input className="input" id="dob" name="dob" type="date" autoComplete="bday" required /><span className="hint">Some giveaways and experiences have a minimum age.</span></div>
<div className="field">
<label htmlFor="city">City</label>
<select className="select input" id="city" name="city" required>
<option value="">Choose your city</option><option>Delhi</option><option>Gurugram</option><option>Noida</option><option>Mumbai</option><option>Bengaluru</option><option>Hyderabad</option><option>Pune</option><option>Chennai</option><option>Kolkata</option><option>Jaipur</option><option>Ahmedabad</option><option>Lucknow</option><option>Chandigarh</option><option>Indore</option><option>Kochi</option><option>Bhopal</option><option value="__other">Other city</option>
</select>
</div>
<div className="field" id="city-other-wrap" hidden><label htmlFor="city-other">Your city</label><input className="input" id="city-other" name="cityOther" autoComplete="address-level2" /></div>
<div className="hp" aria-hidden="true"><label htmlFor="company">Company</label><input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
<p className="error" id="details-error" hidden />
<button className="btn btn--ticket btn--block" type="submit">Join the waitlist</button>
</div>
</form>
<div id="step-done" hidden>
<h2 id="done-title">You're in.</h2>
<p id="done-lede">Your spot is locked. We'll message you on WhatsApp before launch.</p>
<div className="stack-lg">
<div className="ticket" id="done-ticket" style={{ justifySelf: "start", transform: "rotate(-1.5deg)" }}>
<div className="ticket__main">
<div className="ticket__brand"><b>TURNE</b><span>Waitlist</span></div>
<div className="ticket__title" id="done-tier">2-Year Premium</div>
<dl className="ticket__rows">
<div><dt>Your spot</dt><dd data-done-position="">#0</dd></div>
<div><dt>Status</dt><dd>Verified</dd></div>
<div><dt>Valid for</dt><dd>Life</dd></div>
</dl>
<div className="ticket__barcode" aria-hidden="true" />
</div>
<div className="ticket__stub" aria-hidden="true"><span data-done-position="">#0</span></div>
</div>
<p id="done-premium" className="notice notice--ok">2-Year Premium unlocked. You made the first 10,000.</p>
<p id="done-standard" className="notice" hidden>The 10,000 Premium spots are taken, but you're on the list and will be first through the door at launch.</p>
<div className="stack">
<p style={{ fontWeight: "600" }}>Bring your people in too. Spots are going.</p>
<div className="share-row"><a className="btn btn--ticket" id="share-wa" href="https://wa.me/" target="_blank" rel="noopener">Share on WhatsApp</a></div>
<div className="field"><label htmlFor="invite-link">Your invite link</label><div className="invite"><input className="input" id="invite-link" readOnly /><button className="btn btn--ghost" type="button" id="copy-invite">Copy link</button></div></div>
</div>
</div>
</div>
</div>
</div>
</section>
    </>
  );
}
