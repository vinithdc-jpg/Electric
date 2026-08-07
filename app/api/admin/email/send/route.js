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

export async function POST(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { target_audience, subject, body } = await req.json();

    if (!subject || subject.trim() === "") {
      return NextResponse.json({ success: false, message: "Subject is required" }, { status: 400 });
    }

    if (!body || body.trim() === "") {
      return NextResponse.json({ success: false, message: "Email body is required" }, { status: 400 });
    }

    let userQuery = `SELECT email FROM users WHERE status != 'SUSPENDED'`;
    const params = [];

    if (target_audience === "APPROVED_USERS") {
      userQuery += ` AND status = 'APPROVED'`;
    } else if (target_audience === "PENDING_USERS") {
      userQuery += ` AND status = 'PENDING'`;
    }

    const usersResult = await pool.query(userQuery, params);
    const recipientEmails = usersResult.rows.map((u) => u.email);

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { success: false, message: "No recipients found for the selected target audience" },
        { status: 400 }
      );
    }

    // Dispatch broadcast email
    const dispatchResults = await sendBroadcastEmail({
      recipients: recipientEmails,
      subject: subject.trim(),
      body: body.trim(),
    });

    // Record campaign in DB
    const campaignResult = await pool.query(
      `INSERT INTO email_campaigns (subject, body, target_audience, recipient_count, status)
       VALUES ($1, $2, $3, $4, 'SENT')
       RETURNING *`,
      [subject.trim(), body.trim(), target_audience || "ALL_USERS", recipientEmails.length]
    );

    return NextResponse.json({
      success: true,
      message: `Email broadcast successfully dispatched to ${recipientEmails.length} recipients.`,
      campaign: campaignResult.rows[0],
      dispatchResults,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
