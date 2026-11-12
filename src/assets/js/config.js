/*
 * Turne site configuration.
 * This is the ONLY file you need to edit to connect the backend.
 *
 * apiBase   – Base URL of your API, no trailing slash. e.g. "https://api.turne.in/v1"
 *             Leave empty ("") to run in MOCK mode: every call is simulated in the browser
 *             (OTP code 123456 is accepted). Useful for design review and local dev.
 * launchAt  – Planned launch moment (ISO 8601 with offset). Used by the countdown until
 *             GET /stats returns its own launchAt. PLACEHOLDER: replace with the real date.
 */
window.TURNE_CONFIG = {
  apiBase: "https://tgnrnjnuemnjvancelyo.supabase.co/functions/v1/api",
  // Supabase Auth for the /admin/ sign-in. The publishable key is meant to be public: the
  // database grants it nothing, and every admin call is checked by the api function.
  supabaseUrl: "https://tgnrnjnuemnjvancelyo.supabase.co",
  supabaseKey: "sb_publishable_2apziPEw2O-azDBFNEQhSQ_90hyvAtx",
  launchAt: "2027-01-26T10:00:00+05:30",
  premiumLimit: 10000,
  siteUrl: "https://turne.in",
  // Shown until the first /stats response arrives (and in mock mode).
  fallbackStats: { waitlistCount: 1121 },
  // How often the live counters refresh, in ms. 0 disables polling.
  statsRefreshMs: 60000,
  otpLength: 6,
  // Minimum age to join (Terms A2 / Privacy §8 — confirm with legal).
  minAge: 13,
  otpResendSeconds: 30,
  cities: [
    "Delhi", "Gurugram", "Noida", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai",
    "Kolkata", "Jaipur", "Ahmedabad", "Lucknow", "Chandigarh", "Indore", "Kochi", "Bhopal"
  ]
};
