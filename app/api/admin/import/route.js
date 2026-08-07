import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
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

// Simple CSV Parser helper
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
    if (values.length === headers.length || values.length > 1) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      rows.push({ rowIndex: i + 1, data: row });
    }
  }

  return rows;
}

export async function POST(req) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { importType, csvContent } = body; // importType: 'USERS' | 'QUESTIONNAIRES'

    if (!csvContent || csvContent.trim() === "") {
      return NextResponse.json({ success: false, message: "CSV content is empty" }, { status: 400 });
    }

    const rows = parseCSV(csvContent);
    const successLogs = [];
    const errorLogs = [];

    const defaultPassword = await bcrypt.hash("DefaultPass123!", 10);

    if (importType === "USERS") {
      for (const item of rows) {
        const { name, email, phone, address, city, current_vendor } = item.data;
        
        if (!email || !name) {
          errorLogs.push({
            row: item.rowIndex,
            data: item.data,
            error: "Missing required fields: name or email",
          });
          continue;
        }

        const client = await pool.connect();
        try {
          // Check existing email
          const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
          if (existing.rows.length > 0) {
            errorLogs.push({
              row: item.rowIndex,
              data: item.data,
              error: `Email ${email} already exists`,
            });
            continue;
          }

          await client.query("BEGIN");
          const userRes = await client.query(
            `INSERT INTO users (full_name, email, phone_number, password, role, status)
             VALUES ($1, $2, $3, $4, 'USER', 'APPROVED')
             RETURNING id`,
            [name, email, phone || null, defaultPassword]
          );

          const userId = userRes.rows[0].id;

          if (address || city) {
            await client.query(
              `INSERT INTO operating_locations (user_id, address, city) VALUES ($1, $2, $3)`,
              [userId, address || null, city || null]
            );
          }

          if (current_vendor) {
            await client.query(
              `INSERT INTO energy_profiles (user_id, c_electric_supplier) VALUES ($1, $2)`,
              [userId, current_vendor]
            );
          }

          await client.query("COMMIT");
          successLogs.push({ row: item.rowIndex, email, message: "Imported successfully" });
        } catch (err) {
          await client.query("ROLLBACK");
          errorLogs.push({ row: item.rowIndex, data: item.data, error: err.message });
        } finally {
          client.release();
        }
      }
    } else if (importType === "QUESTIONNAIRES") {
      for (const item of rows) {
        const { category, question_text, question_type } = item.data;
        const catUpper = (category || "").toUpperCase().trim();
        const typeUpper = (question_type || "").toUpperCase().trim();

        const validCategories = ["CURRENT_VENDOR_PERFORMANCE", "DESIRED_VENDOR_PREFERENCE"];
        const validTypes = ["YES_NO", "RATING_1_TO_10"];

        if (!validCategories.includes(catUpper)) {
          errorLogs.push({
            row: item.rowIndex,
            data: item.data,
            error: `Invalid category '${category}'. Must be CURRENT_VENDOR_PERFORMANCE or DESIRED_VENDOR_PREFERENCE`,
          });
          continue;
        }

        if (!validTypes.includes(typeUpper)) {
          errorLogs.push({
            row: item.rowIndex,
            data: item.data,
            error: `Invalid question_type '${question_type}'. Must be YES_NO or RATING_1_TO_10`,
          });
          continue;
        }

        if (!question_text) {
          errorLogs.push({
            row: item.rowIndex,
            data: item.data,
            error: "Missing question_text",
          });
          continue;
        }

        try {
          await pool.query(
            `INSERT INTO questions (category, question_text, question_type, is_active)
             VALUES ($1, $2, $3, TRUE)`,
            [catUpper, question_text.trim(), typeUpper]
          );
          successLogs.push({ row: item.rowIndex, question_text, message: "Imported successfully" });
        } catch (err) {
          errorLogs.push({ row: item.rowIndex, data: item.data, error: err.message });
        }
      }
    } else {
      return NextResponse.json({ success: false, message: "Invalid importType" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: rows.length,
        successfulCount: successLogs.length,
        failedCount: errorLogs.length,
      },
      successLogs,
      errorLogs,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
