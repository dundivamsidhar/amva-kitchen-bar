import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Razorpay sends a webhook with:
// - razorpay-signature header
// - JSON body containing the event payload
//
// Setup in Razorpay Dashboard → Settings → Webhooks:
// URL: https://your-domain.com/api/razorpay-webhook
// Secret: set RAZORPAY_WEBHOOK_SECRET env var to match
// Events to subscribe: payment.captured, payment.failed

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const body = await req.text();

  // Verify signature
  if (webhookSecret) {
    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Razorpay webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let event: { event: string; payload: { payment: { entity: { id: string; order_id: string; status: string; amount: number } } } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentId = event.payload?.payment?.entity?.id;
  const rzpOrderId = event.payload?.payment?.entity?.order_id;

  if (event.event === "payment.captured") {
    // Payment successful — find order by payment_ref and mark verified
    if (paymentId) {
      await (supabase as any)
        .from("orders")
        .update({ payment_verified: true, payment_ref: paymentId })
        .eq("payment_ref", paymentId);

      // Also try matching by rzp order id if stored
      if (rzpOrderId) {
        await (supabase as any)
          .from("orders")
          .update({ payment_verified: true, payment_ref: paymentId })
          .eq("payment_ref", rzpOrderId);
      }
    }
    console.log(`Razorpay webhook: payment captured — ${paymentId}`);
  }

  if (event.event === "payment.failed") {
    // Payment failed — optionally mark the order as cancelled
    if (paymentId) {
      await (supabase as any)
        .from("orders")
        .update({ status: "cancelled" })
        .eq("payment_ref", paymentId);
    }
    console.log(`Razorpay webhook: payment failed — ${paymentId}`);
  }

  return NextResponse.json({ ok: true });
}
