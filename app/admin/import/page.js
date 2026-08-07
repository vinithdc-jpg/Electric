"use client";

import { useState } from "react";

export default function AdminImportPage() {
  const [importType, setImportType] = useState("USERS");
  const [csvContent, setCsvContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleImportSubmit = async () => {
    if (!csvContent.trim()) {
      alert("Please upload or paste CSV content first.");
      return;
    }

    setUploading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importType, csvContent }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data);
      } else {
        setErrorMsg(data.message || "Failed to process bulk CSV import.");
      }
    } catch (err) {
      setErrorMsg("Network error submitting import file.");
    } finally {
      setUploading(false);
    }
  };

  const sampleUsersCSV = `name,email,phone,address,city,current_vendor
Juan Dela Cruz,juan@company.ph,+639171234567,123 Ayala Ave,Makati City,AboitizPower RES
Maria Santos,maria@factory.ph,+639189876543,456 Industrial Zone,Pasig City,Meralco MPower`;

  const sampleQuestionsCSV = `category,question_text,question_type
CURRENT_VENDOR_PERFORMANCE,How would you rate monthly billing accuracy?,RATING_1_TO_10
CURRENT_VENDOR_PERFORMANCE,Does your RES provide emergency outage alerts?,YES_NO
DESIRED_VENDOR_PREFERENCE,Do you require 100% green solar/hydro power tariffs?,YES_NO`;

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h1 className="text-3xl font-black text-white mb-1">Bulk Data Import Utility</h1>
        <p className="text-slate-400 text-sm">
          Import bulk user registries or survey questionnaire schemas using formatted CSV files.
        </p>
      </div>

      {/* Import Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              1. Select Data Import Type
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setImportType("USERS");
                  setResult(null);
                }}
                className={`w-full p-4 rounded-2xl text-left font-bold text-sm transition border ${
                  importType === "USERS"
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                👥 Import Users Registry
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportType("QUESTIONNAIRES");
                  setResult(null);
                }}
                className={`w-full p-4 rounded-2xl text-left font-bold text-sm transition border ${
                  importType === "QUESTIONNAIRES"
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                📝 Import Questionnaires
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
            <p className="font-bold text-slate-200 mb-1">Expected CSV Headers:</p>
            {importType === "USERS" ? (
              <code className="text-amber-400 block font-mono text-[11px] break-all">
                name, email, phone, address, city, current_vendor
              </code>
            ) : (
              <code className="text-amber-400 block font-mono text-[11px] break-all">
                category, question_text, question_type
              </code>
            )}
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              2. Upload or Paste CSV File
            </label>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-8 text-center transition bg-slate-950/50 cursor-pointer mb-4"
            >
              <div className="text-3xl mb-2">📥</div>
              <p className="text-sm font-semibold text-white">Drag & drop your CSV file here</p>
              <p className="text-xs text-slate-500 mt-1">or click to browse from your device</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-4 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-400">CSV Raw Content Preview</label>
                <button
                  onClick={() =>
                    setCsvContent(importType === "USERS" ? sampleUsersCSV : sampleQuestionsCSV)
                  }
                  className="text-xs text-amber-400 hover:underline"
                >
                  Load Sample Data
                </button>
              </div>
              <textarea
                rows={5}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Paste CSV rows here..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleImportSubmit}
              disabled={uploading}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {uploading ? "Processing CSV Rows..." : `Execute Bulk ${importType} Import`}
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-sm">
          ❌ {errorMsg}
        </div>
      )}

      {/* Import Execution Results & Error Logs */}
      {result && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-wrap gap-6 items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Import Summary Results</h2>
              <p className="text-xs text-slate-400">Processed {result.summary.totalRows} CSV rows</p>
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                ✓ {result.summary.successfulCount} Successful
              </span>
              <span className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20">
                ✗ {result.summary.failedCount} Failed
              </span>
            </div>
          </div>

          {result.errorLogs && result.errorLogs.length > 0 && (
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
              <h3 className="text-md font-bold text-rose-400 mb-4">⚠️ Row Validation Error Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
                      <th className="p-3">Row #</th>
                      <th className="p-3">Row Data</th>
                      <th className="p-3">Error Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.errorLogs.map((err, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/50">
                        <td className="p-3 font-bold text-amber-400">Row {err.row}</td>
                        <td className="p-3 text-slate-300 max-w-xs truncate">{JSON.stringify(err.data)}</td>
                        <td className="p-3 text-rose-400 font-semibold">{err.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
