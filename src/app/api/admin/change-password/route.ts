import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All password fields are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const { data: adminUser, error: authError } = await supabase
      .from("admin_users")
      .select("id, email")
      .eq("email", email)
      .eq("password", currentPassword)
      .maybeSingle();

    if (authError || !adminUser) {
      return NextResponse.json(
        { success: false, message: "Current email or password is incorrect." },
        { status: 401 }
      );
    }

    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ password: newPassword })
      .eq("id", adminUser.id);

    if (updateError) {
      console.error("Failed to update password:", updateError.message);
      return NextResponse.json(
        { success: false, message: "Unable to update password right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully.",
    });
  } catch (error: unknown) {
    console.error("Change password route error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
