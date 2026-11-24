import type { ReactNode } from "react";
import { type HeadingLevel, useHeadingLevel } from "./headingLevel.js";
import type { Passthrough } from "./props.js";
import { BoneLines, BusyLabel, busy, type LoadingProps, useLoading } from "./skeleton.js";

// A minimal, SAFE markdown renderer (headings / bullets / bold). No
// dangerouslySetInnerHTML: text is rendered as React nodes, so it can't inject HTML.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-slate-900">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

/** The level of a `### ` heading: one below a `## `, never past 6. */
const SUB: Record<HeadingLevel, HeadingLevel> = { 2: 3, 3: 4, 4: 5, 5: 6, 6: 6 };

/** The blocks of `md`: its `## ` headings at `top`, its `### ` at `sub`. */
function blocks(md: string, top: HeadingLevel, sub: HeadingLevel): ReactNode[] {
  const H2 = `h${top}` as const;
  const H3 = `h${sub}` as const;
  const out: ReactNode[] = [];
  let bullets: ReactNode[] = [];
  const flush = () => {
    if (bullets.length) {
      out.push(
        <ul key={`u${out.length}`} className="ml-4 list-disc space-y-1">
          {bullets}
        </ul>,
      );
      bullets = [];
    }
  };
  md.split("\n").forEach((ln, i) => {
    const t = ln.trim();
    if (t.startsWith("## ")) {
      flush();
      out.push(
        <H2
          key={i}
          className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400 first:mt-0"
        >
          {t.slice(3)}
        </H2>,
      );
    } else if (t.startsWith("### ")) {
      flush();
      out.push(
        <H3 key={i} className="mt-3 text-sm font-semibold text-slate-700">
          {t.slice(4)}
        </H3>,
      );
    } else if (t.startsWith("- ") || t.startsWith("* ")) {
      bullets.push(
        <li key={i} className="text-sm text-slate-700">
          {inline(t.slice(2))}
        </li>,
      );
    } else if (t === "") {
      flush();
    } else {
      flush();
      out.push(
        <p key={i} className="text-sm text-slate-700">
          {inline(t)}
        </p>,
      );
    }
  });
  flush();
  return out;
}

/**
 * A small, safe Markdown renderer for short notes: `## ` and `### ` headings, `- ` or `* ` bullets,
 * `**bold**` and paragraphs. Text is rendered as React nodes, never as HTML. While `loading` with
 * no `md` yet it draws a paragraph of bones.
 *
 * A `## ` heading is one level below the heading that holds the Markdown (an `h2` on the page, an
 * `h3` in a `Section`, an `h4` in a titled `Card` there) and a `### ` one below that, never past
 * `h6`, so the notes keep the page's outline.
 */
export function Markdown({
  md,
  loading: ownLoading,
  loadingLabel,
  ...rest
}: {
  /** The Markdown source; while `loading`, none yet is a paragraph of bones. */
  md: string | undefined;
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
  const out = blocks(md, level, SUB[level]);
  return (
    <div {...rest} {...busy(owner, loading)} className="space-y-1">
      {out}
      <BusyLabel owner={owner} loading={loading} label={loadingLabel} />
    </div>
  );
}
