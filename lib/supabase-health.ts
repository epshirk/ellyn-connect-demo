import { createClient } from "@supabase/supabase-js";

export type SupabaseHealth = {
  ok: boolean;
  message: string;
  details?: Record<string, unknown>;
};

/**
 * Verifies Supabase env vars and that the Auth REST endpoint responds.
 * Works on an empty project (no tables required).
 */
export async function getSupabaseHealth(): Promise<SupabaseHealth> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url?.trim() || !anon?.trim()) {
    return {
      ok: false,
      message:
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    };
  }

  try {
    const supabase = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const sessionPromise = supabase.auth.getSession();

    const healthUrl = new URL("/auth/v1/health", url.replace(/\/$/, ""));
    const healthFetch = fetch(healthUrl, {
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
      cache: "no-store",
    });

    const [{ error: sessionError }, healthRes] = await Promise.all([
      sessionPromise,
      healthFetch,
    ]);

    const healthBody = await healthRes.text();

    const ok = healthRes.ok && !sessionError;

    return {
      ok,
      message: ok
        ? "Connected to Supabase (Auth API responded)."
        : "Could not verify Supabase; check URL and anon key.",
      details: {
        authHealthStatus: healthRes.status,
        authHealthSnippet: healthBody.slice(0, 120),
        sessionError: sessionError?.message ?? null,
      },
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e),
    };
  }
}
