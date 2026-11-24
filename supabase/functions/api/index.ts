/*
 * Turne API: the backend behind lib/api.ts.
 * Served at https://<project>.supabase.co/functions/v1/api, which is what apiBase in
 * lib/config.ts points to. Endpoint contract: README.md ("Backend integration").
 *
 * Secrets (supabase secrets set NAME=value):
 *   OTP_MODE            "test" (default: every code is 123456, nothing is sent) or "whatsapp"
 *   WA_ACCESS_TOKEN     Permanent System User access token (Meta Business Settings), with
 *                       whatsapp_business_messaging permission          (OTP_MODE=whatsapp)
 *   WA_PHONE_NUMBER_ID  Phone number ID of the sending number (WhatsApp Manager -> API Setup)
 *   WA_TEMPLATE         Name of the approved Authentication template (default "turne_otp")
 *   WA_TEMPLATE_LANG    Template language code (default "en")
 *   WA_GRAPH_VERSION    Graph API version (default "v23.0")
 *   WA_VERIFY_TOKEN     Any random string; paste the same value as "Verify token" in the Meta
 *                       app's WhatsApp -> Configuration -> Webhook
 *   WA_APP_SECRET       App secret (App settings -> Basic), used to check webhook signatures
 *   OTP_PEPPER          Random secret mixed into stored code hashes
 *   ADMIN_EMAILS        Comma-separated emails allowed into the /admin/ panel (Supabase Auth users)
 *   ALLOWED_ORIGINS     Comma-separated extra origins allowed by CORS
 *   LAUNCH_AT           ISO launch moment for the countdown; omit to use lib/config.ts
 *   PREMIUM_LIMIT       2-Year Premium spots (default 10000)
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
  ["https://turne.in", "https://www.turne.in", "https://brands.turne.in", ...env("ALLOWED_ORIGINS").split(",")]
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

/* ------------------------------------------------------- WhatsApp (Meta Cloud API) */
// We generate the code, store only its hash, and deliver it with an approved Authentication
// template (body "{{1}} is your verification code." + a "Copy code" button).
// Docs: https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates

const WA_VERSION = env("WA_GRAPH_VERSION", "v23.0");
const WA_TEMPLATE = env("WA_TEMPLATE", "turne_otp");
const WA_LANG = env("WA_TEMPLATE_LANG", "en");

/** A uniformly random 6-digit code (no modulo bias). */
function newCode() {
  const a = new Uint32Array(1);
  do crypto.getRandomValues(a); while (a[0] >= 4_294_000_000);
  return String(a[0] % 1_000_000).padStart(6, "0");
}

/** Sends `code` to +91 `phone` on WhatsApp and returns Meta's message id (wamid). */
async function waSend(phone: string, code: string) {
  if (!env("WA_ACCESS_TOKEN") || !env("WA_PHONE_NUMBER_ID")) {
    throw new Error("OTP_MODE=whatsapp but WA_ACCESS_TOKEN / WA_PHONE_NUMBER_ID are not set");
  }
  const res = await fetch(`https://graph.facebook.com/${WA_VERSION}/${env("WA_PHONE_NUMBER_ID")}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${env("WA_ACCESS_TOKEN")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${phone}`,
      type: "template",
      template: {
        name: WA_TEMPLATE,
        language: { code: WA_LANG },
        components: [
          { type: "body", parameters: [{ type: "text", text: code }] },
          // The copy-code button of an Authentication template carries the code too.
          { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: code }] },
        ],
      },
    }),
  });
  const body = await res.json().catch(() => ({}));
  const id = body?.messages?.[0]?.id;
  if (res.ok && id) return String(id);

  const err = body?.error ?? {};
  console.error("whatsapp send failed", res.status, JSON.stringify(err));
  const c = Number(err.code);
  // 130429 throughput, 131056 too many messages to this number, 80007/4/80008 account limits.
  if ([130429, 131056, 80007, 80008, 4].includes(c)) {
    throw new Fail("rate_limited", "Too many codes requested. Try again in a few minutes.", 429);
  }
  // 131026 undeliverable (not on WhatsApp, old app, or hasn't accepted terms); 131030 not in
  // the test recipient list while the app is in development; 131009/100 bad number.
  if ([131026, 131030, 131009, 100].includes(c)) {
    throw new Fail("send_failed", "We couldn't reach this number on WhatsApp. Check it's your WhatsApp number and try again.", 502);
  }
  // Anything else (expired token 190, missing template 132001, ...) is our problem, not theirs.
  throw new Fail("send_failed", "We couldn't send the code right now. Try again in a minute.", 502);
}

/* ------------------------------------------------------- WhatsApp inbox helpers */

const graph = (path: string) => `https://graph.facebook.com/${WA_VERSION}/${path}`;
const waHeaders = () => ({ "Authorization": `Bearer ${env("WA_ACCESS_TOKEN")}`, "Content-Type": "application/json" });

/** Records a message in the admin inbox (wa_messages + wa_contacts). Never throws: logging must
 *  not break an OTP send or a webhook. */
async function waLog(m: {
  waId: string; direction: "in" | "out"; kind: string; body: string | null; wamid?: string | null;
  mediaId?: string | null; mediaMime?: string | null; status?: string | null; sentBy?: string | null;
  profileName?: string | null; at?: string;
}) {
  const { error } = await db.rpc("wa_log_message", {
    p_wa_id: m.waId, p_direction: m.direction, p_kind: m.kind, p_body: m.body,
    p_wamid: m.wamid ?? null, p_media_id: m.mediaId ?? null, p_media_mime: m.mediaMime ?? null,
    p_status: m.status ?? null, p_sent_by: m.sentBy ?? null, p_profile_name: m.profileName ?? null,
    p_created_at: m.at ?? new Date().toISOString(),
  });
  if (error) console.error("wa_log_message failed", error.message);
}

/** Sends a free-text WhatsApp message (only allowed within 24 hours of their last message). */
async function waSendText(waId: string, text: string) {
  const res = await fetch(graph(`${env("WA_PHONE_NUMBER_ID")}/messages`), {
    method: "POST",
    headers: waHeaders(),
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: waId, type: "text", text: { body: text, preview_url: true } }),
  });
  const body = await res.json().catch(() => ({}));
  const id = body?.messages?.[0]?.id;
  if (res.ok && id) return String(id);
  const err = body?.error ?? {};
  console.error("whatsapp text send failed", res.status, JSON.stringify(err));
  if (Number(err.code) === 131047) {
    throw new Fail("window_closed", "More than 24 hours have passed since their last message, so WhatsApp only allows approved templates now.", 409);
  }
  throw new Fail("send_failed", `WhatsApp didn't accept the message${err.message ? `: ${err.message}` : "."}`, 502);
}

/** One line of text for any incoming message type, for the inbox list and thread. */
function describeIncoming(msg: any): { kind: string; body: string; mediaId: string | null; mime: string | null } {
  const t = String(msg?.type ?? "unknown");
  const media = msg?.[t] ?? {};
  switch (t) {
    case "text": return { kind: t, body: String(msg.text?.body ?? ""), mediaId: null, mime: null };
    case "button": return { kind: t, body: String(msg.button?.text ?? ""), mediaId: null, mime: null };
    case "interactive": {
      const r = msg.interactive?.button_reply ?? msg.interactive?.list_reply ?? {};
      return { kind: t, body: String(r.title ?? "[reply]"), mediaId: null, mime: null };
    }
    case "image": case "video": case "document": case "audio": case "sticker": {
      const label = { image: "Photo", video: "Video", document: "Document", audio: "Voice message", sticker: "Sticker" }[t];
      const extra = media.caption || media.filename || "";
      return { kind: t, body: extra ? `${extra}` : `[${label}]`, mediaId: media.id ?? null, mime: media.mime_type ?? null };
    }
    case "location": {
      const l = msg.location ?? {};
      return { kind: t, body: `[Location] ${l.name ?? ""} ${l.latitude ?? ""},${l.longitude ?? ""}`.trim(), mediaId: null, mime: null };
    }
    case "reaction": return { kind: t, body: msg.reaction?.emoji ? `Reacted ${msg.reaction.emoji}` : "Removed a reaction", mediaId: null, mime: null };
    case "contacts": return { kind: t, body: "[Contact card]", mediaId: null, mime: null };
    default: return { kind: t, body: `[${t} message]`, mediaId: null, mime: null };
  }
}

/* ------------------------------------------------------------ WhatsApp webhook */
// Callback URL: https://<project>.supabase.co/functions/v1/api/whatsapp/webhook
// GET  = Meta's one-time verification handshake.
// POST = message status updates and incoming messages, signed with the app secret.

function waVerify(req: Request) {
  const q = new URL(req.url).searchParams;
  const token = env("WA_VERIFY_TOKEN");
  if (q.get("hub.mode") === "subscribe" && token && q.get("hub.verify_token") === token) {
    return new Response(q.get("hub.challenge") ?? "", { status: 200, headers: { "Content-Type": "text/plain" } });
  }
  return new Response("Forbidden", { status: 403 });
}

async function validSignature(raw: string, header: string | null) {
  const secret = env("WA_APP_SECRET");
  if (!secret || !header?.startsWith("sha256=")) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  const hex = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
  const got = header.slice(7);
  if (got.length !== hex.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}

const STOP_WORDS = new Set(["stop", "unsubscribe", "stop all", "cancel"]);
const START_WORDS = new Set(["start", "subscribe", "unstop"]);

/** Indian +91 numbers come in as "91XXXXXXXXXX"; we store the 10-digit form. */
const localPhone = (waId: string) => (/^91[6-9]\d{9}$/.test(waId) ? waId.slice(2) : null);

async function waWebhook(req: Request) {
  const raw = await req.text();
  if (!(await validSignature(raw, req.headers.get("x-hub-signature-256")))) {
    console.error("whatsapp webhook: bad or missing signature");
    return new Response("Bad signature", { status: 401 });
  }
  let payload: any;
  try { payload = JSON.parse(raw); } catch { return new Response("ok"); }

  for (const entry of payload?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      const v = change?.value ?? {};
      for (const st of v.statuses ?? []) {
        const errText = st.errors?.length
          ? st.errors.map((e: any) => `${e.code} ${e.title ?? ""} ${e.error_data?.details ?? ""}`.trim()).join("; ")
          : null;
        if (st.status === "failed") console.error("whatsapp delivery failed", st.id, st.recipient_id, errText);
        const at = st.timestamp ? new Date(Number(st.timestamp) * 1000).toISOString() : new Date().toISOString();
        const { error } = await db.rpc("wa_set_status", { p_wamid: String(st.id), p_status: String(st.status), p_error: errText, p_at: at });
        if (error) console.error("wa_set_status failed", error.message);
      }
      const names = new Map<string, string>(
        (v.contacts ?? []).map((c: any) => [String(c.wa_id), String(c.profile?.name ?? "")] as [string, string]),
      );
      for (const msg of v.messages ?? []) {
        const from = String(msg?.from ?? "");
        const d = describeIncoming(msg);
        await waLog({
          waId: from, direction: "in", kind: d.kind, body: d.body, wamid: String(msg.id),
          mediaId: d.mediaId, mediaMime: d.mime, profileName: names.get(from) || null,
          at: msg.timestamp ? new Date(Number(msg.timestamp) * 1000).toISOString() : undefined,
        });
        const text = String(msg?.text?.body ?? msg?.button?.text ?? "").trim().toLowerCase();
        const phone = localPhone(from);
        if (!phone) continue;
        if (STOP_WORDS.has(text)) {
          must(await db.from("members").update({ whatsapp_opted_out_at: new Date().toISOString() }).eq("phone", phone));
        } else if (START_WORDS.has(text)) {
          must(await db.from("members").update({ whatsapp_opted_out_at: null }).eq("phone", phone));
        }
      }
    }
  }
  // Always 200 quickly, or Meta retries the same event for days.
  return new Response("ok");
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

  // Waitlist sign-up only: if the number is already on the waitlist, say so and spend no message.
  // Only the fact that it's registered is revealed; the spot, name and invite code still need
  // the OTP (see otpVerify). Brand registrations (purpose "brand") verify any number: a
  // marketing lead who joined the waitlist personally can still register their brand.
  if (body.purpose !== "brand") {
    const member = must(await db.from("members").select("id").eq("phone", phone).maybeSingle());
    if (member) throw new Fail("already_registered", ALREADY_REGISTERED, 409);
  }

  const last = must(await db.from("otp_codes").select("sent_at").eq("phone", phone).maybeSingle());
  if (last && Date.now() - Date.parse(last.sent_at) < RESEND_AFTER_S * 1000) {
    throw new Fail("rate_limited", `Wait ${RESEND_AFTER_S} seconds before asking for another code.`, 429);
  }
  if ((await countLastHour("otp_sends", "sent_at", "phone", phone)) >= SENDS_PER_PHONE_HOUR ||
    (await countLastHour("otp_sends", "sent_at", "ip", ip)) >= SENDS_PER_IP_HOUR) {
    throw new Fail("rate_limited", "Too many codes requested. Try again in an hour.", 429);
  }

  const test = OTP_MODE !== "whatsapp";
  const code = test ? "123456" : newCode();
  const messageId = test ? null : await waSend(phone, code);
  // Show it in the admin WhatsApp inbox. Never the code itself.
  if (messageId) {
    await waLog({ waId: `91${phone}`, direction: "out", kind: "otp", body: "Verification code sent (turne_otp template)", wamid: messageId, sentBy: "system" });
  }

  must(await db.from("otp_codes").upsert({
    phone,
    code_hash: await sha256(`${PEPPER}:${phone}:${code}`),
    provider_ref: messageId,
    attempts: 0,
    expires_at: new Date(Date.now() + OTP_TTL_MIN * 60_000).toISOString(),
    sent_at: new Date().toISOString(),
  }));
  must(await db.from("otp_sends").insert({ phone, ip }));

  return test ? { ok: true, resendAfter: RESEND_AFTER_S, mock: true } : { ok: true, resendAfter: RESEND_AFTER_S };
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
  if (!/^\d{4,8}$/.test(code)) throw new Fail("otp_invalid", "That code doesn't match. Check WhatsApp and try again.");
  must(await db.from("otp_codes").update({ attempts: rec.attempts + 1 }).eq("phone", phone));
  if ((await sha256(`${PEPPER}:${phone}:${code}`)) !== rec.code_hash) {
    throw new Fail("otp_invalid", "That code doesn't match. Check WhatsApp and try again.");
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
  if (!city) throw new Fail("invalid_city", "Add your city.");

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

const BRAND_CATEGORIES = new Set([
  "Consumer tech", "Fashion and beauty", "Food and beverage", "Education", "Finance and fintech",
  "Gaming and entertainment", "Health and fitness", "Startup or accelerator", "Media and agency", "Other",
]);
const BRAND_SIZES = new Set(["1-10", "11-50", "51-200", "201-1000", "1000+"]);
const BRAND_INTERESTS = new Set(["Events", "Product launches", "Giveaways", "Startup rooms and demo days", "Community"]);
const BRAND_TIMELINES = new Set(["At launch", "Within 3 months", "3 to 6 months", "Just exploring"]);

/** Registration from brands.turne.in: stored in brand_enquiries with source = 'registration'. */
async function brandRegister(body: Record<string, unknown>, ip: string | null) {
  if (str(body.website, 200)) return { ok: true, reference: "" }; // honeypot
  const pick = (v: unknown, allowed: Set<string>) => { const x = str(v, 60); return allowed.has(x) ? x : null; };
  const interests = Array.isArray(body.interests)
    ? [...new Set(body.interests.map((i) => str(i, 60)).filter((i) => BRAND_INTERESTS.has(i)))]
    : [];
  const token = str(body.verificationToken, 200);
  if (!token) throw new Fail("token_invalid", "Please verify your mobile number on WhatsApp first.", 401);
  const row = {
    source: "registration",
    company: str(body.company, 150),
    legal_name: str(body.legal_name, 200) || null,
    website_url: str(body.website_url, 300),
    category: pick(body.category, BRAND_CATEGORIES),
    city: str(body.city, 80),
    company_size: pick(body.company_size, BRAND_SIZES),
    name: str(body.name, 100),
    role: str(body.role, 100),
    email: str(body.email, 200),
    phone: "",
    interests,
    timeline: pick(body.timeline, BRAND_TIMELINES),
    plan: interests.join(", ") || null,
    message: str(body.message, 5000) || null,
    ip,
  };
  if (!row.company || !row.website_url || !row.category || !row.city) {
    throw new Fail("invalid_form", "Add your brand name, website or Instagram, category and city.");
  }
  if (!row.name || !row.role || !isEmail(row.email)) {
    throw new Fail("invalid_form", "Add your name, role and a valid work email.");
  }
  if (!interests.length) throw new Fail("invalid_form", "Pick at least one thing you'd like to run on Turne.");
  if (body.consent !== true) throw new Fail("invalid_form", "Please agree to be contacted about your registration.");
  if ((await countLastHour("brand_enquiries", "created_at", "ip", ip)) >= FORMS_PER_IP_HOUR) {
    throw new Fail("rate_limited", "Too many registrations from this connection. Try again in an hour.", 429);
  }
  // Last: the contact's mobile must have been verified by WhatsApp OTP (/otp/send with purpose
  // "brand", then /otp/verify). Using the token up in one statement means it works only once,
  // and checking it last means a typo elsewhere doesn't cost the person a new code.
  const used = must(await db.from("verification_tokens").update({ used_at: new Date().toISOString() })
    .eq("token_hash", await sha256(token)).is("used_at", null).gt("expires_at", new Date().toISOString())
    .select("phone")) as { phone: string }[];
  if (!used.length) throw new Fail("token_invalid", "Your WhatsApp verification expired. Verify your number again.", 401);
  row.phone = used[0].phone;
  const saved = must(await db.from("brand_enquiries").insert(row).select("id").single()) as { id: number };
  return { ok: true, reference: `TB-${String(saved.id).padStart(5, "0")}` };
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

/* ---------------------------------------------------------- admin: WhatsApp inbox */

const WINDOW_MS = 24 * 3600_000;
const localOf = (waId: string) => (/^91[6-9]\d{9}$/.test(waId) ? waId.slice(2) : null);
const cleanWaId = (v: unknown) => { const d = str(v, 20).replace(/\D/g, ""); return /^\d{8,15}$/.test(d) ? d : ""; };

/** Names and tags for a set of numbers: waitlist member and brand registrations. */
async function waPeople(waIds: string[]) {
  const phones = waIds.map(localOf).filter(Boolean) as string[];
  const members = phones.length
    ? must(await db.from("members").select("phone, name, position, premium, city, created_at, whatsapp_opted_out_at").in("phone", phones)) as any[]
    : [];
  const brands = phones.length
    ? must(await db.from("brand_enquiries").select("id, phone, company, name, source, status, created_at").in("phone", phones).order("created_at", { ascending: false })) as any[]
    : [];
  return { members: new Map(members.map((m) => [m.phone, m])), brands };
}

async function adminWaSummary() {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const count = async (f: (q: any) => any) => {
    const { count, error } = await f(db.from("wa_contacts").select("wa_id", { count: "exact", head: true }));
    if (error) throw new Error(error.message);
    return count ?? 0;
  };
  return {
    total: await count((q) => q),
    needsReply: await count((q) => q.eq("last_direction", "in")),
    unread: await count((q) => q.gt("unread", 0)),
    open: await count((q) => q.gte("last_in_at", since)),
  };
}

async function adminWaConversations(url: URL) {
  const page = pageOf(url);
  const filter = url.searchParams.get("filter") ?? "all";
  const term = str(url.searchParams.get("q"), 60).replace(/[%,()*"]/g, "");
  let q = db.from("wa_contacts").select("*", { count: "exact" });
  if (filter === "reply") q = q.eq("last_direction", "in");
  if (filter === "unread") q = q.gt("unread", 0);
  if (filter === "open") q = q.gte("last_in_at", new Date(Date.now() - WINDOW_MS).toISOString());
  if (term) {
    // Match the number, their WhatsApp name, or the name they used on the waitlist.
    const digits = term.replace(/\D/g, "");
    const byName = must(await db.from("members").select("phone").ilike("name", `%${term}%`).limit(50)) as { phone: string }[];
    const ors = [`profile_name.ilike.*${term}*`];
    if (digits.length >= 3) ors.push(`wa_id.like.*${digits}*`);
    if (byName.length) ors.push(`wa_id.in.(${byName.map((m) => "91" + m.phone).join(",")})`);
    q = q.or(ors.join(","));
  }
  const { data, count, error } = await q.order("last_at", { ascending: false }).range(page * ADMIN_PAGE, page * ADMIN_PAGE + ADMIN_PAGE - 1);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as any[];
  const people = await waPeople(rows.map((r) => r.wa_id));
  return {
    rows: rows.map((r) => {
      const phone = localOf(r.wa_id);
      const m = phone ? people.members.get(phone) : null;
      const b = phone ? people.brands.find((x) => x.phone === phone && x.source === "registration") : null;
      return {
        ...r,
        name: m?.name || (b ? `${b.name} · ${b.company}` : null) || r.profile_name || null,
        member: m ? { position: m.position, premium: m.premium, optedOut: !!m.whatsapp_opted_out_at } : null,
        brand: b ? { company: b.company } : null,
        windowOpen: !!r.last_in_at && Date.now() - Date.parse(r.last_in_at) < WINDOW_MS,
      };
    }),
    total: count ?? 0, page, pageSize: ADMIN_PAGE,
  };
}

async function adminWaThread(url: URL) {
  const waId = cleanWaId(url.searchParams.get("wa_id"));
  if (!waId) throw new Fail("bad_request", "Missing number.");
  const contact = must(await db.from("wa_contacts").select("*").eq("wa_id", waId).maybeSingle()) as any;
  if (!contact) throw new Fail("not_found", "No conversation with that number.", 404);
  let q = db.from("wa_messages").select("id, wamid, direction, kind, body, media_id, media_mime, status, error, sent_by, created_at")
    .eq("wa_id", waId).order("created_at", { ascending: false }).limit(60);
  const before = Number(url.searchParams.get("before"));
  if (Number.isInteger(before) && before > 0) q = q.lt("id", before);
  const msgs = (must(await q) as any[]).reverse();
  const phone = localOf(waId);
  const people = await waPeople([waId]);
  const m = phone ? people.members.get(phone) : null;
  const windowUntil = contact.last_in_at ? new Date(Date.parse(contact.last_in_at) + WINDOW_MS).toISOString() : null;
  return {
    contact: { ...contact, windowUntil, windowOpen: !!windowUntil && Date.parse(windowUntil) > Date.now() },
    messages: msgs,
    member: m ? { position: m.position, name: m.name, premium: m.premium, city: m.city, joined: m.created_at, optedOut: !!m.whatsapp_opted_out_at } : null,
    brands: people.brands.map((b) => ({ id: b.id, company: b.company, name: b.name, source: b.source, status: b.status, created_at: b.created_at })),
    hasMore: msgs.length === 60,
  };
}

async function adminWaSend(admin: string, body: Record<string, unknown>) {
  const waId = cleanWaId(body.wa_id);
  const text = str(body.text, 4096);
  if (!waId || !text) throw new Fail("bad_request", "Write a message first.");
  const contact = must(await db.from("wa_contacts").select("last_in_at").eq("wa_id", waId).maybeSingle()) as any;
  if (!contact?.last_in_at || Date.now() - Date.parse(contact.last_in_at) >= WINDOW_MS) {
    throw new Fail("window_closed", "More than 24 hours have passed since their last message, so WhatsApp only allows approved templates now.", 409);
  }
  const wamid = await waSendText(waId, text);
  await waLog({ waId, direction: "out", kind: "text", body: text, wamid, sentBy: admin });
  must(await db.from("wa_contacts").update({ unread: 0 }).eq("wa_id", waId));
  await audit(admin, "whatsapp.send", `wa:${waId}`, { chars: text.length });
  return { ok: true, wamid };
}

async function adminWaRead(body: Record<string, unknown>) {
  const waId = cleanWaId(body.wa_id);
  if (!waId) throw new Fail("bad_request", "Missing number.");
  must(await db.from("wa_contacts").update({ unread: 0 }).eq("wa_id", waId));
  return { ok: true };
}

/** Streams a photo or file someone sent us (WhatsApp media needs our token to download). */
async function adminWaMedia(req: Request, url: URL) {
  const id = str(url.searchParams.get("id"), 64);
  if (!/^\d+$/.test(id)) throw new Fail("bad_request", "Missing media id.");
  const known = must(await db.from("wa_messages").select("id").eq("media_id", id).limit(1)) as unknown[];
  if (!known.length) throw new Fail("not_found", "Unknown media.", 404);
  const meta = await fetch(graph(id), { headers: waHeaders() }).then((r) => r.json()).catch(() => ({}));
  if (!meta?.url) throw new Fail("not_found", "WhatsApp no longer has this file (media expires after 30 days).", 404);
  const file = await fetch(meta.url, { headers: { Authorization: `Bearer ${env("WA_ACCESS_TOKEN")}` } });
  if (!file.ok) throw new Fail("not_found", "Couldn't download this file from WhatsApp.", 502);
  return new Response(file.body, {
    headers: { ...cors(req), "Content-Type": meta.mime_type || "application/octet-stream", "Cache-Control": "private, max-age=3600" },
  });
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
      case "/admin/wa/summary": return json(req, await adminWaSummary(), 200, noStore);
      case "/admin/wa/conversations": return json(req, await adminWaConversations(url), 200, noStore);
      case "/admin/wa/thread": return json(req, await adminWaThread(url), 200, noStore);
      case "/admin/wa/media": return await adminWaMedia(req, url);
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
    case "/admin/wa/send": return json(req, await adminWaSend(admin, body));
    case "/admin/wa/read": return json(req, await adminWaRead(body));
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
    if (path === "/whatsapp/webhook") {
      if (req.method === "GET") return waVerify(req);
      if (req.method === "POST") return await waWebhook(req);
    }
    if (req.method !== "POST") throw new Fail("not_found", "Not found.", 404);

    let body: Record<string, unknown>;
    try { body = await req.json(); } catch { throw new Fail("bad_request", "Send a JSON body.", 400); }
    if (!body || typeof body !== "object") throw new Fail("bad_request", "Send a JSON body.", 400);

    switch (path) {
      case "/otp/send": return json(req, await otpSend(body, ip));
      case "/otp/verify": return json(req, await otpVerify(body));
      case "/waitlist": return json(req, await waitlist(body));
      case "/brands/enquiry": return json(req, await brandEnquiry(body, ip));
      case "/brands/register": return json(req, await brandRegister(body, ip));
      case "/contact": return json(req, await contact(body, ip));
    }
    throw new Fail("not_found", "Not found.", 404);
  } catch (e) {
    if (e instanceof Fail) return json(req, { error: { code: e.code, message: e.message } }, e.status);
    console.error(e);
    return json(req, { error: { code: "server_error", message: "Something went wrong on our side. Try again in a minute." } }, 500);
  }
});
