import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "./schema";

type D1DatabaseLike = unknown;

// Workers 运行时通过 cloudflare:workers 拿到 D1
export function getDb() {
  try {
    const env = (globalThis as unknown as { env?: { DB: D1DatabaseLike } }).env
      ?? (process as unknown as { env: Record<string, unknown> }).env;
    if (env && (env as Record<string, unknown>).DB) {
      return drizzleD1((env as Record<string, unknown>).DB as never, { schema });
    }
  } catch {}
  return null;
}

export { schema };
