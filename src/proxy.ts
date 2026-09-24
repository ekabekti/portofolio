import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxySupabaseClient } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const context = createProxySupabaseClient(request);

  // Local development can run without Supabase credentials; admin pages render a setup notice.
  if (!context) return NextResponse.next();

  try {
    const {
      data: { user },
    } = await context.supabase.auth.getUser();

    if (!user && !isLoginRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && isLoginRoute) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin/dashboard";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }

    return context.getResponse();
  } catch {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("reason", "session-check-failed");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
