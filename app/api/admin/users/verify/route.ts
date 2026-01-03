import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => null);
  const userId = body?.userId as string | undefined;
  const verified = body?.verified as boolean | undefined;

  if (!userId || typeof verified !== "boolean") {
    return NextResponse.json({ error: "Missing userId or verified" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ is_verified: verified })
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}