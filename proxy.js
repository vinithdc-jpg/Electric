import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function proxy(req) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = verifyToken(token);
      if (payload.status === "SUSPENDED") {
        const res = NextResponse.redirect(new URL("/login?error=suspended", req.url));
        res.cookies.set("token", "", { maxAge: 0 });
        return res;
      }
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = verifyToken(token);
      if (payload.status === "SUSPENDED") {
        const res = NextResponse.redirect(new URL("/login?error=suspended", req.url));
        res.cookies.set("token", "", { maxAge: 0 });
        return res;
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};