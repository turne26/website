/* Every page's SEO data: title, description, share image, breadcrumb label, FAQ. */

export type PageInfo = {
  slug: string;
  crumb: string;
  og: string;
  title: string;
  desc: string;
  ogTitle?: string;
  ogDesc?: string;
  schemaType?: string;
  noindex?: boolean;
  faq?: [string, string][];
  /** Sitemap priority. */
  priority?: number;
};

export const PAGES = {
  home: {
    slug: "",
    crumb: "Home",
    og: "home",
    title: "Turne | India ka Apna Event Platform",
    desc: "Join live online events from top brands, attend exclusive launches and win giveaways. The first 10,000 on the Turne waitlist get 2 years of Premium free.",
    ogDesc: "Discover and join live online events from top brands, attend launches and win giveaways. The first 10,000 get 2 years of Premium free.",
    priority: 1.0,
    faq: [
      ["What is Turne?", "Turne is a digital event and brand engagement platform where you discover events, participate in experiences, enter giveaways and connect with brands."],
      ["When is Turne launching?", "Turne is preparing for launch. The countdown on this page shows the planned launch timeline. Join the waitlist and you'll be first through the door."],
      ["What do I get for joining?", "The first 10,000 verified waitlist members receive 2 years of Premium membership, free from launch day."],
      ["What is Premium?", "Premium is Turne's membership experience: additional benefits and access to selected opportunities. Premium benefits may evolve as Turne launches."],
      ["Do Premium members automatically win giveaways?", "No. Premium does not guarantee winning. It provides access to the Premium allocation, a dedicated 50% share, of selected giveaway opportunities."],
    ],
  },
  "why-turne": {
    slug: "why-turne",
    crumb: "Why Turne",
    og: "why-turne",
    title: "Why Turne | Brands Should Be Experienced, Not Just Seen",
    desc: "Social media gets brands to an audience. Turne gets the audience to participate: discovery, participation, engagement, reward and retention in one loop.",
    priority: 0.7,
  },
  "how-it-works": {
    slug: "how-it-works",
    crumb: "How it works",
    og: "how-it-works",
    title: "How Turne Works | The Expo Floor, Now Online",
    desc: "Brands host online events on Turne and every brand and startup runs a live video pod. Hop between pods, watch demos, talk to founders and win giveaways.",
    priority: 0.8,
  },
  giveaways: {
    slug: "giveaways",
    crumb: "Giveaways",
    og: "giveaways",
    title: "Giveaways on Turne | Real Rewards, Fair 50/50 Split",
    desc: "Win products, event tickets, coupons, memberships and experiences. Free to enter, drawn at random, and split 50/50 between normal and Premium members.",
    priority: 0.8,
  },
  premium: {
    slug: "premium",
    crumb: "Premium",
    og: "premium",
    title: "Turne Premium | The First 10,000 Get 2 Years Free",
    desc: "Be one of the first 10,000 verified waitlist members and get 2 years of Turne Premium free: a dedicated 50% giveaway share, early access and priority.",
    priority: 0.8,
  },
  brands: {
    slug: "brands",
    crumb: "For brands",
    og: "brands",
    title: "Turne for Brands | Run Events People Actually Join",
    desc: "Register your brand on Turne, India's participation-first event platform. Host online events, open startup rooms, run fair giveaways and measure who really showed up.",
    priority: 0.8,
    faq: [
      ["What is Turne for Brands?", "Turne is an Indian online event platform. Brands host events on it, every startup at an event gets its own room with a live demo, chat and Q&A, and people join to take part and win giveaways. Brands register at turne.in/brands/register/ to run their events, launches and giveaways on Turne."],
      ["Does it cost anything to register?", "No. Registering is free and doesn't commit you to anything. Our brands team reads every registration and gets in touch within two working days to understand what you want to run."],
      ["What can we run on Turne?", "Online events and experiences, product launches and drops, startup rooms and demo days, free-to-enter giveaways and an ongoing community around your brand."],
      ["What can we measure?", "Who registered, who actually joined, which rooms they visited, who entered your giveaways and who came back. Reach is not the same as participation, and Turne is built to show the difference."],
      ["How do giveaways work on Turne?", "Giveaways are free to enter and winners are drawn at random. Eligible giveaways split their opportunities 50/50 between normal members and Premium members, so the rules are clear for everyone."],
      ["Why do you verify my number on WhatsApp?", "So we know every registration comes from a real person we can reach. We send a 6-digit code to your WhatsApp; it takes a few seconds and we only use the number to talk to you about your registration."],
      ["When can we run our first event?", "Turne is preparing for launch. Registered brands hear from us first and can plan their events for when Turne goes live."],
      ["Who do we talk to?", "Email brands@turne.in, or register and our brands team will reach out to you directly."],
    ],
  },
  "brands-register": {
    slug: "brands/register",
    crumb: "Register your brand",
    og: "brands",
    title: "Register Your Brand | Turne for Brands",
    desc: "Register your brand on Turne in about two minutes. Verify your number on WhatsApp, tell us what you'd like to run, and our brands team gets in touch within two working days.",
    priority: 0.8,
  },
  faq: {
    slug: "faq",
    crumb: "FAQ",
    og: "faq",
    title: "Turne FAQ | Waitlist, Premium, Giveaways and Launch",
    desc: "Answers about Turne: what it is, when it launches, how to join the waitlist, what 2-Year Premium includes, how giveaways work and which cities can join.",
    priority: 0.7,
    faq: [
      ["What is Turne?", "Turne is a platform for brand-hosted events where every startup gets its own room. You hop between rooms to watch demos, chat with founders, vote, upvote startups and enter giveaways."],
      ["What is a startup room?", "A space inside an event that belongs to one startup, a bit like a server on Discord. It has a live demo, a chat, Q&A and polls, and it can run its own giveaway."],
      ["Can my startup get a room?", "Rooms are opened by the brand hosting each event. If you'd like to showcase at an upcoming Turne event, write to brands@turne.in."],
      ["When is Turne launching?", "Turne is preparing for launch. The countdown on our home page shows the planned launch timeline. Join the waitlist and you'll be first through the door."],
      ["Is Turne free?", "The consumer experience will include a free tier. Premium features and benefits may vary as Turne launches and evolves."],
      ["Which cities can join?", "Anyone in India can join the waitlist. Experiences will roll out city by city."],
      ["How do I join?", "Verify your mobile number with the 6-digit code we send on WhatsApp, add your name, date of birth and city, then tap Join the waitlist. It takes well under a minute."],
      ["What do I get for joining?", "The first 10,000 verified waitlist members receive 2 years of Premium membership, free from launch day."],
      ["Can I register more than one number?", "Each mobile number can hold one waitlist entry. If you register the same number again, you'll see your existing spot."],
      ["Will you share my number with brands?", "No. We don't sell your personal information, and we don't share your phone number with brands or advertisers. See our privacy policy."],
      ["How do I stop WhatsApp messages?", "Reply STOP to any message from us, or email privacy@turne.in. Withdrawing consent may mean we can't keep your waitlist entry or Premium eligibility active."],
      ["What is Premium?", "Premium is Turne's membership experience: additional benefits and access to selected opportunities. Premium benefits may evolve as Turne launches."],
      ["Do Premium members automatically win giveaways?", "No. Premium does not guarantee winning. It provides access to the Premium allocation, a dedicated 50% share, of selected giveaway opportunities."],
      ["Do I have to pay to enter a giveaway?", "No. Giveaways are free to enter for eligible members. There's no purchase, stake or wager of any kind."],
    ],
  },
  contact: {
    slug: "contact",
    crumb: "Contact",
    og: "contact",
    title: "Contact Turne | Waitlist, Brands and Privacy",
    desc: "Get in touch with Turne. Email hello@turne.in for general questions, brands@turne.in for partnerships, or privacy@turne.in about your data.",
    schemaType: "ContactPage",
    priority: 0.5,
  },
  join: {
    slug: "join",
    crumb: "Join the waitlist",
    og: "join",
    title: "Join the Turne Waitlist | First 10,000 Get 2 Years of Premium",
    desc: "Join the Turne waitlist in under a minute with your mobile number. The first 10,000 verified members get 2 years of Premium free.",
    priority: 0.9,
  },
  privacy: {
    slug: "privacy",
    crumb: "Privacy policy",
    og: "home",
    title: "Privacy Policy | Turne",
    desc: "How Turne collects, uses and protects your personal information when you join the waitlist, including WhatsApp consent, data sharing and your rights.",
    priority: 0.3,
  },
  terms: {
    slug: "terms",
    crumb: "Terms and conditions",
    og: "home",
    title: "Terms and Conditions | Turne Waitlist, Premium and Giveaways",
    desc: "Terms for the Turne waitlist, 2-Year Premium membership and giveaways, including eligibility, the 50/50 allocation, prizes and governing law.",
    priority: 0.3,
  },
  "404": {
    slug: "404",
    crumb: "Page not found",
    og: "home",
    title: "Page Not Found | Turne",
    desc: "This page doesn't exist. Head back to Turne or join the waitlist.",
    noindex: true,
  },
} satisfies Record<string, PageInfo>;

export type PageKey = keyof typeof PAGES;
