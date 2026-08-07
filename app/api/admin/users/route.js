import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Check if requester is ADMIN
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

export async function GET(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status"); // 'PENDING', 'APPROVED', 'SUSPENDED', or 'ALL'

  try {
    let query = `
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.phone_number, 
        u.role, 
        u.status, 
        u.dpa_consent,
        u.created_at,
        ol.address,
        ol.city,
        ol.province,
        ep.c_electric_supplier,
        ep.d_supplier_preference
      FROM users u
      LEFT JOIN operating_locations ol ON u.id = ol.user_id
      LEFT JOIN energy_profiles ep ON u.id = ep.user_id
    `;

    const params = [];
    if (statusFilter && statusFilter !== "ALL") {
      query += ` WHERE u.status = $1`;
      params.push(statusFilter);
    }

    query += ` ORDER BY u.created_at DESC`;

    const result = await pool.query(query, params);

    // Also get stats count
    const statsResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM users 
      GROUP BY status
    `);

    const stats = {
      TOTAL: 0,
      PENDING: 0,
      APPROVED: 0,
      SUSPENDED: 0,
    };

    statsResult.rows.forEach((r) => {
      stats[r.status] = parseInt(r.count, 10);
      stats.TOTAL += parseInt(r.count, 10);
    });

    return NextResponse.json({
      success: true,
      users: result.rows,
      stats,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
