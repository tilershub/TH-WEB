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
      },
      { onConflict: "id" }
    );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: userData.user.id });
}
