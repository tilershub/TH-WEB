"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cx(
      "sticky top-0 z-50 bg-white border-b transition-shadow",
      scrolled ? "shadow-md border-gray-200" : "border-gray-100"
    )}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">TH</span>
              </div>
            </div>
            <div className="font-bold text-lg tracking-tight">
              <span className="text-navy">TILERS</span>
              <span className="text-secondary ml-0.5">HUB</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)))
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-navy hover:bg-gray-50"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
