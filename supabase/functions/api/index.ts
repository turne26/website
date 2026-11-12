/*
 * Turne API: the backend behind src/assets/js/api.js.
 * Served at https://<project>.supabase.co/functions/v1/api, which is what apiBase in
 * config.js points to. Endpoint contract: README.md ("Backend integration").
 *
 * Secrets (supabase secrets set NAME=value):
 *   OTP_MODE            "test" (default: every code is 123456, nothing is sent) or "messagecentral"
 *   MC_CUSTOMER_ID      Message Central customer ID, e.g. C-1234ABCD  (OTP_MODE=messagecentral)
 *   MC_AUTH_TOKEN       Auth token from the Message Central console (optional if MC_PASSWORD is set)
 *   MC_PASSWORD         Message Central account password (plain; it's base64-encoded here).
 *                       Used to get a token when MC_AUTH_TOKEN is empty or expired.
 *   MC_FLOW             "SMS" (default) or "WHATSAPP": the channel VerifyNow delivers the code on
 *   ADMIN_EMAILS        Comma-separated emails allowed into the /admin/ panel (Supabase Auth users)
 *   ALLOWED_ORIGINS     Comma-separated extra origins allowed by CORS
 *   LAUNCH_AT           ISO launch moment for the countdown; omit to use config.js
 *   PREMIUM_LIMIT       Lifetime Premium spots (default 10000)
 *   MIN_AGE             Minimum age to join (default 13)
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
 */
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string, d = "") => Deno.env.get(k) ?? d;
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});

const OTP_MODE = env("OTP_MODE", "test");
const PREMIUM_LIMIT = Number(env("PREMIUM_LIMIT", "10000"));
const MIN_AGE = Number(env("MIN_AGE", "13"));
const PEPPER = env("OTP_PEPPER", env("SUPABASE_SERVICE_ROLE_KEY"));

const OTP_TTL_MIN = 10;
const OTP_MAX_TRIES = 5;
const RESEND_AFTER_S = 30;
const SENDS_PER_PHONE_HOUR = 5;
const SENDS_PER_IP_HOUR = 20;
const TOKEN_TTL_MIN = 30;
const FORMS_PER_IP_HOUR = 10;
const ALREADY_REGISTERED = "This number is already on the waitlist, so you're all set. We'll message you before launch.";

const ORIGINS = new Set(
  ["https://turne.in", "https://www.turne.in", ...env("ALLOWED_ORIGINS").split(",")]
    .map((o) => o.trim()).filter(Boolean),
);
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const VERCEL = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

/* ------------------------------------------------------------------ helpers */

class Fail extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const ok = ORIGINS.has(origin) || LOCAL.test(origin) || VERCEL.test(origin);
  return ok
    ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    }
    : { "Vary": "Origin" };
}

function json(req: Request, body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(req), ...extra },
  });
}

function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const a = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isPhone = (p: string) => /^[6-9]\d{9}$/.test(p);
const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function must<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

/** Rows in `table` where `column` = value and `timeColumn` is within the last hour. */
async function countLastHour(table: string, timeColumn: string, column: string, value: string | null) {
  if (!value) return 0;
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true })
    .eq(column, value).gte(timeColumn, new Date(Date.now() - 3600_000).toISOString());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

function ageOn(dob: Date) {
  const t = new Date();
  let a = t.getUTCFullYear() - dob.getUTCFullYear();
  if (t.getUTCMonth() < dob.getUTCMonth() ||
    (t.getUTCMonth() === dob.getUTCMonth() && t.getUTCDate() < dob.getUTCDate())) a -= 1;
  return a;
}

/* ------------------------------------------------------------ Message Central */
// VerifyNow generates, delivers and checks the code itself. We keep only its verificationId.
// Docs: https://www.messagecentral.com/product/verify-now/api

const MC_BASE = "https://cpaas.messagecentral.com";
const MC_FLOW = env("MC_FLOW", "SMS").toUpperCase();
let mcToken: string | null = null;

type McResult = { httpStatus: number; code: number; data: Record<string, unknown> };

async function mcAuthToken(fresh = false) {
  if (mcToken && !fresh) return mcToken;
  // A token pasted from the Message Central console is used as is until it stops working.
  if (!fresh && env("MC_AUTH_TOKEN")) return (mcToken = env("MC_AUTH_TOKEN"));
  if (!env("MC_PASSWORD")) throw new Error("Message Central token rejected and no MC_PASSWORD to renew it");
  const q = new URLSearchParams({
    customerId: env("MC_CUSTOMER_ID"),
    key: btoa(env("MC_PASSWORD")),
    scope: "NEW",
    country: "91",
  });
  const res = await fetch(`${MC_BASE}/auth/v1/authentication/token?${q}`, { headers: { accept: "*/*" } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.token) {
    console.error("message central auth failed", res.status, JSON.stringify(body));
    throw new Error("Message Central auth failed");
  }
  return (mcToken = body.token as string);
}

/** Calls VerifyNow; on an auth error, gets a new token once and retries. */
async function mc(method: "GET" | "POST", path: string, params: Record<string, string>): Promise<McResult> {
  const url = `${MC_BASE}${path}?${new URLSearchParams({ customerId: env("MC_CUSTOMER_ID"), ...params })}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { method, headers: { authToken: await mcAuthToken(attempt > 0) } });
    if ((res.status === 401 || res.status === 403) && attempt === 0) continue;
    const body = await res.json().catch(() => ({}));
    const data = (body.data ?? {}) as Record<string, unknown>;
    const code = Number(data.responseCode ?? body.responseCode ?? res.status);
    if (code !== 200) console.error("message central", path, res.status, JSON.stringify(body));
    return { httpStatus: res.status, code, data };
  }
}

/** Sends a code and returns VerifyNow's verificationId plus its resend window in seconds. */
async function mcSend(phone: string) {
  const r = await mc("POST", "/verification/v3/send", {
    countryCode: "91",
    mobileNumber: phone,
    flowType: MC_FLOW,
    otpLength: "6",
  });
  if (r.code === 506) {
    throw new Fail("rate_limited", "A code is already on its way. Wait a minute before asking for another.", 429);
  }
  if (r.code === 800) throw new Fail("rate_limited", "Too many codes requested. Try again later.", 429);
  if (r.code !== 200 || !r.data.verificationId) {
    throw new Fail("send_failed", "We couldn't send the code. Check the number and try again.", 502);
  }
  return { verificationId: String(r.data.verificationId), timeout: Number(r.data.timeout) || 0 };
}

async function mcValidate(phone: string, verificationId: string, code: string) {
  const r = await mc("GET", "/verification/v3/validateOtp", {
    countryCode: "91",
    mobileNumber: phone,
    verificationId,
    code,
    flowType: MC_FLOW,
  });
  if (r.code === 200 && r.data.verificationStatus === "VERIFICATION_COMPLETED") return;
  if (r.code === 702) throw new Fail("otp_invalid", "That code doesn't match. Check the SMS and try again.");
  if (r.code === 705 || r.code === 703 || r.code === 505) {
    throw new Fail("otp_expired", "That code has expired. Send a new one.");
  }
  if (r.code === 800) throw new Fail("otp_locked", "Too many attempts. Send a new code.", 429);
  throw new Error(`Message Central validate failed: ${r.code}`);
}

/* ------------------------------------------------------------------ endpoints */

async function stats() {
  const { count, error } = await db.from("members").select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  const out: Record<string, unknown> = { waitlistCount: count ?? 0, premiumLimit: PREMIUM_LIMIT };
  if (env("LAUNCH_AT")) out.launchAt = env("LAUNCH_AT");
  return out;
}

async function otpSend(body: Record<string, unknown>, ip: string | null) {
  const phone = str(body.phone, 20);
  if (!isPhone(phone)) throw new Fail("invalid_phone", "Enter a 10-digit Indian mobile number.");

  // Already registered: say so and spend no SMS. Only the fact that it's registered is
  // revealed; the spot, name and invite code still need the OTP (see otpVerify).
  const member = must(await db.from("members").select("id").eq("phone", phone).maybeSingle());
  if (member) throw new Fail("already_registered", ALREADY_REGISTERED, 409);

  const last = must(await db.from("otp_codes").select("sent_at").eq("phone", phone).maybeSingle());
  if (last && Date.now() - Date.parse(last.sent_at) < RESEND_AFTER_S * 1000) {
    throw new Fail("rate_limited", `Wait ${RESEND_AFTER_S} seconds before asking for another code.`, 429);
  }
  if ((await countLastHour("otp_sends", "sent_at", "phone", phone)) >= SENDS_PER_PHONE_HOUR ||
    (await countLastHour("otp_sends", "sent_at", "ip", ip)) >= SENDS_PER_IP_HOUR) {
    throw new Fail("rate_limited", "Too many codes requested. Try again in an hour.", 429);
  }

  const test = OTP_MODE !== "messagecentral";
  const sent = test ? null : await mcSend(phone);

  must(await db.from("otp_codes").upsert({
    phone,
    // Test mode checks the code locally; Message Central checks it on their side.
    code_hash: test ? await sha256(`${PEPPER}:${phone}:123456`) : null,
    provider_ref: sent?.verificationId ?? null,
    attempts: 0,
    expires_at: new Date(Date.now() + OTP_TTL_MIN * 60_000).toISOString(),
    sent_at: new Date().toISOString(),
  }));
  must(await db.from("otp_sends").insert({ phone, ip }));

  const resendAfter = Math.max(RESEND_AFTER_S, sent?.timeout ?? 0);
  return test ? { ok: true, resendAfter, mock: true } : { ok: true, resendAfter };
}

async function otpVerify(body: Record<string, unknown>) {
  const phone = str(body.phone, 20);
  const code = str(body.code, 10);
  if (!isPhone(phone)) throw new Fail("invalid_phone", "Enter a 10-digit Indian mobile number.");

  const rec = must(await db.from("otp_codes").select("*").eq("phone", phone).maybeSingle());
  if (!rec || Date.parse(rec.expires_at) < Date.now()) {
    throw new Fail("otp_expired", "That code has expired. Send a new one.");
  }
  if (rec.attempts >= OTP_MAX_TRIES) {
    throw new Fail("otp_locked", "Too many attempts. Send a new code.", 429);
  }
  if (!/^\d{4,8}$/.test(code)) throw new Fail("otp_invalid", "That code doesn't match. Check the SMS and try again.");
  must(await db.from("otp_codes").update({ attempts: rec.attempts + 1 }).eq("phone", phone));
  if (rec.provider_ref) {
    await mcValidate(phone, rec.provider_ref, code);
  } else if ((await sha256(`${PEPPER}:${phone}:${code}`)) !== rec.code_hash) {
    throw new Fail("otp_invalid", "That code doesn't match. Check the SMS and try again.");
  }
  must(await db.from("otp_codes").delete().eq("phone", phone));

  const token = randomToken();
  must(await db.from("verification_tokens").insert({
    token_hash: await sha256(token),
    phone,
    expires_at: new Date(Date.now() + TOKEN_TTL_MIN * 60_000).toISOString(),
  }));

  const m = must(await db.from("members").select("position, premium, invite_code").eq("phone", phone).maybeSingle());
  return {
    ok: true,
    verificationToken: token,
    existing: m ? { position: m.position, premium: m.premium, inviteCode: m.invite_code } : null,
  };
}

async function waitlist(body: Record<string, unknown>) {
  const token = str(body.verificationToken, 200);
  const hash = token ? await sha256(token) : "";
  const tok = hash
    ? must(await db.from("verification_tokens").select("*").eq("token_hash", hash).maybeSingle())
    : null;
  if (!tok || tok.used_at || Date.parse(tok.expires_at) < Date.now()) {
    throw new Fail("token_invalid", "Your verification expired. Start again.", 401);
  }

  // Honeypot: bots fill the hidden "company" field. Look successful, save nothing.
  if (str(body.company, 200)) return { position: 0, premium: false, inviteCode: "" };

  const name = str(body.name, 100);
  const city = str(body.city, 80);
  const dobRaw = str(body.dob, 10);
  const dob = /^\d{4}-\d{2}-\d{2}$/.test(dobRaw) ? new Date(dobRaw + "T00:00:00Z") : null;
  if (name.length < 2) throw new Fail("invalid_name", "Add your full name.");
  if (!dob || isNaN(dob.getTime()) || ageOn(dob) > 100) throw new Fail("invalid_dob", "Add a valid date of birth.");
  if (ageOn(dob) < MIN_AGE) throw new Fail("too_young", `You need to be at least ${MIN_AGE} to join.`);
  if (!city) throw new Fail("invalid_city", "Pick your city, or choose Other and type it.");

  const u = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;
  const utm = Object.fromEntries(
    ["source", "medium", "campaign", "content", "term"].map((k) => [k, str(u[k], 200) || null]),
  );
  const ref = str(body.ref, 20).toUpperCase() || null;

  const rows = must(await db.rpc("turne_join", {
    p_phone: tok.phone,
    p_name: name,
    p_dob: dobRaw,
    p_city: city,
    p_ref: ref,
    p_utm: utm,
    p_landing: str(body.landing, 300) || null,
    p_premium_limit: PREMIUM_LIMIT,
  })) as { member_position: number; member_premium: boolean; member_invite_code: string }[];
  must(await db.from("verification_tokens").update({ used_at: new Date().toISOString() }).eq("token_hash", hash));

  const r = rows[0];
  return { position: r.member_position, premium: r.member_premium, inviteCode: r.member_invite_code };
}

async function brandEnquiry(body: Record<string, unknown>, ip: string | null) {
  if (str(body.website, 200)) return { ok: true }; // honeypot
  const row = {
    name: str(body.name, 100),
    company: str(body.company, 150),
    email: str(body.email, 200),
    phone: str(body.phone, 30) || null,
    plan: str(body.plan, 50) || null,
    message: str(body.message, 5000) || null,
    ip,
  };
  if (!row.name || !row.company || !isEmail(row.email)) {
    throw new Fail("invalid_form", "Fill in your name, company and a valid email.");
  }
  if ((await countLastHour("brand_enquiries", "created_at", "ip", ip)) >= FORMS_PER_IP_HOUR) {
    throw new Fail("rate_limited", "Too many messages from this connection. Try again in an hour.", 429);
  }
  must(await db.from("brand_enquiries").insert(row));
  return { ok: true };
}

async function contact(body: Record<string, unknown>, ip: string | null) {
  if (str(body.website, 200)) return { ok: true }; // honeypot
  const row = {
    name: str(body.name, 100),
    email: str(body.email, 200),
    topic: str(body.topic, 50) || null,
    message: str(body.message, 5000),
    ip,
  };
  if (!row.name || !isEmail(row.email) || !row.message) {
    throw new Fail("invalid_form", "Fill in your name, a valid email and your message.");
  }
  if ((await countLastHour("contact_messages", "created_at", "ip", ip)) >= FORMS_PER_IP_HOUR) {
    throw new Fail("rate_limited", "Too many messages from this connection. Try again in an hour.", 429);
  }
  must(await db.from("contact_messages").insert(row));
  return { ok: true };
}

/* ------------------------------------------------------------------ admin */
// The /admin/ page signs in with Supabase Auth (email + password) and sends the session's
// access token. Only confirmed accounts whose email is in ADMIN_EMAILS get through.

const ADMIN_EMAILS = new Set(
  env("ADMIN_EMAILS").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
);
const ADMIN_PAGE = 50;
const STATUSES = new Set(["new", "in_progress", "done", "spam"]);

async function requireAdmin(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!jwt) throw new Fail("unauthorized", "Sign in to continue.", 401);
  const { data, error } = await db.auth.getUser(jwt);
  const user = data?.user;
  if (error || !user) throw new Fail("unauthorized", "Your session expired. Sign in again.", 401);
  const email = (user.email ?? "").toLowerCase();
  if (!user.email_confirmed_at || !ADMIN_EMAILS.has(email)) {
    throw new Fail("forbidden", "This account doesn't have admin access.", 403);
  }
  return email;
}

async function audit(admin: string, action: string, target: string, detail: Record<string, unknown> = {}) {
  must(await db.from("admin_log").insert({ admin_email: admin, action, target, detail }));
}

const maskPhone = (p: string) => p.slice(0, 2) + "xxxxxx" + p.slice(-2);
const pageOf = (url: URL) => Math.max(0, Math.floor(Number(url.searchParams.get("page")) || 0));
/** Search text safe to put inside a PostgREST or() filter. */
const searchText = (s: string) => s.replace(/[^\p{L}\p{N} @._+-]/gu, "").trim().slice(0, 60);

async function adminOverview() {
  return must(await db.rpc("turne_admin_overview", { p_premium_limit: PREMIUM_LIMIT }));
}

async function adminMembers(url: URL) {
  const p = url.searchParams;
  const page = pageOf(url);
  let q = db.from("admin_members").select("*", { count: "exact" });

  const s = searchText(p.get("q") ?? "");
  if (s) {
    const ors = [`name.ilike."*${s}*"`, `city.ilike."*${s}*"`, `invite_code.ilike."*${s}*"`];
    const digits = s.replace(/\D/g, "");
    if (digits.length >= 3 && /^[\d\s+-]+$/.test(s)) ors.push(`phone.ilike."*${digits.slice(-10)}*"`);
    if (/^\d+$/.test(s)) ors.push(`position.eq.${Number(s)}`);
    q = q.or(ors.join(","));
  }
  const city = str(p.get("city"), 80);
  if (city) q = q.eq("city", city);
  const tier = p.get("tier");
  if (tier === "premium") q = q.eq("premium", true);
  if (tier === "member") q = q.eq("premium", false);

  const sort = p.get("sort");
  q = sort === "oldest" ? q.order("position", { ascending: true })
    : sort === "name" ? q.order("name", { ascending: true })
    : q.order("position", { ascending: false });

  const { data, count, error } = await q.range(page * ADMIN_PAGE, page * ADMIN_PAGE + ADMIN_PAGE - 1);
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0, page, pageSize: ADMIN_PAGE };
}

function csvCell(v: unknown) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // stop spreadsheet formulas
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function adminExport(req: Request) {
  const cols = ["position", "name", "phone", "dob", "city", "premium", "invite_code", "referrer_position",
    "referrals", "ref_code", "utm_source", "utm_medium", "utm_campaign", "landing", "created_at"];
  const lines = [cols.join(",")];
  for (let from = 0; ; from += 1000) {
    const rows = must(await db.from("admin_members").select(cols.join(","))
      .order("position", { ascending: true }).range(from, from + 999)) as unknown as Record<string, unknown>[];
    for (const r of rows) {
      lines.push(cols.map((c) => csvCell(c === "phone" ? "+91" + r[c] : r[c])).join(","));
    }
    if (rows.length < 1000) break;
  }
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "no-store", ...cors(req) },
  });
}

async function adminMemberUpdate(admin: string, body: Record<string, unknown>) {
  const id = Number(body.id);
  if (!Number.isInteger(id)) throw new Fail("bad_request", "Missing member id.");
  const before = must(await db.from("members").select("position, name, dob, city, premium").eq("id", id).maybeSingle());
  if (!before) throw new Fail("not_found", "That member no longer exists.", 404);

  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) {
    const name = str(body.name, 100);
    if (name.length < 2) throw new Fail("invalid_name", "Name needs at least 2 characters.");
    patch.name = name;
  }
  if (body.city !== undefined) {
    const city = str(body.city, 80);
    if (!city) throw new Fail("invalid_city", "City can't be empty.");
    patch.city = city;
  }
  if (body.dob !== undefined) {
    const dob = str(body.dob, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob) || isNaN(Date.parse(dob + "T00:00:00Z"))) {
      throw new Fail("invalid_dob", "Date of birth must be a valid date.");
    }
    patch.dob = dob;
  }
  if (body.premium !== undefined) patch.premium = body.premium === true;

  const changes = Object.fromEntries(Object.entries(patch)
    .filter(([k, v]) => String((before as Record<string, unknown>)[k]) !== String(v))
    .map(([k, v]) => [k, { from: (before as Record<string, unknown>)[k], to: v }]));
  if (!Object.keys(changes).length) return { ok: true, changed: false };

  must(await db.from("members").update(patch).eq("id", id));
  await audit(admin, "member.update", `#${before.position}`, changes);
  return { ok: true, changed: true };
}

async function adminMemberDelete(admin: string, body: Record<string, unknown>) {
  const id = Number(body.id);
  if (!Number.isInteger(id)) throw new Fail("bad_request", "Missing member id.");
  const m = must(await db.from("members").select("position, phone").eq("id", id).maybeSingle());
  if (!m) throw new Fail("not_found", "That member no longer exists.", 404);
  // Everything tied to the number goes, so a deletion request is complete.
  must(await db.from("members").delete().eq("id", id));
  must(await db.from("otp_codes").delete().eq("phone", m.phone));
  must(await db.from("otp_sends").delete().eq("phone", m.phone));
  must(await db.from("verification_tokens").delete().eq("phone", m.phone));
  await audit(admin, "member.delete", `#${m.position}`, { phone: maskPhone(m.phone) });
  return { ok: true };
}

const INBOX = { enquiries: "brand_enquiries", messages: "contact_messages" } as const;
type Inbox = keyof typeof INBOX;

async function adminInbox(kind: Inbox, url: URL) {
  const page = pageOf(url);
  let q = db.from(INBOX[kind]).select("*", { count: "exact" });
  const status = url.searchParams.get("status") ?? "";
  if (STATUSES.has(status)) q = q.eq("status", status);
  const { data, count, error } = await q.order("created_at", { ascending: false })
    .range(page * ADMIN_PAGE, page * ADMIN_PAGE + ADMIN_PAGE - 1);
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0, page, pageSize: ADMIN_PAGE };
}

async function adminInboxUpdate(admin: string, kind: Inbox, body: Record<string, unknown>) {
  const id = Number(body.id);
  if (!Number.isInteger(id)) throw new Fail("bad_request", "Missing id.");
  const patch: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!STATUSES.has(String(body.status))) throw new Fail("bad_request", "Unknown status.");
    patch.status = body.status;
  }
  if (body.note !== undefined) patch.admin_note = str(body.note, 2000) || null;
  if (!Object.keys(patch).length) return { ok: true };
  const rows = must(await db.from(INBOX[kind]).update(patch).eq("id", id).select("id")) as unknown[];
  if (!rows.length) throw new Fail("not_found", "That item no longer exists.", 404);
  await audit(admin, `${kind}.update`, `${kind}#${id}`, patch);
  return { ok: true };
}

async function adminLog(url: URL) {
  const page = pageOf(url);
  const { data, count, error } = await db.from("admin_log").select("*", { count: "exact" })
    .order("created_at", { ascending: false }).range(page * ADMIN_PAGE, page * ADMIN_PAGE + ADMIN_PAGE - 1);
  if (error) throw new Error(error.message);
  return { rows: data ?? [], total: count ?? 0, page, pageSize: ADMIN_PAGE };
}

async function adminRoute(req: Request, path: string) {
  const admin = await requireAdmin(req);
  const url = new URL(req.url);
  const noStore = { "Cache-Control": "no-store" };

  if (req.method === "GET") {
    switch (path) {
      case "/admin/me": return json(req, { email: admin }, 200, noStore);
      case "/admin/overview": return json(req, await adminOverview(), 200, noStore);
      case "/admin/members": return json(req, await adminMembers(url), 200, noStore);
      case "/admin/members/export": return await adminExport(req);
      case "/admin/enquiries": return json(req, await adminInbox("enquiries", url), 200, noStore);
      case "/admin/messages": return json(req, await adminInbox("messages", url), 200, noStore);
      case "/admin/log": return json(req, await adminLog(url), 200, noStore);
    }
    throw new Fail("not_found", "Not found.", 404);
  }
  if (req.method !== "POST") throw new Fail("not_found", "Not found.", 404);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { throw new Fail("bad_request", "Send a JSON body.", 400); }
  if (!body || typeof body !== "object") throw new Fail("bad_request", "Send a JSON body.", 400);

  switch (path) {
    case "/admin/members/update": return json(req, await adminMemberUpdate(admin, body));
    case "/admin/members/delete": return json(req, await adminMemberDelete(admin, body));
    case "/admin/enquiries/update": return json(req, await adminInboxUpdate(admin, "enquiries", body));
    case "/admin/messages/update": return json(req, await adminInboxUpdate(admin, "messages", body));
  }
  throw new Fail("not_found", "Not found.", 404);
}

/* ------------------------------------------------------------------ router */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });

  // The function sees /api/<route>; strip everything up to and including "/api".
  const path = new URL(req.url).pathname.replace(/^.*?\/api(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  const ip = clientIp(req);

  try {
    if (req.method === "GET" && path === "/stats") {
      return json(req, await stats(), 200, { "Cache-Control": "public, max-age=20" });
    }
    if (path === "/admin" || path.startsWith("/admin/")) return await adminRoute(req, path);
    if (req.method !== "POST") throw new Fail("not_found", "Not found.", 404);

    let body: Record<string, unknown>;
    try { body = await req.json(); } catch { throw new Fail("bad_request", "Send a JSON body.", 400); }
    if (!body || typeof body !== "object") throw new Fail("bad_request", "Send a JSON body.", 400);

    switch (path) {
      case "/otp/send": return json(req, await otpSend(body, ip));
      case "/otp/verify": return json(req, await otpVerify(body));
      case "/waitlist": return json(req, await waitlist(body));
      case "/brands/enquiry": return json(req, await brandEnquiry(body, ip));
      case "/contact": return json(req, await contact(body, ip));
    }
    throw new Fail("not_found", "Not found.", 404);
  } catch (e) {
    if (e instanceof Fail) return json(req, { error: { code: e.code, message: e.message } }, e.status);
    console.error(e);
    return json(req, { error: { code: "server_error", message: "Something went wrong on our side. Try again in a minute." } }, 500);
  }
});
