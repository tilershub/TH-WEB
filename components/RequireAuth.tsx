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

  if (loading) return <div className="text-sm text-neutral-600">Loading…</div>;

  if (!session) {
    return (
      <div className="rounded-lg border border-neutral-200 p-4 text-sm">
        You must be logged in to view this page.{" "}
        <a className="underline" href="/auth">Go to login</a>
      </div>
    );
  }

  return <>{children}</>;
}
