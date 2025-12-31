"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/tasks", label: "Tasks" },
  { href: "/post-task", label: "Post Task" },
  { href: "/messages", label: "Messages" },
  { href: "/my-tasks", label: "My Tasks" },
  { href: "/profile", label: "Profile" },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link href="/tasks" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-navy overflow-hidden">
                <div className="h-1/2 bg-secondary"></div>
                <div className="h-1/2 bg-primary"></div>
              </div>
            </div>
            <div className="font-bold leading-tight">
              <span className="text-navy">TILERS </span>
              <span className="text-primary">HUB</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "text-gray-600 hover:text-navy transition-colors",
                  pathname === l.href && "text-navy font-semibold"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-10 w-10 grid place-items-center rounded-lg border hover:bg-neutral-50"
            aria-label="Open menu"
          >
            <div className="space-y-1">
              <div className="h-0.5 w-5 bg-black" />
              <div className="h-0.5 w-5 bg-black" />
              <div className="h-0.5 w-5 bg-black" />
            </div>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3">
            <div className="rounded-2xl border bg-white p-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cx(
                    "block px-3 py-2 rounded-xl text-sm",
                    pathname === l.href
                      ? "bg-black text-white"
                      : "hover:bg-neutral-50"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}