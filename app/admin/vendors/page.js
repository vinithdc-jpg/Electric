"use client";

import { useEffect, useState } from "react";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    contact_email: "",
    website: "",
    is_active: true,
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      contact_email: "",
      website: "",
      is_active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVendor(v);
    setFormData({
      name: v.name || "",
      code: v.code || "",
      description: v.description || "",
      contact_email: v.contact_email || "",
      website: v.website || "",
      is_active: v.is_active !== undefined ? v.is_active : true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingVendor ? `/api/admin/vendors/${editingVendor.id}` : "/api/admin/vendors";
      const method = editingVendor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        fetchVendors();
      } else {
        alert(data.message || "Failed to save vendor");
      }
    } catch (err) {
      alert("Network error saving vendor");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to deactivate or remove this RES vendor?")) return;
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchVendors();
      } else {
        alert(data.message || "Failed to delete vendor");
      }
    } catch (err) {
      alert("Error deleting vendor");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">RES Vendor Management (CRUD)</h1>
          <p className="text-slate-400 text-sm">
            Maintain Philippine Retail Electricity Suppliers available for contestable customer benchmarking.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 shrink-0"
        >
          + Add New RES Supplier
        </button>
      </div>

      {/* Vendors Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin text-3xl mb-2">⚡</div>
            <p>Loading vendors list...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-base font-semibold">No RES vendors found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Vendor Name & Code</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Contact / Website</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/90 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-base">{v.name}</p>
                      <p className="text-xs font-mono text-amber-400">{v.code || "AP-RES"}</p>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-300 max-w-xs truncate">
                      {v.description || "No description provided."}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-300">
                      <p>{v.contact_email || "N/A"}</p>
                      <p className="text-amber-400 truncate max-w-[150px]">{v.website || ""}</p>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {v.is_active ? (
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
                          onClick={() => handleOpenEdit(v)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
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
              {editingVendor ? "Edit RES Supplier" : "Create New RES Supplier"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AboitizPower RES"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Supplier Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. AP-RES"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Company description and energy offerings..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="sales@res.ph"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-slate-200">
                  Vendor Active in Platform Rankings
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
