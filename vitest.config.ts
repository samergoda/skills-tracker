import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/__test__/setup.ts"],
    include: ["src/__test__/**/*.test.{ts,tsx,js,jsx}"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Alias "server-only" to an empty stub so tests can import server modules
      "server-only": path.resolve(__dirname, "./src/__test__/__mocks__/server-only.ts"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./src/__test__/__mocks__/server-only.ts"),
    },
  },
});
