import { NextResponse } from "next/server";

import { getSupabaseHealth } from "@/lib/supabase-health";

export async function GET() {
  const result = await getSupabaseHealth();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
