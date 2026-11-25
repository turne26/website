/* The /brands/ landing page. SEO data (title, description, FAQ) lives in lib/pages.ts. */
import Link from "next/link";
import { AudienceNote } from "@/components/brands/AudienceNote";
import { PAGES } from "@/lib/pages";
import { BRANDS_EMAIL } from "@/lib/brands";

const FAQ = PAGES.brands.faq;

const ARROW = (
  <svg className="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const icon = (d: string) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
);
const ICONS = {
  calendar: '<rect x="4" y="6" width="24" height="22" rx="3"/><path d="M4 12h24M10 3v6M22 3v6"/>',
  rooms: '<rect x="4" y="5" width="10" height="10" rx="2"/><rect x="18" y="5" width="10" height="10" rx="2"/><rect x="4" y="19" width="10" height="9" rx="2"/><rect x="18" y="19" width="10" height="9" rx="2"/>',
  ticket: '<path d="M4 9h24v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6z"/><path d="M20 9v14" stroke-dasharray="2 2"/>',
  gift: '<rect x="5" y="12" width="22" height="16"/><path d="M3 8h26v4H3zM16 8v20M16 8c-2-5-8-5-8-1s8 1 8 1zm0 0c2-5 8-5 8-1s-8 1-8 1z"/>',
  chart: '<path d="M4 28h24M8 24V14M14 24V8M20 24v-7M26 24V11"/>',
  people: '<circle cx="11" cy="11" r="4"/><circle cx="22" cy="13" r="3"/><path d="M3 26c1-5 4-7 8-7s7 2 8 7M19 26c.5-3 2-5 4.5-5S28 23 29 26"/>',
};

const FEATURES: [keyof typeof ICONS, string, string][] = [
  ["calendar", "Create events", "Demo days, launches and festivals, set up from your phone."],
  ["rooms", "Open startup rooms", "Give every startup its own room with a demo, chat and Q&A."],
  ["ticket", "Manage registrations", "See who signed up and who turned up."],
  ["gift", "A giveaway in every event", "Every event runs a free-to-enter giveaway with clear rules and a fair draw."],
  ["chart", "Measure participation", "See who joined, which rooms they visited and who came back."],
  ["people", "Build community", "Turn one-off attendees into people who follow you."],
];

const STEPS: [string, string][] = [
  ["Register", "Two minutes. Verify your number on WhatsApp and tell us what you'd like to run."],
  ["We get in touch", "Our brands team calls you or messages you on WhatsApp within two working days."],
  ["Plan together", "Shape your first event, rooms and giveaway with us."],
  ["Go live", "Your event opens on Turne and people walk in."],
  ["Measure and grow", "See real participation, then keep the people who came."],
];

export default function BrandsContent() {
  return (
    <>

      <section className="page-hero b-hero" data-hero="" aria-labelledby="hero-h">
        <div className="wrap hero-grid">
          <div>
            <p className="b-eyebrow">Turne for Brands</p>
            <h1 id="hero-h">Don&apos;t just reach people. <span className="hl-v">Get them to show up.</span></h1>
            <p className="lede">Turne is India&apos;s participation-first event platform. Host online events, give every startup its own room, run a giveaway people trust in every event, and finally see who actually took part.</p>
            <div className="cta-row">
              <Link className="btn btn--ticket" href="/brands/register/">Register your brand {ARROW}</Link>
              <a className="btn btn--ghost" href="#features">See what you can run</a>
            </div>
            <AudienceNote />
          </div>
          <figure style={{ margin: 0 }}>
            <div className="b-report" role="img" aria-label="Example event report on Turne: 2,140 registered, 1,612 joined, 980 giveaway entries">
              <div className="b-report__head">
                <div><small>Event report · example</small><b>Headphone Launch Live</b></div>
                <span className="b-live">LIVE</span>
              </div>
              <dl className="b-kpis">
                <div><dt>Registered</dt><dd>2,140</dd></div>
                <div><dt>Joined</dt><dd className="up">1,612</dd></div>
                <div><dt>Entries</dt><dd>980</dd></div>
              </dl>
              <div className="b-funnel" aria-hidden="true">
                <div><span>Joined the event</span><i style={{ "--w": "75%" }} /><em>75%</em></div>
                <div><span>Visited a room</span><i style={{ "--w": "61%" }} /><em>61%</em></div>
                <div><span>Entered giveaway</span><i style={{ "--w": "46%" }} /><em>46%</em></div>
                <div><span>Followed you</span><i style={{ "--w": "32%" }} /><em>32%</em></div>
              </div>
              <div className="b-report__rooms" aria-hidden="true">
                <span># product-demo<b>812</b></span><span># q-and-a<b>544</b></span><span># giveaway<b>980</b></span>
              </div>
            </div>
            <figcaption className="fine b-caption">Illustrative example. Numbers and event are made up.</figcaption>
          </figure>
        </div>
      </section>

      <section className="band band--tight band--ink" id="features" aria-labelledby="caps-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="caps-h">What you can run on Turne</h2>
            <p className="lede">Everything a brand needs to turn an audience into participants.</p>
          </div>
          <ul className="prizes prizes--3 b-features">
            {FEATURES.map(([ic, title, text]) => (
              <li key={title}>{icon(ICONS[ic])}<b>{title}</b><span>{text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="vs-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="vs-h">Reach is not the same as participation</h2>
            <p className="lede">Social media gets brands to the audience. Turne gets the audience to participate.</p>
          </div>
          <div className="compare">
            <section className="today" aria-label="Today">
              <h3>Today</h3>
              <ol><li>Brand</li><li>Instagram</li><li>Content</li><li>Scroll</li><li>????</li></ol>
              <p>One-way. Hard to measure. Forgotten by tomorrow.</p>
            </section>
            <section className="turne" aria-label="With Turne">
              <h3>With Turne</h3>
              <ol><li>Discovery</li><li>Participation</li><li>Engagement</li><li>Reward</li><li>Retention</li></ol>
              <p>A loop people actually want to come back to.</p>
            </section>
          </div>
        </div>
      </section>

      <section className="band band--ink" id="how" aria-labelledby="how-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="how-h">From registration to your first event</h2>
            <p className="lede">No long forms, no sales maze. Register, and we take it from there with you.</p>
          </div>
          <ol className="loop">
            {STEPS.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}
          </ol>
          <div className="cta-row" style={{ marginTop: "2.5rem" }}>
            <Link className="btn btn--ticket" href="/brands/register/">Start registration {ARROW}</Link>
            <span className="small muted">Free, about two minutes, no commitment.</span>
          </div>
        </div>
      </section>

      <section className="band" id="faq" aria-labelledby="faq-h">
        <div className="wrap split split--wide-left" style={{ alignItems: "start" }}>
          <div>
            <h2 id="faq-h" style={{ fontSize: "clamp(2rem,4vw,2.75rem)", marginBottom: "1rem" }}>Questions brands ask</h2>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <div className="answer"><p>{a}</p></div>
                </details>
              ))}
            </div>
          </div>
          <aside className="panel stack">
            <h3>Rather talk first?</h3>
            <p className="muted">Write to us and a person from the brands team will reply within two working days.</p>
            <a className="textlink" href={`mailto:${BRANDS_EMAIL}`}>{BRANDS_EMAIL}</a>
          </aside>
        </div>
      </section>

      <section className="band closer" aria-labelledby="closer-h">
        <div className="wrap closer-grid">
          <div className="stack">
            <p className="meta">Be one of the first brands on Turne.</p>
            <h2 id="closer-h">Make your next event one people join.</h2>
          </div>
          <div className="stack">
            <p className="lede">Register now, and you&apos;ll be set up and ready before Turne launches.</p>
            <div className="cta-row"><Link className="btn btn--ticket" href="/brands/register/">Register your brand</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
