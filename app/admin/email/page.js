"use client";

import { useEffect, useState } from "react";

export default function AdminEmailPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [targetAudience, setTargetAudience] = useState("ALL_USERS");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email");
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      alert("Subject line and email body are required.");
      return;
    }

    setSending(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_audience: targetAudience,
          subject,
          body,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message);
        setSubject("");
        setBody("");
        fetchCampaigns();
      } else {
        setErrorMsg(data.message || "Failed to dispatch email broadcast.");
      }
    } catch (err) {
      setErrorMsg("Network error sending broadcast email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h1 className="text-3xl font-black text-white mb-1">Email Broadcast & Marketing Engine</h1>
        <p className="text-slate-400 text-sm">
          Compose and dispatch transactional emails or market updates to target user audiences across the RES network.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
          ✅ {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold text-sm">
          ❌ {errorMsg}
        </div>
      )}

      {/* Broadcast Composer */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Compose New Campaign</h2>

        <form onSubmit={handleSendBroadcast} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Target User Segment *
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value="ALL_USERS">All Registered Users (Except Suspended)</option>
                <option value="APPROVED_USERS">Approved Users Only</option>
                <option value="PENDING_USERS">Pending Registration Users Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. New Philippine RES Supplier Ratings Published"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Content (HTML / Text) *
            </label>
            <textarea
              rows={8}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email body message here... (Supports standard HTML or formatted text)"
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              <span>📧 {sending ? "Dispatching Emails..." : "Broadcast Email Campaign"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Campaign History Log */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Dispatched Campaign History</h2>

        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <div className="inline-block animate-spin text-2xl mb-2">⚡</div>
            <p>Loading campaign history...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-slate-400 text-sm italic">No broadcast campaigns sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Audience</th>
                  <th className="py-4 px-6 text-center">Recipients</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-950/50">
                    <td className="py-4 px-6 font-bold text-white">{c.subject}</td>
                    <td className="py-4 px-6 text-xs text-amber-400 font-mono">{c.target_audience}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-300">{c.recipient_count} users</td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-xs text-slate-400">
                      {new Date(c.sent_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
