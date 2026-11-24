/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function NotFoundContent() {
  return (
    <>
<section className="band lost" data-hero="">
<div className="wrap stack-lg">
<h1>Wrong turn.</h1>
<p className="lede">This page doesn't exist, or it moved. The good stuff is this way.</p>
<div className="cta-row"><Link className="btn btn--ticket" href="/join/">Join the waitlist</Link><Link className="textlink" href="/">Back to home</Link></div>
</div>
</section>
    </>
  );
}
