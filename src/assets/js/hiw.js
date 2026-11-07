/* Turne — How it works animations: the live expo floor and the inside-a-pod video call.
   Runs only while each section is on screen; respects reduced-motion (stays still). */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.NumberFormat("en-IN");
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function rnd(n) { return Math.floor(Math.random() * n); }

  /* run fn every ms, but only while el is visible and the tab is open */
  function whileVisible(el, jobs) {
    var on = false, timers = [];
    function start() { if (on) return; on = true; jobs.forEach(function (j) { j[0](); timers.push(setInterval(function () { if (!document.hidden) j[0](); }, j[1])); }); }
    function stop() { on = false; timers.forEach(clearInterval); timers = []; }
    if (!("IntersectionObserver" in window)) { start(); return; }
    new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: 0.15 }).observe(el);
  }

  /* ---------------- live expo floor ---------------- */
  var floor = $("[data-floor]");
  if (floor && !reduce) {
    var grid = $("[data-floor-grid]", floor), pods = $all("[data-pod]", floor), you = $("[data-you]", floor);
    var inside = $("[data-inside]", floor), feed = $("[data-feed]", floor);
    var people = ["Rohan", "Priya", "Arjun", "Meera", "Kabir", "Ananya", "Isha", "Dev", "Sana", "Vikram"];
    var acts = [
      function (p) { return p + " joined the " + podName() + " pod"; },
      function (p) { return p + " booked a 1:1 demo with " + podName(); },
      function (p) { return p + " entered the " + podName() + " giveaway"; },
      function (p) { return p + " asked a question in " + podName(); },
      function (p) { return p + " followed " + podName(); }
    ];
    function podName() { var b = $("b", pods[rnd(pods.length)].querySelector(".w-pod__meta")); return b ? b.textContent : "a"; }
    var cur = -1;

    function viewers() {
      var p = pods[rnd(pods.length)], b = $("[data-viewers]", p), v = +b.getAttribute("data-viewers");
      v = Math.max(20, v + (Math.random() < .8 ? 1 + rnd(4) : -1));
      b.setAttribute("data-viewers", v); b.textContent = fmt.format(v);
      var n = +inside.getAttribute("data-inside") + 1 + rnd(5);
      inside.setAttribute("data-inside", n); inside.textContent = fmt.format(n);
    }
    function hop() {
      var next; do { next = rnd(pods.length); } while (next === cur && pods.length > 1);
      if (cur >= 0) pods[cur].classList.remove("has-you");
      cur = next;
      var p = pods[cur], g = grid.getBoundingClientRect(), r = p.getBoundingClientRect();
      you.style.transform = "translate(" + (r.left - g.left + r.width - 70) + "px," + (r.top - g.top + 10) + "px)";
      you.classList.add("is-on");
      setTimeout(function () { p.classList.add("has-you"); }, 700);
    }
    function ticker() {
      var s = document.createElement("span");
      s.textContent = acts[rnd(acts.length)](people[rnd(people.length)]);
      feed.innerHTML = ""; feed.appendChild(s);
    }
    whileVisible(floor, [[viewers, 900], [hop, 3200], [ticker, 2600]]);
    window.addEventListener("resize", function () { if (cur >= 0) hop(); });
  }

  /* ---------------- inside a pod: the video call, switching between brand pods ---------------- */
  var call = $("[data-call]");
  if (call) {
    var chat = $("[data-chat]", call), reacts = $("[data-reacts]", call);
    var here = $("[data-here]", call), timer = $("[data-timer]", call), toast = $("[data-toast]", call);
    var book = $("[data-book]", call), give = $("[data-give]", call), hand = $(".w-vt--hand", call);
    var roomName = $("[data-room-name]", call), evName = $("[data-ev-name]", call), label = $("[data-label]", call), toastWho = $("[data-toast-who]", call);
    var slides = $all("[data-slide]", call), tabs = $all("[data-tab]");
    var tiles = $all(".w-vt", call), secs = 12 * 60 + 4, step = 0, cur = 0, li = 2, lines = [], role = "", heads = 0, lastPick = 0;
    var brandNames = tabs.map(function (t) { return t.getAttribute("data-brand"); });

    function addLine(l) {
      var p = document.createElement("p"), b = document.createElement("b");
      b.textContent = l[0];
      if (l[1]) { var em = document.createElement("em"); em.textContent = role; b.appendChild(document.createTextNode(" ")); b.appendChild(em); }
      p.appendChild(b); p.appendChild(document.createTextNode(l[2]));
      if (l[0] === "You") p.className = "is-you";
      chat.appendChild(p);
      while (chat.children.length > 4) chat.removeChild(chat.firstChild);
    }
    function show(i) {
      cur = i;
      var s = slides[i];
      slides.forEach(function (x, j) { x.classList.toggle("is-on", j === i); });
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === i ? "true" : "false"); });
      try { lines = JSON.parse(s.getAttribute("data-lines")) || []; } catch (e) { lines = []; }
      role = s.getAttribute("data-role");
      heads = +s.getAttribute("data-here");
      roomName.textContent = s.getAttribute("data-room");
      evName.textContent = s.getAttribute("data-ev");
      here.textContent = fmt.format(heads);
      label.textContent = s.getAttribute("data-who") + " is presenting " + brandNames[i];
      toastWho.textContent = s.getAttribute("data-who");
      chat.innerHTML = ""; lines.slice(0, 2).forEach(addLine); li = 2;
    }
    tabs.forEach(function (t, i) { t.addEventListener("click", function () { lastPick = Date.now(); show(i); }); });
    if (slides.length) show(0);

    if (!reduce) {
      var bars = $all("[data-bars] i", call);
      function addMsg() { if (lines.length) addLine(lines[li++ % lines.length]); }
      function wiggle() { bars.forEach(function (b) { b.style.setProperty("--h", (35 + rnd(60)) + "%"); }); }
      function react() {
        var e = document.createElement("i"), set = ["\u{1F44F}", "\u{1F525}", "❤️", "\u{1F389}", "\u{1F44D}"];
        e.textContent = set[rnd(set.length)]; e.style.left = (10 + rnd(80)) + "%";
        reacts.appendChild(e); setTimeout(function () { e.remove(); }, 2600);
      }
      function tick() {
        secs++; timer.textContent = Math.floor(secs / 60) + ":" + ("0" + secs % 60).slice(-2);
        if (secs % 3 === 0) { heads += Math.random() < .75 ? 1 : -1; here.textContent = fmt.format(heads); }
      }
      function speak() {
        tiles.forEach(function (t) { t.classList.remove("is-speaking"); });
        tiles[rnd(tiles.length)].classList.add("is-speaking");
        if (hand) hand.classList.toggle("w-vt--hand");
      }
      function scene() {
        // loop: book the demo, see the toast, enter the giveaway, reset
        step = (step + 1) % 4;
        book.classList.toggle("is-pressed", step === 1 || step === 2);
        toast.classList.toggle("is-on", step === 1);
        give.classList.toggle("is-pressed", step === 2 || step === 3);
        give.textContent = step === 2 || step === 3 ? "✓ Entered" : "Enter giveaway";
        book.textContent = step === 1 || step === 2 ? "✓ Demo booked" : "Book a 1:1 demo";
      }
      function rotate() { if (Date.now() - lastPick > 20000 && slides.length) show((cur + 1) % slides.length); }
      // first rotate() fires immediately on start; skip it so the opening pod stays a while
      var started = false;
      function rotateLater() { if (!started) { started = true; return; } rotate(); }
      whileVisible(call, [[addMsg, 2200], [wiggle, 1800], [react, 1100], [tick, 1000], [speak, 1500], [scene, 3000], [rotateLater, 10000]]);
    }
  }
})();
