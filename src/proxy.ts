import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/server/auth/jwt";

const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  // login 本身不保护
  if (pathname === "/admin/login" || pathname === "/api/auth/login") return NextResponse.next();
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("karios_session")?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const payload = await verifySession(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
