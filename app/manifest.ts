import type { MetadataRoute } from "next";
import { THEME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Turne",
    short_name: "Turne",
    description: "Discover events, join experiences, enter giveaways and connect with brands.",
    start_url: "/",
    display: "standalone",
    background_color: THEME,
    theme_color: THEME,
    lang: "en-IN",
    categories: ["events", "entertainment", "social"],
    icons: [
      { src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/assets/img/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
