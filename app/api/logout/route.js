import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logged Out",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}