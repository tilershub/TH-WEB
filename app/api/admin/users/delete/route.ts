import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Delete profile row
  const { error: profileDeleteErr } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileDeleteErr) {
    return NextResponse.json({ error: profileDeleteErr.message }, { status: 500 });
  }

  // Delete auth user (prevents login)
  const { error: authDeleteErr } = await supabase.auth.admin.deleteUser(userId);

  if (authDeleteErr) {
    return NextResponse.json({ error: authDeleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}