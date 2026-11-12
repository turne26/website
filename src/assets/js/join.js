/* Turne — waitlist signup: mobile number -> SMS OTP -> details -> ticket. */
(function () {
  "use strict";
  var root = document.getElementById("join-flow");
  if (!root || !window.TurneAPI) return;
  var cfg = window.TURNE_CONFIG || {};
  var api = window.TurneAPI;
  var fmt = new Intl.NumberFormat("en-IN");
  var OTP_LEN = cfg.otpLength || 6;
  var MIN_AGE = cfg.minAge || 13;
  var state = { phone: "", token: "", resendTimer: null };

  function $(sel) { return root.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  var panels = { phone: $("#step-phone"), otp: $("#step-otp"), details: $("#step-details"), done: $("#step-done") };
  var stepItems = $all(".steps li");
  var order = ["phone", "otp", "details"];

  function show(name) {
    Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== name; });
    var idx = order.indexOf(name);
    $(".steps").hidden = name === "done";
    stepItems.forEach(function (li, i) {
      li.classList.toggle("is-done", i < idx);
      li.classList.toggle("is-current", i === idx);
      if (i === idx) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    var h = panels[name].querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    var top = root.getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top: top });
  }

  function setError(id, msg) {
    var el = document.getElementById(id); if (!el) return;
    el.textContent = msg || ""; el.hidden = !msg;
  }
  function busy(btn, on, label) {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.disabled = on; btn.textContent = on ? label : btn.dataset.label;
  }
  function normalisePhone(v) {
    var d = String(v || "").replace(/\D/g, "");
    if (d.length === 12 && d.indexOf("91") === 0) d = d.slice(2);
    if (d.length === 11 && d[0] === "0") d = d.slice(1);
    return d;
  }
  function masked(p) { return "+91 " + p.slice(0, 5) + " " + p.slice(5); }

  /* ---------- step 1: phone ---------- */
  var phoneInput = $("#wa-number");
  panels.phone.addEventListener("submit", function (e) {
    e.preventDefault();
    var phone = normalisePhone(phoneInput.value);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      phoneInput.setAttribute("aria-invalid", "true");
      setError("phone-error", "Enter your 10-digit mobile number, without +91.");
      phoneInput.focus(); return;
    }
    phoneInput.removeAttribute("aria-invalid"); setError("phone-error", "");
    var btn = panels.phone.querySelector("button[type=submit]");
    busy(btn, true, "Sending code…");
    api.sendOtp({ phone: phone }).then(function (res) {
      state.phone = phone;
      $("#otp-target").textContent = masked(phone);
      $("#otp-mock").hidden = !(res && res.mock);
      clearOtp(); show("otp"); startResend((res && res.resendAfter) || cfg.otpResendSeconds || 30);
      otpInputs[0].focus();
    }).catch(function (err) { setError("phone-error", err.message); })
      .then(function () { busy(btn, false); });
  });

  /* ---------- step 2: OTP ---------- */
  var otpInputs = $all(".otp input");
  function otpValue() { return otpInputs.map(function (i) { return i.value; }).join(""); }
  function clearOtp() { otpInputs.forEach(function (i) { i.value = ""; i.removeAttribute("aria-invalid"); }); setError("otp-error", ""); }
  otpInputs.forEach(function (input, i) {
    input.addEventListener("input", function () {
      input.value = input.value.replace(/\D/g, "").slice(-1);
      if (input.value && i < otpInputs.length - 1) otpInputs[i + 1].focus();
      if (otpValue().length === OTP_LEN) panels.otp.requestSubmit ? panels.otp.requestSubmit() : panels.otp.dispatchEvent(new Event("submit", { cancelable: true }));
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !input.value && i > 0) { otpInputs[i - 1].focus(); otpInputs[i - 1].value = ""; }
      if (e.key === "ArrowLeft" && i > 0) otpInputs[i - 1].focus();
      if (e.key === "ArrowRight" && i < otpInputs.length - 1) otpInputs[i + 1].focus();
    });
    input.addEventListener("paste", function (e) {
      var text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
      if (!text) return;
      e.preventDefault();
      text.split("").forEach(function (ch, k) { if (otpInputs[k]) otpInputs[k].value = ch; });
      otpInputs[Math.min(text.length, OTP_LEN) - 1].focus();
      if (text.length === OTP_LEN) panels.otp.requestSubmit ? panels.otp.requestSubmit() : null;
    });
  });

  var verifying = false;
  panels.otp.addEventListener("submit", function (e) {
    e.preventDefault();
    if (verifying) return;
    var code = otpValue();
    if (code.length !== OTP_LEN) { setError("otp-error", "Enter all " + OTP_LEN + " digits from the SMS."); return; }
    var btn = panels.otp.querySelector("button[type=submit]");
    verifying = true; busy(btn, true, "Checking…");
    api.verifyOtp({ phone: state.phone, code: code }).then(function (res) {
      state.token = res.verificationToken;
      stopResend();
      if (res.existing && res.existing.position) { renderDone(res.existing, true); return; }
      show("details"); $("#full-name").focus();
    }).catch(function (err) {
      otpInputs.forEach(function (i) { i.setAttribute("aria-invalid", "true"); });
      setError("otp-error", err.message);
    }).then(function () { verifying = false; busy(btn, false); });
  });

  var resendBtn = $("#resend");
  function startResend(seconds) {
    stopResend();
    var left = seconds;
    resendBtn.disabled = true;
    function paint() { resendBtn.textContent = left > 0 ? "Resend code in " + left + "s" : "Resend code"; }
    paint();
    state.resendTimer = setInterval(function () {
      left -= 1; paint();
      if (left <= 0) { stopResend(); resendBtn.disabled = false; }
    }, 1000);
  }
  function stopResend() { if (state.resendTimer) clearInterval(state.resendTimer); state.resendTimer = null; }
  resendBtn.addEventListener("click", function () {
    resendBtn.disabled = true; resendBtn.textContent = "Sending…";
    api.sendOtp({ phone: state.phone }).then(function (res) {
      clearOtp(); otpInputs[0].focus();
      startResend((res && res.resendAfter) || cfg.otpResendSeconds || 30);
    }).catch(function (err) { setError("otp-error", err.message); resendBtn.disabled = false; resendBtn.textContent = "Resend code"; });
  });
  $("#change-number").addEventListener("click", function () { stopResend(); show("phone"); phoneInput.select(); });

  /* ---------- step 3: details ---------- */
  var citySelect = $("#city"), cityOther = $("#city-other-wrap");
  citySelect.addEventListener("change", function () {
    cityOther.hidden = citySelect.value !== "__other";
    if (!cityOther.hidden) $("#city-other").focus();
  });
  var dobInput = $("#dob");
  (function setDobBounds() {
    var t = new Date(), max = new Date(t.getFullYear() - MIN_AGE, t.getMonth(), t.getDate());
    dobInput.max = max.toISOString().slice(0, 10);
    dobInput.min = (t.getFullYear() - 100) + "-01-01";
  })();

  function ageOn(dobStr) {
    var d = new Date(dobStr + "T00:00:00"), t = new Date();
    var a = t.getFullYear() - d.getFullYear();
    if (t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) a -= 1;
    return a;
  }

  panels.details.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#full-name").value.trim();
    var dob = dobInput.value;
    var city = citySelect.value === "__other" ? $("#city-other").value.trim() : citySelect.value;
    var problems = [];
    [["#full-name", name.length >= 2], ["#dob", !!dob], ["#city", !!city]].forEach(function (p) {
      var el = $(p[0]); if (p[1]) el.removeAttribute("aria-invalid"); else el.setAttribute("aria-invalid", "true");
    });
    if (name.length < 2) problems.push("Add your full name.");
    if (!dob) problems.push("Add your date of birth.");
    else if (ageOn(dob) < MIN_AGE) problems.push("You need to be at least " + MIN_AGE + " to join.");
    if (!city) problems.push("Pick your city, or choose Other and type it.");
    if (problems.length) { setError("details-error", problems.join(" ")); return; }
    setError("details-error", "");
    var btn = panels.details.querySelector("button[type=submit]");
    busy(btn, true, "Locking in your spot…");
    var attr = window.TurneAttribution ? window.TurneAttribution() : {};
    api.joinWaitlist({
      verificationToken: state.token,
      name: name, dob: dob, city: city,
      company: $("#company").value,          // honeypot – real people leave this empty
      ref: attr.ref || null,
      utm: { source: attr.utm_source || null, medium: attr.utm_medium || null, campaign: attr.utm_campaign || null, content: attr.utm_content || null, term: attr.utm_term || null },
      landing: attr.landing || null
    }).then(function (res) {
      renderDone(res, false);
      if (window.TurneStats) window.TurneStats.refresh();
    }).catch(function (err) {
      if (err.code === "token_invalid") { setError("details-error", err.message); setTimeout(function () { show("phone"); }, 1500); return; }
      setError("details-error", err.message);
    }).then(function () { busy(btn, false); });
  });

  /* ---------- step 4: done ---------- */
  function renderDone(entry, returning) {
    var pos = fmt.format(entry.position || 0);
    $("#done-title").textContent = returning ? "You're already in." : "You're in.";
    $("#done-lede").textContent = returning
      ? "This number is already on the waitlist. Here's your spot."
      : "Your spot is locked. We'll message you on WhatsApp before launch.";
    $all("[data-done-position]").forEach(function (el) { el.textContent = "#" + pos; });
    var premium = !!entry.premium;
    $("#done-ticket").classList.toggle("ticket--premium", premium);
    $("#done-tier").textContent = premium ? "Lifetime Premium" : "Member";
    $("#done-premium").hidden = !premium;
    $("#done-standard").hidden = premium;
    var invite = (cfg.siteUrl || location.origin) + "/?ref=" + encodeURIComponent(entry.inviteCode || "");
    $("#invite-link").value = invite;
    var msg = "I just joined the Turne waitlist. The first 10,000 get Lifetime Premium. Get your spot: " + invite;
    $("#share-wa").href = "https://wa.me/?text=" + encodeURIComponent(msg);
    show("done");
  }

  $("#copy-invite").addEventListener("click", function () {
    var input = $("#invite-link"), btn = this;
    function done() { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy link"; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(done, function () { input.select(); });
    } else { input.select(); }
  });

  show("phone");
  // Do not steal focus on load; just make the first field ready.
  document.activeElement && document.activeElement.blur && document.activeElement.tagName === "H2" && document.activeElement.blur();
})();
