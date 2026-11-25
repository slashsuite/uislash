/** Serves storybook-static (or `STATIC_DIR`) on localhost for the e2e run and the visual check; no dependency, no network beyond the loopback. */
import { fstatSync } from "node:fs";
import { join, normalize } from "node:path";

const root = process.env["STATIC_DIR"] ?? join(import.meta.dirname, "..", "storybook-static");
const port = Number(process.env["PORT"] ?? 6007);

/** A missing file: Cloudflare Pages answers with the build's own `404.html` and status 404 when it has one, and a bare 404 when it does not (a Storybook build has none). */
async function notFound() {
  const page = Bun.file(join(root, "404.html"));
  if (await page.exists()) return new Response(page, { status: 404 });
  return new Response("not found", { status: 404 });
}

/** What holds a TCP port on the loopback, from `ss` (Linux) or `lsof`, or "" when neither can say. */
function holderOf(taken: number): string {
  const probes: [string[], RegExp][] = [
    [["ss", "-Hltnp", `sport = :${taken}`], /pid=(\d+)/],
    [["lsof", "-t", `-iTCP:${taken}`, "-sTCP:LISTEN"], /^(\d+)/m],
  ];
  for (const [cmd, pidIn] of probes) {
    try {
      const pid = pidIn.exec(Bun.spawnSync(cmd, { stderr: "ignore" }).stdout.toString())?.[1];
      if (!pid) continue;
      const args = Bun.spawnSync(["ps", "-o", "args=", "-p", pid]).stdout.toString().trim();
      return `pid ${pid}${args ? ` (${args})` : ""}`;
    } catch {
      // That tool is not installed; try the next.
    }
  }
  return "";
}

let server: ReturnType<typeof Bun.serve>;
try {
  server = Bun.serve({
    hostname: "127.0.0.1",
    port,
    async fetch(req) {
      const path = normalize(decodeURIComponent(new URL(req.url).pathname));
      const file = Bun.file(join(root, path.endsWith("/") ? `${path}index.html` : path));
      // Refuse anything that resolves outside the build directory.
      if (!file.name?.startsWith(root) || !(await file.exists())) {
        return notFound();
      }
      return new Response(file);
    },
  });
} catch (error) {
  if (!(error instanceof Error && "code" in error && error.code === "EADDRINUSE")) throw error;
  const holder = holderOf(port);
  // Keep Bun's own wording first: the visual check reads it to retry on another port.
  process.stderr.write(
    `error: Failed to start server. Is port ${port} in use?\n code: "EADDRINUSE"\n` +
      `serve.ts: 127.0.0.1:${port} is held by ${holder || "another process"}. Stop that process by its pid, or serve on another PORT.\n`,
  );
  process.exit(1);
}

/** Stop serving and exit, so the port is free again. */
function stop(): never {
  void server.stop(true);
  process.exit(0);
}

for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"] as const) process.on(signal, stop);

// The runner that started this server holds the write end of its stdin pipe (Playwright's webServer
// does). When the runner dies, however it dies, the pipe closes: exit with it rather than outlive it
// holding the port. Only a pipe is watched (Node makes it a socket pair); a terminal or /dev/null is
// not a parent.
const stdin = fstatSync(0);
if (stdin.isFIFO() || stdin.isSocket()) {
  void (async () => {
    for await (const _ of Bun.stdin.stream()) {
      // Nothing is sent on it; the loop ends when the pipe closes.
    }
    stop();
  })();
}
