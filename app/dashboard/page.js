import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-10 max-w-md w-full shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="mt-3 text-slate-400 text-sm">You must log in to view your user dashboard.</p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full rounded-2xl bg-amber-500 px-5 py-3 text-slate-950 font-bold hover:bg-amber-400 transition"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  try {
    const payload = verifyToken(token);
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black text-white">User Dashboard</h1>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      payload.role === "ADMIN"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {payload.role || "USER"}
                  </span>
                </div>
                <p className="mt-1 text-slate-400 text-sm">Welcome back, {payload.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {payload.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
                  >
                    ⚙️ Admin Portal
                  </Link>
                )}
                <form action="/api/logout" method="post">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-rose-400 font-semibold text-sm border border-slate-700 hover:bg-slate-700 transition"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl font-bold mb-4 border border-amber-500/20">
                  ✍️
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Rate Your Electricity Supplier</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Submit ratings and satisfaction feedback for your current retail electricity vendor or express desired preferences.
                </p>
              </div>
              <Link
                href="/dashboard/survey"
                className="inline-flex justify-center items-center py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
              >
                Launch Survey Form →
              </Link>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl font-bold mb-4 border border-blue-500/20">
                  🏆
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Public RES Leaderboard</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Explore overall rankings, score breakdowns, and verified customer reviews across all Philippine electricity suppliers.
                </p>
              </div>
              <Link
                href="/rankings"
                className="inline-flex justify-center items-center py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
              >
                View Rankings →
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-10 max-w-md w-full shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-white">Authentication Failed</h1>
          <p className="mt-3 text-slate-400 text-sm">Your session is invalid or expired. Please log in again.</p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full rounded-2xl bg-amber-500 px-5 py-3 text-slate-950 font-bold hover:bg-amber-400 transition"
          >
            Back to Login
          </Link>
        </div>
      </main>
    );
  }
}
