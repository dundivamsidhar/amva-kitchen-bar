import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");

  const { orderId, customerName, tableNumber, items, total, paymentMethod } = await req.json();

  if (!orderId || !items?.length) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const paymentLabel: Record<string, string> = {
    upi: "UPI",
    card: "Card (Razorpay)",
    cash: "Cash at Table",
    demo: "Demo",
  };

  const itemsHtml = items.map((item: OrderItem) => `
    <tr>
      <td style="padding:8px 0;color:rgba(255,255,255,0.8);font-size:14px;border-bottom:1px solid rgba(255,255,255,0.06)">
        ${item.name}${item.notes ? `<br><span style="color:rgba(255,255,255,0.35);font-size:12px">${item.notes}</span>` : ""}
      </td>
      <td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)">×${item.quantity}</td>
      <td style="padding:8px 0;color:#d4a017;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06)">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `).join("");

  try {
    await resend.emails.send({
      from: "AmVa Kitchen & Bar <onboarding@resend.dev>",
      to: "hello@amvakitchen.in", // sends to restaurant — customer has no email in order flow
      subject: `New Order #${orderId.slice(0, 8).toUpperCase()} — Table ${tableNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d0a04;color:#fff;padding:40px;border:1px solid rgba(212,160,23,0.2)">
          <div style="margin-bottom:24px">
            <h2 style="color:#d4a017;margin:0 0 4px;font-size:22px">AmVa Kitchen & Bar</h2>
            <p style="color:rgba(255,255,255,0.35);margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase">New Order Received</p>
          </div>

          <div style="background:rgba(212,160,23,0.06);border:1px solid rgba(212,160,23,0.2);padding:16px 20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 4px">Order ID</p>
              <p style="color:#fff;font-size:14px;font-weight:700;margin:0">#${orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div style="text-align:right">
              <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 4px">Table</p>
              <p style="color:#d4a017;font-size:20px;font-weight:700;margin:0">${tableNumber}</p>
            </div>
          </div>

          ${customerName ? `<p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 20px">Customer: <strong style="color:#fff">${customerName}</strong></p>` : ""}

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            ${itemsHtml}
          </table>

          <div style="border-top:1px solid rgba(212,160,23,0.2);padding-top:16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
            <div>
              <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 2px">Payment</p>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0">${paymentLabel[paymentMethod] ?? paymentMethod}</p>
            </div>
            <div style="text-align:right">
              <p style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 2px">Total</p>
              <p style="color:#d4a017;font-size:22px;font-weight:700;margin:0">₹${total.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px">
            <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">
              ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })} IST
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order email error:", err);
    return NextResponse.json({ ok: true, emailFailed: true });
  }
}
