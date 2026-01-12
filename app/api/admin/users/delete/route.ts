import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => null);
  const userId = body?.userId as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Prevent deleting yourself (safety)
  if (userId === guard.callerId) {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  // Optional: delete related data first (tasks/messages) if you have FK constraints.
  // Example:
  // await supabaseAdmin.from("tasks").delete().eq("user_id", userId);

  // Delete auth user first (this cascades to profiles via FK)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  // Ensure profile row is removed (in case cascade is not configured)
  const { error: profileError } = await supabaseAdmin.from("profiles").delete().eq("id", userId);
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
