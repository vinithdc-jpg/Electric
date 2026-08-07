"use client";

import { useEffect, useState } from "react";

export default function AdminQuestionnairePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState({
    category: "CURRENT_VENDOR_PERFORMANCE",
    question_text: "",
    question_type: "RATING_1_TO_10",
    is_active: true,
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/questions");
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      category: "CURRENT_VENDOR_PERFORMANCE",
      question_text: "",
      question_type: "RATING_1_TO_10",
      is_active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormData({
      category: q.category || "CURRENT_VENDOR_PERFORMANCE",
      question_text: q.question_text || "",
      question_type: q.question_type || "RATING_1_TO_10",
      is_active: q.is_active !== undefined ? q.is_active : true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestion ? `/api/admin/questions/${editingQuestion.id}` : "/api/admin/questions";
      const method = editingQuestion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        fetchQuestions();
      } else {
        alert(data.message || "Failed to save question");
      }
    } catch (err) {
      alert("Network error saving question");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this survey question?")) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchQuestions();
      } else {
        alert(data.message || "Failed to delete question");
      }
    } catch (err) {
      alert("Error deleting question");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Dynamic Questionnaire Builder</h1>
          <p className="text-slate-400 text-sm">
            Create and configure evaluation criteria for Current Vendor Performance and Desired Vendor Preferences.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          + Add New Question
        </button>
      </div>

      {/* Questions Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin text-3xl mb-2">⚡</div>
            <p>Loading questions list...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-base font-semibold">No survey questions configured.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Question Text</th>
                  <th className="py-4 px-6 text-center">Type</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-900/90 transition">
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                          q.category === "CURRENT_VENDOR_PERFORMANCE"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {q.category === "CURRENT_VENDOR_PERFORMANCE" ? "Performance" : "Preference"}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-semibold text-white text-sm max-w-md">
                      {q.question_text}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300">
                        {q.question_type === "YES_NO" ? "YES / NO" : "RATING 1–10"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {q.is_active ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">
              {editingQuestion ? "Edit Question" : "Create Survey Question"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Category Tag *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="CURRENT_VENDOR_PERFORMANCE">CURRENT_VENDOR_PERFORMANCE</option>
                  <option value="DESIRED_VENDOR_PREFERENCE">DESIRED_VENDOR_PREFERENCE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Question Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="e.g. How would you rate the overall reliability and outage notifications of your RES vendor?"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Question Response Type *
                </label>
                <select
                  value={formData.question_type}
                  onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="RATING_1_TO_10">RATING_1_TO_10 (Integer 1 to 10)</option>
                  <option value="YES_NO">YES_NO (Boolean)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="q_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="q_is_active" className="text-sm font-semibold text-slate-200">
                  Question Active in User Survey View
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
