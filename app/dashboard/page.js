import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || null;

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-10 shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">Access denied</h1>
          <p className="mt-3 text-slate-600">You must log in to view the dashboard.</p>
          <Link href="/login" className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  try {
    const payload = verifyToken(token);
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
              <p className="mt-2 text-slate-600">Welcome back, {payload.email}</p>
            </div>
            <form action="/api/logout" method="post">
              <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
                Logout
              </button>
            </form>
          </div>
          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Account</h2>
              <p className="mt-2 text-slate-600">Email: {payload.email}</p>
              <p className="text-slate-600">User ID: {payload.id}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Secure area</h2>
              <p className="mt-2 text-slate-600">This page is protected by a token cookie and middleware redirect.</p>
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-10 shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">Authentication failed</h1>
          <p className="mt-3 text-slate-600">Your session is invalid. Please log in again.</p>
          <Link href="/login" className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
            Back to login
          </Link>
        </div>
      </main>
    );
  }
}
