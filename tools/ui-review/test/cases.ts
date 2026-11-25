import type { RuleId } from "../src/rules.js";

/**
 * Whole files, each added as a new file, with what layer 1 reports on them: `[rule, line]`.
 * `markup.test.ts` holds layer 1 to these, and `@slashsuite/oxlint-ui`'s parity test runs the same
 * files through oxlint and asserts it reports the same. Every case is a file a parser accepts, and
 * only the rules both run are planted here (no stylesheets, no `.astro`).
 */
export type Case = { name: string; path: string; source: string; expect: [RuleId, number][] };

const lines = (...text: string[]) => `${text.join("\n")}\n`;

export const CASES: Case[] = [
  {
    name: "a clean page that composes UISlash parts",
    path: "src/Page.tsx",
    source: lines(
      'import { Card, Stack } from "@slashsuite/ui-react";',
      "",
      "export function Page() {",
      "  return (",
      "    <Stack>",
      "      <Card>hello</Card>",
      "    </Stack>",
      "  );",
      "}",
    ),
    expect: [],
  },
  {
    name: "a raw bg-slate-800 div",
    path: "src/a.tsx",
    source: lines(
      "export const a = 1;",
      'export const b = <div className="bg-slate-800">x</div>;',
      "export const c = 2;",
    ),
    expect: [["raw-colour", 2]],
  },
  {
    name: "a variant and an arbitrary colour",
    path: "src/a.tsx",
    source: lines(
      'export const a = <p className="hover:text-violet-700">a</p>;',
      'export const b = <p className="bg-[#1e1e2e]">b</p>;',
    ),
    expect: [
      ["raw-colour", 1],
      ["raw-colour", 2],
    ],
  },
  {
    name: "a palette utility, in a template literal and a cn() call",
    path: "src/a.tsx",
    source: lines(
      'import { cn } from "./cn";',
      'export const a = (on: boolean) => <i className={`p-2 ${on ? "bg-slate-100" : ""}`} />;',
      'export const b = <i className={cn("p-2", "text-red-500")} />;',
    ),
    expect: [
      ["raw-colour", 2],
      ["raw-colour", 3],
    ],
  },
  {
    name: "a colour utility and a dark: variant named in comments",
    path: "src/a.tsx",
    source: lines(
      "// bg-slate-800 was the old card colour; dark:p-4 went with it.",
      "/* text-red-500 */ export const a = 1;",
      "export const b = <div>{/* dark:bg-black */}b</div>;",
    ),
    expect: [],
  },
  {
    name: "layout utilities",
    path: "src/a.tsx",
    source: lines('export const a = <div className="flex gap-4 text-center border-t">a</div>;'),
    expect: [],
  },
  {
    name: "a dark: variant",
    path: "src/a.tsx",
    source: lines('export const a = <div className="p-2 dark:p-4">a</div>;'),
    expect: [["dark-variant", 1]],
  },
  {
    name: "a <style> element",
    path: "src/a.tsx",
    source: lines(
      "export const a = (",
      "  <>",
      '    <style>{"h1 { margin: 0 }"}</style>',
      "  </>",
      ");",
    ),
    expect: [["style-block", 3]],
  },
  {
    name: "<style> in a comment",
    path: "src/a.tsx",
    source: lines(
      "// Never add a <style> block here.",
      "/* nor a <style>",
      "   over two lines */",
      "export const a = (",
      "  <>",
      "    {/* <style> would go here */}",
      "    <p>a</p>",
      "  </>",
      ");",
    ),
    expect: [],
  },
  {
    name: "className and style on UISlash parts, and on a local one",
    path: "src/a.tsx",
    source: lines(
      'import { Button, Card as Panel } from "@slashsuite/ui-react";',
      'import { Local } from "./Local";',
      "",
      "export const a = (",
      "  <>",
      '    <Button className="mt-4" onClick={() => go()}>Go</Button>',
      "    <Panel",
      '      tone="info"',
      "      style={{ margin: 0 }}",
      "    />",
      '    <Local className="fine" />',
      '    <Button onClick={() => note("className=x")}>ok</Button>',
      "  </>",
      ");",
    ),
    expect: [
      ["styling-prop", 6],
      ["styling-prop", 9],
    ],
  },
  {
    name: "a local component named like a UISlash export",
    path: "src/mine.tsx",
    source: lines(
      "export function Card({ children }: { children: string }) {",
      "  return <section>{children}</section>;",
      "}",
    ),
    expect: [["duplicate-component", 1]],
  },
  {
    name: "an arrow component named like a UISlash export",
    path: "src/mine.tsx",
    source: lines("export const Badge = ({ label }: { label: string }) => <b>{label}</b>;"),
    expect: [["duplicate-component", 1]],
  },
  {
    name: "a new file named after a UISlash export",
    path: "src/Pill.tsx",
    source: lines("export default null;"),
    expect: [["duplicate-component", 1]],
  },
  {
    name: "an unrelated name and a constant",
    path: "src/a.tsx",
    source: lines("export function PricingTable() {}", "export const Card = 5;"),
    expect: [],
  },
  {
    name: "colour literals in a style value",
    path: "src/a.tsx",
    source: lines(
      'export const a = <div style={{ color: "#ff0000", background: "rgb(1, 2, 3)" }}>a</div>;',
      "export const b = (",
      "  <span",
      "    style={{",
      '      borderColor: "rebeccapurple",',
      "      outline: `1px solid ${'oklch(0.5 0.2 30)'}`,",
      "    }}",
      "  />",
      ");",
      'export const c = <p style="color: red">c</p>;',
    ),
    expect: [
      ["inline-colour", 1],
      ["inline-colour", 5],
      ["inline-colour", 6],
      ["inline-colour", 10],
    ],
  },
  {
    name: "a colour word in prose, a plain string, a comment and a colour-free style",
    path: "src/a.tsx",
    source: lines(
      'export const label = "red";',
      "// color: #ff0000 was the old brand",
      "export const a = (",
      "  <div style={{ margin: 0, gridArea: `main` /* not red */, gap: `${red ? 4 : 8}px` }}>",
      "    A red door, a #1 pick, and rgb(1, 2, 3) in prose.",
      "  </div>",
      ");",
    ),
    expect: [],
  },
  {
    name: "raw elements that have a UISlash part",
    path: "src/a.tsx",
    source: lines(
      "export const a = (",
      "  <form>",
      "    <button>Save</button>",
      '    <input type="text" />',
      '    <input type="checkbox" />',
      "    <select />",
      "    <textarea />",
      "    <dialog open>Hi</dialog>",
      "  </form>",
      ");",
    ),
    expect: [
      ["raw-element", 3],
      ["raw-element", 4],
      ["raw-element", 5],
      ["raw-element", 6],
      ["raw-element", 7],
      ["raw-element", 8],
    ],
  },
  {
    name: "an image, a hidden input and the UISlash parts",
    path: "src/a.tsx",
    source: lines(
      'import { Button, Input } from "@slashsuite/ui-react";',
      "export const a = (",
      "  <form>",
      '    <img src="/a.png" alt="A" />',
      '    <input type="hidden" name="id" value="1" />',
      "    {/* <button> is the old way */}",
      "    <Button>Save</Button>",
      '    <Input label="Name" />',
      "  </form>",
      ");",
    ),
    expect: [],
  },
];
