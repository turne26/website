/* Turne admin panel. Signs in with Supabase Auth (email + password) and talks to the api
   function's /admin/* routes, which check that the account is on ADMIN_EMAILS. */
(function () {
  "use strict";
  var cfg = window.TURNE_CONFIG || {};
  var API = (cfg.apiBase || "").replace(/\/+$/, "");
  var AUTH = (cfg.supabaseUrl || "").replace(/\/+$/, "") + "/auth/v1";
  var KEY = cfg.supabaseKey || "";
  var STORE = "turne-admin-session";

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(v) {
    return String(v === null || v === undefined ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var num = new Intl.NumberFormat("en-IN");
  var dtFmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  var dayFmt = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", day: "numeric", month: "short" });
  function when(iso) { return iso ? dtFmt.format(new Date(iso)) : ""; }
  function day(isoDate) { return dayFmt.format(new Date(isoDate + "T00:00:00Z")); }
  function age(dob) {
    if (!dob) return "";
    var d = new Date(dob + "T00:00:00"), t = new Date();
    var a = t.getFullYear() - d.getFullYear();
    if (t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) a -= 1;
    return a;
  }

  var toastTimer;
  function toast(msg, kind) {
    var t = $("#toast");
    t.textContent = msg; t.dataset.kind = kind || ""; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3500);
  }

  /* ---------------------------------------------------------------- session */
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { return null; } }
  function save(s) { try { if (s) localStorage.setItem(STORE, JSON.stringify(s)); else localStorage.removeItem(STORE); } catch (e) { /* private mode */ } }
  var session = load();

  function authCall(grant, body) {
    return fetch(AUTH + "/token?grant_type=" + grant, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: KEY },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok || !data.access_token) {
          var msg = data.error_description || data.msg || data.message || "Sign-in failed.";
          if (/invalid login credentials/i.test(msg)) msg = "Wrong email or password.";
          if (/email not confirmed/i.test(msg)) msg = "This email isn't confirmed yet. Confirm it in Supabase first.";
          throw new Error(msg);
        }
        session = {
          access: data.access_token, refresh: data.refresh_token,
          expires: Date.now() + (data.expires_in || 3600) * 1000,
          email: (data.user && data.user.email) || (session && session.email) || ""
        };
        save(session);
        return session;
      });
    });
  }
  function freshToken(force) {
    if (!session) return Promise.reject(new Error("signed_out"));
    if (!force && session.expires - Date.now() > 60000) return Promise.resolve(session.access);
    return authCall("refresh_token", { refresh_token: session.refresh }).then(function (s) { return s.access; });
  }
  function signOut(message) {
    var s = session; session = null; save(null);
    if (s) fetch(AUTH + "/logout", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + s.access } }).catch(function () {});
    showLogin(message);
  }

  /* ---------------------------------------------------------------- api */
  function call(method, path, body, raw, retried) {
    return freshToken(false).then(function (token) {
      var opts = { method: method, headers: { Accept: "application/json", Authorization: "Bearer " + token } };
      if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
      return fetch(API + path, opts);
    }).then(function (res) {
      if (res.status === 401 && !retried) {
        return freshToken(true).then(function () { return call(method, path, body, raw, true); });
      }
      if (raw && res.ok) return res;
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.ok) return data;
        var err = new Error((data.error && data.error.message) || "Request failed (" + res.status + ").");
        err.status = res.status; err.code = data.error && data.error.code;
        throw err;
      });
    }).catch(function (err) {
      if (err.message === "signed_out" || err.status === 401) { signOut("Your session ended. Sign in again."); }
      else if (err.status === 403) { signOut(err.message); }
      throw err;
    });
  }
  function fail(err) { if (err && err.status !== 401 && err.status !== 403 && err.message !== "signed_out") toast(err.message, "error"); }

  /* ---------------------------------------------------------------- shell */
  function showLogin(message) {
    $("#app").hidden = true; $("#login").hidden = false;
    var e = $("#login-error"); e.textContent = message || ""; e.hidden = !message;
    $("#login-email").focus();
  }
  function showApp() {
    $("#login").hidden = true; $("#app").hidden = false;
    $("#me-email").textContent = session.email;
    var start = (location.hash || "").replace("#", "");
    openTab(views[start] ? start : "overview");
  }

  $("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = this.querySelector("button"), err = $("#login-error");
    var email = $("#login-email").value.trim(), password = $("#login-password").value;
    if (!email || !password) { err.textContent = "Enter your email and password."; err.hidden = false; return; }
    btn.disabled = true; btn.textContent = "Signing in…"; err.hidden = true;
    authCall("password", { email: email, password: password })
      .then(function () { return call("GET", "/admin/me"); })
      .then(function (me) { session.email = me.email; save(session); $("#login-password").value = ""; showApp(); })
      .catch(function (x) { if (!$("#login").hidden || !session) { err.textContent = x.message; err.hidden = false; } })
      .then(function () { btn.disabled = false; btn.textContent = "Sign in"; });
  });
  $("#logout").addEventListener("click", function () { signOut(""); });

  var views = { overview: loadOverview, members: loadMembers, enquiries: function () { loadInbox("enquiries"); }, messages: function () { loadInbox("messages"); }, log: loadLog };
  function openTab(name) {
    $all(".adm-tabs [data-tab]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.tab === name)); });
    $all(".adm-view").forEach(function (v) { v.hidden = v.id !== "view-" + name; });
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    views[name]();
  }
  $all(".adm-tabs [data-tab]").forEach(function (b) { b.addEventListener("click", function () { openTab(b.dataset.tab); }); });
  $all("[data-refresh]").forEach(function (b) { b.addEventListener("click", function () { views[b.dataset.refresh](); }); });

  function badge(id, n) { var b = $(id); b.textContent = n; b.hidden = !n; }

  /* ---------------------------------------------------------------- tooltip */
  var tip = $("#tip");
  function showTip(el, text) {
    var r = el.getBoundingClientRect();
    tip.textContent = text; tip.hidden = false;
    var x = Math.min(Math.max(r.left + r.width / 2, 70), window.innerWidth - 70);
    tip.style.left = x + "px"; tip.style.top = r.top + "px";
  }
  function hideTip() { tip.hidden = true; }

  /* ---------------------------------------------------------------- overview */
  var knownCities = [];
  function rankList(items, label) {
    if (!items.length) return '<p class="adm-empty">Nothing yet.</p>';
    var max = Math.max.apply(null, items.map(function (i) { return i.count; })) || 1;
    return '<ol class="adm-rank">' + items.map(function (i) {
      return "<li><span>" + label(i) + '</span><span class="n">' + num.format(i.count) + '</span><span class="bar"><i style="width:' + (i.count / max * 100).toFixed(1) + '%"></i></span></li>';
    }).join("") + "</ol>";
  }
  function niceMax(v) {
    if (v <= 4) return 4;
    var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p;
    return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }
  function renderChart(daily) {
    var max = niceMax(Math.max.apply(null, daily.map(function (d) { return d.count; }).concat([0])));
    var grid = [0, 0.5, 1].map(function (f) { return '<div class="adm-chart__grid" style="bottom:' + f * 100 + '%"></div>'; }).join("");
    var y = [0, 0.5, 1].map(function (f) { return '<span style="bottom:' + f * 100 + '%">' + num.format(Math.round(max * f)) + "</span>"; }).join("");
    var bars = daily.map(function (d) {
      var label = day(d.day) + " · " + num.format(d.count) + (d.count === 1 ? " sign-up" : " sign-ups");
      return '<button type="button" aria-label="' + esc(label) + '" data-tip="' + esc(label) + '"><i style="height:' + (d.count / max * 100).toFixed(2) + '%"></i></button>';
    }).join("");
    var first = daily[0], mid = daily[Math.floor(daily.length / 2)], last = daily[daily.length - 1];
    $("#ov-chart").innerHTML =
      '<div class="adm-chart__y" aria-hidden="true">' + y + '</div>' +
      '<div class="adm-chart__plot">' + grid + '<div class="adm-chart__bars">' + bars + "</div></div>" +
      '<div class="adm-chart__x" aria-hidden="true"><span>' + (first ? day(first.day) : "") + "</span><span>" + (mid ? day(mid.day) : "") + "</span><span>" + (last ? "Today" : "") + "</span></div>";
    $all("#ov-chart [data-tip]").forEach(function (b) {
      b.addEventListener("mouseenter", function () { showTip(b, b.dataset.tip); });
      b.addEventListener("focus", function () { showTip(b, b.dataset.tip); });
      b.addEventListener("mouseleave", hideTip); b.addEventListener("blur", hideTip);
    });
    $("#ov-chart-table").innerHTML = '<table class="adm-table"><thead><tr><th>Day</th><th>Sign-ups</th></tr></thead><tbody>' +
      daily.slice().reverse().map(function (d) { return "<tr><td>" + day(d.day) + "</td><td>" + num.format(d.count) + "</td></tr>"; }).join("") + "</tbody></table>";
  }
  function tile(label, value, note, meter) {
    return '<div class="adm-tile"><span class="lbl">' + label + "</span><b>" + value + "</b><span>" + note + "</span>" +
      (meter !== undefined ? '<div class="adm-meter"><i style="width:' + Math.min(100, meter).toFixed(1) + '%"></i></div>' : "") + "</div>";
  }
  function loadOverview() {
    call("GET", "/admin/overview").then(function (o) {
      var left = Math.max(0, o.premiumLimit - o.premium);
      var rate = o.smsTotal ? Math.round(o.verifiedTotal / o.smsTotal * 100) + "%" : "–";
      $("#ov-tiles").innerHTML =
        tile("Members", num.format(o.members), "+" + num.format(o.today) + " today") +
        tile("Last 7 days", num.format(o.last7), "new sign-ups") +
        tile("Premium spots left", num.format(left), num.format(o.premium) + " of " + num.format(o.premiumLimit) + " taken", o.premium / o.premiumLimit * 100) +
        tile("SMS sent today", num.format(o.smsToday), num.format(o.smsTotal) + " in total") +
        tile("Codes verified", rate, num.format(o.verifiedTotal) + " of " + num.format(o.smsTotal) + " codes") +
        tile("Needs a reply", num.format(o.enquiriesNew + o.messagesNew), num.format(o.enquiriesNew) + " enquiries · " + num.format(o.messagesNew) + " messages");
      renderChart(o.daily || []);
      $("#ov-cities").innerHTML = rankList((o.cities || []).slice(0, 10), function (i) { return esc(i.name); });
      $("#ov-sources").innerHTML = rankList(o.sources || [], function (i) { return esc(i.name); });
      $("#ov-referrers").innerHTML = rankList(o.referrers || [], function (i) { return "#" + num.format(i.position) + " " + esc(i.name) + ' <span class="adm-sub">' + esc(i.inviteCode) + "</span>"; });
      badge("#badge-enquiries", o.enquiriesNew); badge("#badge-messages", o.messagesNew);
      knownCities = (o.cities || []).map(function (c) { return c.name; });
      fillCities();
    }).catch(fail);
  }

  /* ---------------------------------------------------------------- members */
  var mPage = 0, mRows = [], mTimer;
  function fillCities() {
    var sel = $("#m-city"), cur = sel.value;
    sel.innerHTML = '<option value="">All cities</option>' + knownCities.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("");
    sel.value = cur;
  }
  function memberQuery() {
    var p = new URLSearchParams({ page: String(mPage), sort: $("#m-sort").value });
    if ($("#m-q").value.trim()) p.set("q", $("#m-q").value.trim());
    if ($("#m-city").value) p.set("city", $("#m-city").value);
    if ($("#m-tier").value) p.set("tier", $("#m-tier").value);
    return p;
  }
  function pager(el, res, go) {
    var from = res.total ? res.page * res.pageSize + 1 : 0, to = Math.min(res.total, (res.page + 1) * res.pageSize);
    el.innerHTML = "<span>" + num.format(from) + "–" + num.format(to) + " of " + num.format(res.total) + "</span><div>" +
      '<button class="btn btn--ghost btn--sm" type="button" data-p="-1"' + (res.page > 0 ? "" : " disabled") + ">Previous</button>" +
      '<button class="btn btn--ghost btn--sm" type="button" data-p="1"' + (to < res.total ? "" : " disabled") + ">Next</button></div>";
    $all("[data-p]", el).forEach(function (b) { b.addEventListener("click", function () { go(res.page + Number(b.dataset.p)); }); });
  }
  function loadMembers() {
    if (!knownCities.length) call("GET", "/admin/overview").then(function (o) { knownCities = (o.cities || []).map(function (c) { return c.name; }); fillCities(); }).catch(function () {});
    call("GET", "/admin/members?" + memberQuery()).then(function (res) {
      mRows = res.rows;
      $("#m-total").textContent = num.format(res.total) + (res.total === 1 ? " person" : " people");
      $("#m-rows").innerHTML = res.rows.length ? res.rows.map(function (m) {
        return '<tr tabindex="0" data-id="' + m.id + '">' +
          "<td>#" + num.format(m.position) + "</td><td>" + esc(m.name) + "</td><td>+91 " + esc(m.phone) + "</td><td>" + esc(m.city) + "</td><td>" + age(m.dob) + "</td>" +
          "<td>" + (m.premium ? '<span class="adm-pill adm-pill--premium">Premium</span>' : '<span class="adm-pill">Member</span>') + "</td>" +
          "<td>" + esc(m.invite_code) + "</td><td>" + num.format(m.referrals || 0) + "</td><td>" + esc(m.utm_source || "direct") + "</td><td>" + when(m.created_at) + "</td></tr>";
      }).join("") : '<tr><td colspan="10" class="adm-empty">No members match.</td></tr>';
      $all("#m-rows tr[data-id]").forEach(function (tr) {
        tr.addEventListener("click", function () { openMember(Number(tr.dataset.id)); });
        tr.addEventListener("keydown", function (e) { if (e.key === "Enter") openMember(Number(tr.dataset.id)); });
      });
      pager($("#m-pager"), res, function (p) { mPage = p; loadMembers(); });
    }).catch(fail);
  }
  $("#m-filters").addEventListener("submit", function (e) { e.preventDefault(); });
  $("#m-q").addEventListener("input", function () { clearTimeout(mTimer); mTimer = setTimeout(function () { mPage = 0; loadMembers(); }, 300); });
  ["#m-city", "#m-tier", "#m-sort"].forEach(function (s) { $(s).addEventListener("change", function () { mPage = 0; loadMembers(); }); });

  $("#m-export").addEventListener("click", function () {
    var btn = this; btn.disabled = true; btn.textContent = "Preparing…";
    call("GET", "/admin/members/export", null, true).then(function (res) { return res.blob(); }).then(function (blob) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "turne-members-" + new Date().toISOString().slice(0, 10) + ".csv";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    }).catch(fail).then(function () { btn.disabled = false; btn.textContent = "Export CSV"; });
  });

  /* member drawer */
  var drawer = $("#drawer"), current = null;
  function openMember(id) {
    current = mRows.filter(function (m) { return m.id === id; })[0];
    if (!current) return;
    var m = current, wa = "https://wa.me/91" + encodeURIComponent(m.phone);
    $("#d-title").textContent = "#" + num.format(m.position) + " · " + m.name;
    $("#d-facts").innerHTML =
      "<dt>Phone</dt><dd><a href=\"tel:+91" + esc(m.phone) + "\">+91 " + esc(m.phone) + '</a> · <a href="' + wa + '" target="_blank" rel="noopener">WhatsApp</a></dd>' +
      "<dt>Joined</dt><dd>" + when(m.created_at) + "</dd>" +
      "<dt>Invite code</dt><dd>" + esc(m.invite_code) + "</dd>" +
      "<dt>Referrals</dt><dd>" + num.format(m.referrals || 0) + "</dd>" +
      "<dt>Referred by</dt><dd>" + (m.referrer_position ? "#" + num.format(m.referrer_position) + " " + esc(m.referrer_name) : (m.ref_code ? "code " + esc(m.ref_code) + " (no match)" : "–")) + "</dd>" +
      "<dt>Source</dt><dd>" + esc([m.utm_source, m.utm_medium, m.utm_campaign].filter(Boolean).join(" / ") || "direct") + "</dd>" +
      "<dt>Landing page</dt><dd>" + esc(m.landing || "–") + "</dd>";
    $("#d-name").value = m.name; $("#d-dob").value = m.dob || ""; $("#d-city").value = m.city; $("#d-premium").checked = !!m.premium;
    $("#d-error").hidden = true;
    disarm();
    drawer.showModal();
  }
  function closeDrawer() { drawer.close(); disarm(); }
  $("#d-close").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) { if (e.target === drawer) closeDrawer(); });

  $("#d-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!current) return;
    var btn = this.querySelector("button[type=submit]"), err = $("#d-error");
    btn.disabled = true; err.hidden = true;
    call("POST", "/admin/members/update", {
      id: current.id, name: $("#d-name").value, dob: $("#d-dob").value, city: $("#d-city").value, premium: $("#d-premium").checked
    }).then(function (r) {
      toast(r.changed ? "Saved." : "Nothing changed.");
      closeDrawer(); loadMembers();
    }).catch(function (x) { err.textContent = x.message; err.hidden = false; })
      .then(function () { btn.disabled = false; });
  });

  var delBtn = $("#d-delete"), armTimer;
  function disarm() { clearTimeout(armTimer); delete delBtn.dataset.armed; delBtn.textContent = "Delete this member"; }
  delBtn.addEventListener("click", function () {
    if (!current) return;
    if (!delBtn.dataset.armed) {
      delBtn.dataset.armed = "1"; delBtn.textContent = "Click again to delete #" + num.format(current.position);
      armTimer = setTimeout(disarm, 5000); return;
    }
    disarm(); delBtn.disabled = true;
    call("POST", "/admin/members/delete", { id: current.id }).then(function () {
      toast("Member deleted."); closeDrawer(); loadMembers();
    }).catch(fail).then(function () { delBtn.disabled = false; });
  });

  /* ---------------------------------------------------------------- inboxes */
  var inbox = {
    enquiries: { page: 0, list: "#e-rows", pager: "#e-pager", total: "#e-total" },
    messages: { page: 0, list: "#c-rows", pager: "#c-pager", total: "#c-total" }
  };
  var STATUS = { "new": "New", in_progress: "In progress", done: "Done", spam: "Spam" };
  function statusSelect(cur) {
    return '<select class="select" data-f="status" aria-label="Status">' + Object.keys(STATUS).map(function (k) {
      return '<option value="' + k + '"' + (k === cur ? " selected" : "") + ">" + STATUS[k] + "</option>";
    }).join("") + "</select>";
  }
  function inboxCard(kind, r) {
    var mail = '<a href="mailto:' + esc(r.email) + '">' + esc(r.email) + "</a>";
    var meta = kind === "enquiries"
      ? [mail, r.phone ? '<a href="tel:' + esc(r.phone) + '">' + esc(r.phone) + "</a>" : "", r.plan ? "Plan: " + esc(r.plan) : ""]
      : [mail, r.topic ? "Topic: " + esc(r.topic) : ""];
    return '<article class="adm-msg" data-id="' + r.id + '" data-status="' + esc(r.status) + '">' +
      "<header><b>" + esc(r.name) + "</b>" + (kind === "enquiries" ? "<span>" + esc(r.company) + "</span>" : "") +
      '<time datetime="' + esc(r.created_at) + '">' + when(r.created_at) + "</time></header>" +
      '<div class="meta">' + meta.filter(Boolean).join("<span>·</span>") + "</div>" +
      (r.message ? '<div class="body">' + esc(r.message) + "</div>" : "") +
      '<div class="actions">' + statusSelect(r.status) +
      '<textarea class="textarea" data-f="note" rows="1" maxlength="2000" placeholder="Internal note" aria-label="Internal note">' + esc(r.admin_note || "") + "</textarea>" +
      '<button class="btn btn--ghost btn--sm" type="button" data-save>Save</button></div></article>';
  }
  function loadInbox(kind) {
    var s = inbox[kind];
    var p = new URLSearchParams({ page: String(s.page) });
    var f = $('[data-inbox-filter="' + kind + '"]').value; if (f) p.set("status", f);
    call("GET", "/admin/" + kind + "?" + p).then(function (res) {
      $(s.total).textContent = num.format(res.total);
      $(s.list).innerHTML = res.rows.length ? res.rows.map(function (r) { return inboxCard(kind, r); }).join("") : '<p class="adm-empty">Nothing here.</p>';
      $all(".adm-msg", $(s.list)).forEach(function (card) {
        $("[data-save]", card).addEventListener("click", function () {
          var btn = this; btn.disabled = true;
          call("POST", "/admin/" + kind + "/update", {
            id: Number(card.dataset.id), status: $('[data-f="status"]', card).value, note: $('[data-f="note"]', card).value
          }).then(function () { card.dataset.status = $('[data-f="status"]', card).value; toast("Saved."); })
            .catch(fail).then(function () { btn.disabled = false; });
        });
      });
      pager($(s.pager), res, function (pg) { s.page = pg; loadInbox(kind); });
    }).catch(fail);
  }
  $all("[data-inbox-filter]").forEach(function (sel) {
    sel.addEventListener("change", function () { inbox[sel.dataset.inboxFilter].page = 0; loadInbox(sel.dataset.inboxFilter); });
  });

  /* ---------------------------------------------------------------- activity */
  var lPage = 0;
  var ACTIONS = { "member.update": "Edited member", "member.delete": "Deleted member", "enquiries.update": "Updated enquiry", "messages.update": "Updated message" };
  function detailText(d) {
    return Object.keys(d || {}).map(function (k) {
      var v = d[k];
      if (v && typeof v === "object" && "from" in v) return k + ": " + v.from + " → " + v.to;
      return k + ": " + v;
    }).join("; ");
  }
  function loadLog() {
    call("GET", "/admin/log?page=" + lPage).then(function (res) {
      $("#l-rows").innerHTML = res.rows.length ? res.rows.map(function (r) {
        return "<tr><td>" + when(r.created_at) + "</td><td>" + esc(r.admin_email) + "</td><td>" + esc(ACTIONS[r.action] || r.action) +
          "</td><td>" + esc(r.target) + '</td><td class="wrap">' + esc(detailText(r.detail)) + "</td></tr>";
      }).join("") : '<tr><td colspan="5" class="adm-empty">No changes yet.</td></tr>';
      pager($("#l-pager"), res, function (p) { lPage = p; loadLog(); });
    }).catch(fail);
  }

  /* ---------------------------------------------------------------- start */
  if (!API || !KEY) { showLogin("The admin panel isn't configured: set apiBase, supabaseUrl and supabaseKey in config.js."); return; }
  if (session) {
    call("GET", "/admin/me").then(function (me) { session.email = me.email; save(session); showApp(); })
      .catch(function (err) { if ($("#login").hidden && $("#app").hidden) showLogin(err.message); });
  }
  else showLogin("");
})();
