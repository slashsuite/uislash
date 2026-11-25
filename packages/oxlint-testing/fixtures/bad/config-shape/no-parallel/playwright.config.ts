import { defineConfig } from "@playwright/test"; // expect: ui-testing/config-shape

export default defineConfig({
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { trace: "retain-on-failure" },
});
