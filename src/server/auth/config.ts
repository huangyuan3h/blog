export const SESSION_COOKIE = "karios_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7d

export function getEnv(name: string, fallback = "") {
  try {
    // @ts-ignore - Workers env
    const env = (globalThis as unknown as { env?: Record<string, string> })?.env;
    if (env?.[name]) return env[name];
  } catch {}
  return process.env[name] ?? fallback;
}
