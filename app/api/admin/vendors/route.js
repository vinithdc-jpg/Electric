import { NextResponse } from "next/server";
import pool from "@/lib/db";
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

// GET all vendors (Admin view including active/inactive)
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM vendors ORDER BY created_at DESC`
    );
    return NextResponse.json({ success: true, vendors: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create new RES vendor
export async function POST(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, code, description, contact_email, website, is_active } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, message: "Vendor name is required" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO vendors (name, code, description, contact_email, website, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name.trim(),
        code ? code.trim() : null,
        description ? description.trim() : null,
        contact_email ? contact_email.trim() : null,
        website ? website.trim() : null,
        is_active !== undefined ? is_active : true,
      ]
    );

    return NextResponse.json({ success: true, vendor: result.rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
