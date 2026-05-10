import { getSupabaseHealth } from "@/lib/supabase-health";

export default async function Home() {
  const health = await getSupabaseHealth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Hello,
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ellyn Shirk
        </h1>
        <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          This page confirms Next.js is running. Below is a live check against your
          Supabase project (Auth API).
        </p>

        <div
          className={`mt-8 rounded-xl px-4 py-3 text-sm ${
            health.ok
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
          }`}
        >
          <p className="font-medium">
            Supabase: {health.ok ? "OK" : "Needs attention"}
          </p>
          <p className="mt-1 opacity-90">{health.message}</p>
          {health.details && (
            <pre className="mt-3 max-h-32 overflow-auto rounded-lg bg-black/5 p-2 text-xs dark:bg-white/10">
              {JSON.stringify(health.details, null, 2)}
            </pre>
          )}
        </div>

        <p className="mt-8 text-xs text-zinc-400">
          API:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
            /api/health/supabase
          </code>
        </p>
      </main>
    </div>
  );
}
