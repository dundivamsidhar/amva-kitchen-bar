import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key to bypass RLS — admin-only action
export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );

  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const validStatuses = ["pending", "confirmed", "cancelled", "seated"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updatePayload: Record<string, string> = { status };
  if (status === "seated") {
    updatePayload.seated_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .update(updatePayload)
    .eq("id", id)
    .select();

  if (error) {
    console.error("update-reservation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If no rows returned, RLS silently blocked the update (missing service role key)
  if (!data || data.length === 0) {
    console.error("update-reservation: 0 rows updated — check SUPABASE_SERVICE_ROLE_KEY in Vercel env vars");
    return NextResponse.json(
      { error: "Update blocked — SUPABASE_SERVICE_ROLE_KEY not configured in Vercel." },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
