/* Home event-card carousel (mobile): the dots follow the scroll and jump to a card.
   Started by <PageScripts names={["carousel"]} />, returns a cleanup. */
export default function initCarousel() {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cleanups = [];
  document.querySelectorAll("[data-carousel]").forEach(function (track) {
    var dotsBox = track.parentNode.querySelector("[data-dots]");
    var dots = dotsBox ? Array.prototype.slice.call(dotsBox.querySelectorAll("button")) : [];
    var cards = Array.prototype.slice.call(track.children);
    function current() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bestD = Infinity;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      return best;
    }
    function mark() { var i = current(); dots.forEach(function (d, j) { if (i === j) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); }); }
    var raf = 0;
    function onScroll() { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }
    track.addEventListener("scroll", onScroll, { passive: true });
    var clicks = dots.map(function (d, i) {
      function go() {
        var c = cards[i]; if (!c) return;
        track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
      }
      d.addEventListener("click", go);
      return function () { d.removeEventListener("click", go); };
    });
    cleanups.push(function () { cancelAnimationFrame(raf); track.removeEventListener("scroll", onScroll); clicks.forEach(function (f) { f(); }); });
  });
  return function () { cleanups.forEach(function (f) { f(); }); };
}
