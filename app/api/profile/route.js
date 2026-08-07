import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
    const client = await pool.connect();

    try {
        const {
            user_id,

            address,
            city,
            province,

            c_electric_supplier,
            d_supplier_preference,

            avg_monthly_consumption,
            avg_monthly_bill,
        } = await req.json();

        if (!user_id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");

        await client.query(
            `
      INSERT INTO operating_locations
      (user_id, address, city, province)
      VALUES ($1, $2, $3, $4)
      `,
            [user_id, address, city, province]
        );

        await client.query(
            `
      INSERT INTO energy_profiles
      (user_id, c_electric_supplier, d_supplier_preference)
      VALUES ($1, $2, $3)
      `,
            [
                user_id,
                c_electric_supplier,
                d_supplier_preference,
            ]
        );

        await client.query(
            `
      INSERT INTO reviews
      (user_id, avg_monthly_consumption, avg_monthly_bill)
      VALUES ($1, $2, $3)
      `,
            [
                user_id,
                avg_monthly_consumption,
                avg_monthly_bill,
            ]
        );

        await client.query("COMMIT");

        return NextResponse.json(
            {
                success: true,
                message: "Profile saved successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}