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
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="mx-auto max-w-5xl">
          <div className="relative h-20 flex items-center justify-around px-6">
            <Link
              href="/home"
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive(pathname, "/home")
                  ? "text-navy"
                  : "text-gray-500"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium">Home</span>
            </Link>

            <Link
              href="/messages"
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive(pathname, "/messages")
                  ? "text-navy"
                  : "text-gray-500"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-medium">Post Task</span>
            </Link>

            <Link
              href="/post-task"
              className="absolute left-1/2 -translate-x-1/2 -top-7"
            >
              <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:bg-primary-dark transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>

            <Link
              href="/my-tasks"
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive(pathname, "/my-tasks")
                  ? "text-navy"
                  : "text-gray-500"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs font-medium">My Jobs</span>
            </Link>

            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive(pathname, "/profile")
                  ? "text-navy"
                  : "text-gray-500"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  );
}