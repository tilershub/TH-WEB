"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/auth?next=${next}`);
    }
  }, [loading, session, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-sm text-neutral-600">
        Checking authentication…
      </div>
    );
  }

  // IMPORTANT: don’t return null (blank screen). Show a message while redirecting.
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-sm text-neutral-600">
        Redirecting to login…
      </div>
    );
  }

  return <>{children}</>;
}