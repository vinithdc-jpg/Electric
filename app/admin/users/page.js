"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ TOTAL: 0, PENDING: 0, APPROVED: 0, SUSPENDED: 0 });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleUpdateStatus = async (userId, newStatus) => {
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(`Updated user ${data.user.email} to ${newStatus}`);
        fetchUsers();
      } else {
        alert(data.message || "Failed to update user status");
      }
    } catch (err) {
      alert("Network error updating status");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h1 className="text-3xl font-black text-white mb-2">User Control & Pending Registrations</h1>
        <p className="text-slate-400 text-sm">
          Review registered accounts, approve new applicants, or suspend access. Suspended users are immediately blocked.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
          ✅ {actionMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "APPROVED", "SUSPENDED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              statusFilter === st
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <span>{st}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/60 font-mono">
              {st === "ALL" ? stats.TOTAL : stats[st] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin text-3xl mb-2">⚡</div>
            <p>Loading user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-base font-semibold">No users found under filter "{statusFilter}".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">RES Supplier</th>
                  <th className="py-4 px-6 text-center">DPA Consent</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/90 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-white">{u.full_name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{u.phone_number || "No phone"}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-300">
                      <p className="font-medium text-slate-200">{u.city || "N/A"}</p>
                      <p className="text-slate-500">{u.province || u.address || ""}</p>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-300">
                      <p className="font-medium text-amber-400">{u.c_electric_supplier || "Not set"}</p>
                      <p className="text-slate-500 text-[11px]">Pref: {u.d_supplier_preference || "None"}</p>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {u.dpa_consent ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ✓ Agreed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          ✗ Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          u.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : u.status === "SUSPENDED"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {u.status || "PENDING"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status !== "APPROVED" && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, "APPROVED")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold border border-emerald-500/30 transition"
                          >
                            Approve
                          </button>
                        )}
                        {u.status !== "SUSPENDED" && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, "SUSPENDED")}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 transition"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
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
