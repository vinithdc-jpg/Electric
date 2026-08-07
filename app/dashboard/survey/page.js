"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UserSurveyPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [submissionType, setSubmissionType] = useState("CURRENT_VENDOR");
  const [ratings, setRatings] = useState({});
  const [booleans, setBooleans] = useState({});
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveSurveyData = async () => {
      try {
        const res = await fetch("/api/surveys/active");
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
          setVendors(data.vendors);
          if (data.vendors.length > 0) {
            setSelectedVendor(data.vendors[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSurveyData();
  }, []);

  const handleRatingChange = (qId, val) => {
    setRatings({ ...ratings, [qId]: parseInt(val, 10) });
  };

  const handleBooleanChange = (qId, val) => {
    setBooleans({ ...booleans, [qId]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const responses = questions.map((q) => ({
      question_id: q.id,
      rating_value: q.question_type === "RATING_1_TO_10" ? ratings[q.id] || null : null,
      boolean_value: q.question_type === "YES_NO" ? booleans[q.id] ?? null : null,
    }));

    try {
      const res = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: parseInt(selectedVendor, 10),
          submission_type: submissionType,
          responses,
          remarks,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message);
        setTimeout(() => {
          router.push("/rankings");
        }, 2000);
      } else {
        setError(data.message || "Failed to submit survey.");
      }
    } catch (err) {
      setError("Network or server error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center text-slate-400">
            <div className="inline-block animate-spin text-4xl mb-3">⚡</div>
            <p>Loading survey form...</p>
          </div>
        </div>
      </div>
    );
  }

  const performanceQuestions = questions.filter((q) => q.category === "CURRENT_VENDOR_PERFORMANCE");
  const preferenceQuestions = questions.filter((q) => q.category === "DESIRED_VENDOR_PREFERENCE");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Rate Your Electricity Supplier</h1>
          <p className="text-slate-400 mt-2">
            Your feedback directly impacts the Philippine Retail Electricity Supplier benchmark ratings.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
            ✅ {message} Redirecting to leaderboard...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vendor Selection Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span>🏢 Step 1: Select Electricity Vendor</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Supplier
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-amber-500 focus:outline-none"
                  required
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.code || "RES"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Submission Category
                </label>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-amber-500 focus:outline-none"
                >
                  <option value="CURRENT_VENDOR">Current Vendor Performance</option>
                  <option value="DESIRED_VENDOR">Desired Vendor Preference</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Vendor Performance Section */}
          {performanceQuestions.length > 0 && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-2">
                <span>⚡ Step 2: Vendor Performance Criteria</span>
              </h2>

              <div className="space-y-6">
                {performanceQuestions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <p className="text-sm font-semibold text-white mb-4">
                      {idx + 1}. {q.question_text}
                    </p>

                    {q.question_type === "RATING_1_TO_10" ? (
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>1 (Poor)</span>
                          <span className="font-bold text-amber-400">Score: {ratings[q.id] || "Not selected"}</span>
                          <span>10 (Excellent)</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleRatingChange(q.id, num)}
                              className={`py-2 rounded-xl text-xs font-bold transition border ${
                                ratings[q.id] === num
                                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20"
                                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleBooleanChange(q.id, true)}
                          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition border ${
                            booleans[q.id] === true
                              ? "bg-emerald-500 text-slate-950 border-emerald-500"
                              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          👍 Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBooleanChange(q.id, false)}
                          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition border ${
                            booleans[q.id] === false
                              ? "bg-rose-500 text-white border-rose-500"
                              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          👎 No
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desired Vendor Preference Section */}
          {preferenceQuestions.length > 0 && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-2">
                <span>🌱 Step 3: Desired Vendor Preferences</span>
              </h2>

              <div className="space-y-6">
                {preferenceQuestions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <p className="text-sm font-semibold text-white mb-4">
                      {idx + 1}. {q.question_text}
                    </p>

                    {q.question_type === "RATING_1_TO_10" ? (
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span>1 (Not Important)</span>
                          <span className="font-bold text-amber-400">Score: {ratings[q.id] || "Not selected"}</span>
                          <span>10 (Crucial)</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleRatingChange(q.id, num)}
                              className={`py-2 rounded-xl text-xs font-bold transition border ${
                                ratings[q.id] === num
                                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20"
                                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleBooleanChange(q.id, true)}
                          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition border ${
                            booleans[q.id] === true
                              ? "bg-emerald-500 text-slate-950 border-emerald-500"
                              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          👍 Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBooleanChange(q.id, false)}
                          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition border ${
                            booleans[q.id] === false
                              ? "bg-rose-500 text-white border-rose-500"
                              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          👎 No
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remarks TextArea & DPA Consent */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span>💬 Step 4: Remarks & Data Privacy Consent</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Optional User Remarks / Comments
                </label>
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Share details about power reliability, customer service experience, or billing clarity..."
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                <input type="checkbox" defaultChecked disabled className="mt-0.5 rounded border-slate-700 text-amber-500" />
                <p>
                  <strong className="text-slate-200">Data Privacy Act (DPA) Compliance:</strong> By submitting this rating, you agree to allow your sanitized review to be aggregated anonymously under the Philippine RES Benchmarking framework.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? "Submitting Rating..." : "Complete & Submit Rating"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
