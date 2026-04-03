import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  // Initialise lazily so missing key doesn't crash the build
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  // Check employee exists with this email
  const { data: emp } = await supabase
    .from("employees")
    .select("id, full_name")
    .eq("email", email.trim().toLowerCase())
    .eq("is_active", true)
    .single();

  // Always return success to prevent email enumeration
  if (!emp) {
    return NextResponse.json({ ok: true });
  }

  // Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000));

  // Invalidate previous unused codes for this email
  await supabase
    .from("password_resets")
    .update({ used: true })
    .eq("email", email.trim().toLowerCase())
    .eq("used", false);

  // Store new code
  await supabase.from("password_resets").insert([{
    email: email.trim().toLowerCase(),
    code,
  }]);

  // Send email
  await resend.emails.send({
    from: "AmVa Kitchen & Bar <onboarding@resend.dev>",
    to: email.trim(),
    subject: "Your Password Reset Code — AmVa Kitchen & Bar",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0d0a04;color:#fff;padding:32px;border:1px solid rgba(212,160,23,0.2)">
        <h2 style="color:#d4a017;margin:0 0 8px">AmVa Kitchen & Bar</h2>
        <p style="color:rgba(255,255,255,0.5);margin:0 0 24px;font-size:13px">Staff Portal — Password Reset</p>
        <p style="color:rgba(255,255,255,0.8);margin:0 0 12px">Hi ${emp.full_name},</p>
        <p style="color:rgba(255,255,255,0.6);margin:0 0 24px;font-size:14px">Use the code below to reset your password. It expires in 15 minutes.</p>
        <div style="background:rgba(212,160,23,0.1);border:1px solid rgba(212,160,23,0.3);padding:24px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#d4a017">${code}</span>
        </div>
        <p style="color:rgba(255,255,255,0.3);font-size:12px">If you didn't request this, ignore this email. Your password will not change.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
