import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { trace: { mode: "on-first-retry" } }, // expect: ui-testing/config-shape
});
