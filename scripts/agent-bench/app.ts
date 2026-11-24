/**
 * The consumer app each run works in: the packed `@slashsuite/ui-react` from this checkout,
 * installed once into a template and copied per run, then shaped to its arm.
 *
 *   A  the package without its `agent-docs/` and `skills/`, and no skill in the app.
 *   C  the package as packed, and its `skills/uislash/SKILL.md` installed as the app's project skill.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const ARMS = ["A", "C"] as const;
export type Arm = (typeof ARMS)[number];
export const isArm = (v: string): v is Arm => ARMS.some((a) => a === v);

export function sh(cmd: string[], cwd: string): string {
  const r = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0)
    throw new Error(`${cmd.join(" ")}: ${r.stderr.toString()}${r.stdout.toString()}`);
  return r.stdout.toString();
}

const json = (v: unknown) => `${JSON.stringify(v, null, 2)}\n`;

const TSCONFIG = {
  compilerOptions: {
    target: "ES2023",
    jsx: "react-jsx",
    module: "ESNext",
    moduleResolution: "bundler",
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    allowImportingTsExtensions: true,
  },
  include: ["src"],
};

const INDEX_CSS =
  '@import "tailwindcss";\n@import "@slashsuite/themes/catppuccin-latte.css";\n@source "../node_modules/@slashsuite/ui-react/dist";\n';

const MAIN_TSX =
  'import { createRoot } from "react-dom/client";\nimport "./index.css";\n\ncreateRoot(document.getElementById("root")!).render(<h1>Settings app</h1>);\n';

/** The package's devDependency versions, so the app's React matches the one the package builds on. */
function devVersions(pkgDir: string): (name: string) => string {
  const pkg: unknown = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  const dev = typeof pkg === "object" && pkg !== null ? Reflect.get(pkg, "devDependencies") : {};
  return (name) => {
    const v: unknown = Reflect.get(dev, name);
    if (typeof v !== "string") throw new Error(`ui-react has no devDependency ${name}`);
    return v;
  };
}

/** Packs ui-react (agent-docs already built by the moon dep), installs it into a fresh app. */
export function makeTemplate(repo: string, out: string): string {
  const pkgDir = join(repo, "packages/ui-react");
  const template = join(out, "template");
  mkdirSync(join(template, "src"), { recursive: true });
  const packed = sh(["npm", "pack", "--ignore-scripts", "--pack-destination", out], pkgDir);
  const tarball = join(out, packed.trim().split("\n").at(-1) ?? "");
  const dev = devVersions(pkgDir);
  const deps = {
    "@slashsuite/ui-react": `file:${tarball}`,
    react: dev("react"),
    "react-dom": dev("react-dom"),
    "@types/react": dev("@types/react"),
    "@types/react-dom": dev("@types/react-dom"),
    typescript: "5.9.3",
  };
  writeFileSync(
    join(template, "package.json"),
    json({ name: "settings-app", private: true, type: "module", dependencies: deps }),
  );
  writeFileSync(join(template, "bunfig.toml"), '[install]\nlinker = "hoisted"\n');
  writeFileSync(join(template, "tsconfig.json"), json(TSCONFIG));
  writeFileSync(join(template, "src/index.css"), INDEX_CSS);
  writeFileSync(join(template, "src/main.tsx"), MAIN_TSX);
  sh(["bun", "install"], template);
  const lib = join(template, "node_modules/@slashsuite/ui-react");
  for (const shipped of ["agent-docs/llms.txt", "skills/uislash/SKILL.md"])
    if (!existsSync(join(lib, shipped)))
      throw new Error(`the packed @slashsuite/ui-react has no ${shipped}`);
  return template;
}

/** A fresh copy of the template for one run of one arm, as its own git repository. */
export function setup(template: string, arm: Arm, dir: string): string {
  rmSync(dir, { recursive: true, force: true });
  cpSync(template, dir, { recursive: true });
  const lib = join(dir, "node_modules/@slashsuite/ui-react");
  if (arm === "A") {
    rmSync(join(lib, "agent-docs"), { recursive: true, force: true });
    rmSync(join(lib, "skills"), { recursive: true, force: true });
  } else {
    mkdirSync(join(dir, ".claude/skills/uislash"), { recursive: true });
    cpSync(join(lib, "skills/uislash/SKILL.md"), join(dir, ".claude/skills/uislash/SKILL.md"));
  }
  sh(["git", "init", "-q"], dir);
  return dir;
}
