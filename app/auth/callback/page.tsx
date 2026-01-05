// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Finishing sign in…");

  useEffect(() => {
    const run = async () => {
      try {
        const code = searchParams.get("code");
        const next = searchParams.get("next") || "/profile";

        if (!code) {
          setMsg("Missing code. Redirecting…");
          router.replace("/auth");
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;

        router.replace(next.startsWith("/") ? next : `/${next}`);
      } catch (e: any) {
        console.error(e);
        setMsg(e?.message ?? "Login failed. Redirecting…");
        setTimeout(() => router.replace("/auth"), 1200);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center">
        <div className="text-sm text-neutral-600">{msg}</div>
      </div>
    </div>
  );
}