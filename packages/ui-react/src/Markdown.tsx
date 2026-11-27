import type { ReactElement, ReactNode } from "react";
import { type HeadingLevel, useHeadingLevel } from "./headingLevel.js";
import { Image } from "./Image.js";
import type { Passthrough } from "./props.js";
import { BoneLines, BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";
import { Table, TableBody, TableHead, TableRow } from "./Table.js";
import { TableCell, TableHeaderCell } from "./TableCells.js";
import type { CellAlign } from "./tableRow.js";
import { TextLink } from "./TextLink.js";

// A minimal, SAFE markdown renderer. No dangerouslySetInnerHTML: text is rendered as React nodes, so
// it can't inject HTML, and a link or picture whose address is not on the safe list is dropped.

/** A link's address is kept only if it is a web, mail or phone address, or one on this site. */
const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#|\?|\.\/|\.\.\/)/i;
/** A picture's address is kept only if it is a web address, one on this site, or a data URL of an image. */
const SAFE_SRC = /^(https?:|\/|\.\/|\.\.\/|data:image\/)/i;

/** `**bold**`, `[words](href)` and an inline `![alt](src)`, which stays text: a picture is a line of its own. */
const INLINE = /(\*\*[^*]+\*\*|!?\[[^\]]*\]\([^)\s]*\))/g;
const LINK = /^\[([^\]]*)\]\(([^)\s]*)\)$/;
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]*)\)$/;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {p.slice(2, -2)}
        </strong>
      );
    }
    const link = LINK.exec(p);
    if (link) {
      const [, words = "", href = ""] = link;
      if (!SAFE_HREF.test(href)) return <span key={i}>{words}</span>;
      return (
        <TextLink key={i} href={href} underline>
          {words}
        </TextLink>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

/** The level of a `### ` heading: one below a `## `, never past 6. */
const SUB: Record<HeadingLevel, HeadingLevel> = { 2: 3, 3: 4, 4: 5, 5: 6, 6: 6 };

const BULLET = /^[-*] /;
const NUMBERED = /^(\d+)[.)] /;
const TABLE_RULE = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/;

/** The cells of a `| a | b |` row, trimmed. */
function cells(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/** A column's alignment from its rule: `:--` start, `:-:` center, `--:` end. */
function alignOf(rule: string): CellAlign {
  const left = rule.startsWith(":");
  const right = rule.endsWith(":");
  if (left && right) return "center";
  return right ? "end" : "start";
}

/** A GFM table: its head row, its rule and its body rows, named by the heading above it. */
function table(lines: string[], label: string, key: number): ReactElement {
  const [head = "", rule = "", ...body] = lines;
  const titles = cells(head);
  const align = cells(rule).map(alignOf);
  return (
    <Table key={key} label={label}>
      <TableHead>
        <TableRow>
          {titles.map((title, i) => (
            <TableHeaderCell key={i} align={align[i]}>
              {inline(title)}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {body.map((row, r) => (
          <TableRow key={r}>
            {titles.map((_, i) => (
              <TableCell key={i} align={align[i]}>
                {inline(cells(row)[i] ?? "")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** One block of the source: a heading, a list item, a table, a picture, a paragraph or a break. */
type Block =
  | { kind: "h2" | "h3" | "p"; text: string }
  | { kind: "ul" | "ol"; start: number; text: string }
  | { kind: "table"; rows: string[] }
  | { kind: "image"; alt: string; src: string }
  | { kind: "blank" };

/** A list item's line, bulleted or numbered, or nothing. */
function itemOf(t: string): Block | undefined {
  if (BULLET.test(t)) return { kind: "ul", start: 1, text: t.slice(2) };
  const numbered = NUMBERED.exec(t);
  if (!numbered) return undefined;
  const [marker = "", n = "1"] = numbered;
  return { kind: "ol", start: Number(n), text: t.slice(marker.length) };
}

/** What one line is, when it is not the start of a table. */
function lineOf(t: string): Block {
  if (t === "") return { kind: "blank" };
  if (t.startsWith("## ")) return { kind: "h2", text: t.slice(3) };
  if (t.startsWith("### ")) return { kind: "h3", text: t.slice(4) };
  const item = itemOf(t);
  if (item) return item;
  const image = IMAGE.exec(t);
  if (image) return { kind: "image", alt: image[1] ?? "", src: image[2] ?? "" };
  return { kind: "p", text: t };
}

/** The source's blocks, a table's lines gathered into one. */
function parse(md: string): Block[] {
  const lines = md.split("\n").map((ln) => ln.trim());
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i] ?? "";
    if (t.startsWith("|") && TABLE_RULE.test(lines[i + 1] ?? "")) {
      let end = i + 2;
      while (lines[end]?.startsWith("|")) end++;
      out.push({ kind: "table", rows: lines.slice(i, end) });
      i = end;
    } else {
      out.push(lineOf(t));
      i++;
    }
  }
  return out;
}

/** A run of list items of one kind, as a `ul` or an `ol` that counts from the first item's number. */
function list(items: Item[], kind: "ul" | "ol", key: number): ReactNode {
  const lis = items.map((it, i) => (
    <li key={i} className="text-sm text-slate-700">
      {inline(it.text)}
    </li>
  ));
  if (kind === "ul") {
    return (
      <ul key={key} className="ml-4 list-disc space-y-1">
        {lis}
      </ul>
    );
  }
  const start = items[0]?.start ?? 1;
  return (
    <ol key={key} start={start === 1 ? undefined : start} className="ml-5 list-decimal space-y-1">
      {lis}
    </ol>
  );
}

/** Everything but a list item, drawn. */
function single(block: Block, key: number, h: Headings, label: string): ReactNode {
  switch (block.kind) {
    case "h2":
      return (
        <h.H2
          key={key}
          className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400 first:mt-0"
        >
          {block.text}
        </h.H2>
      );
    case "h3":
      return (
        <h.H3 key={key} className="mt-3 text-sm font-semibold text-slate-700">
          {block.text}
        </h.H3>
      );
    case "table":
      return table(block.rows, label, key);
    case "image":
      return (
        <div key={key} className="py-1">
          <Image
            src={SAFE_SRC.test(block.src) ? block.src : undefined}
            alt={block.alt}
            aspect="natural"
          />
        </div>
      );
    case "p":
      return (
        <p key={key} className="text-sm text-slate-700">
          {inline(block.text)}
        </p>
      );
    default:
      return null;
  }
}

type Headings = { H2: `h${HeadingLevel}`; H3: `h${HeadingLevel}` };

type Item = { start: number; text: string };

/** The run of list items of one kind from `from`, and the index after it. */
function run(all: Block[], from: number, kind: "ul" | "ol"): [Item[], number] {
  const items: Item[] = [];
  let i = from;
  for (let b = all[i]; b?.kind === kind; b = all[++i]) items.push(b);
  return [items, i];
}

/** The blocks of `md` drawn: its `## ` headings at `top`, its `### ` at `sub`. */
function blocks(md: string, top: HeadingLevel, sub: HeadingLevel, tableLabel: string): ReactNode[] {
  const h: Headings = { H2: `h${top}`, H3: `h${sub}` };
  const out: ReactNode[] = [];
  // A table is named by the heading above it, as a reader finds it.
  let label = tableLabel;
  const all = parse(md);
  let i = 0;
  for (let block = all[0]; block; block = all[i]) {
    if (block.kind === "ul" || block.kind === "ol") {
      const [items, next] = run(all, i, block.kind);
      out.push(list(items, block.kind, i));
      i = next;
    } else {
      if (block.kind === "h2" || block.kind === "h3") label = block.text;
      out.push(single(block, i, h, label));
      i++;
    }
  }
  return out;
}

/**
 * A small, safe Markdown renderer for notes and for rich text from a CMS: `## ` and `### `
 * headings, `- ` or `* ` bullets, `1. ` numbered lists, `**bold**`, `[links](href)`, a picture on a
 * line of its own (`![alt](src)`), GFM tables and paragraphs. Text is rendered as React nodes, never
 * as HTML. A link is a `TextLink` (an in-app path goes through `LinkProvider`) and is kept only if
 * its address is a web, mail or phone address or a path on this site; any other (`javascript:`)
 * keeps its words and drops the link. A picture is an `Image` in its own shape, and a table a
 * `Table` named by the heading above it, or `tableLabel`. While `loading` with no `md` yet it
 * draws a paragraph of bones.
 *
 * A `## ` heading is one level below the heading that holds the Markdown (an `h2` on the page, an
 * `h3` in a `Section`, an `h4` in a titled `Card` there) and a `### ` one below that, never past
 * `h6`, so the notes keep the page's outline.
 */
export function Markdown({
  md,
  tableLabel = "Table",
  loading: ownLoading,
  loadingLabel,
  ...rest
}: {
  /** The Markdown source; while `loading`, none yet is a paragraph of bones. */
  md: string | undefined;
  /**
   * The name a table takes when no heading comes before it, for an app in another language.
   * @default Table
   */
  tableLabel?: string | undefined;
} & LoadingProps &
  Passthrough) {
  const { loading, owner } = useLoading(ownLoading);
  const level = useHeadingLevel(undefined);
  if (md === undefined || md === "") {
    return (
      <div {...rest} {...busy(owner, loading)} className="space-y-1">
        {loading && (
          <p className="text-sm">
            <BoneLines />
          </p>
        )}
        <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
      </div>
    );
  }
  const out = blocks(md, level, SUB[level], tableLabel);
  return (
    <div {...rest} {...busy(owner, loading)} className="space-y-1">
      {out}
      <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
    </div>
  );
}
