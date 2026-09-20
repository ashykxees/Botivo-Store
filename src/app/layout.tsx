import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `Buy Discord Nitro, Tokens & Server Boosts — Instant Delivery | ${SITE.name}`,
  description: SITE.description,
  keywords: [
    "buy discord nitro",
    "cheap discord nitro",
    "discord nitro tokens",
    "buy server boosts",
    "discord boost shop",
    "botivo store",
  ],
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: `${SITE.name} — Premium Discord, delivered in seconds`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: "/banner.png", width: 1568, height: 896, alt: `${SITE.name} Store` }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Premium Discord, delivered in seconds`,
    description: SITE.description,
    images: ["/banner.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="hero-glow absolute inset-x-0 top-0 h-[75vh]" />
          <div className="grid-bg absolute inset-x-0 top-0 h-[70vh]" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-[84px]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
