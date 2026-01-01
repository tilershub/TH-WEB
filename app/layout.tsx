import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "Tilers Hub - Find Professional Tilers in Sri Lanka",
    template: "%s | Tilers Hub",
  },
  description: "Connect with verified professional tilers in Sri Lanka. Get quotes for floor tiling, wall tiling, bathroom renovations, and more. Quality workmanship guaranteed.",
  keywords: ["tilers", "tiling", "Sri Lanka", "floor tiling", "wall tiling", "bathroom tiling", "tile installation", "professional tilers"],
  authors: [{ name: "Tilers Hub" }],
  creator: "Tilers Hub",
  publisher: "Tilers Hub",
  metadataBase: new URL("https://tilershub.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tilershub.com",
    siteName: "Tilers Hub",
    title: "Tilers Hub - Find Professional Tilers in Sri Lanka",
    description: "Connect with verified professional tilers in Sri Lanka. Get quotes for floor tiling, wall tiling, bathroom renovations, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tilers Hub - Professional Tiling Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tilers Hub - Find Professional Tilers in Sri Lanka",
    description: "Connect with verified professional tilers in Sri Lanka. Get quotes for floor tiling, wall tiling, bathroom renovations, and more.",
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
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
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
