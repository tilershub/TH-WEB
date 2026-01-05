import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  // If someone opens /auth/callback without a code, send them to /auth
  if (!code) {
    return NextResponse.redirect(`${origin}/auth`);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // send user back with readable error (prevents "site can't be reached")
      return NextResponse.redirect(
        `${origin}/auth?error=${encodeURIComponent(error.message)}`
      );
    }

    const safeNext = next.startsWith("/") ? next : `/${next}`;
    return NextResponse.redirect(`${origin}${safeNext}`);
  } catch (e: any) {
    return NextResponse.redirect(
      `${origin}/auth?error=${encodeURIComponent(e?.message ?? "callback_failed")}`
    );
  }
}