import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req) {

    try {
        const { full_name, age, phone_number, email, password } = await req.json();
        const exist = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (exist.rows.length > 0) {
            return NextResponse.json(
                {
                    message: "Email already exists"
                },
                {
                    status: 400
                }
            );

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users(full_name,age,phone_number,email,password) VALUES($1,$2,$3,$4,$5)",
            [
                full_name,
                age,
                phone_number,
                email,
                hashedPassword
            ]
        );

        return NextResponse.json({
            message: "Registration Successful"
        });
    }

    catch (error) {
        return NextResponse.json({
            error: error.message
        });
    }
}