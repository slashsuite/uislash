import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The unit tests run under jsdom with `react-native` swapped for a DOM stand-in (test/react-native.tsx).
export default defineConfig({
  resolve: {
    alias: { "react-native": fileURLToPath(new URL("test/react-native.tsx", import.meta.url)) },
    conditions: ["development"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
  },
});
