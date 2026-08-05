import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, age, phone_number, email, password } = await req.json();
    const exist = await pool.query("SELECT id FROM users WHERE email=$1", [email]);

    if (exist.rows.length > 0) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users(full_name, age, phone_number, email, password) VALUES($1,$2,$3,$4,$5) RETURNING id",
      [name, age, phone_number, email, hashedPassword]
    );

    const userId = result.rows[0]?.id;
    const token = createToken({ id: userId, email });
    const response = NextResponse.json(
      {
        message: "Registration Successful",
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
    return NextResponse.json(
      {
        error: error.message || "Registration failed.",
      },
      {
        status: 500,
      }
    );
  }
}