import { NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const offers = Array.isArray(body?.offers) ? body.offers : [];

  if (offers.length === 0) {
    return NextResponse.json({ error: "No offers provided." }, { status: 400 });
  }

  const rows = offers.map((offer: {
    subServiceId: string;
    isActive: boolean;
    price: number | null;
    imagePath?: string | null;
  }) => {
    const price = Number.isFinite(offer.price) ? Number(offer.price) : 0;

    if (offer.isActive && price < 0) {
      throw new Error("Invalid price.");
    }

    return {
      tasker_id: authData.user.id,
      sub_service_id: offer.subServiceId,
      price,
      image_path: offer.imagePath ?? null,
      is_active: offer.isActive,
    };
  });

  try {
    const { error } = await supabase
      .from("tasker_sub_services")
      .upsert(rows, { onConflict: "tasker_id,sub_service_id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
