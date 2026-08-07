"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [initMsg, setInitMsg] = useState(null);
  const [initializing, setInitializing] = useState(false);

  const handleInitDB = async () => {
    setInitializing(true);
    setInitMsg(null);
    try {
      const res = await fetch("/api/init-db", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setInitMsg(`DB Initialized successfully! Default Admin: ${data.adminAccount}`);
      } else {
        setInitMsg(`Init Failed: ${data.message}`);
      }
    } catch {
      setInitMsg("Error initializing database.");
    } finally {
      setInitializing(false);
    }
  };

  const navItems = [
    { label: "📊 Overview Stats", href: "/admin" },
    { label: "👥 User Control", href: "/admin/users" },
    { label: "🏢 RES Vendors (CRUD)", href: "/admin/vendors" },
    { label: "📝 Question Builder", href: "/admin/questionnaire" },
    { label: "📥 Bulk CSV Import", href: "/admin/import" },
    { label: "📧 Email Broadcast", href: "/admin/email" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sticky top-24 shadow-xl">
            <div className="mb-6 pb-4 border-b border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                ADMINISTRATION
              </span>
              <h2 className="text-xl font-black text-white mt-2">Control Center</h2>
            </div>

            <nav className="space-y-1.5 mb-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleInitDB}
                disabled={initializing}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/20 transition"
              >
                {initializing ? "Initializing..." : "⚡ Sync DB Schema & Seeds"}
              </button>
              {initMsg && (
                <p className="mt-2 text-[11px] text-emerald-400 font-mono leading-tight">{initMsg}</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Admin Page Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
