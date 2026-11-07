/* Turne — brand enquiry + contact forms. Each form has data-api="brandEnquiry" | "contact". */
(function () {
  "use strict";
  if (!window.TurneAPI) return;
  Array.prototype.forEach.call(document.querySelectorAll("form[data-api]"), function (form) {
    var method = form.getAttribute("data-api");
    var status = form.querySelector("[data-status]");
    var btn = form.querySelector("button[type=submit]");
    var label = btn.textContent;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var missing = [];
      Array.prototype.forEach.call(form.querySelectorAll("[required]"), function (el) {
        var ok = el.value.trim() !== "" && (el.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        if (ok) el.removeAttribute("aria-invalid"); else { el.setAttribute("aria-invalid", "true"); missing.push(el); }
      });
      if (missing.length) {
        status.className = "error"; status.hidden = false;
        status.textContent = "Fill in the highlighted fields. Emails need an @ and a domain.";
        missing[0].focus(); return;
      }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      btn.disabled = true; btn.textContent = "Sending…"; status.hidden = true;
      window.TurneAPI[method](data).then(function () {
        form.reset();
        status.className = "notice notice--ok"; status.hidden = false;
        status.textContent = form.getAttribute("data-success") || "Sent. We'll reply within two working days.";
      }).catch(function (err) {
        status.className = "error"; status.hidden = false; status.textContent = err.message;
      }).then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });
})();
