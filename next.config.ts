import type { NextConfig } from "next";

const config: NextConfig = {
  // Keep the URLs the site has always had (/premium/, /join/), so search rankings carry over.
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/privacy.html", destination: "/privacy/", permanent: true },
      { source: "/terms.html", destination: "/terms/", permanent: true },
      { source: "/404.html", destination: "/", permanent: false },
      { source: "/site.webmanifest", destination: "/manifest.webmanifest", permanent: true },
    ];
  },
  async rewrites() {
    // The admin panel is a standalone static page (public/admin/index.html).
    return [{ source: "/admin/", destination: "/admin/index.html" }];
  },
  async headers() {
    return [
      {
        // Images and admin files keep fixed names, so cache for a day, not forever.
        // (Next's own JS/CSS under /_next/static is content-hashed and cached for a year.)
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default config;
