import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

type CreateTaskerPayload = {
  email?: string;
  password?: string;
  fullName?: string;
  displayName?: string;
  city?: string;
  district?: string;
  isVerified?: boolean;
  approvalStatus?: "pending" | "approved" | "declined";
  approvalNote?: string;
};

const toOptionalValue = (value?: string) => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.res;

  const body = (await req.json().catch(() => null)) as CreateTaskerPayload | null;
  const email = body?.email?.trim();
  const password = body?.password?.trim();
  const fullName = body?.fullName?.trim();

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "Missing email, password, or full name" }, { status: 400 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      display_name: body?.displayName?.trim() || fullName,
    },
  });

  if (userError || !userData?.user) {
    return NextResponse.json({ error: userError?.message || "Unable to create user" }, { status: 400 });
  }

  const approvalStatus = body?.approvalStatus ?? "pending";
  const approvalNote =
    approvalStatus === "declined"
      ? body?.approvalNote?.trim() || "Your tasker profile does not meet the requirements."
      : null;

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: userData.user.id,
        role: "tasker",
        full_name: fullName,
        display_name: body?.displayName?.trim() || fullName,
        email,
        city: toOptionalValue(body?.city),
        district: toOptionalValue(body?.district),
        is_verified: body?.isVerified ?? false,
        approval_status: approvalStatus,
        approval_note: approvalNote,
      },
      { onConflict: "id" }
    );

  if (profileError) {
    if (
      profileError.message.includes("is_verified") ||
      profileError.message.includes("approval_status") ||
      profileError.message.includes("approval_note") ||
      profileError.code === "42703"
    ) {
      const { error: fallbackError } = await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: userData.user.id,
            role: "tasker",
            full_name: fullName,
            display_name: body?.displayName?.trim() || fullName,
            email,
            city: toOptionalValue(body?.city),
            district: toOptionalValue(body?.district),
          },
          { onConflict: "id" }
        );
      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true, userId: userData.user.id });
}
