import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TIMESTAMP_FIELD: Record<string, string> = {
  acknowledged: "acknowledged_at",
  preparing:    "preparing_at",
  ready:        "ready_at",
  served:       "served_at",
};

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );

  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const validStatuses = ["new", "acknowledged", "preparing", "ready", "served", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updatePayload: Record<string, string> = { status };
  const tsField = TIMESTAMP_FIELD[status];
  if (tsField) {
    updatePayload[tsField] = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(updatePayload)
    .eq("id", id)
    .select();

  if (error) {
    console.error("update-order-status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Update blocked — check SUPABASE_SERVICE_ROLE_KEY." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, updated: data[0] });
}
