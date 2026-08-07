import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    // 1. Fetch vendor basic info
    const vendorResult = await pool.query(
      `SELECT * FROM vendors WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (vendorResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    const vendor = vendorResult.rows[0];

    // 2. Fetch overall stats
    const statsResult = await pool.query(
      `SELECT 
        COALESCE(ROUND(AVG(rating_value), 1), 0.0) as overall_rating,
        COUNT(DISTINCT id) as total_responses,
        COALESCE(
          ROUND(
            (COUNT(CASE WHEN boolean_value = TRUE THEN 1 END)::DECIMAL / 
             NULLIF(COUNT(CASE WHEN boolean_value IS NOT NULL THEN 1 END), 0)) * 100, 
            0
          ), 
          0
        ) as satisfaction_score
       FROM survey_submissions 
       WHERE vendor_id = $1`,
      [id]
    );

    const stats = {
      overall_rating: parseFloat(statsResult.rows[0].overall_rating),
      total_responses: parseInt(statsResult.rows[0].total_responses, 10),
      satisfaction_score: parseInt(statsResult.rows[0].satisfaction_score, 10),
    };

    // 3. Score breakdown by question
    const questionBreakdown = await pool.query(
      `SELECT 
        q.id,
        q.category,
        q.question_text,
        q.question_type,
        COALESCE(ROUND(AVG(s.rating_value), 1), 0.0) as avg_rating,
        COUNT(CASE WHEN s.boolean_value = TRUE THEN 1 END) as yes_count,
        COUNT(CASE WHEN s.boolean_value = FALSE THEN 1 END) as no_count
       FROM questions q
       LEFT JOIN survey_submissions s ON q.id = s.question_id AND s.vendor_id = $1
       WHERE q.is_active = TRUE
       GROUP BY q.id, q.category, q.question_text, q.question_type
       ORDER BY q.category ASC, q.id ASC`,
      [id]
    );

    // 4. Rating distribution (1 to 10)
    const distributionResult = await pool.query(
      `SELECT rating_value, COUNT(*) as count
       FROM survey_submissions
       WHERE vendor_id = $1 AND rating_value IS NOT NULL
       GROUP BY rating_value
       ORDER BY rating_value ASC`,
      [id]
    );

    const ratingDistribution = {};
    for (let r = 1; r <= 10; r++) {
      ratingDistribution[r] = 0;
    }
    distributionResult.rows.forEach((row) => {
      ratingDistribution[row.rating_value] = parseInt(row.count, 10);
    });

    // 5. Remarks / Comments feed
    const remarksResult = await pool.query(
      `SELECT DISTINCT
        s.remarks,
        s.created_at,
        u.full_name
       FROM survey_submissions s
       JOIN users u ON s.user_id = u.id
       WHERE s.vendor_id = $1 AND s.remarks IS NOT NULL AND TRIM(s.remarks) != ''
       ORDER BY s.created_at DESC
       LIMIT 50`,
      [id]
    );

    return NextResponse.json({
      success: true,
      vendor,
      stats,
      questionBreakdown: questionBreakdown.rows,
      ratingDistribution,
      remarks: remarksResult.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
