import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const questionsResult = await pool.query(
      `SELECT id, category, question_text, question_type 
       FROM questions 
       WHERE is_active = TRUE 
       ORDER BY category ASC, id ASC`
    );

    const vendorsResult = await pool.query(
      `SELECT id, name, code 
       FROM vendors 
       WHERE is_active = TRUE 
       ORDER BY name ASC`
    );

    return NextResponse.json({
      success: true,
      questions: questionsResult.rows,
      vendors: vendorsResult.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
