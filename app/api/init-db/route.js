import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function GET() {
  return await initializeDatabase();
}

export async function POST() {
  return await initializeDatabase();
}

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(process.cwd(), "lib", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    await client.query(sql);

    // Check if admin user exists, create default admin if not
    const adminCheck = await client.query(
      "SELECT id FROM users WHERE email = $1 OR role = 'ADMIN'",
      ["admin@res.gov.ph"]
    );

    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("Admin123!", 10);
      await client.query(
        `INSERT INTO users (full_name, email, password, role, status, dpa_consent)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["Platform Administrator", "admin@res.gov.ph", hashedPassword, "ADMIN", "APPROVED", true]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database schema and seed data initialized successfully.",
      adminAccount: "admin@res.gov.ph / Admin123!"
    });
  } catch (error) {
    console.error("DB Initialization Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
