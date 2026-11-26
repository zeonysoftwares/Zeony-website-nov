import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const RESET_COOKIE_NAME = "zeony_admin_reset";

function getSigningSecret(): string {
  return (
    process.env.ADMIN_RESET_SECRET ||
    process.env.RESEND_API_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "zeony-admin-reset-fallback-key"
  );
}

function signResetPayload(payload: { email: string; otpHash: string; exp: number }): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", getSigningSecret()).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid admin email address." },
        { status: 400 }
      );
    }

    const { data: adminUser, error: lookupError } = await supabase
      .from("admin_users")
      .select("id, email")
      .ilike("email", email)
      .maybeSingle();

    if (lookupError) {
      console.error("Admin lookup error:", lookupError.message);
      return NextResponse.json(
        { success: false, message: "Unable to process reset request right now." },
        { status: 500 }
      );
    }

    // Return a consistent response whether or not the email exists to prevent enumeration
    if (!adminUser) {
      return NextResponse.json({
        success: true,
        message: "If an admin account matches this email, a 6-digit verification code has been sent.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
    const token = signResetPayload({ email: adminUser.email, otpHash, exp });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { success: false, message: "Email service is not configured on the server." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    const { error: emailError } = await resend.emails.send({
      from: "Zeony Admin Security <notifications@zeonytechnologies.com>",
      to: adminUser.email,
      subject: "Zeony Admin Panel Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">Admin Password Reset</h2>
          <p style="color: #475569; line-height: 1.6;">
            We received a request to reset the password for your Zeony Technologies Admin Panel account.
            Use the 6-digit verification code below within <strong>10 minutes</strong>:
          </p>
          <div style="margin: 24px 0; padding: 16px; background-color: #f1f5f9; border-radius: 8px; text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            If you did not request this reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend reset email error:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send verification code email. Please try again." },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(RESET_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "If an admin account matches this email, a 6-digit verification code has been sent.",
    });
  } catch (error: unknown) {
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
