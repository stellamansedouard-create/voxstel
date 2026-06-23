import { NextResponse, type NextRequest } from "next/server";

/**
 * Lightweight session check — reads Supabase auth cookies directly.
 * No network call, no Node.js APIs → fully Edge Runtime compatible.
 * Real token validation still happens in every Server Component via getCurrentUser().
 */
function hasAuthSession(request: NextRequest): boolean {
  return request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthSession(request);

  // Protect /dashboard — redirect to /login if not authenticated
  if (pathname.startsWith("/dashboard") && !authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/login" || pathname === "/signup") && authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
