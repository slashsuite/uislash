import type { ReactElement } from "react";
import { cx, focusRing } from "./cx.js";
import type { Passthrough } from "./props.js";
import { Overline } from "./typography.js";

/** One entry of a `TableOfContents`: the heading's `id` (its anchor), its words, and its level. */
export type TableOfContentsItem = { id: string; label: string; level: 2 | 3 };

const ENTRY = `rounded text-sm/6 transition ${focusRing}`;
const ENTRY_ON = "font-medium text-violet-700";
const ENTRY_OFF = "text-slate-600 hover:text-violet-700";

/** The list of entries, each linking to its heading, the current one marked. Shared with `DocsLayout`'s own. Internal. */
export function ContentsList({
  items,
  current,
}: {
  items: TableOfContentsItem[];
  current: string | undefined;
}): ReactElement {
  return (
    <ul role="list" className="flex list-none flex-col gap-1">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "ps-3" : undefined}>
          <a
            href={`#${item.id}`}
            aria-current={item.id === current ? "location" : undefined}
            className={cx(ENTRY, item.id === current ? ENTRY_ON : ENTRY_OFF)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The headings of a long page, as links to their anchors: "On this page". `items` are the page's
 * `h2`s and `h3`s in order, each `{ id, label, level }`; a level 3 entry is indented under the one
 * before it. `current` is the id of the section being read, which the app tracks (from the scroll
 * position or the URL hash): its link is marked in the accent and has `aria-current="location"`.
 * The rest are small and quiet. `label` names the list and the `<nav>` landmark.
 *
 * It sets no width or position: put it in a `SideColumn`'s aside, sticky, beside the page.
 * `DocsLayout` draws its own.
 */
export function TableOfContents({
  items,
  current,
  label = "On this page",
  ...rest
}: {
  /** The page's headings in order: `{ id, label, level }`, `level` 2 or 3. */
  items: TableOfContentsItem[];
  /** The id of the section being read; its link is marked as the current one. */
  current?: string | undefined;
  /**
   * The words over the list, and the name of the `<nav>` landmark.
   * @default "On this page"
   */
  label?: string | undefined;
} & Passthrough): ReactElement {
  return (
    <nav {...rest} aria-label={label}>
      <div className="pb-2">
        <Overline>{label}</Overline>
      </div>
      <ContentsList items={items} current={current} />
    </nav>
  );
}
