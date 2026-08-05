import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Electricy</h1>
        <p className="text-slate-600 mb-8">
          A simple authentication demo with register, login, and dashboard protection.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex justify-center rounded-2xl bg-slate-900 px-5 py-4 text-white transition hover:bg-slate-700"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex justify-center rounded-2xl border border-slate-200 px-5 py-4 text-slate-900 transition hover:bg-slate-100"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

