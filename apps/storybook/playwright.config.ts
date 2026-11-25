import { execFileSync } from "node:child_process";
import { defineConfig, devices } from "@playwright/test";

/**
 * A port nothing listens on now, picked once per run, so two checkouts can run the suite at once.
 * The config is read again in every worker, which inherits the runner's environment, so the first
 * read keeps its pick in `E2E_PORT` and the workers reuse it. `E2E_PORT` set beforehand wins.
 */
function runPort(): number {
  process.env["E2E_PORT"] ??= execFileSync(process.execPath, [
    "-e",
    'const s = require("node:net").createServer().listen(0, "127.0.0.1", () => { process.stdout.write(String(s.address().port)); s.close(); });',
  ]).toString();
  return Number(process.env["E2E_PORT"]);
}

const port = runPort();

export default defineConfig({
  testDir: "e2e",
  testMatch: "*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  reporter: process.env["CI"] ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  // Every spec runs in Chromium and nothing else (playwright.config.test.ts fails on another engine).
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // The `e2e` moon task builds Storybook first; this only serves the result. STATIC_DIR is set here,
  // not taken from the shell, so the run always tests the build the task hashed.
  webServer: {
    command: "bun e2e/serve.ts",
    url: `http://127.0.0.1:${port}/iframe.html`,
    env: { PORT: String(port), STATIC_DIR: `${import.meta.dirname}/storybook-static` },
    reuseExistingServer: false,
  },
});
