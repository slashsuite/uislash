/**
 * Is a run's result correct? It typechecks, renders, and uses the three components the way their
 * agent-docs pages say (the "one right way" and Do lines of the Button, Field and Table pages).
 *
 * bun scripts/agent-bench/check.ts <run dir>   prints JSON { ok, failed: [...] }
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface Verdict {
  ok: boolean;
  failed: string[];
}

function rules(code: string): [string, boolean][] {
  return [
    ["imports from @slashsuite/ui-react", /from ["']@slashsuite\/ui-react["']/.test(code)],
    ["no className or style", !/\b(className|style)=/.test(code)],
    [
      "no raw button/input/label/table/th/td",
      !/<(button|input|label|table|thead|tbody|tr|th|td)[\s>]/.test(code),
    ],
    [
      "Field label Project name with hint",
      /<Field[^>]*label=["{]?["']?Project name/.test(code) && /hint=/.test(code),
    ],
    [
      "Input in a Field, no id/htmlFor",
      /<Input\b/.test(code) && !/<Input[^>]*\bid=/.test(code) && !/htmlFor=/.test(code),
    ],
    [
      "Buttons in a ButtonGroup or a FormLayout actions row",
      /<ButtonGroup\b/.test(code) || /<FormLayout\b[\s\S]*?actions=\{[\s\S]*?<Button\b/.test(code),
    ],
    [
      "Cancel is a quieter variant",
      /<Button[^>]*variant=["'](outline|ghost|link)["'][^>]*>\s*Cancel/.test(code),
    ],
    ["Save is the one primary", /<Button(?![^>]*variant=)[^>]*>\s*Save/.test(code)],
    ["Table has a label", /<Table\b[^>]*label=/.test(code)],
    [
      "Table composed of head and body",
      /<TableHead\b/.test(code) && /<TableBody\b/.test(code) && /<TableHeaderCell\b/.test(code),
    ],
    ["Projects column is numeric", /<TableHeaderCell[^>]*numeric[^>]*>\s*Projects/.test(code)],
    ["Name cells are strong", /tone=["']strong["']/.test(code)],
  ];
}

const RENDER = `import { renderToString } from "react-dom/server"; import { createElement } from "react"; import { SettingsPage } from "./src/SettingsPage.tsx"; const h = renderToString(createElement(SettingsPage)); if (!h.includes("Ada Lovelace") || !h.includes("Project name")) { console.error("missing text"); process.exit(1) }`;

export function check(dir: string): Verdict {
  const file = join(dir, "src/SettingsPage.tsx");
  if (!existsSync(file)) return { ok: false, failed: ["no src/SettingsPage.tsx"] };
  const code = readFileSync(file, "utf8");
  const failed: string[] = [];
  const tsc = Bun.spawnSync(["node_modules/.bin/tsc", "--noEmit"], { cwd: dir });
  if (tsc.exitCode !== 0) failed.push(`tsc: ${tsc.stdout.toString().slice(0, 300)}`);
  for (const [name, pass] of rules(code)) if (!pass) failed.push(name);
  const render = Bun.spawnSync(["bun", "-e", RENDER], { cwd: dir });
  if (render.exitCode !== 0) failed.push(`render: ${render.stderr.toString().slice(0, 300)}`);
  return { ok: failed.length === 0, failed };
}

if (import.meta.main) console.log(JSON.stringify(check(resolve(process.argv[2] ?? "."))));
