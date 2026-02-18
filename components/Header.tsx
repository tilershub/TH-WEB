"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-taupe-100/60">
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="text-charcoal tracking-[0.2em] text-sm font-semibold uppercase">
            Tilershub
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[13px] tracking-wide transition-colors ${
                  (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)))
                    ? "text-charcoal"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="hidden md:inline-flex text-[13px] tracking-wide border border-charcoal/20 text-charcoal px-5 py-2 rounded-full hover:bg-charcoal hover:text-cream transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
