import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(req) {
  const client = await pool.connect();

  try {
    const data = await req.json();

    const {
      full_name,
      age,
      phone_number,
      email,
      password,

      address,
      city,
      province,

      c_electric_supplier,
      d_supplier_preference,

      avg_monthly_consumption,
      avg_monthly_bill,

      dpa_consent = true,
    } = data;

    // Check if email already exists
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    // Insert User with role USER and status PENDING
    const userResult = await client.query(
      `
      INSERT INTO users
      (
        full_name,
        age,
        phone_number,
        email,
        password,
        role,
        status,
        dpa_consent
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, role, status
      `,
      [
        full_name,
        age || null,
        phone_number || null,
        email,
        hashedPassword,
        "USER",
        "PENDING",
        dpa_consent,
      ]
    );

    const user = userResult.rows[0];
    const userId = user.id;

    // Insert Operating Location
    await client.query(
      `
      INSERT INTO operating_locations
      (
        user_id,
        address,
        city,
        province
      )
      VALUES($1,$2,$3,$4)
      `,
      [
        userId,
        address || null,
        city || null,
        province || null,
      ]
    );

    // Insert Energy Profile
    await client.query(
      `
      INSERT INTO energy_profiles
      (
        user_id,
        c_electric_supplier,
        d_supplier_preference
      )
      VALUES($1,$2,$3)
      `,
      [
        userId,
        c_electric_supplier || null,
        d_supplier_preference || null,
      ]
    );

    await client.query("COMMIT");

    const token = createToken({
      id: userId,
      email: email,
      role: user.role,
      status: user.status,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration Successful",
        user: {
          id: userId,
          email: email,
          role: user.role,
          status: user.status,
        },
      },
      {
        status: 201,
      }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}