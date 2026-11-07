/* Turne — shared page behaviour: menu, live stats, tally counter, countdown, attribution. */
(function () {
  "use strict";
  var cfg = window.TURNE_CONFIG || {};
  var LIMIT = cfg.premiumLimit || 10000;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.NumberFormat("en-IN");

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(kind) { try { return window[kind]; } catch (e) { return null; } }

  /* ---------- mobile menu ---------- */
  var menuBtn = $(".menu-btn"), nav = $("#site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Open menu"); menuBtn.focus(); }
    });
  }

  /* ---------- attribution: keep UTM + referral code for the signup ---------- */
  (function captureAttribution() {
    var ss = store("sessionStorage"); if (!ss) return;
    var params = new URLSearchParams(location.search), found = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"].forEach(function (k) {
      var v = params.get(k); if (v) found[k] = v.slice(0, 120);
    });
    if (!Object.keys(found).length) return;
    try {
      var prev = JSON.parse(ss.getItem("turne_attr") || "{}");
      ss.setItem("turne_attr", JSON.stringify(Object.assign(prev, found, { landing: location.pathname })));
    } catch (e) {}
  })();
  window.TurneAttribution = function () {
    var ss = store("sessionStorage"); if (!ss) return {};
    try { return JSON.parse(ss.getItem("turne_attr") || "{}"); } catch (e) { return {}; }
  };

  /* ---------- tally counter ---------- */
  function buildTally(el, value, animate) {
    var s = fmt.format(value);
    el.setAttribute("aria-label", s + " people on the waitlist");
    el.innerHTML = "";
    var reels = [];
    s.split("").forEach(function (ch) {
      if (!/\d/.test(ch)) {
        var sep = document.createElement("span"); sep.className = "tally__sep"; sep.setAttribute("aria-hidden", "true"); sep.textContent = ch; el.appendChild(sep); return;
      }
      var d = document.createElement("span"); d.className = "tally__digit"; d.setAttribute("aria-hidden", "true");
      var reel = document.createElement("span"); reel.className = "tally__reel";
      for (var i = 0; i < 10; i++) { var n = document.createElement("span"); n.textContent = i; reel.appendChild(n); }
      d.appendChild(reel); el.appendChild(d);
      reels.push([reel, +ch]);
    });
    reels.forEach(function (r, i) {
      var target = "translateY(-" + r[1] * 10 + "%)";
      if (!animate || reduceMotion) { r[0].style.transition = "none"; r[0].style.transform = target; return; }
      r[0].style.transition = "none"; r[0].style.transform = "translateY(0)";
      r[0].getBoundingClientRect();
      r[0].style.transition = "";
      r[0].style.transitionDelay = (i * 0.12) + "s";
      r[0].style.transform = target;
    });
  }

  function buildTicks(el, value) {
    var cells = +(el.getAttribute("data-cells") || 50), per = LIMIT / cells;
    var on = Math.min(cells, Math.ceil(value / per));
    if (!el.children.length) { for (var i = 0; i < cells; i++) el.appendChild(document.createElement("i")); }
    $all("i", el).forEach(function (c, i) { c.className = i < on ? "on" : ""; });
    el.setAttribute("aria-label", fmt.format(value) + " of " + fmt.format(LIMIT) + " Lifetime Premium spots claimed");
  }

  /* ---------- live stats ---------- */
  var lastCount = null;
  function applyStats(stats, first) {
    var count = Math.max(0, +stats.waitlistCount || 0);
    var limit = +stats.premiumLimit || LIMIT;
    var remaining = Math.max(0, limit - count);
    var values = {
      count: fmt.format(count),
      next: fmt.format(count + 1),
      remaining: fmt.format(remaining),
      limit: fmt.format(limit),
      percent: (Math.min(100, (count / limit) * 100)).toFixed(2) + "%"
    };
    $all("[data-stat]").forEach(function (el) { var k = el.getAttribute("data-stat"); if (k in values) el.textContent = values[k]; });
    $all("[data-tally]").forEach(function (el) { if (lastCount !== count) buildTally(el, count, first); });
    $all("[data-ticks]").forEach(function (el) { buildTicks(el, count); });
    $all("[data-when-full]").forEach(function (el) { el.hidden = remaining > 0; });
    $all("[data-when-open]").forEach(function (el) { el.hidden = remaining <= 0; });
    if (stats.launchAt) startCountdown(stats.launchAt);
    lastCount = count;
  }

  /* ---------- countdown ---------- */
  var cdTimer = null, cdTarget = null;
  function startCountdown(iso) {
    var t = Date.parse(iso); if (isNaN(t) || t === cdTarget) return;
    cdTarget = t;
    var boxes = $all("[data-countdown]"); if (!boxes.length) return;
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    function tick() {
      var diff = Math.max(0, cdTarget - Date.now());
      var s = Math.floor(diff / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
      boxes.forEach(function (box) {
        box.querySelector("[data-cd=d]").textContent = d;
        box.querySelector("[data-cd=h]").textContent = pad(h);
        box.querySelector("[data-cd=m]").textContent = pad(m);
        box.querySelector("[data-cd=s]").textContent = pad(sec);
      });
      if (diff <= 0 && cdTimer) { clearInterval(cdTimer); cdTimer = null; }
    }
    tick();
    if (cdTimer) clearInterval(cdTimer);
    cdTimer = setInterval(tick, 1000);
  }

  function loadStats(first) {
    if (!window.TurneAPI) return;
    window.TurneAPI.getStats().then(function (s) { applyStats(s, first); }).catch(function () { /* keep fallback numbers */ });
  }

  applyStats({ waitlistCount: (cfg.fallbackStats || {}).waitlistCount || 0, premiumLimit: LIMIT, launchAt: cfg.launchAt }, false);
  // Roll the tally once on load, from 0 to the live number.
  lastCount = null;
  loadStats(true);
  if (cfg.statsRefreshMs) setInterval(function () { if (!document.hidden) loadStats(false); }, cfg.statsRefreshMs);
  window.TurneStats = { refresh: function () { loadStats(false); } };

  /* ---------- mobile sticky join bar ---------- */
  var sticky = $(".sticky-join");
  if (sticky && "IntersectionObserver" in window) {
    document.body.classList.add("has-sticky");
    var hero = $("[data-hero]"), blockers = $all("[data-hide-sticky]"), heroGone = false, blocked = 0;
    function update() { sticky.classList.toggle("is-visible", heroGone && blocked === 0); }
    if (hero) new IntersectionObserver(function (es) { heroGone = !es[0].isIntersecting; update(); }).observe(hero); else heroGone = true;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { blocked += e.isIntersecting ? 1 : (blocked > 0 ? -1 : 0); }); update(); });
    blockers.forEach(function (b) { io.observe(b); });
    update();
  }
  /* ---------- home event-card carousel (mobile) ---------- */
  $all("[data-carousel]").forEach(function (track) {
    var dots = $all("button", track.parentNode.querySelector("[data-dots]") || document.createElement("div"));
    var cards = Array.prototype.slice.call(track.children);
    function current() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bestD = Infinity;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      return best;
    }
    function mark() { var i = current(); dots.forEach(function (d, j) { if (i === j) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); }); }
    var raf = 0;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () {
        var c = cards[i]; if (!c) return;
        track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  });
})();
