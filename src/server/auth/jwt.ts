import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "./config";

function getSecret() {
  const secret = getEnv("AUTH_SECRET") || getEnv("ADMIN_PASSWORD_HASH") || "dev-secret-change-me-32-chars!!";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: { userId: string; username: string }, expiresIn = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: string; username: string; exp?: number };
  } catch {
    return null;
  }
}
