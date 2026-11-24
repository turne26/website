import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyJoin } from "@/components/StickyJoin";
import { Attribution } from "@/components/Attribution";
import { StatsProvider } from "@/components/live";
import { BRAND, SITE, THEME } from "@/lib/seo";

const jakarta = localFont({
  src: [
    { path: "./fonts/plus-jakarta-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  applicationName: BRAND,
  title: { default: `${BRAND} | India ka Apna Event Platform`, template: `%s | ${BRAND}` },
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [{ url: "/assets/img/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/assets/img/apple-touch-icon.png",
  },
  category: "events",
};

export const viewport: Viewport = {
  themeColor: THEME,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={jakarta.variable}>
      <body>
        <StatsProvider>
          <Attribution />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StickyJoin />
        </StatsProvider>
      </body>
    </html>
  );
}
