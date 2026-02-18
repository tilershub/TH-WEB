import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "TILERSHUB — Interior Design & Renovation",
    template: "%s — TILERSHUB",
  },
  description: "Thoughtful interior design and renovation in Sri Lanka. Bathrooms, kitchens, flooring, ceilings, glass work, electrical, plumbing, and waterproofing.",
  keywords: ["interior design", "renovation", "Sri Lanka", "bathroom", "kitchen", "flooring", "tilershub"],
  authors: [{ name: "TILERSHUB" }],
  metadataBase: new URL("https://tilershub.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tilershub.com",
    siteName: "TILERSHUB",
    title: "TILERSHUB — Interior Design & Renovation",
    description: "Thoughtful interior design and renovation in Sri Lanka.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TILERSHUB" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-cream text-charcoal">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-charcoal focus:text-white focus:rounded-lg">
          Skip to main content
        </a>
        <MobileHeader />
        <div className="hidden md:block"><Header /></div>
        <main id="main-content" className="pb-20 md:pb-0" role="main">{children}</main>
        <div className="hidden md:block"><Footer /></div>
        <BottomNav />
      </body>
    </html>
  );
}
