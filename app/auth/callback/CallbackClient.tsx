"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CallbackClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Just bounce to the route handler so it can exchange + set cookies + redirect
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/profile";

    if (code) {
      window.location.href = `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`;
    } else {
      window.location.href = "/auth";
    }
  }, [searchParams]);

  return <div className="p-6 text-sm text-gray-600">Signing you in…</div>;
}