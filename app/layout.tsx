import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd, SITE_DESCRIPTION as description, SITE_NAME, SITE_URL, organization, website } from "@/lib/schema";
import "./globals.css";

// Aikido sets type in a commercial grotesk; Figtree is the closest free (OFL) geometric grotesk. Mono stays Geist Mono.
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Cybersecurity and AI security consulting · Resilient Privacy", template: "%s · Resilient Privacy" },
  description,
  alternates: { canonical: "./" }, // resolves to each route's own URL via metadataBase
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: "./" },
  twitter: { card: "summary_large_image" },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }),
};
export const viewport: Viewport = { themeColor: "#f7f6fc" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${GeistMono.variable}`}>
      <body>
        <JsonLd data={[organization(), website()]} />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
