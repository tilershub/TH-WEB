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
    <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">TH</span>
              </div>
            </div>
            <div className="font-bold text-lg tracking-tight">
              <span className="text-navy">TILERS</span>
              <span className="text-secondary ml-0.5">HUB</span>
            </div>
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 w-10 grid place-items-center rounded-lg border hover:bg-neutral-50"
            aria-label="Open menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="space-y-1">
                <div className="h-0.5 w-5 bg-black" />
                <div className="h-0.5 w-5 bg-black" />
                <div className="h-0.5 w-5 bg-black" />
              </div>
            )}
          </button>
        </div>

        {open && (
          <div className="pb-3">
            <div className="rounded-2xl border bg-white p-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${
                    (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)))
                      ? "bg-primary text-white"
                      : "hover:bg-neutral-50 text-gray-700"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block mt-2 text-center bg-secondary text-navy px-3 py-2.5 rounded-xl text-sm font-medium"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
