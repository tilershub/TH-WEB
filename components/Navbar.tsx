"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const links = [
  { href: "/tasks", label: "Tasks" },
  { href: "/post-task", label: "Post Task" },
  { href: "/messages", label: "Messages" },
  { href: "/my-tasks", label: "My Tasks" },
  { href: "/profile", label: "Profile" },
];

function NotificationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-navy overflow-hidden">
                <div className="h-1/2 bg-secondary"></div>
                <div className="h-1/2 bg-primary"></div>
              </div>
            </div>
            <div className="font-bold text-lg">
              <span className="text-navy">TILERS</span>
              <span className="text-primary ml-1">HUB</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/notifications"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <NotificationIcon />
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden border rounded-md p-2"
            >
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-black" />
                <span className="block w-5 h-0.5 bg-black" />
                <span className="block w-5 h-0.5 bg-black" />
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${
                    pathname === l.href
                      ? "font-semibold text-black"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="border px-3 py-1.5 rounded-md text-sm hover:bg-neutral-50"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <div className="border rounded-xl p-3 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-3 py-2 rounded-lg text-sm ${
                    pathname === l.href
                      ? "bg-black text-white"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              <button
                onClick={logout}
                className="w-full border px-3 py-2 rounded-lg text-sm hover:bg-neutral-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
