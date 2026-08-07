import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "rating_desc";

  try {
    let baseQuery = `
      SELECT 
        v.id,
        v.name,
        v.code,
        v.description,
        COALESCE(ROUND(AVG(s.rating_value), 1), 0.0) as overall_rating,
        COUNT(DISTINCT s.id) as total_reviews,
        COALESCE(
          ROUND(
            (COUNT(CASE WHEN s.boolean_value = TRUE THEN 1 END)::DECIMAL / 
             NULLIF(COUNT(CASE WHEN s.boolean_value IS NOT NULL THEN 1 END), 0)) * 100, 
            0
          ), 
          0
        ) as satisfaction_score
      FROM vendors v
      LEFT JOIN survey_submissions s ON v.id = s.vendor_id
      WHERE v.is_active = TRUE
    `;

    const params = [];
    if (search.trim() !== "") {
      baseQuery += ` AND (v.name ILIKE $1 OR v.code ILIKE $1)`;
      params.push(`%${search.trim()}%`);
    }

    baseQuery += ` GROUP BY v.id, v.name, v.code, v.description`;

    if (sort === "rating_asc") {
      baseQuery += ` ORDER BY overall_rating ASC, total_reviews DESC`;
    } else if (sort === "reviews_desc") {
      baseQuery += ` ORDER BY total_reviews DESC, overall_rating DESC`;
    } else {
      baseQuery += ` ORDER BY overall_rating DESC, total_reviews DESC`;
    }

    const result = await pool.query(baseQuery, params);

    // Add rank index
    const rankedVendors = result.rows.map((vendor, idx) => ({
      rank: idx + 1,
      ...vendor,
      overall_rating: parseFloat(vendor.overall_rating),
      satisfaction_score: parseInt(vendor.satisfaction_score, 10),
      total_reviews: parseInt(vendor.total_reviews, 10),
    }));

    return NextResponse.json({
      success: true,
      rankings: rankedVendors,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
