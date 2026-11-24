/* Brand registration options. They must match the lists the api function accepts
   (BRAND_CATEGORIES etc. in supabase/functions/api/index.ts). */
export const CATEGORIES = [
  "Consumer tech", "Fashion and beauty", "Food and beverage", "Education", "Finance and fintech",
  "Gaming and entertainment", "Health and fitness", "Startup or accelerator", "Media and agency", "Other",
];
export const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
export const INTERESTS = [
  { value: "Events", hint: "Online events and experiences" },
  { value: "Product launches", hint: "Launches, drops and reveals" },
  { value: "Giveaways", hint: "Free-to-enter, fair draws" },
  { value: "Startup rooms and demo days", hint: "A room for every startup" },
  { value: "Community", hint: "Followers who come back" },
];
export const TIMELINES = ["At launch", "Within 3 months", "3 to 6 months", "Just exploring"];
export const BRANDS_EMAIL = "brands@turne.in";
