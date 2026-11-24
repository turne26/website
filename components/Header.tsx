"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works/", label: "How it Works" },
  { href: "/premium/", label: "Premium" },
  { href: "/faq/", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const cur = (href: string) => (pathname === href || pathname + "/" === href ? "page" : undefined);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap">
          <Logo />
          <button ref={btn} className="menu-btn" type="button" aria-expanded={open} aria-controls="site-nav"
            aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span></span><span></span><span></span>
          </button>
          <nav className={"nav" + (open ? " is-open" : "")} id="site-nav" aria-label="Main">
            <div className="nav-links">
              {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={cur(n.href)}>{n.label}</Link>)}
            </div>
            <Link className="pill pill--outline header-cta" href="/join/" aria-current={cur("/join/")}>Join the Waitlist</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
