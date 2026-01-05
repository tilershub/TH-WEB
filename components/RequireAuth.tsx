"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      window.location.href = "/auth";
    }
  }, [loading, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-sm text-neutral-600">
        Checking authentication…
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}