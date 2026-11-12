/*
 * Turne API client.
 * Every network call the site makes goes through this file. The endpoint contract is
 * documented in README.md ("Backend integration"). When TURNE_CONFIG.apiBase is empty the
 * client runs in mock mode so the site works without a server.
 */
(function () {
  "use strict";
  var cfg = window.TURNE_CONFIG || {};
  var base = (cfg.apiBase || "").replace(/\/+$/, "");
  var MOCK = !base;

  function ApiError(message, code, status, data) {
    this.name = "ApiError";
    this.message = message;
    this.code = code || "error";
    this.status = status || 0;
    this.data = data || null;
  }
  ApiError.prototype = Object.create(Error.prototype);

  function request(method, path, body) {
    var opts = { method: method, headers: { "Accept": "application/json" }, credentials: "include" };
    if (body !== undefined) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
    return fetch(base + path, opts).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        if (!res.ok) {
          var err = (data && data.error) || {};
          throw new ApiError(
            err.message || "Something went wrong on our side. Try again in a minute.",
            err.code || "http_" + res.status, res.status, data
          );
        }
        return data;
      });
    }, function () {
      throw new ApiError("We couldn't reach Turne. Check your connection and try again.", "network");
    });
  }

  /* ---------------- mock backend (browser only) ---------------- */
  var mock = (function () {
    var count = (cfg.fallbackStats && cfg.fallbackStats.waitlistCount) || 1121;
    var pending = {};   // phone -> { code, tries }
    var tokens = {};    // token -> phone
    var members = {};   // phone -> entry
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function fail(msg, code, status) { return Promise.reject(new ApiError(msg, code, status || 400)); }
    function code() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
    return {
      getStats: function () {
        return wait(150).then(function () {
          return { waitlistCount: count, premiumLimit: cfg.premiumLimit || 10000, launchAt: cfg.launchAt };
        });
      },
      sendOtp: function (p) {
        return wait(500).then(function () {
          if (!/^[6-9]\d{9}$/.test(p.phone)) return fail("Enter a 10-digit Indian mobile number.", "invalid_phone");
          pending[p.phone] = { code: "123456", tries: 0 };
          return { ok: true, resendAfter: cfg.otpResendSeconds || 30, mock: true };
        });
      },
      verifyOtp: function (p) {
        return wait(500).then(function () {
          var rec = pending[p.phone];
          if (!rec) return fail("That code has expired. Send a new one.", "otp_expired");
          rec.tries += 1;
          if (rec.tries > 5) return fail("Too many attempts. Send a new code.", "otp_locked", 429);
          if (p.code !== rec.code) return fail("That code doesn't match. Check the SMS and try again.", "otp_invalid");
          var t = "mock_" + code();
          tokens[t] = p.phone;
          return { ok: true, verificationToken: t, existing: members[p.phone] || null };
        });
      },
      joinWaitlist: function (p) {
        return wait(700).then(function () {
          var phone = tokens[p.verificationToken];
          if (!phone) return fail("Your verification expired. Start again.", "token_invalid", 401);
          if (p.company) return { position: 0, premium: false, inviteCode: "" }; // honeypot hit
          if (members[phone]) return members[phone];
          count += 1;
          var entry = { position: count, premium: count <= (cfg.premiumLimit || 10000), inviteCode: code(), name: p.name };
          members[phone] = entry;
          return entry;
        });
      },
      brandEnquiry: function () { return wait(600).then(function () { return { ok: true }; }); },
      contact: function () { return wait(600).then(function () { return { ok: true }; }); }
    };
  })();

  window.TurneAPI = {
    isMock: MOCK,
    ApiError: ApiError,
    /** GET /stats -> { waitlistCount, premiumLimit, launchAt } */
    getStats: function () { return MOCK ? mock.getStats() : request("GET", "/stats"); },
    /** POST /otp/send { phone } -> { ok, resendAfter } */
    sendOtp: function (payload) { return MOCK ? mock.sendOtp(payload) : request("POST", "/otp/send", payload); },
    /** POST /otp/verify { phone, code } -> { ok, verificationToken, existing } */
    verifyOtp: function (payload) { return MOCK ? mock.verifyOtp(payload) : request("POST", "/otp/verify", payload); },
    /** POST /waitlist { verificationToken, name, dob, city, company, utm, ref } -> { position, premium, inviteCode } */
    joinWaitlist: function (payload) { return MOCK ? mock.joinWaitlist(payload) : request("POST", "/waitlist", payload); },
    /** POST /brands/enquiry { name, company, email, phone, role, plan, company_url, website } -> { ok } */
    brandEnquiry: function (payload) { return MOCK ? mock.brandEnquiry(payload) : request("POST", "/brands/enquiry", payload); },
    /** POST /contact { name, email, topic, message, website } -> { ok } */
    contact: function (payload) { return MOCK ? mock.contact(payload) : request("POST", "/contact", payload); }
  };
})();
