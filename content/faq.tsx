/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Stat } from "@/components/live";

export default function FaqContent() {
  return (
    <>
<section className="page-hero" data-hero="">
<div className="wrap">
<nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">FAQ</span></nav>
<h1>The details.</h1>
<p className="lede">Quick answers about Turne, the waitlist, Premium and giveaways.</p>
</div>
</section>
<section className="band band--tight">
<div className="wrap split split--wide-left" style={{ alignItems: "start" }}>
<div><section className="faq-group" aria-labelledby="fg0"><h2 id="fg0">About Turne</h2><div className="faq"><details><summary>What is Turne?</summary><div className="answer"><p>Turne is a platform for brand-hosted events where every startup gets its own room. You hop between rooms to watch demos, chat with founders, vote, upvote startups and enter giveaways.</p></div></details><details><summary>What is a startup room?</summary><div className="answer"><p>A space inside an event that belongs to one startup, a bit like a server on Discord. It has a live demo, a chat, Q&amp;A and polls, and it can run its own giveaway.</p></div></details><details><summary>Can my startup get a room?</summary><div className="answer"><p>Rooms are opened by the brand hosting each event. If you'd like to showcase at an upcoming Turne event, write to brands@turne.in.</p></div></details><details><summary>When is Turne launching?</summary><div className="answer"><p>Turne is preparing for launch. The countdown on our home page shows the planned launch timeline. Join the waitlist and you'll be first through the door.</p></div></details><details><summary>Is Turne free?</summary><div className="answer"><p>The consumer experience will include a free tier. Premium features and benefits may vary as Turne launches and evolves.</p></div></details><details><summary>Which cities can join?</summary><div className="answer"><p>Anyone in India can join the waitlist. Experiences will roll out city by city.</p></div></details></div></section>
<section className="faq-group" aria-labelledby="fg1"><h2 id="fg1">The waitlist</h2><div className="faq"><details><summary>How do I join?</summary><div className="answer"><p>Verify your mobile number with the 6-digit code we send on WhatsApp, add your name, date of birth and city, then tap Join the waitlist. It takes well under a minute.</p></div></details><details><summary>What do I get for joining?</summary><div className="answer"><p>The first 10,000 verified waitlist members receive 2 years of Premium membership, free from launch day.</p></div></details><details><summary>Can I register more than one number?</summary><div className="answer"><p>Each mobile number can hold one waitlist entry. If you register the same number again, you'll see your existing spot.</p></div></details><details><summary>Will you share my number with brands?</summary><div className="answer"><p>No. We don't sell your personal information, and we don't share your phone number with brands or advertisers. See our{" "}<Link href="/privacy/">privacy policy</Link>.</p></div></details><details><summary>How do I stop WhatsApp messages?</summary><div className="answer"><p>Reply STOP to any message from us, or email privacy@turne.in. Withdrawing consent may mean we can't keep your waitlist entry or Premium eligibility active.</p></div></details></div></section>
<section className="faq-group" aria-labelledby="fg2"><h2 id="fg2">Premium and giveaways</h2><div className="faq"><details><summary>What is Premium?</summary><div className="answer"><p>Premium is Turne's membership experience: additional benefits and access to selected opportunities. Premium benefits may evolve as Turne launches.</p></div></details><details><summary>Do Premium members automatically win giveaways?</summary><div className="answer"><p>No. Premium does not guarantee winning. It provides access to the Premium allocation, a dedicated 50% share, of selected giveaway opportunities.</p></div></details><details><summary>Do I have to pay to enter a giveaway?</summary><div className="answer"><p>No. Giveaways are free to enter for eligible members. There's no purchase, stake or wager of any kind.</p></div></details></div></section></div>
<aside className="panel stack" style={{ position: "sticky", top: "110px" }}>
<h2 className="display" style={{ fontSize: "1.6rem" }}>Still stuck?</h2>
<p className="muted">Write to{" "}<b style={{ color: "var(--paper)" }}>hello@turne.in</b>{" "}or send us a message and we'll get back to you.</p>
<Link className="textlink" href="/contact/">Contact Turne</Link>
</aside>
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
<div className="cta-row"><Link className="btn btn--ticket" href="/join/">Join the waitlist</Link><span className="meta"><Stat k="count" className="num" />+ already waiting</span></div>
</div>
</div>
</section>
    </>
  );
}
