import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, code, description, website FROM vendors WHERE is_active = TRUE ORDER BY name ASC`
    );
    return NextResponse.json({ success: true, vendors: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
