import Link from "next/link";
import { Logo } from "./Logo";
import { COMPANY } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="site-footer" data-hide-sticky="">
      <div className="wrap foot">
        <div className="foot__brand"><Logo /><p>Discover Events. Win Giveaways. Connect with Brands.</p></div>
        <a className="foot__mail" href="mailto:support@turne.in">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
          support@turne.in
        </a>
        <nav className="foot__legal" aria-label="Legal"><Link href="/privacy/">Privacy Policy</Link><Link href="/terms/">Terms of Use</Link></nav>
      </div>
      <div className="wrap foot__company"><p>Turne is a product of <strong>{COMPANY}</strong></p></div>
    </footer>
  );
}
