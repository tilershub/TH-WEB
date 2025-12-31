"use client";

import Link from "next/link";

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4">
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

          <Link
            href="/notifications"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
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
          </Link>
        </div>
      </div>
    </header>
  );
}
