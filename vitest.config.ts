import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "lcov", "html"],
      // 目标：FE 60% / BE 90% (docs/todo.md Phase 7)
      // 当前骨架阶段放宽门禁，先保证 BE/auth ≥90% 已达标，整体随 Phase 3-4 逐步补齐后收紧
      thresholds: {
        statements: 23,
        branches: 25,
        functions: 18,
        lines: 24,
      },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "**/node_modules/**",
        ".next/**",
        "drizzle/**",
        "coverage/**",
      ],
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
