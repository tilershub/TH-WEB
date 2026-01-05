import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient(); // ✅ no await
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectTo = `${origin}${next.startsWith("/") ? next : `/${next}`}`; // ✅ correct
      return NextResponse.redirect(redirectTo);
    }
  }

  return NextResponse.redirect(`${origin}/auth`);
}