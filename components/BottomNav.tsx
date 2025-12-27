"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background */}
      <div className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="relative h-16 flex items-center justify-between">
            {/* Tasks */}
            <Link
              href="/tasks"
              className={`flex flex-col items-center justify-center text-xs ${
                isActive(pathname, "/tasks")
                  ? "text-black"
                  : "text-neutral-500"
              }`}
            >
              <span className="text-lg">📋</span>
              Tasks
            </Link>

            {/* Messages */}
            <Link
              href="/messages"
              className={`flex flex-col items-center justify-center text-xs ${
                isActive(pathname, "/messages")
                  ? "text-black"
                  : "text-neutral-500"
              }`}
            >
              <span className="text-lg">💬</span>
              Chat
            </Link>

            {/* Center Post Button */}
            <Link
              href="/post-task"
              className="absolute left-1/2 -translate-x-1/2 -top-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg text-2xl">
                +
              </div>
            </Link>

            {/* My Tasks */}
            <Link
              href="/my-tasks"
              className={`flex flex-col items-center justify-center text-xs ${
                isActive(pathname, "/my-tasks")
                  ? "text-black"
                  : "text-neutral-500"
              }`}
            >
              <span className="text-lg">🧱</span>
              My Jobs
            </Link>

            {/* Profile */}
            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center text-xs ${
                isActive(pathname, "/profile")
                  ? "text-black"
                  : "text-neutral-500"
              }`}
            >
              <span className="text-lg">👤</span>
              Profile
            </Link>
          </div>
        </div>
      </div>

      {/* iOS safe area */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  );
}