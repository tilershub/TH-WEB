import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

const validStatuses = ["pending", "approved", "declined"] as const;

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => null);
  const userId = body?.userId as string | undefined;
  const status = body?.status as (typeof validStatuses)[number] | undefined;
  const note = body?.note as string | undefined;

  if (!userId || !status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Missing userId or status" }, { status: 400 });
  }

  const approvalNote = status === "declined"
    ? (note?.trim() || "Your tasker profile does not meet the requirements.")
    : null;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ approval_status: status, approval_note: approvalNote })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.message.includes("approval_status") || error.code === "42703") {
      return NextResponse.json(
        {
          error:
            "Approval is unavailable because the profiles table is missing approval columns. Apply the database migration and refresh the schema cache.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
