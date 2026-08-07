"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function VendorDetailPage() {
  const params = useParams();
  const { id } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await fetch(`/api/vendors/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVendorData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center text-slate-400">
            <div className="inline-block animate-spin text-4xl mb-3">⚡</div>
            <p>Loading RES vendor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.vendor) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Vendor Not Found</h1>
            <p className="text-slate-400 mb-6">The requested Retail Electricity Supplier could not be located.</p>
            <Link href="/rankings" className="px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold">
              Back to Rankings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { vendor, stats, questionBreakdown, ratingDistribution, remarks } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link href="/rankings" className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1">
            ← Back to All RES Rankings
          </Link>
        </div>

        {/* Vendor Header Card */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white">{vendor.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {vendor.code || "RES"}
                </span>
              </div>
              <p className="text-slate-300 max-w-2xl leading-relaxed">{vendor.description || "Licensed Philippine Retail Electricity Supplier under the ERC contestable market database."}</p>

              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline"
                >
                  🌐 Visit Official Website
                </a>
              )}
            </div>

            {/* Main Score Badge */}
            <div className="rounded-2xl bg-slate-950/80 border border-amber-500/30 p-6 text-center min-w-[200px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Rating</p>
              <div className="text-4xl font-black text-amber-400 mb-1">
                ★ {stats.overall_rating.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ 10</span>
              </div>
              <p className="text-xs font-semibold text-emerald-400">{stats.satisfaction_score}% Satisfaction Score</p>
              <p className="text-xs text-slate-400 mt-1">{stats.total_responses} Verified Reviews</p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Rating Distribution (Histogram) */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📊 Rating Distribution</span>
            </h2>
            <div className="space-y-2">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star] || 0;
                const pct = stats.total_responses > 0 ? (count / stats.total_responses) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-bold text-slate-400">{star} Stars</span>
                    <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-slate-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Category Breakdown */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📋 Performance & Preference Criteria</span>
            </h2>
            <div className="space-y-4">
              {questionBreakdown.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                        {q.category === "CURRENT_VENDOR_PERFORMANCE" ? "Vendor Performance" : "Customer Preference"}
                      </span>
                      <p className="text-sm font-semibold text-white mt-1.5">{q.question_text}</p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {q.question_type === "RATING_1_TO_10" ? (
                        <span className="inline-block px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-sm border border-amber-500/20">
                          ★ {q.avg_rating} / 10
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            👍 {q.yes_count} Yes
                          </span>
                          <span className="text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                            👎 {q.no_count} No
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Remarks Feed */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💬 User Remarks & Feedback</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {remarks.length} comments
            </span>
          </h2>

          {remarks.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No remarks submitted yet for this supplier.</p>
          ) : (
            <div className="space-y-4">
              {remarks.map((r, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-slate-300">👤 {r.full_name || "Verified Customer"}</span>
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">"{r.remarks}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
