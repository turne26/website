"use client";
/*
 * Mobile "Join the waitlist" bar. Appears once the hero has scrolled away and hides while a
 * [data-hide-sticky] section (closer, forms, footer) is on screen. Pages that already are the
 * call to action (join, brands, contact, 404) leave it out.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const HIDDEN_ON = new Set(["/join/", "/brands/", "/brands/register/", "/contact/"]);

export function StickyJoin() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [off, setOff] = useState(false);

  useEffect(() => {
    const path = pathname.endsWith("/") ? pathname : pathname + "/";
    const noSticky = HIDDEN_ON.has(path) || !!document.querySelector("[data-no-sticky]");
    setOff(noSticky);
    setVisible(false);
    if (noSticky || !("IntersectionObserver" in window)) return;
    document.body.classList.add("has-sticky");
    let heroGone = false, blocked = 0;
    const update = () => setVisible(heroGone && blocked === 0);
    const observers: IntersectionObserver[] = [];
    const hero = document.querySelector("[data-hero]");
    if (hero) {
      const o = new IntersectionObserver((es) => { heroGone = !es[0].isIntersecting; update(); });
      o.observe(hero); observers.push(o);
    } else heroGone = true;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { blocked += e.isIntersecting ? 1 : (blocked > 0 ? -1 : 0); });
      update();
    });
    document.querySelectorAll("[data-hide-sticky]").forEach((b) => io.observe(b));
    observers.push(io);
    update();
    return () => { observers.forEach((o) => o.disconnect()); document.body.classList.remove("has-sticky"); };
  }, [pathname]);

  if (off) return null;
  return (
    <div ref={ref} className={"sticky-join" + (visible ? " is-visible" : "")} role="region" aria-label="Join the waitlist">
      <Link className="btn btn--ticket btn--block" href="/join/">Join the waitlist</Link>
    </div>
  );
}
