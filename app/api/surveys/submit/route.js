import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { sanitizeText, validateRating } from "@/lib/sanitize";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized. Please log in." }, { status: 401 });
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token session." }, { status: 401 });
  }

  if (user.status === "SUSPENDED") {
    return NextResponse.json(
      { success: false, message: "Your account is suspended. Submissions are disabled." },
      { status: 403 }
    );
  }

  const client = await pool.connect();
  try {
    const { vendor_id, responses, remarks, submission_type } = await req.json();

    if (!vendor_id) {
      return NextResponse.json({ success: false, message: "Vendor selection is required." }, { status: 400 });
    }

    const sanitizedRemarks = sanitizeText(remarks || "");

    await client.query("BEGIN");

    for (const resp of responses || []) {
      const { question_id, rating_value, boolean_value } = resp;

      let validatedRating = null;
      if (rating_value !== undefined && rating_value !== null && rating_value !== "") {
        validatedRating = validateRating(rating_value);
        if (validatedRating === null || validatedRating < 1 || validatedRating > 10) {
          await client.query("ROLLBACK");
          return NextResponse.json(
            { success: false, message: "Rating value must stay strictly within 1 and 10." },
            { status: 400 }
          );
        }
      }

      await client.query(
        `INSERT INTO survey_submissions (user_id, vendor_id, question_id, rating_value, boolean_value, remarks, submission_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          user.id,
          vendor_id,
          question_id,
          validatedRating,
          boolean_value !== undefined ? Boolean(boolean_value) : null,
          sanitizedRemarks,
          submission_type || "CURRENT_VENDOR",
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Survey submitted successfully! Thank you for rating your electricity supplier.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
