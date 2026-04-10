import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");

  const { name, email, date, time, guests, occasion, special_requests } = await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  try {
    await resend.emails.send({
      from: "AmVa Kitchen & Bar <onboarding@resend.dev>",
      to: email,
      subject: `Reservation Request Received — ${formattedDate} at ${time}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d0a04;color:#fff;padding:40px;border:1px solid rgba(212,160,23,0.2)">
          <div style="margin-bottom:24px">
            <h2 style="color:#d4a017;margin:0 0 4px;font-size:22px">AmVa Kitchen & Bar</h2>
            <p style="color:rgba(255,255,255,0.35);margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase">Jubilee Hills, Hyderabad</p>
          </div>

          <h3 style="color:#fff;margin:0 0 8px;font-size:20px">You're on the list, ${name.split(' ')[0]}.</h3>
          <p style="color:rgba(255,255,255,0.55);margin:0 0 28px;font-size:14px;line-height:1.6">
            We've received your reservation request and will confirm it shortly via phone or email.
          </p>

          <div style="background:rgba(212,160,23,0.06);border:1px solid rgba(212,160,23,0.2);padding:24px;margin-bottom:28px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;padding:6px 0;width:40%">Date</td>
                <td style="color:#fff;font-size:14px;font-weight:600;padding:6px 0">${formattedDate}</td>
              </tr>
              <tr>
                <td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;padding:6px 0">Time</td>
                <td style="color:#fff;font-size:14px;font-weight:600;padding:6px 0">${time}</td>
              </tr>
              <tr>
                <td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;padding:6px 0">Guests</td>
                <td style="color:#fff;font-size:14px;font-weight:600;padding:6px 0">${guests} ${guests === 1 ? "Guest" : "Guests"}</td>
              </tr>
              ${occasion ? `<tr>
                <td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;padding:6px 0">Occasion</td>
                <td style="color:#d4a017;font-size:14px;font-weight:600;padding:6px 0">${occasion}</td>
              </tr>` : ""}
              ${special_requests ? `<tr>
                <td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;padding:6px 0;vertical-align:top">Notes</td>
                <td style="color:rgba(255,255,255,0.6);font-size:13px;padding:6px 0">${special_requests}</td>
              </tr>` : ""}
            </table>
          </div>

          <div style="margin-bottom:28px">
            <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0">
              Our team will call you to confirm your booking. For immediate assistance, call us at
              <a href="tel:+914022334455" style="color:#d4a017;text-decoration:none"> 040-2233-4455</a>.
            </p>
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px">
            <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0">
              AmVa Kitchen & Bar · Plot 42, Road 10, Jubilee Hills, Hyderabad 500033
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reservation email error:", err);
    // Don't fail the reservation if email fails
    return NextResponse.json({ ok: true, emailFailed: true });
  }
}
