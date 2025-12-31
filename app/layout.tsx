import "./globals.css";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Desktop Header */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Main content */}
        <main className="pb-24 md:pb-0">
          {children}
        </main>

        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* Mobile Bottom App Bar */}
        <BottomNav />
      </body>
    </html>
  );
}