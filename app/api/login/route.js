import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(req) {

    const { email, password } = await req.json();

    const user = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );

    if (user.rows.length === 0) {

        return NextResponse.json(
            {
                message: "Invalid Credentials"
            },
            {
                status: 400
            }
        );
    }

    const currentUser = user.rows[0];

    const match = await bcrypt.compare(
        password,
        currentUser.password
    );

    if (!match) {

        return NextResponse.json(
            {
                message: "Wrong Password"
            },
            {
                status: 400
            }
        );
    }

    const token = createToken(currentUser);

    const response = NextResponse.json({

        message: "Login Success"

    });

    response.cookies.set(
        "token",
        token,
        {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/"
        }
    );
    return response;
}