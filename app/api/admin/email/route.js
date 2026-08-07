import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendBroadcastEmail } from "@/lib/email";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  try {
    const payload = verifyToken(token);
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}

// GET email campaigns history
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM email_campaigns ORDER BY sent_at DESC`
    );
    return NextResponse.json({ success: true, campaigns: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
