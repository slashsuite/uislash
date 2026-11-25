import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false, // expect: ui-testing/config-shape
  retries: process.env.CI ? 2 : 0, // expect: ui-testing/config-shape
  reporter: "list", // expect: ui-testing/config-shape
  use: { trace: "on-first-retry" }, // expect: ui-testing/config-shape
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["iPhone 13"], browserName: "chromium" } }, // expect: ui-testing/config-shape
    { name: "iphone", use: { ...devices["iPhone 15"] } }, // expect: ui-testing/config-shape
    { name: "firefox", use: { ...devices["Desktop Firefox"] } }, // expect: ui-testing/config-shape
    { name: "safari", use: { browserName: "webkit" } }, // expect: ui-testing/config-shape
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } }, // expect: ui-testing/config-shape
  ],
  webServer: {
    command: "bun run preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI, // expect: ui-testing/config-shape
  },
});
