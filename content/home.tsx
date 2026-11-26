/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Cd, Stat } from "@/components/live";

export default function HomeContent() {
  return (
    <>
<div className="h-page">
<section className="h-hero" data-hero="" aria-labelledby="hero-h">
<div className="wrap h-hero__grid">
<div className="h-hero__copy">
<p className="h-chip"><span className="h-chip__ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" /><path d="m10 9 5 3-5 3z" fill="#1a0f2e" /></svg></span>Online Events{" "}<i />{" "}Brand Launches{" "}<i />{" "}Real Giveaways</p>
<h1 id="hero-h">India ka Apna{" "}<span className="g-violet">Event Platform</span></h1>
<p className="h-lede">Discover &amp; join live online events from top brands, attend exclusive launch events, interact with them and win guaranteed giveaways.</p>
<Link className="pill pill--lime pill--lg" href="/join/">Join the Waitlist{" "}<svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
<p className="h-proof"><span className="h-avatars"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#6d4bd6" /><path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="#ece6f7" /><circle cx="20" cy="17" r="8" fill="#f2c09a" /><path d="M11.5 16c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z" fill="#2b1a12" /></svg><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#a35bd8" /><path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="#ece6f7" /><circle cx="20" cy="17" r="8" fill="#c98c62" /><path d="M11.5 16c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z" fill="#1b120c" /></svg><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#5e7be0" /><path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="#ece6f7" /><circle cx="20" cy="17" r="8" fill="#e0a87e" /><path d="M11.5 16c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z" fill="#3b2416" /></svg><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#c9659a" /><path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill="#ece6f7" /><circle cx="20" cy="17" r="8" fill="#b9784e" /><path d="M11.5 16c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z" fill="#140d09" /></svg></span><span>Next spot <b>#<Stat k="next" className="num" /></b>{" "}·{" "}<b><Stat k="remaining" className="num" /></b>{" "}Premium spots left</span></p>
</div>
<div className="h-cards-wrap">
<div className="h-cards" data-carousel=""><article className="h-card h-card--live" aria-label="3.0 Headphone Launch Event by SoundX">
<div className="h-card__top"><span className="h-badge">Live Event</span><span className="h-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>Mar 05</span></div>
<div className="h-card__art"><svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<radialGradient id="hp-cup" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#4a3670" /><stop offset=".6" stopColor="#1d1430" /><stop offset="1" stopColor="#0c0816" /></radialGradient>
<linearGradient id="hp-band" x1="0" x2="1"><stop offset="0" stopColor="#2a1d42" /><stop offset=".5" stopColor="#4b3678" /><stop offset="1" stopColor="#1a1129" /></linearGradient>
<filter id="hp-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter></defs>
<ellipse cx="110" cy="142" rx="80" ry="6" fill="#8b5cff" opacity=".35" filter="url(#hp-glow)" />
<path d="M50 104C46 40 80 14 112 14s66 26 60 90" fill="none" stroke="url(#hp-band)" strokeWidth="15" strokeLinecap="round" />
<path d="M56 100C54 46 84 22 112 22s58 24 54 78" fill="none" stroke="#b58bff" strokeWidth="1.6" opacity=".7" />
<g><ellipse cx="58" cy="106" rx="28" ry="34" fill="url(#hp-cup)" />
<ellipse cx="62" cy="106" rx="19" ry="25" fill="none" stroke="#b77dff" strokeWidth="4" filter="url(#hp-glow)" />
<ellipse cx="62" cy="106" rx="19" ry="25" fill="none" stroke="#d8b8ff" strokeWidth="1.6" /></g>
<g><ellipse cx="162" cy="106" rx="28" ry="34" fill="url(#hp-cup)" />
<ellipse cx="158" cy="106" rx="19" ry="25" fill="none" stroke="#b77dff" strokeWidth="4" filter="url(#hp-glow)" />
<ellipse cx="158" cy="106" rx="19" ry="25" fill="none" stroke="#d8b8ff" strokeWidth="1.6" /></g>
</svg></div>
<p className="h-card__brand"><i className="h-blogo">S</i>SoundX</p>
<h3>3.0 Headphone Launch Event</h3>
<p className="h-card__prize"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" /><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.2 6.8 6.8 7 8.4 12 8.5 12 8.5zm0 0c1.5-4.5 5.5-4.3 5.2-1.7C17 8.4 12 8.5 12 8.5z" /></svg>30 Headphones Giveaway</p>
<Link className="pill pill--ghost pill--sm" href="/join/">Join the Event{" "}<svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
</article><article className="h-card" aria-label="New Collection Launch by UrbanThread">
<div className="h-card__top"><span className="h-badge">Upcoming</span><span className="h-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>Mar 08</span></div>
<div className="h-card__art"><svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<linearGradient id="hd-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c3b0ff" /><stop offset=".55" stopColor="#d6a4e6" /><stop offset="1" stopColor="#f3a9c4" /></linearGradient>
<linearGradient id="hd-shade" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".22" /><stop offset=".5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".25" /></linearGradient></defs>
<path d="M66 50 36 74c-7 6-9 14-9 24v52h28l5-58z" fill="url(#hd-body)" />
<path d="M154 50l30 24c7 6 9 14 9 24v52h-28l-5-58z" fill="url(#hd-body)" />
<path d="M64 48c8-6 22-10 46-10s38 4 46 10l4 102H60z" fill="url(#hd-body)" />
<path d="M64 48c8-6 22-10 46-10s38 4 46 10l4 102H60z" fill="url(#hd-shade)" />
<path d="M76 56c0-30 14-46 34-46s34 16 34 46c-10-8-21-12-34-12s-24 4-34 12z" fill="#b39af0" />
<ellipse cx="110" cy="56" rx="26" ry="13" fill="#5e4691" />
<path d="M102 64c-1 12-2 22-3 32M118 64c1 12 2 22 3 32" stroke="#f6eefe" strokeWidth="2.4" strokeLinecap="round" />
<path d="m110 84 6 10h-12z" fill="none" stroke="#4b3778" strokeWidth="2" />
<path d="M80 120h60l6 30H74z" fill="#000" opacity=".1" />
</svg></div>
<p className="h-card__brand"><i className="h-blogo">UT</i>UrbanThread</p>
<h3>New Collection Launch</h3>
<p className="h-card__prize"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" /><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.2 6.8 6.8 7 8.4 12 8.5 12 8.5zm0 0c1.5-4.5 5.5-4.3 5.2-1.7C17 8.4 12 8.5 12 8.5z" /></svg>50 Fashion Goodies Giveaway</p>
<Link className="pill pill--ghost pill--sm" href="/join/">Join the Event{" "}<svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
</article><article className="h-card" aria-label="Beauty Essentials Live Showcase by Glowra Beauty">
<div className="h-card__top"><span className="h-badge">Upcoming</span><span className="h-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>Mar 12</span></div>
<div className="h-card__art"><svg viewBox="0 0 220 150" aria-hidden="true"><defs>
<linearGradient id="bt-a" x1="0" x2="1"><stop offset="0" stopColor="#ffb3d3" /><stop offset=".5" stopColor="#ff7fb0" /><stop offset="1" stopColor="#c94d80" /></linearGradient>
<linearGradient id="bt-b" x1="0" x2="1"><stop offset="0" stopColor="#ffd0e3" /><stop offset="1" stopColor="#e888ae" /></linearGradient>
<filter id="bt-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter></defs>
<ellipse cx="118" cy="144" rx="90" ry="6" fill="#ff7fb0" opacity=".35" filter="url(#bt-glow)" />
<rect x="138" y="14" width="8" height="14" rx="2" fill="#d65c8e" /><rect x="144" y="16" width="20" height="5" rx="2" fill="#d65c8e" />
<rect x="132" y="26" width="20" height="22" rx="3" fill="#e57aa6" />
<rect x="120" y="46" width="44" height="98" rx="9" fill="url(#bt-a)" />
<rect x="126" y="52" width="6" height="84" rx="3" fill="#fff" opacity=".35" />
<text x="142" y="98" textAnchor="middle" fontSize="7" fontWeight="700" fill="#8a2a55" letterSpacing="1">GLOWRA</text>
<rect x="174" y="66" width="18" height="18" rx="3" fill="#d65c8e" />
<rect x="170" y="82" width="28" height="62" rx="6" fill="url(#bt-b)" />
<rect x="36" y="94" width="86" height="16" rx="5" fill="#f6b3cd" />
<rect x="40" y="108" width="78" height="36" rx="7" fill="url(#bt-b)" />
<rect x="44" y="112" width="5" height="28" rx="2.5" fill="#fff" opacity=".4" />
<text x="79" y="129" textAnchor="middle" fontSize="7" fontWeight="700" fill="#8a2a55" letterSpacing="1">GLOWRA</text>
</svg></div>
<p className="h-card__brand"><i className="h-blogo h-blogo--pink"><svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><circle cx="12.0" cy="7.8" r="3.6" /><circle cx="16.0" cy="10.7" r="3.6" /><circle cx="14.5" cy="15.4" r="3.6" /><circle cx="9.5" cy="15.4" r="3.6" /><circle cx="8.0" cy="10.7" r="3.6" /><circle cx="12" cy="12" r="2.4" fill="#ff7fb0" /></svg></i>Glowra Beauty</p>
<h3>Beauty Essentials Live Showcase</h3>
<p className="h-card__prize"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" /><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.2 6.8 6.8 7 8.4 12 8.5 12 8.5zm0 0c1.5-4.5 5.5-4.3 5.2-1.7C17 8.4 12 8.5 12 8.5z" /></svg>100 Beauty Hampers Giveaway</p>
<Link className="pill pill--ghost pill--sm" href="/join/">Join the Event{" "}<svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
</article></div>
<div className="h-dots" data-dots=""><button type="button" aria-label="Show event 1" aria-current="true" /><button type="button" aria-label="Show event 2" /><button type="button" aria-label="Show event 3" /></div>
<p className="h-note">Example events for illustration. Brands shown are not partners.</p>
</div>
</div>
</section>
<section className="wrap" aria-labelledby="give-h">
<div className="h-panel h-feats">
<div className="h-feats__head">
<h2 id="give-h">Every Event Comes with{" "}<span className="g-lime">Guaranteed</span>{" "}<span className="g-violet">Giveaways</span></h2>
<p>Join exciting online events from top brands and get your chance to win real prizes, always!</p>
</div>
<ul className="h-feats__list">
<li><span className="h-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" /><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.2 6.8 6.8 7 8.4 12 8.5 12 8.5zm0 0c1.5-4.5 5.5-4.3 5.2-1.7C17 8.4 12 8.5 12 8.5z" /></svg></span><b>Guaranteed Giveaways</b><span>Real prizes in every event</span></li>
<li><span className="h-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" /></svg></span><b>100% Free to Join</b><span>No entry fee, no hidden cost</span></li>
<li><span className="h-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5.5 3.5-5.5 3.5z" /></svg></span><b>Live &amp; Interactive Events</b><span>Product launches, Q&amp;A and more</span></li>
</ul>
</div>
</section>
<section className="wrap" aria-labelledby="prem-h">
<div className="h-panel h-prem">
<div className="h-prem__crown"><svg className="h-crown" viewBox="0 0 260 200" role="img" aria-label="2-Year Premium crown"><defs>
<linearGradient id="cr-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a3" /><stop offset=".45" stopColor="#f6b93b" /><stop offset="1" stopColor="#c7781a" /></linearGradient>
<linearGradient id="cr-ped" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1d45" /><stop offset="1" stopColor="#140d24" /></linearGradient>
<filter id="cr-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter></defs>
<g fill="#8b5cff" opacity=".9"><ellipse cx="50.3" cy="64.0" rx="11" ry="4.6" transform="rotate(-35.0 50.3 64.0)" /><ellipse cx="43.0" cy="80.0" rx="11" ry="4.6" transform="rotate(-46.0 43.0 80.0)" /><ellipse cx="38.9" cy="97.2" rx="11" ry="4.6" transform="rotate(-57.0 38.9 97.2)" /><ellipse cx="38.1" cy="114.8" rx="11" ry="4.6" transform="rotate(-68.0 38.1 114.8)" /><ellipse cx="40.7" cy="132.3" rx="11" ry="4.6" transform="rotate(-79.0 40.7 132.3)" /><ellipse cx="46.6" cy="148.9" rx="11" ry="4.6" transform="rotate(-90.0 46.6 148.9)" /><ellipse cx="55.6" cy="164.1" rx="11" ry="4.6" transform="rotate(-101.0 55.6 164.1)" /><ellipse cx="67.3" cy="177.3" rx="11" ry="4.6" transform="rotate(-112.0 67.3 177.3)" /><ellipse cx="81.2" cy="188.0" rx="11" ry="4.6" transform="rotate(-123.0 81.2 188.0)" /><ellipse cx="209.7" cy="64.0" rx="11" ry="4.6" transform="rotate(-145.0 209.7 64.0)" /><ellipse cx="217.0" cy="80.0" rx="11" ry="4.6" transform="rotate(-134.0 217.0 80.0)" /><ellipse cx="221.1" cy="97.2" rx="11" ry="4.6" transform="rotate(-123.0 221.1 97.2)" /><ellipse cx="221.9" cy="114.8" rx="11" ry="4.6" transform="rotate(-112.0 221.9 114.8)" /><ellipse cx="219.3" cy="132.3" rx="11" ry="4.6" transform="rotate(-101.0 219.3 132.3)" /><ellipse cx="213.4" cy="148.9" rx="11" ry="4.6" transform="rotate(-90.0 213.4 148.9)" /><ellipse cx="204.4" cy="164.1" rx="11" ry="4.6" transform="rotate(-79.0 204.4 164.1)" /><ellipse cx="192.7" cy="177.3" rx="11" ry="4.6" transform="rotate(-68.0 192.7 177.3)" /><ellipse cx="178.8" cy="188.0" rx="11" ry="4.6" transform="rotate(-57.0 178.8 188.0)" /></g>
<ellipse cx="130" cy="72" rx="58" ry="34" fill="#f6b93b" opacity=".25" filter="url(#cr-glow)" />
<path d="M82 104 74 50l30 26 26-44 26 44 30-26-8 54z" fill="url(#cr-gold)" stroke="#a8601a" strokeWidth="1" />
<rect x="80" y="100" width="100" height="16" rx="4" fill="url(#cr-gold)" stroke="#a8601a" strokeWidth="1" />
<circle cx="74" cy="48" r="6" fill="url(#cr-gold)" /><circle cx="130" cy="30" r="7" fill="url(#cr-gold)" /><circle cx="186" cy="48" r="6" fill="url(#cr-gold)" />
<circle cx="130" cy="82" r="7" fill="#9b5cff" stroke="#fff3c4" strokeWidth="1.5" /><circle cx="104" cy="90" r="4.5" fill="#9b5cff" /><circle cx="156" cy="90" r="4.5" fill="#9b5cff" />
<ellipse cx="130" cy="186" rx="112" ry="9" fill="#8b5cff" opacity=".7" filter="url(#cr-glow)" />
<path d="M54 126h152l-10 54H64z" fill="url(#cr-ped)" stroke="#5b3fa0" strokeWidth="1.2" />
<ellipse cx="130" cy="126" rx="76" ry="7" fill="#33245a" stroke="#7c5cd6" strokeWidth="1" />
<path d="M64 180h132" stroke="#c9a8ff" strokeWidth="2.2" strokeLinecap="round" />
<text x="130" y="152" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff" letterSpacing="1">PREMIUM</text>
<text x="130" y="169" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#d9ccff" letterSpacing="3.5">2 YEARS</text>
</svg></div>
<div className="h-prem__copy">
<p className="h-offer"><span aria-hidden="true">🎉</span>Founding Members Offer</p>
<h2 id="prem-h">First 10,000 Waitlist Spots Get{" "}<span className="g-violet">2 Years of Premium Membership</span></h2>
<p>Be early, unlock 2 years of premium benefits for free, and get higher chances to win in every event.</p>
</div>
<ul className="h-prem__list">
<li><span className="h-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" /><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.2 6.8 6.8 7 8.4 12 8.5 12 8.5zm0 0c1.5-4.5 5.5-4.3 5.2-1.7C17 8.4 12 8.5 12 8.5z" /></svg></span><div><b>Higher Chances to Win</b><span>50% of every giveaway is reserved for Premium users (50% for normal users)</span></div></li>
<li><span className="h-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg></span><div><b>Early Access to Big Events</b><span>Be the first to join exclusive events from top &amp; premium brands</span></div></li>
<li><span className="h-tile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.5 4h11L21 9l-9 11L3 9z" /><path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5" /></svg></span><div><b>Specialised Premium Events</b><span>Access to curated events, workshops and brand sessions only for Premium users</span></div></li>
</ul>
<Link className="pill pill--lime h-prem__cta" href="/join/">Get 2 Years of Premium Free{" "}<svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
</div>
</section>
<section className="h-cd" aria-labelledby="cd-h">
<div className="wrap">
<h2 id="cd-h">We are{" "}<span className="g-violet">going live</span>{" "}in</h2>
<div className="h-cd__row"><svg className="h-spark" viewBox="0 0 40 50" aria-hidden="true"><path d="M8 8l14 12M4 26h20M8 44l14-10" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg><div className="h-cd__boxes" data-countdown="" role="timer" aria-label="Time until Turne launches"><div className="h-cd__box"><Cd as="b" k="d" /><span>Days</span></div><i className="h-cd__sep" aria-hidden="true">:</i><div className="h-cd__box"><Cd as="b" k="h" /><span>Hrs</span></div><i className="h-cd__sep" aria-hidden="true">:</i><div className="h-cd__box"><Cd as="b" k="m" /><span>Min</span></div><i className="h-cd__sep" aria-hidden="true">:</i><div className="h-cd__box"><Cd as="b" k="s" /><span>Sec</span></div></div><span className="h-spark--r"><svg className="h-spark" viewBox="0 0 40 50" aria-hidden="true"><path d="M8 8l14 12M4 26h20M8 44l14-10" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg></span></div>
<Link className="pill pill--lime pill--lg" href="/join/">Join the Waitlist{" "}<svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
</div>
</section>
<section className="h-faq" aria-labelledby="faq-h">
<div className="wrap h-faq__grid">
<div>
<p className="h-kicker">08 / Quick answers</p>
<h2 id="faq-h">The{" "}<span className="g-violet">Details.</span></h2>
</div>
<div className="h-faq__list"><details open><summary>What is Turne?<i aria-hidden="true" /></summary><p>Turne is a digital event and brand engagement platform where you discover events, participate in experiences, enter giveaways and connect with brands.</p></details><details><summary>When is Turne launching?<i aria-hidden="true" /></summary><p>Turne is preparing for launch. The countdown on this page shows the planned launch timeline. Join the waitlist and you'll be first through the door.</p></details><details><summary>What do I get for joining?<i aria-hidden="true" /></summary><p>The first 10,000 waitlist spots get 2 years of Premium membership, free from launch day.</p></details><details><summary>What is Premium?<i aria-hidden="true" /></summary><p>Premium is Turne's membership experience: additional benefits and access to selected opportunities. Premium benefits may evolve as Turne launches.</p></details><details><summary>Do Premium members automatically win giveaways?<i aria-hidden="true" /></summary><p>No. Premium does not guarantee winning. It provides access to the Premium allocation, a dedicated 50% share, of selected giveaway opportunities.</p></details></div>
</div>
</section>
</div>
    </>
  );
}
