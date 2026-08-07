"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating_desc");

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, sort });
      const res = await fetch(`/api/rankings?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRankings(data.rankings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRankings();
  };

  const topVendor = rankings.length > 0 ? rankings[0] : null;
  const totalReviews = rankings.reduce((acc, curr) => acc + (curr.total_reviews || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 p-8 sm:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
              ⚡ Official Philippine RES Benchmark
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Philippine Retail Electricity Supplier Rankings
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Transparent, user-driven ratings and satisfaction scores for contestable commercial and industrial power customers under the RCOA framework.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/survey"
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>✍️ Submit RES Rating</span>
              </Link>
              <a
                href="#rankings-table"
                className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium border border-slate-700 transition flex items-center gap-2"
              >
                <span>📊 View Leaderboard</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl font-bold border border-amber-500/20">
              🏆
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Rated Supplier</p>
              <p className="text-xl font-bold text-white mt-1">{topVendor ? topVendor.name : "N/A"}</p>
              <p className="text-xs text-amber-400 mt-0.5">{topVendor ? `★ ${topVendor.overall_rating} / 10` : ""}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl font-bold border border-blue-500/20">
              🏢
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active RES Suppliers</p>
              <p className="text-2xl font-black text-white mt-1">{rankings.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Licensed Electricity Vendors</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/20">
              💬
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total User Ratings</p>
              <p className="text-2xl font-black text-white mt-1">{totalReviews}</p>
              <p className="text-xs text-emerald-400 mt-0.5">Verified Customer Submissions</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div id="rankings-table" className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex gap-2">
            <input
              type="text"
              placeholder="Search by vendor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
            >
              Search
            </button>
          </form>

          <div className="w-full md:w-auto flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-400">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="rating_desc">Highest Rating (Default)</option>
              <option value="rating_asc">Lowest Rating</option>
              <option value="reviews_desc">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 shadow-xl backdrop-blur-md">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block animate-spin text-3xl mb-2">⚡</div>
              <p>Fetching RES rankings...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="text-lg font-semibold">No RES vendors found.</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria or initialize sample vendors in Admin.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6 text-center">Rank</th>
                    <th className="py-4 px-6">Vendor Name</th>
                    <th className="py-4 px-6 text-center">Overall Rating (1–10)</th>
                    <th className="py-4 px-6 text-center">Satisfaction Score</th>
                    <th className="py-4 px-6 text-center">Reviews Count</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {rankings.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-900/80 transition">
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xs ${
                            vendor.rank === 1
                              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                              : vendor.rank === 2
                              ? "bg-slate-300 text-slate-950"
                              : vendor.rank === 3
                              ? "bg-amber-700/80 text-white"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {vendor.rank === 1 ? "🥇 1" : vendor.rank === 2 ? "🥈 2" : vendor.rank === 3 ? "🥉 3" : vendor.rank}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-white text-base">{vendor.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{vendor.code || "RES Supplier"}</p>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black">
                          <span>★</span>
                          <span>{vendor.overall_rating > 0 ? vendor.overall_rating.toFixed(1) : "N/A"}</span>
                          <span className="text-slate-500 text-xs font-normal">/ 10</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${vendor.satisfaction_score}%` }}
                            />
                          </div>
                          <span className="font-bold text-emerald-400 text-xs">{vendor.satisfaction_score}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center font-medium text-slate-300">
                        {vendor.total_reviews} reviews
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/vendors/${vendor.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition border border-slate-700"
                        >
                          <span>View Details</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
