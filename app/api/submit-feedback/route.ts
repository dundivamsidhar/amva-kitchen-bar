import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );

  const { orderId, foodRating, serviceRating, ambienceRating, comment } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      food_rating: foodRating ?? null,
      service_rating: serviceRating ?? null,
      ambience_rating: ambienceRating ?? null,
      feedback_comment: comment ?? null,
      feedback_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("submit-feedback error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
