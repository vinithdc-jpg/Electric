import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    // Insert User
    const userResult = await client.query(
      `
      INSERT INTO users
      (
        full_name,
        age,
        phone_number,
        email,
        password
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING id
      `,
      [
        full_name,
        age,
        phone_number,
        email,
        hashedPassword,
      ]
    );

    const userId = userResult.rows[0].id;

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
        address,
        city,
        province,
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
        c_electric_supplier,
        d_supplier_preference,
      ]
    );

    // Insert Review
    await client.query(
      `
      INSERT INTO reviews
      (
        user_id,
        avg_monthly_consumption,
        avg_monthly_bill
      )
      VALUES($1,$2,$3)
      `,
      [
        userId,
        avg_monthly_consumption,
        avg_monthly_bill,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: "Registration Successful",
        userId,
      },
      {
        status: 201,
      }
    );
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