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
  const { category, question_text, question_type, is_active } = await req.json();

  try {
    const result = await pool.query(
      `UPDATE questions
       SET category = $1, question_text = $2, question_type = $3, is_active = $4
       WHERE id = $5
       RETURNING *`,
      [category, question_text, question_type, is_active, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, question: result.rows[0] });
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
    await pool.query(`DELETE FROM questions WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    await pool.query(`UPDATE questions SET is_active = false WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: "Question deactivated successfully" });
  }
}
