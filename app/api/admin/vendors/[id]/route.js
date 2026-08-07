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

export async function PUT(req, { params }) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { name, code, description, contact_email, website, is_active } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE vendors 
       SET name = $1, code = $2, description = $3, contact_email = $4, website = $5, is_active = $6
       WHERE id = $7
       RETURNING *`,
      [name, code, description, contact_email, website, is_active, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await pool.query(`DELETE FROM vendors WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    // If foreign key constraint exists, fallback to setting is_active = false
    await pool.query(`UPDATE vendors SET is_active = false WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: "Vendor deactivated successfully" });
  }
}
