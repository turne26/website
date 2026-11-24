/*
 * Turne site configuration. The admin panel reads the same values from
 * public/assets/js/config.js, so change both if you change apiBase or the Supabase keys.
 *
 * apiBase   Base URL of the API, no trailing slash. Empty ("") = mock mode: every call is
 *           simulated in the browser and OTP 123456 is accepted (handy for local design work).
 * launchAt  Planned launch moment, used by the countdown until GET /stats returns its own.
 */
export const config = {
  apiBase: "https://tgnrnjnuemnjvancelyo.supabase.co/functions/v1/api",
  launchAt: "2027-01-26T10:00:00+05:30",
  premiumLimit: 10000,
  siteUrl: "https://www.turne.in",
  // Shown until the first /stats response arrives (and in mock mode).
  fallbackStats: { waitlistCount: 1121 },
  // How often the live counters refresh, in ms. 0 disables polling.
  statsRefreshMs: 60000,
  otpLength: 6,
  // Minimum age to join (Terms A2 / Privacy §8).
  minAge: 13,
  otpResendSeconds: 30,
  cities: [
    "Delhi", "Gurugram", "Noida", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai",
    "Kolkata", "Jaipur", "Ahmedabad", "Lucknow", "Chandigarh", "Indore", "Kochi", "Bhopal",
  ],
};
