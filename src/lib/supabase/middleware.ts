import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextResponse as NextResponseType } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "./database.types";

/** Cookie adapter used by the Next.js 16 proxy for admin session checks. */
export function createProxySupabaseClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  return { supabase, getResponse: () => response as NextResponseType };
}
