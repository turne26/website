import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { RegisterForm } from "@/components/brands/RegisterForm";
import { pageMetadata } from "@/lib/seo";
import { BRANDS_EMAIL } from "@/lib/brands";
import "../brands.css";

export const metadata = pageMetadata("brands-register");

const CHECK = (
  <svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8.5 14.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function Page() {
  return (
    <>
      <JsonLd page={"brands-register"} />
      <section className="band" style={{ paddingTop: "clamp(2.5rem,6vw,4.5rem)" }}>
        <div className="wrap b-register">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/brands/">For brands</Link><span aria-hidden="true">/</span><span aria-current="page">Register</span></nav>
            <h1>Register your brand on Turne.</h1>
            <p className="lede" style={{ marginTop: "1.25rem" }}>About two minutes. Tell us who you are and what you&apos;d like to run, and we&apos;ll plan your first event with you.</p>
            <ul className="b-perks">
              <li>{CHECK}<div><b>Free, no commitment</b><span>Registering doesn&apos;t sign you up for anything.</span></div></li>
              <li>{CHECK}<div><b>Verified on WhatsApp</b><span>A quick 6-digit code, so we know we can reach you.</span></div></li>
              <li>{CHECK}<div><b>A real person replies</b><span>Our brands team gets in touch within two working days.</span></div></li>
            </ul>
            <p className="muted small" style={{ marginTop: "2rem" }}>Questions? <a className="textlink" href={`mailto:${BRANDS_EMAIL}`}>{BRANDS_EMAIL}</a></p>
          </div>
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
