import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSession } from "@/server/auth/jwt";
import { SESSION_COOKIE, SESSION_MAX_AGE, getEnv } from "@/server/auth/config";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!username || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

  const adminUser = getEnv("ADMIN_USERNAME", "admin");
  const adminHash = getEnv("ADMIN_PASSWORD_HASH", "");

  // 若未配置 hash，开发环境允许 admin/admin
  let ok = false;
  if (adminHash) {
    ok = username === adminUser && (await bcrypt.compare(password, adminHash));
  } else {
    ok = username === "admin" && password === "admin";
  }

  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await signSession({ userId: "admin", username: adminUser });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
