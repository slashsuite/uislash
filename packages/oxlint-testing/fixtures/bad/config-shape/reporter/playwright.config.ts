import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["html"]] : "list", // expect: ui-testing/config-shape
  use: { trace: "retain-on-failure" },
});
