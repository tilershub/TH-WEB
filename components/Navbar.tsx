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
          {/* Logo */}
          <Link href="/tasks" className="font-bold leading-tight">
            <div>TILERS</div>
            <div className="-mt-1">HUB</div>
          </Link>

          {/* Desktop nav */}
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

          {/* Mobile menu button */}
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
        </div>

        {/* Mobile menu */}
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