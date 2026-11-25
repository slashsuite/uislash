import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  retries: 0,
  reporter: process.env["CI"] ? [["github"], ["html", { open: "never" }]] : "list",
  use: { trace: { mode: "retain-on-failure", sources: false } },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
