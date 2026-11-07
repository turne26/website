/* Turne — 3D explainer. A phone plays one Turne event in five 5-second scenes:
   a brand hosts it, startups get rooms, you explore, you take part, you win.
   Every frame is a pure function of time t, so the site plays it live and the
   video renderer (src/make_video.py) can seek to any frame. */
(function () {
  "use strict";
  var root = document.querySelector("[data-explainer]");
  if (!root) return;

  var SCENE = 5, N = 5, T = SCENE * N;
  var FILM = root.classList.contains("explainer--film");
  var reduce = !FILM && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.NumberFormat("en-IN");

  /* ---------- easing ---------- */
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function ease(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function out(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
  function backOut(x) { x = clamp(x, 0, 1); var c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function r(u, a, b) { return ease((u - a) / (b - a)); }
  function ro(u, a, b) { return out((u - a) / (b - a)); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function bump(u, a, b) { if (u <= a || u >= b) return 0; return Math.sin(Math.PI * (u - a) / (b - a)); }
  function px(n) { return n.toFixed(2) + "px"; }

  /* ---------- elements ---------- */
  function q(s) { return root.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(root.querySelectorAll(s)); }
  function scr(i) { return screens[i]; }
  var phone = q(".ex-phone"), shadow = q(".ex-shadow");
  var screens = qa(".ex-scr");
  var steps = qa(".ex-step"), bars = qa(".ex-step .ex-bar i"), caption = q(".ex-caption");
  // 0 host
  var typed = q(".ex-typed"), caret = q(".ex-caret"), roomsN = q(".ex-roomsn"), dots = qa(".ex-dots i");
  var tog = q(".ex-tog"), togKnob = q(".ex-tog i"), publish = q(".ex-publish"), pass = q(".ex-ticket");
  var NAME = "Founders Fest '26";
  // 1 showcase
  var rooms = qa(".ex-room"), target = q(".ex-room--target"), inside = q(".ex-inside"), floats = qa(".ex-float");
  // 2 explore
  var msgs = qa(".ex-msg"), appBars = qa(".ex-app i"), qaTab = q(".ex-qatab");
  var dotsLive = qa(".ex-dot");
  // 3 participate
  var s3 = scr(3);
  var optA = s3.querySelector(".ex-opt--a"), optB = s3.querySelector(".ex-opt--b");
  var upQ = s3.querySelector(".ex-up--q"), qn = s3.querySelector(".ex-qn");
  var upvote = s3.querySelector(".ex-upvote"), rankN = s3.querySelector(".ex-rankn"), react = s3.querySelector(".ex-react");
  // 4 win
  var enter = q(".ex-enter"), entries = q(".ex-entries"), draw = q(".ex-draw"), marker = q(".ex-marker"), drawLabel = q(".ex-drawlabel");
  var win = q(".ex-win"), follow = q(".ex-follow"), notif = q(".ex-notif"), confetti = q(".ex-confetti");
  var tap = q(".ex-tap"), ripple = q(".ex-ripple");

  /* deterministic pseudo-random */
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  /* reactions that rise from the upvote button */
  var GLYPHS = ["▲", "♥", "✦", "▲", "★"];
  var COLORS = ["var(--lime)", "var(--violet)", "var(--paper)"];
  var reactions = [];
  for (var i = 0; i < 14; i++) {
    var s = document.createElement("span");
    s.textContent = GLYPHS[i % GLYPHS.length];
    s.style.color = COLORS[i % COLORS.length];
    s.style.left = (20 + rnd() * 160) + "px";
    react.appendChild(s);
    reactions.push({ el: s, at: 3.15 + i * 0.1, sway: rnd() * 6, size: .7 + rnd() * .6 });
  }

  /* confetti bursting out of the phone in 3D */
  var bits = [], CONF = ["#c6ff3d", "#8b6cff", "#f3f2f8", "#c6ff3d", "#6a45ff"];
  for (var j = 0; j < 48; j++) {
    var c = document.createElement("i");
    c.style.background = CONF[j % CONF.length];
    confetti.appendChild(c);
    var ang = rnd() * Math.PI * 2;
    bits.push({ el: c, vx: Math.cos(ang) * (90 + rnd() * 170), vy: -(260 + rnd() * 280), vz: 40 + rnd() * 260, spin: (rnd() - .5) * 1440, tilt: rnd() * 360, delay: rnd() * .12 });
  }

  /* where the room tiles float to, around the phone: [x, y, z] from its centre */
  var FLOAT_TO = [[-170, -170, 110], [175, -40, 150], [-160, 150, 120]];

  /* taps: which element is pressed when */
  var TAPS = [
    { k: 0, at: 2.8, el: tog }, { k: 0, at: 3.5, el: publish },
    { k: 1, at: 3.7, el: target },
    { k: 2, at: 3.95, el: qaTab },
    { k: 3, at: 0.7, el: optA }, { k: 3, at: 1.9, el: upQ }, { k: 3, at: 3.1, el: upvote },
    { k: 4, at: 0.6, el: enter }, { k: 4, at: 3.3, el: follow }
  ];
  function measure() {
    TAPS.forEach(function (tp) {
      var x = 0, y = 0, el = tp.el;
      while (el && !el.classList.contains("ex-scr")) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      tp.x = x + tp.el.offsetWidth / 2; tp.y = y + tp.el.offsetHeight / 2;
    });
    reactions.forEach(function (rc) { rc.el.style.top = (upvote.offsetTop - 6) + "px"; rc.el.style.bottom = "auto"; });
  }

  /* camera angle per scene: [rotateY, rotateX] */
  var ANGLES = [[-14, 6], [-20, 8], [-8, 5], [-16, 7], [-10, 6]];

  function swap(el, p) {
    el.querySelector(".a").style.opacity = 1 - p;
    el.querySelector(".b").style.opacity = p;
  }
  function press(el, u, at) { el.style.transform = "scale(" + (1 - .04 * bump(u, at - .12, at + .14)).toFixed(4) + ")"; }

  /* ---------- one frame ---------- */
  var lastStep = -1;
  function frame(t) {
    t = ((t % T) + T) % T;
    var k = Math.floor(t / SCENE), u = t - k * SCENE, nk = (k + 1) % N;
    var p = r(u, 4.4, 5.0);

    /* phone */
    var a = ANGLES[k], b = ANGLES[nk], cam = r(u, 4.2, 5.0);
    var fl = Math.sin(t * 2 * Math.PI / 5);
    phone.style.transform = "translate3d(0," + px(fl * 7) + ",0) rotateX(" + lerp(a[1], b[1], cam).toFixed(2) + "deg) rotateY(" + lerp(a[0], b[0], cam).toFixed(2) + "deg)";
    shadow.style.transform = "scaleX(" + (1 - fl * .05).toFixed(3) + ")";
    shadow.style.opacity = (.85 - fl * .1).toFixed(3);

    /* screens slide */
    screens.forEach(function (s, i) {
      if (i === k) { s.style.visibility = "visible"; s.style.transform = "translate3d(" + (-p * 100).toFixed(2) + "%,0,0)"; }
      else if (i === nk && p > 0) { s.style.visibility = "visible"; s.style.transform = "translate3d(" + ((1 - p) * 100).toFixed(2) + "%,0,0)"; }
      else s.style.visibility = "hidden";
    });
    function local(i) { return i === k ? u : 0; }
    var pulse = (.45 + .55 * Math.abs(Math.sin(t * Math.PI / 1.25))).toFixed(3);
    dotsLive.forEach(function (d) { d.style.setProperty("--pulse", pulse); });

    /* 0 · a brand hosts the event */
    var u0 = local(0);
    var chars = Math.floor(clamp((u0 - 0.3) / 1.1, 0, 1) * NAME.length);
    typed.textContent = NAME.slice(0, chars);
    caret.style.opacity = u0 > 1.7 ? 0 : (Math.floor(t * 2.4) % 2 === 0 || (u0 > .3 && u0 < 1.4) ? 1 : 0);
    var n = Math.round(24 * r(u0, 1.6, 2.6));
    roomsN.textContent = n;
    dots.forEach(function (d, i) { d.className = i < n ? "on" : ""; });
    var tg = r(u0, 2.85, 3.05);
    tog.style.background = tg > .5 ? "var(--lime)" : "var(--line)";
    togKnob.style.transform = "translateX(" + px(18 * tg) + ")";
    togKnob.style.background = tg > .5 ? "var(--night)" : "var(--paper)";
    swap(publish, r(u0, 3.52, 3.72)); press(publish, u0, 3.5);
    if (k === 0 && u0 > 3.7) {
      var f = backOut((u0 - 3.7) / 0.8), fo = r(u0, 4.45, 4.9);
      pass.style.opacity = (clamp((u0 - 3.7) / .15, 0, 1) * (1 - fo)).toFixed(3);
      pass.style.transform = "translate3d(" + px(lerp(0, 120, f)) + "," + px(lerp(150, -205, f)) + "," + px(lerp(0, 150, f)) + ") rotateZ(" + lerp(0, -8, f).toFixed(2) + "deg) rotateY(" + lerp(0, 16, f).toFixed(2) + "deg) scale(" + lerp(.5, 1, f).toFixed(3) + ")";
    } else pass.style.opacity = 0;

    /* 1 · every startup gets a room */
    var u1 = local(1);
    rooms.forEach(function (rm, i) {
      var e = ro(u1, 0.25 + i * 0.22, 0.65 + i * 0.22);
      rm.style.opacity = e.toFixed(3);
      rm.style.transform = "translate3d(" + px(lerp(28, 0, e)) + ",0,0) scale(" + (1 - (rm === target ? .03 * bump(u1, 3.58, 3.84) : 0)).toFixed(4) + ")";
    });
    target.style.setProperty("--ring", r(u1, 3.72, 3.9).toFixed(3));
    inside.textContent = fmt.format(Math.round(lerp(3380, 3446, clamp(u1 / 5, 0, 1))));
    floats.forEach(function (fe, i) {
      if (k !== 1) { fe.style.opacity = 0; return; }
      var st = 1.5 + i * 0.25, e = backOut((u1 - st) / .7), fo = r(u1, 4.0, 4.4), to = FLOAT_TO[i];
      var bob = Math.sin(t * 2 * Math.PI / 2.5 + i * 2) * 6;
      fe.style.opacity = (clamp((u1 - st) / .15, 0, 1) * (1 - fo)).toFixed(3);
      fe.style.transform = "translate(-50%,-50%) translate3d(" + px(lerp(0, to[0], e)) + "," + px(lerp(0, to[1], e) + bob) + "," + px(lerp(0, to[2], e)) + ") scale(" + lerp(.4, 1, e).toFixed(3) + ")";
    });

    /* 2 · walk into a room */
    var u2 = local(2);
    msgs.forEach(function (m, i) {
      var e = ro(u2, 0.5 + i * 0.8, 0.85 + i * 0.8);
      m.style.opacity = e.toFixed(3);
      m.style.transform = "translate3d(0," + px(lerp(10, 0, e)) + ",0)";
    });
    appBars.forEach(function (bar, i) { bar.style.height = (28 + 66 * Math.abs(Math.sin(t * 2 * Math.PI / 2.5 + i * .9))).toFixed(1) + "%"; });
    qaTab.style.background = u2 > 3.98 ? "var(--ink-2)" : "";
    qaTab.style.color = u2 > 3.98 ? "var(--paper)" : "";

    /* 3 · take part */
    var u3 = local(3);
    optA.style.setProperty("--sel", r(u3, 0.72, 0.9).toFixed(3)); press(optA, u3, 0.7);
    optA.querySelector("i").style.width = (r(u3, 0.8, 1.9) * 71).toFixed(2) + "%";
    optB.querySelector("i").style.width = (r(u3, 0.8, 1.9) * 29).toFixed(2) + "%";
    optA.querySelector("em").style.opacity = optB.querySelector("em").style.opacity = r(u3, 0.9, 1.2).toFixed(3);
    var upped = u3 >= 1.92;
    upQ.classList.toggle("is-on", upped); qn.textContent = upped ? "32" : "31"; press(upQ, u3, 1.9);
    swap(upvote, r(u3, 3.12, 3.3)); press(upvote, u3, 3.1);
    rankN.textContent = u3 >= 3.4 ? "#2" : "#3";
    rankN.style.color = u3 >= 3.4 ? "var(--lime)" : "";
    reactions.forEach(function (rc) {
      var age = u3 - rc.at;
      if (k !== 3 || age < 0 || age > 1.4) { rc.el.style.opacity = 0; return; }
      rc.el.style.opacity = Math.sin(Math.PI * age / 1.4).toFixed(3);
      rc.el.style.transform = "translate3d(" + px(Math.sin(age * 4 + rc.sway) * 9) + "," + px(-age * 120) + ",0) scale(" + rc.size.toFixed(2) + ")";
    });

    /* 4 · win, then follow */
    var u4 = local(4);
    swap(enter, r(u4, 0.62, 0.8)); press(enter, u4, 0.6);
    entries.textContent = u4 >= 0.7 ? "643" : "642";
    draw.style.opacity = r(u4, 1.0, 1.3).toFixed(3);
    var scan = r(u4, 1.2, 2.2);
    marker.style.left = (50 + 40 * Math.sin(scan * Math.PI * 3.2) * (1 - scan) - 22 * scan).toFixed(2) + "%";
    drawLabel.textContent = u4 >= 2.2 ? "Winner drawn" : "Drawing winners";
    win.style.transform = "translate3d(0," + lerp(130, 0, backOut((u4 - 2.35) / .55)).toFixed(2) + "%,0)";
    swap(follow, r(u4, 3.32, 3.5)); press(follow, u4, 3.3);
    if (k === 4 && u4 >= 2.5) {
      var cf = 1 - r(u4, 4.1, 4.5);
      bits.forEach(function (bt) {
        var age = clamp(u4 - 2.5 - bt.delay, 0, 3);
        bt.el.style.opacity = (age > 0 ? cf * (1 - r(age, 1.1, 1.6)) : 0).toFixed(3);
        bt.el.style.transform = "translate3d(" + px(bt.vx * age) + "," + px(bt.vy * age + 260 * age * age) + "," + px(bt.vz * age) + ") rotateX(" + (bt.spin * age + bt.tilt).toFixed(1) + "deg) rotateZ(" + (bt.spin * .5 * age).toFixed(1) + "deg)";
      });
    } else bits.forEach(function (bt) { bt.el.style.opacity = 0; });
    if (k === 4) {
      var nn = ro(u4, 3.55, 4.0), nf = r(u4, 4.25, 4.6);
      notif.style.opacity = (clamp((u4 - 3.55) / .2, 0, 1) * (1 - nf)).toFixed(3);
      notif.style.transform = "translate3d(0," + px(lerp(-60, 50, nn)) + "," + px(lerp(10, 80, nn)) + ")";
    } else notif.style.opacity = 0;

    /* tap cursor: the press nearest in time */
    var tp = null, best = 9;
    TAPS.forEach(function (c) {
      var d = u - c.at;
      if (c.k === k && d > -.6 && d < .5 && Math.abs(d) < best) { tp = c; best = Math.abs(d); }
    });
    if (tp && p === 0) {
      var app = ro(u, tp.at - .6, tp.at - .12);
      tap.style.opacity = (r(u, tp.at - .6, tp.at - .38) * (1 - r(u, tp.at + .22, tp.at + .45))).toFixed(3);
      tap.style.transform = "translate3d(" + px(tp.x + lerp(40, 0, app)) + "," + px(tp.y + lerp(56, 0, app)) + ",0) scale(" + (1 - .25 * bump(u, tp.at - .1, tp.at + .18)).toFixed(3) + ")";
      var ra = u - tp.at;
      ripple.style.opacity = ra > 0 && ra < .45 ? (.8 * (1 - ra / .45)).toFixed(3) : 0;
      ripple.style.transform = "scale(" + (1 + clamp(ra, 0, .45) * 3).toFixed(3) + ")";
    } else tap.style.opacity = 0;

    /* step list */
    bars.forEach(function (bar, i) { bar.style.transform = "scaleX(" + (i < k ? 1 : i === k ? (u / SCENE) : 0).toFixed(4) + ")"; });
    if (k !== lastStep) {
      steps.forEach(function (st, i) { st.setAttribute("aria-pressed", String(i === k)); });
      if (caption) caption.textContent = steps[k].querySelector(".ex-d").textContent;
      lastStep = k;
    }
  }

  /* ---------- fit the 460x680 stage to its column ---------- */
  var wrap = q(".ex-stage-wrap");
  function fit() {
    var s = FILM ? 1.3 : Math.min(1.12, wrap.clientWidth / 460);
    root.style.setProperty("--ex-s", s.toFixed(4));
  }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(wrap); else window.addEventListener("resize", fit);

  /* ---------- playback ---------- */
  var t = 0, playing = !reduce && !FILM, visible = false, raf = 0, last = 0;
  var toggle = q(".ex-toggle");
  var KEY = [3.9, 3.0, 3.3, 3.6, 3.9]; // a still that sums up each step (reduced motion)

  function tick(now) {
    if (last) t = (t + Math.min(.1, (now - last) / 1000)) % T;
    last = now;
    frame(t);
    raf = requestAnimationFrame(tick);
  }
  function run() {
    var go = playing && visible && !document.hidden;
    if (go && !raf) { last = 0; raf = requestAnimationFrame(tick); }
    if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  function paintToggle() {
    if (!toggle) return;
    toggle.textContent = playing ? "Pause" : "Play";
    toggle.setAttribute("aria-pressed", String(!playing));
  }
  if (toggle) toggle.addEventListener("click", function () { playing = !playing; paintToggle(); run(); });
  steps.forEach(function (st, i) {
    st.addEventListener("click", function () { t = playing ? i * SCENE : i * SCENE + KEY[i]; frame(t); });
  });
  if (!FILM && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; run(); }, { threshold: .25 }).observe(root);
  } else visible = true;
  document.addEventListener("visibilitychange", run);

  function ready() {
    measure();
    if (reduce) t = KEY[0];
    frame(t);
    paintToggle();
    run();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
  window.addEventListener("resize", function () { measure(); frame(t); });

  window.TurneExplainer = { T: T, seek: function (s) { t = s; frame(s); }, measure: measure };
})();
