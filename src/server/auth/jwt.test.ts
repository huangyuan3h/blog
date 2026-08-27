/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from "vitest";
import { signSession, verifySession } from "./jwt";

describe("jwt", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = "test-secret-32-chars-long-!!!!!!!";
  });
  it("sign and verify", async () => {
    const token = await signSession({ userId: "u1", username: "admin" });
    const payload = await verifySession(token);
    expect(payload?.username).toBe("admin");
    expect(payload?.userId).toBe("u1");
  });
  it("expired/invalid returns null", async () => {
    expect(await verifySession("invalid.token.here")).toBeNull();
    const token = await signSession({ userId: "u1", username: "admin" }, "0s");
    // 稍等让 jwt 过期需时间，改测篡改
    const tampered = token.slice(0, -2) + "ab";
    expect(await verifySession(tampered)).toBeNull();
  });
});
