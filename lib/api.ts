/*
 * Turne API client. Every network call the site makes goes through here. The endpoint
 * contract is in README.md ("Backend integration"). With config.apiBase empty it runs in
 * mock mode so the site works without a server.
 */
import { config } from "./config";

const base = (config.apiBase || "").replace(/\/+$/, "");
const MOCK = !base;

export class ApiError extends Error {
  code: string;
  status: number;
  data: unknown;
  constructor(message: string, code = "error", status = 0, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

export type Stats = { waitlistCount: number; premiumLimit?: number; launchAt?: string };
export type Entry = { position: number; premium: boolean; inviteCode: string; name?: string };
type Json = Record<string, unknown>;

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const opts: RequestInit = { method, headers: { Accept: "application/json" }, credentials: "include" };
  if (body !== undefined) {
    (opts.headers as Record<string, string>)["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  let res: Response;
  try {
    res = await fetch(base + path, opts);
  } catch {
    throw new ApiError("We couldn't reach Turne. Check your connection and try again.", "network");
  }
  const text = await res.text();
  let data: Json | null = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) {
    const err = ((data && data.error) || {}) as { message?: string; code?: string };
    throw new ApiError(
      err.message || "Something went wrong on our side. Try again in a minute.",
      err.code || `http_${res.status}`, res.status, data,
    );
  }
  return data as T;
}

/* ---------------- mock backend (browser only) ---------------- */
const mock = (() => {
  let count = config.fallbackStats.waitlistCount || 1121;
  const pending: Record<string, { code: string; tries: number }> = {};
  const tokens: Record<string, string> = {};
  const members: Record<string, Entry> = {};
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const fail = (msg: string, code: string, status = 400) => Promise.reject(new ApiError(msg, code, status));
  const code = () => Math.random().toString(36).slice(2, 8).toUpperCase();
  return {
    async getStats(): Promise<Stats> {
      await wait(150);
      return { waitlistCount: count, premiumLimit: config.premiumLimit, launchAt: config.launchAt };
    },
    async sendOtp(p: { phone: string; purpose?: "brand" }) {
      await wait(500);
      if (!/^[6-9]\d{9}$/.test(p.phone)) return fail("Enter a 10-digit Indian mobile number.", "invalid_phone");
      if (p.purpose !== "brand" && members[p.phone]) return fail("This number is already on the waitlist, so you're all set. We'll message you before launch.", "already_registered", 409);
      pending[p.phone] = { code: "123456", tries: 0 };
      return { ok: true, resendAfter: config.otpResendSeconds, mock: true };
    },
    async verifyOtp(p: { phone: string; code: string }) {
      await wait(500);
      const rec = pending[p.phone];
      if (!rec) return fail("That code has expired. Send a new one.", "otp_expired");
      rec.tries += 1;
      if (rec.tries > 5) return fail("Too many attempts. Send a new code.", "otp_locked", 429);
      if (p.code !== rec.code) return fail("That code doesn't match. Check WhatsApp and try again.", "otp_invalid");
      const t = "mock_" + code();
      tokens[t] = p.phone;
      return { ok: true, verificationToken: t, existing: members[p.phone] || null };
    },
    async joinWaitlist(p: Json) {
      await wait(700);
      const phone = tokens[p.verificationToken as string];
      if (!phone) return fail("Your verification expired. Start again.", "token_invalid", 401);
      if (p.company) return { position: 0, premium: false, inviteCode: "" };
      if (members[phone]) return members[phone];
      count += 1;
      const entry = { position: count, premium: count <= config.premiumLimit, inviteCode: code(), name: p.name as string };
      members[phone] = entry;
      return entry;
    },
    async brandEnquiry() { await wait(600); return { ok: true }; },
    async contact() { await wait(600); return { ok: true }; },
    async brandRegister(p: Json) {
      await wait(700);
      if (!tokens[p.verificationToken as string]) return fail("Please verify your mobile number on WhatsApp first.", "token_invalid", 401);
      delete tokens[p.verificationToken as string];
      return { ok: true, reference: "TB-00000" };
    },
  };
})();

export const api = {
  isMock: MOCK,
  /** GET /stats -> { waitlistCount, premiumLimit, launchAt } */
  getStats: (): Promise<Stats> => (MOCK ? mock.getStats() : request("GET", "/stats")),
  /** POST /otp/send { phone, purpose? } -> { ok, resendAfter, mock? }. purpose "brand" = brand registration. */
  sendOtp: (p: { phone: string; purpose?: "brand" }): Promise<{ ok: boolean; resendAfter?: number; mock?: boolean }> =>
    (MOCK ? mock.sendOtp(p) : request("POST", "/otp/send", p)),
  /** POST /otp/verify { phone, code } -> { ok, verificationToken, existing } */
  verifyOtp: (p: { phone: string; code: string }): Promise<{ ok: boolean; verificationToken: string; existing: Entry | null }> =>
    (MOCK ? mock.verifyOtp(p) : request("POST", "/otp/verify", p)),
  /** POST /waitlist { verificationToken, name, dob, city, company, utm, ref } -> { position, premium, inviteCode } */
  joinWaitlist: (p: Json): Promise<Entry> => (MOCK ? mock.joinWaitlist(p) : request("POST", "/waitlist", p)),
  /** POST /brands/enquiry { name, company, email, phone, role, plan, company_url, website } -> { ok } */
  brandEnquiry: (p: Json): Promise<{ ok: boolean }> => (MOCK ? mock.brandEnquiry() : request("POST", "/brands/enquiry", p)),
  /** POST /contact { name, email, topic, message, website } -> { ok } */
  contact: (p: Json): Promise<{ ok: boolean }> => (MOCK ? mock.contact() : request("POST", "/contact", p)),
  /** POST /brands/register { verificationToken, company, …, consent } -> { ok, reference } */
  brandRegister: (p: Json): Promise<{ ok: boolean; reference: string }> =>
    (MOCK ? mock.brandRegister(p) : request("POST", "/brands/register", p)),
};

/** UTM tags and invite code captured on the landing page (see components/Attribution). */
export function getAttribution(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem("turne_attr") || "{}"); } catch { return {}; }
}

/** Ask every live counter on the page to refetch /stats (e.g. right after someone joins). */
export function refreshStats() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("turne:stats-refresh"));
}
