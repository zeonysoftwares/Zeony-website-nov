import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
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

function verifyResetToken(
  token: string
): { email: string; otpHash: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, providedSig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");

  const sigBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      email?: string;
      otpHash?: string;
      exp?: number;
    };
    if (!parsed.email || !parsed.otpHash || !parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    return { email: parsed.email, otpHash: parsed.otpHash, exp: parsed.exp };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const code = typeof body?.code === "string" ? body.code.trim() : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, verification code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(RESET_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Reset session expired or not found. Request a new code." },
        { status: 400 }
      );
    }

    const payload = verifyResetToken(token);
    if (!payload || payload.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification session." },
        { status: 400 }
      );
    }

    const providedHash = crypto.createHash("sha256").update(code).digest("hex");
    const hashBuf = Buffer.from(providedHash, "utf8");
    const expectedHashBuf = Buffer.from(payload.otpHash, "utf8");
    if (
      hashBuf.length !== expectedHashBuf.length ||
      !crypto.timingSafeEqual(hashBuf, expectedHashBuf)
    ) {
      return NextResponse.json(
        { success: false, message: "Incorrect verification code. Please check your email." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ password: newPassword })
      .eq("email", payload.email);

    if (updateError) {
      console.error("Failed to update admin password:", updateError.message);
      return NextResponse.json(
        { success: false, message: "Failed to update password in database." },
        { status: 500 }
      );
    }

    cookieStore.delete(RESET_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now log in with your new password.",
    });
  } catch (error: unknown) {
    console.error("Reset password route error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
