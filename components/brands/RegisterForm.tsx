"use client";
/*
 * Brand registration (/brands/register/): 1 Brand -> 2 You (mobile verified by WhatsApp OTP)
 * -> 3 Plans -> done. Uses the same OTP as the waitlist (/otp/send with purpose "brand",
 * /otp/verify); /brands/register only accepts a fresh verification token and checks every
 * field again on the server.
 */
import { useEffect, useRef, useState } from "react";
import { api, ApiError, getAttribution } from "@/lib/api";
import { config } from "@/lib/config";
import { CityPicker } from "@/components/CityPicker";
import { BRANDS_EMAIL, CATEGORIES, GIVEAWAY_INCLUDED, INTERESTS, SIZES, TIMELINES } from "@/lib/brands";

type Step = 0 | 1 | 2 | 3;
const STEP_NAMES = ["Your brand", "About you", "Your plans"];

type Form = {
  company: string; legal_name: string; website_url: string; category: string; city: string; company_size: string;
  name: string; role: string; email: string; phone: string;
  interests: string[]; timeline: string; message: string; consent: boolean;
  website: string; // honeypot
};
const EMPTY: Form = {
  company: "", legal_name: "", website_url: "", category: "", city: "", company_size: "",
  name: "", role: "", email: "", phone: "",
  interests: [], timeline: "", message: "", consent: false, website: "",
};

type Verify = { state: "idle" | "sending" | "code" | "checking" | "verified"; phone: string; token: string; code: string; resendIn: number; mock: boolean };
const NO_VERIFY: Verify = { state: "idle", phone: "", token: "", code: "", resendIn: 0, mock: false };

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const normPhone = (v: string) => {
  let d = v.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
};
const validPhone = (v: string) => /^[6-9]\d{9}$/.test(normPhone(v));
const looksLikeSite = (v: string) => /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v.trim()) || /^@?[\w.]{2,30}$/.test(v.trim());

type Errors = Partial<Record<keyof Form | "code" | "form", string>>;

function validate(step: Step, r: Form, verified: boolean): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (r.company.trim().length < 2) e.company = "Add your brand or company name.";
    if (!looksLikeSite(r.website_url)) e.website_url = "Add your website (brand.com) or Instagram handle (@brand).";
    if (!r.category) e.category = "Pick the category that fits best.";
    if (r.city.trim().length < 2) e.city = "Add the city you're based in.";
  }
  if (step === 1) {
    if (r.name.trim().length < 2) e.name = "Add your full name.";
    if (r.role.trim().length < 2) e.role = "Add your role, e.g. Marketing lead.";
    if (r.email.trim() && !isEmail(r.email)) e.email = "Check the email, or leave it empty.";
    if (!validPhone(r.phone)) e.phone = "Add a 10-digit Indian mobile number.";
    else if (!verified) e.phone = "Verify this number on WhatsApp to continue.";
  }
  if (step === 2) {
    if (!r.interests.length) e.interests = "Pick at least one.";
    if (!r.timeline) e.timeline = "Pick a timeline.";
    if (!r.consent) e.consent = "Please agree so we can contact you.";
  }
  return e;
}

const TICK = <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" /><path d="M5.8 10.4l2.7 2.7 5.7-5.9" fill="none" stroke="#07070c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function RegisterForm() {
  const [step, setStep] = useState<Step>(0);
  const [r, setR] = useState<Form>(EMPTY);
  const [v, setV] = useState<Verify>(NO_VERIFY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const verified = v.state === "verified" && v.phone === normPhone(r.phone);

  // Move focus to the new step's heading (not on first load) and keep it in view.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    root.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    const top = (root.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top });
  }, [step]);

  // Resend countdown.
  useEffect(() => {
    if (v.resendIn <= 0) return;
    const t = setTimeout(() => setV((p) => ({ ...p, resendIn: p.resendIn - 1 })), 1000);
    return () => clearTimeout(t);
  }, [v.resendIn]);

  const clearErr = (...keys: (keyof Errors)[]) =>
    setErrors((prev) => { const n = { ...prev }; keys.forEach((k) => delete n[k]); return n; });
  const set = <K extends keyof Form>(k: K, val: Form[K]) => { setR((p) => ({ ...p, [k]: val })); if (errors[k]) clearErr(k); };
  const toggleInterest = (val: string) =>
    set("interests", r.interests.includes(val) ? r.interests.filter((i) => i !== val) : [...r.interests, val]);
  const focusFirstError = (e: Errors) => {
    const k = Object.keys(e)[0];
    if (k) requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`[name="${k}"]`)?.focus());
  };

  /* ---------- WhatsApp verification ---------- */
  async function sendCode() {
    const phone = normPhone(r.phone);
    if (!validPhone(phone)) { setErrors((p) => ({ ...p, phone: "Add a 10-digit Indian mobile number." })); return; }
    clearErr("phone", "code");
    const before = v.state;
    setV((p) => ({ ...p, state: "sending" }));
    try {
      const res = await api.sendOtp({ phone, purpose: "brand" });
      setV({ state: "code", phone, token: "", code: "", resendIn: res.resendAfter || config.otpResendSeconds, mock: !!res.mock });
      requestAnimationFrame(() => root.current?.querySelector<HTMLInputElement>("#b-code")?.focus());
    } catch (err) {
      // A failed resend keeps the code box open; a failed first send goes back to "Send code".
      setV((p) => ({ ...p, state: before === "code" ? "code" : "idle" }));
      setErrors((p) => ({ ...p, [before === "code" ? "code" : "phone"]: (err as Error).message }));
    }
  }

  async function checkCode(code: string) {
    if (!/^\d{6}$/.test(code)) { setErrors((p) => ({ ...p, code: "Enter the 6 digits from WhatsApp." })); return; }
    clearErr("code");
    setV((p) => ({ ...p, state: "checking" }));
    try {
      const res = await api.verifyOtp({ phone: v.phone, code });
      setV((p) => ({ ...p, state: "verified", token: res.verificationToken, code: "" }));
    } catch (err) {
      setV((p) => ({ ...p, state: "code" }));
      setErrors((p) => ({ ...p, code: (err as Error).message }));
    }
  }

  function changeNumber() {
    setV(NO_VERIFY);
    clearErr("code", "phone");
    requestAnimationFrame(() => root.current?.querySelector<HTMLInputElement>("#phone")?.focus());
  }

  /* ---------- steps ---------- */
  async function next(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(step, r, verified);
    setErrors(e);
    if (Object.keys(e).length) { focusFirstError(e); return; }
    if (step < 2) { setStep((step + 1) as Step); return; }
    setBusy(true);
    try {
      const attr = getAttribution();
      const res = await api.brandRegister({
        ...r,
        website_url: r.website_url.trim(),
        phone: v.phone,
        verificationToken: v.token,
        ref: attr.ref || null,
      });
      setReference(res.reference);
      setStep(3);
    } catch (err) {
      if (err instanceof ApiError && err.code === "token_invalid") {
        // The verification expired or was used: verify again on step 2.
        setV(NO_VERIFY);
        setStep(1);
        setErrors({ phone: err.message });
        return;
      }
      setErrors({ form: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof Errors) => (errors[k] ? <p className="error" id={`${k}-error`}>{errors[k]}</p> : null);
  const aria = (k: keyof Errors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  if (step === 3) {
    const first = r.name.trim().split(" ")[0];
    return (
      <div ref={root} className="panel b-done" aria-live="polite">
        <div className="b-done__badge" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M7 17l6 6L25 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h2 tabIndex={-1}>You&apos;re registered.</h2>
        <p className="lede">Thanks, {first}. {r.company.trim()} is on our list, and our brands team will get in touch within two working days.</p>
        {reference && <p className="b-ref">Your reference <b>{reference}</b></p>}
        <ol className="b-next">
          <li><b>We review your registration</b><span>and look at what {r.company.trim()} wants to run.</span></li>
          <li><b>We reach out</b><span>on WhatsApp{r.email.trim() ? ` or at ${r.email.trim()}` : ""} to plan your first event together.</span></li>
          <li><b>You&apos;re ready for launch</b><span>with your brand set up before Turne goes live.</span></li>
        </ol>
        <p className="muted small">Anything to add? Email <a href={`mailto:${BRANDS_EMAIL}`}>{BRANDS_EMAIL}</a>{reference ? ` and mention ${reference}` : ""}.</p>
      </div>
    );
  }

  const phoneLocked = v.state !== "idle" && v.state !== "sending";

  return (
    <div ref={root} className="panel" aria-live="polite">
      <ol className="steps" aria-label="Registration progress">
        {STEP_NAMES.map((name, i) => (
          <li key={name} className={i < step ? "is-done" : i === step ? "is-current" : undefined}
            aria-current={i === step ? "step" : undefined}>{name}</li>
        ))}
      </ol>

      <form onSubmit={next} noValidate>
        {/* Honeypot: real people never see or fill this. */}
        <div className="b-hp" aria-hidden="true">
          <label htmlFor="b-website">Leave this empty</label>
          <input id="b-website" name="website" tabIndex={-1} autoComplete="off" value={r.website} onChange={(e) => set("website", e.target.value)} />
        </div>

        {step === 0 && (
          <>
            <h2 tabIndex={-1}>Tell us about your brand.</h2>
            <p>The basics, so we know who we&apos;re talking to.</p>
            <div className="form">
              <div className="field">
                <label htmlFor="company">Brand name</label>
                <input className="input" id="company" name="company" autoComplete="organization" placeholder="e.g. SoundX"
                  value={r.company} onChange={(e) => set("company", e.target.value)} {...aria("company")} />
                {err("company")}
              </div>
              <div className="field">
                <label htmlFor="legal_name">Registered company name <span className="muted">(optional)</span></label>
                <input className="input" id="legal_name" name="legal_name" placeholder="e.g. SoundX Audio Pvt Ltd"
                  value={r.legal_name} onChange={(e) => set("legal_name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="website_url">Website or Instagram</label>
                <input className="input" id="website_url" name="website_url" inputMode="url" autoComplete="url" placeholder="brand.com or @brand"
                  value={r.website_url} onChange={(e) => set("website_url", e.target.value)} {...aria("website_url")} />
                {err("website_url")}
              </div>
              <div className="row-2">
                <div className="field">
                  <label htmlFor="category">Category</label>
                  <select className="select input" id="category" name="category" value={r.category}
                    onChange={(e) => set("category", e.target.value)} {...aria("category")}>
                    <option value="">Choose one</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {err("category")}
                </div>
                <div className="field">
                  <label htmlFor="city">City</label>
                  <CityPicker id="city" name="city" value={r.city} onChange={(c) => set("city", c)} {...aria("city")} />
                  {err("city")}
                </div>
              </div>
              <fieldset className="field b-fieldset">
                <legend className="label">Team size <span className="muted">(optional)</span></legend>
                <div className="b-chips" role="radiogroup">
                  {SIZES.map((s) => (
                    <label key={s} className="b-chip">
                      <input type="radio" name="company_size" value={s} checked={r.company_size === s} onChange={() => set("company_size", s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button className="btn btn--ticket btn--block" type="submit">Continue</button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 tabIndex={-1}>Who should we talk to?</h2>
            <p>We&apos;ll use this to get in touch about {r.company.trim() || "your brand"}. Nothing else.</p>
            <div className="form">
              <div className="row-2">
                <div className="field">
                  <label htmlFor="name">Your name</label>
                  <input className="input" id="name" name="name" autoComplete="name"
                    value={r.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
                  {err("name")}
                </div>
                <div className="field">
                  <label htmlFor="role">Your role</label>
                  <input className="input" id="role" name="role" autoComplete="organization-title" placeholder="e.g. Marketing lead"
                    value={r.role} onChange={(e) => set("role", e.target.value)} {...aria("role")} />
                  {err("role")}
                </div>
              </div>
              <div className="field">
                <label htmlFor="email">Work email <span className="muted">(optional)</span></label>
                <input className="input" id="email" name="email" type="email" autoComplete="email" placeholder="you@brand.com"
                  value={r.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
                {err("email")}
              </div>

              <div className="field">
                <label htmlFor="phone">WhatsApp number</label>
                <div className="b-verify">
                  <div className="phone-input"><span className="prefix">+91</span>
                    <input className="input" id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={14}
                      value={r.phone} readOnly={phoneLocked}
                      onChange={(e) => { set("phone", e.target.value); if (v.state === "verified") setV(NO_VERIFY); }} {...aria("phone")} />
                  </div>
                  {v.state === "idle" || v.state === "sending" ? (
                    <button className="btn btn--ghost" type="button" onClick={sendCode} disabled={v.state === "sending"}>
                      {v.state === "sending" ? "Sending…" : "Send code"}
                    </button>
                  ) : null}
                </div>
                {err("phone")}
                {verified && (
                  <p className="b-verified">{TICK}Verified on WhatsApp
                    <button className="linkbtn small" type="button" onClick={changeNumber} style={{ marginLeft: ".5rem" }}>Change</button></p>
                )}
                {(v.state === "code" || v.state === "checking") && (
                  <div className="b-code">
                    <p>We sent a 6-digit code to <b>+91 {v.phone.slice(0, 5)} {v.phone.slice(5)}</b> on WhatsApp.</p>
                    <label className="sr-only" htmlFor="b-code">6-digit code</label>
                    <input className="input" id="b-code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••"
                      value={v.code} {...aria("code")}
                      onChange={(e) => {
                        const code = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setV((p) => ({ ...p, code }));
                        if (errors.code) clearErr("code");
                        if (code.length === 6 && v.state === "code") checkCode(code);
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); checkCode(v.code); } }} />
                    {err("code")}
                    {v.mock && <p className="notice">Demo mode: no message is sent. Use code 123456.</p>}
                    <button className="btn btn--ticket btn--block" type="button" onClick={() => checkCode(v.code)} disabled={v.state === "checking"}>
                      {v.state === "checking" ? "Checking…" : "Verify number"}
                    </button>
                    <div className="b-code__row">
                      <button className="linkbtn" type="button" onClick={sendCode} disabled={v.resendIn > 0}>
                        {v.resendIn > 0 ? `Resend code in ${v.resendIn}s` : "Resend code"}
                      </button>
                      <button className="linkbtn" type="button" onClick={changeNumber}>Change number</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="b-actions">
                <button className="linkbtn" type="button" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn--ticket" type="submit">Continue</button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 tabIndex={-1}>What would you like to run?</h2>
            <p>Pick everything that applies. It helps us come prepared.</p>
            <div className="form">
              <fieldset className="field b-fieldset" aria-describedby={errors.interests ? "interests-error" : undefined}>
                <legend className="label">On Turne, we want to run</legend>
                <div className="b-options">
                  {INTERESTS.map((o) => (
                    <label key={o.value} className="b-option">
                      <input type="checkbox" name="interests" checked={r.interests.includes(o.value)} onChange={() => toggleInterest(o.value)} />
                      <span><b>{o.value}</b><small>{o.hint}</small></span>
                    </label>
                  ))}
                  {/* Every event has a giveaway: shown ticked and locked, not a choice. */}
                  <div className="b-option b-option--locked">
                    <span><b>{GIVEAWAY_INCLUDED.title} <em className="b-included">Always included</em></b><small>{GIVEAWAY_INCLUDED.hint}</small></span>
                  </div>
                </div>
                {err("interests")}
              </fieldset>
              <fieldset className="field b-fieldset" aria-describedby={errors.timeline ? "timeline-error" : undefined}>
                <legend className="label">When would you like to start?</legend>
                <div className="b-chips" role="radiogroup">
                  {TIMELINES.map((t) => (
                    <label key={t} className="b-chip">
                      <input type="radio" name="timeline" checked={r.timeline === t} onChange={() => set("timeline", t)} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
                {err("timeline")}
              </fieldset>
              <div className="field">
                <label htmlFor="message">Anything else? <span className="muted">(optional)</span></label>
                <textarea className="textarea" id="message" name="message" rows={3} maxLength={2000}
                  placeholder="Your first event idea, dates, the audience you want to reach…"
                  value={r.message} onChange={(e) => set("message", e.target.value)} />
              </div>
              <label className="b-consent">
                <input type="checkbox" name="consent" checked={r.consent} onChange={(e) => set("consent", e.target.checked)}
                  aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} />
                <span>I agree that Turne can contact me by email, phone or WhatsApp about this registration, under the <a href="/privacy/" target="_blank" rel="noopener">Privacy policy</a>.</span>
              </label>
              {err("consent")}
              {errors.form && <p className="error" role="alert">{errors.form}</p>}
              <div className="b-actions">
                <button className="linkbtn" type="button" onClick={() => setStep(1)} disabled={busy}>Back</button>
                <button className="btn btn--ticket" type="submit" disabled={busy}>{busy ? "Registering…" : "Register my brand"}</button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
