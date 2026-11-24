"use client";
/*
 * Live numbers: waitlist count, spots left, % claimed, the rolling tally, the Premium spot
 * grid and the launch countdown. One provider fetches GET /stats and every number reads it.
 * Pages render with config.fallbackStats on the server, then switch to the live figures.
 */
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type ElementType } from "react";
import { api } from "@/lib/api";
import { config } from "@/lib/config";

const fmt = new Intl.NumberFormat("en-IN");
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type StatsState = { count: number; limit: number; launchAt: string; live: number };
const StatsCtx = createContext<StatsState>({
  count: config.fallbackStats.waitlistCount,
  limit: config.premiumLimit,
  launchAt: config.launchAt,
  live: 0,
});
const NowCtx = createContext<number | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatsState>({
    count: config.fallbackStats.waitlistCount,
    limit: config.premiumLimit,
    launchAt: config.launchAt,
    live: 0,
  });
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api.getStats().then((s) => {
        if (!alive) return;
        setStats((prev) => ({
          count: Math.max(0, Number(s.waitlistCount) || 0),
          limit: Number(s.premiumLimit) || config.premiumLimit,
          launchAt: s.launchAt || prev.launchAt,
          live: prev.live + 1,
        }));
      }).catch(() => { /* keep the numbers we have */ });
    load();
    const poll = config.statsRefreshMs
      ? setInterval(() => { if (!document.hidden) load(); }, config.statsRefreshMs)
      : undefined;
    window.addEventListener("turne:stats-refresh", load);
    return () => { alive = false; clearInterval(poll); window.removeEventListener("turne:stats-refresh", load); };
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <StatsCtx.Provider value={stats}>
      <NowCtx.Provider value={now}>{children}</NowCtx.Provider>
    </StatsCtx.Provider>
  );
}

export function useStats() {
  const s = useContext(StatsCtx);
  return useMemo(() => {
    const remaining = Math.max(0, s.limit - s.count);
    return {
      ...s,
      remaining,
      values: {
        count: fmt.format(s.count),
        next: fmt.format(s.count + 1),
        remaining: fmt.format(remaining),
        limit: fmt.format(s.limit),
        percent: Math.min(100, (s.count / s.limit) * 100).toFixed(2) + "%",
      },
    };
  }, [s]);
}

type StatKey = "count" | "next" | "remaining" | "limit" | "percent";

/** One live number, e.g. <Stat k="remaining" />. */
export function Stat({ k, className = "num", ...rest }: { k: string } & ComponentPropsWithoutRef<"span">) {
  const { values } = useStats();
  return <span className={className} data-stat={k} {...rest}>{values[k as StatKey]}</span>;
}

/** The odometer-style waitlist counter. Rolls up from 0 the first time live numbers arrive. */
export function Tally({ className = "tally", ...rest }: ComponentPropsWithoutRef<"div">) {
  const { count, live } = useStats();
  const ref = useRef<HTMLDivElement>(null);
  const text = fmt.format(count);

  useIsoLayoutEffect(() => {
    const reels = Array.from(ref.current?.querySelectorAll<HTMLElement>(".tally__reel") ?? []);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const animate = live === 1 && !reduce;
    reels.forEach((reel, i) => {
      const target = `translateY(-${Number(reel.dataset.d) * 10}%)`;
      if (!animate) { reel.style.transition = "none"; reel.style.transform = target; return; }
      reel.style.transition = "none";
      reel.style.transform = "translateY(0)";
      reel.getBoundingClientRect();
      reel.style.transition = "";
      reel.style.transitionDelay = `${i * 0.12}s`;
      reel.style.transform = target;
    });
  }, [text, live]);

  return (
    <div ref={ref} className={className} {...rest} aria-label={`${text} people on the waitlist`}>
      {text.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="tally__digit" aria-hidden="true">
            <span className="tally__reel" data-d={ch} style={{ transform: `translateY(-${Number(ch) * 10}%)`, transition: "none" }}>
              {Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}
            </span>
          </span>
        ) : (
          <span key={i} className="tally__sep" aria-hidden="true">{ch}</span>
        ),
      )}
    </div>
  );
}

/** The grid of Premium spot blocks; each block is limit/cells spots. */
export function Ticks({ cells = 50, className = "ticks", ...rest }: { cells?: number } & ComponentPropsWithoutRef<"div">) {
  const { count, limit } = useStats();
  const on = Math.min(cells, Math.ceil(count / (limit / cells)));
  return (
    <div className={className} {...rest} aria-label={`${fmt.format(count)} of ${fmt.format(limit)} 2-Year Premium spots claimed`}>
      {Array.from({ length: cells }, (_, i) => <i key={i} className={i < on ? "on" : ""} />)}
    </div>
  );
}

/** One countdown unit: d, h, m or s. Shows "--" until the page is running in the browser. */
export function Cd<T extends ElementType = "b">({ as, k, ...rest }: { as?: T; k: "d" | "h" | "m" | "s" | string } & ComponentPropsWithoutRef<T>) {
  const now = useContext(NowCtx);
  const { launchAt } = useContext(StatsCtx);
  const Tag = (as || "b") as ElementType;
  let text = "--";
  const target = Date.parse(launchAt);
  if (now !== null && !Number.isNaN(target)) {
    const s = Math.floor(Math.max(0, target - now) / 1000);
    const pad = (n: number) => (n < 10 ? "0" + n : String(n));
    text = k === "d" ? String(Math.floor(s / 86400))
      : k === "h" ? pad(Math.floor((s % 86400) / 3600))
        : k === "m" ? pad(Math.floor((s % 3600) / 60))
          : pad(s % 60);
  }
  return <Tag data-cd={k} {...rest}>{text}</Tag>;
}
