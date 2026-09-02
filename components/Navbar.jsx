"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check user cookie or login state if available
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          setUser({ role: "ADMIN" });
        } else {
          setUser({ role: "USER" });
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link
              href="/rankings"
              className="flex items-center gap-2 font-black text-xl text-amber-400 tracking-tight"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black">
                ⚡
              </span>
              <span>PowerBench PH</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Philippine RES Platform
            </span>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-3">
            <Link
              href="/rankings"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                pathname === "/rankings"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              🏆 RES Rankings
            </Link>

            <Link
              href="/dashboard/survey"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                pathname === "/dashboard/survey"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              📝 Rate Supplier
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                pathname === "/dashboard"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              👤 Dashboard
            </Link>

            <Link
              href="/admin"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                pathname.startsWith("/admin")
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-amber-400 hover:bg-amber-500/10 border border-amber-500/30"
              }`}
            >
              ⚙️ Admin Portal
            </Link>

            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition border border-rose-500/20"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
