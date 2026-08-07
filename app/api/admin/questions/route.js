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

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM questions ORDER BY category ASC, created_at DESC`
    );
    return NextResponse.json({ success: true, questions: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { category, question_text, question_type, is_active } = await req.json();

    const validCategories = ["CURRENT_VENDOR_PERFORMANCE", "DESIRED_VENDOR_PREFERENCE"];
    const validTypes = ["YES_NO", "RATING_1_TO_10"];

    if (!validCategories.includes(category)) {
      return NextResponse.json({ success: false, message: "Invalid question category" }, { status: 400 });
    }

    if (!validTypes.includes(question_type)) {
      return NextResponse.json({ success: false, message: "Invalid question type" }, { status: 400 });
    }

    if (!question_text || question_text.trim() === "") {
      return NextResponse.json({ success: false, message: "Question text is required" }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO questions (category, question_text, question_type, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [category, question_text.trim(), question_type, is_active !== undefined ? is_active : true]
    );

    return NextResponse.json({ success: true, question: result.rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
