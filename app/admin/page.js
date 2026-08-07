"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    usersTotal: 0,
    usersPending: 0,
    usersApproved: 0,
    vendorsTotal: 0,
    questionsTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, vendorsRes, questionsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/vendors"),
          fetch("/api/admin/questions"),
        ]);

        const usersData = await usersRes.json();
        const vendorsData = await vendorsRes.json();
        const questionsData = await questionsRes.json();

        setStats({
          usersTotal: usersData.stats ? usersData.stats.TOTAL : 0,
          usersPending: usersData.stats ? usersData.stats.PENDING : 0,
          usersApproved: usersData.stats ? usersData.stats.APPROVED : 0,
          vendorsTotal: vendorsData.vendors ? vendorsData.vendors.length : 0,
          questionsTotal: questionsData.questions ? questionsData.questions.length : 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h1 className="text-3xl font-black text-white mb-2">Platform Administration</h1>
        <p className="text-slate-400 text-sm">
          Overview metrics and management workflows for the Philippine Retail Electricity Supplier rating network.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
          <p className="text-3xl font-black text-white mt-2">{loading ? "..." : stats.usersTotal}</p>
          <span className="inline-block text-xs font-semibold text-emerald-400 mt-1">
            {stats.usersApproved} Approved
          </span>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Approvals</p>
          <p className="text-3xl font-black text-amber-400 mt-2">{loading ? "..." : stats.usersPending}</p>
          <span className="inline-block text-xs font-semibold text-slate-400 mt-1">Awaiting Review</span>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-400">RES Vendors</p>
          <p className="text-3xl font-black text-white mt-2">{loading ? "..." : stats.vendorsTotal}</p>
          <span className="inline-block text-xs font-semibold text-blue-400 mt-1">Philippine Electricity Vendors</span>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Active Questions</p>
          <p className="text-3xl font-black text-white mt-2">{loading ? "..." : stats.questionsTotal}</p>
          <span className="inline-block text-xs font-semibold text-purple-400 mt-1">Survey Engine Items</span>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Quick Admin Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/admin/users"
            className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition">
                👥 Pending Registrations
              </h3>
              <span className="text-slate-500 text-sm">→</span>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Review registered users, update account status to APPROVED or SUSPENDED.
            </p>
          </Link>

          <Link
            href="/admin/vendors"
            className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition">
                🏢 Manage RES Vendors
              </h3>
              <span className="text-slate-500 text-sm">→</span>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Add, edit, deactivate, or list Philippine Retail Electricity Suppliers.
            </p>
          </Link>

          <Link
            href="/admin/import"
            className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition">
                📥 Bulk CSV Data Import
              </h3>
              <span className="text-slate-500 text-sm">→</span>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Drag-and-drop CSV files to bulk register users or survey questions.
            </p>
          </Link>

          <Link
            href="/admin/email"
            className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition">
                📧 Broadcast Email Engine
              </h3>
              <span className="text-slate-500 text-sm">→</span>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Send transactional and announcement emails to target user groups.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
