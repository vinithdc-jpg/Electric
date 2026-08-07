import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-6">
          ⚡ Philippine Retail Electricity Supplier (RES) Benchmarking Platform
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight max-w-4xl leading-tight mb-6">
          Empowering Contestable Energy Consumers Across the Philippines
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          Compare Retail Electricity Suppliers (RES), rate vendor performance, evaluate green power options, and explore transparent customer satisfaction rankings.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/rankings"
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 text-base"
          >
            🏆 View RES Leaderboard
          </Link>
          <Link
            href="/dashboard/survey"
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition border border-slate-800 text-base"
          >
            📝 Rate Your Supplier
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold transition border border-slate-700 text-base"
          >
            🔑 Member Login
          </Link>
        </div>
      </main>
    </div>
  );
}
