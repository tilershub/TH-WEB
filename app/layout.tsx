import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "TILERSHUB - Interior Design & Renovation Services in Sri Lanka",
    template: "%s | TILERSHUB",
  },
  description: "TILERSHUB is a leading interior design and renovation company in Sri Lanka. We specialize in bathrooms, kitchens, flooring, ceilings, glass work, electrical, plumbing, and waterproofing.",
  keywords: ["interior design", "renovation", "Sri Lanka", "bathroom renovation", "kitchen design", "flooring", "ceiling", "glass work", "electrical", "plumbing", "waterproofing", "tilershub"],
  authors: [{ name: "TILERSHUB" }],
  creator: "TILERSHUB",
  publisher: "TILERSHUB",
  metadataBase: new URL("https://tilershub.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tilershub.com",
    siteName: "TILERSHUB",
    title: "TILERSHUB - Interior Design & Renovation Services in Sri Lanka",
    description: "Transform your space with TILERSHUB. Expert interior design and renovation services for bathrooms, kitchens, flooring, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TILERSHUB - Interior Design & Renovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TILERSHUB - Interior Design & Renovation Services",
    description: "Transform your space with TILERSHUB. Expert interior design and renovation services in Sri Lanka.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1B4D3E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-black">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
          Skip to main content
        </a>

        <MobileHeader />

        <div className="hidden md:block">
          <Header />
        </div>

        <main id="main-content" className="pb-24 md:pb-0" role="main">
          {children}
        </main>

        <div className="hidden md:block">
          <Footer />
        </div>

        <BottomNav />
      </body>
    </html>
  );
}
