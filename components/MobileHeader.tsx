"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="md:hidden sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-taupe-100/60">
      <div className="mx-auto max-w-5xl px-5">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="text-charcoal tracking-[0.2em] text-sm font-semibold uppercase">
            Tilershub
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 grid place-items-center"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5M3.75 15.75h16.5" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <nav className="pb-6 pt-2 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-3 py-2.5 text-sm tracking-wide rounded-lg transition-colors ${
                  (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)))
                    ? "text-charcoal bg-sand"
                    : "text-charcoal-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
