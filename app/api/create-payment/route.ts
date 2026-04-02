import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // Require Razorpay keys — set them in .env.local
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("REPLACE")) {
      // Demo mode — return a fake order so UI still works without keys
      return NextResponse.json({
        id: "demo_order_" + Date.now(),
        amount: amount * 100,
        currency: "INR",
        demo: true,
      });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `amva_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
