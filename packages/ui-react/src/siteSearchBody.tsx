import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type RefObject,
  useRef,
  useState,
} from "react";
import { Input } from "./Input.js";
import { ListRow } from "./ListRow.js";
import { Text } from "./typography.js";

/** One page the search can find. */
export type SiteSearchItem = {
  /** The page's name: the row's label and the first thing matched. */
  label: string;
  /** A muted line under the label, matched last. */
  description?: string | undefined;
  /** Where the row goes. */
  href: string;
  /** Other names the page answers to (the exports it documents), matched like the label but not shown. */
  keywords?: string[] | undefined;
};

/**
 * The items that match `text`, best first: the label starts with it, then the label contains it,
 * then a keyword contains it, then the description does. Case is ignored, and items of the same
 * rank keep their order in `items`. Empty text matches nothing.
 */
export function rankSiteSearch(items: readonly SiteSearchItem[], text: string): SiteSearchItem[] {
  const query = text.trim().toLowerCase();
  if (query === "") return [];
  const rankOf = (item: SiteSearchItem): number => {
    const label = item.label.toLowerCase();
    if (label.startsWith(query)) return 0;
    if (label.includes(query)) return 1;
    if (item.keywords?.some((keyword) => keyword.toLowerCase().includes(query))) return 2;
    if (item.description?.toLowerCase().includes(query)) return 3;
    return -1;
  };
  return items
    .map((item, index) => ({ item, index, rank: rankOf(item) }))
    .filter((entry) => entry.rank >= 0)
    .toSorted((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.item);
}

/** What the live region says for a result count, in English. */
export function englishCount(count: number): string {
  if (count === 0) return "No results";
  return count === 1 ? "1 result" : `${count} results`;
}

/** The words `SearchBody` renders, each a `SiteSearch` prop with its English default. */
export type BodyWords = {
  resultsLabel: string;
  placeholder: string;
  hintLabel: string;
  noResultsLabel: string;
  countLabel: (count: number) => string;
  allResultsLabel: string;
};

/**
 * An Enter that commits an input method's composition (a Japanese or Chinese keyboard) is not a
 * submit. Safari has already cleared `isComposing` by then, and only the 229 keyCode tells.
 */
function isComposing({ nativeEvent }: KeyboardEvent<HTMLInputElement>): boolean {
  return nativeEvent.isComposing || nativeEvent.keyCode === 229;
}

// A link that stays on the page (a hash, an app's router) still closes the search; one opened in a
// new tab or window leaves it open.
function onListClick(event: MouseEvent<HTMLUListElement>): void {
  if (event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target instanceof Element && event.target.closest("a[href]")) {
    event.currentTarget.closest("dialog")?.close();
  }
}

/** The result links in the list, in order. */
function linksIn(list: HTMLElement | null): HTMLAnchorElement[] {
  return list ? [...list.querySelectorAll<HTMLAnchorElement>("a[href]")] : [];
}

/** The muted line under the field: the prompt before anything is typed, the no-match line after. */
function SearchNote({
  query,
  found,
  words: { hintLabel, noResultsLabel },
}: {
  query: string;
  found: boolean;
  words: Pick<BodyWords, "hintLabel" | "noResultsLabel">;
}): ReactElement | null {
  if (query.trim() === "") return <Text tone="muted">{hintLabel}</Text>;
  if (found) return null;
  return (
    <Text tone="muted">
      {noResultsLabel} {query.trim()}
    </Text>
  );
}

/** The matches, then the link to the full results page when there is one. */
function SearchResults({
  list,
  results,
  all,
  label,
  onKeyDown,
}: {
  list: RefObject<HTMLUListElement | null>;
  results: readonly SiteSearchItem[];
  all: { href: string; text: string } | undefined;
  label: string;
  onKeyDown: (event: KeyboardEvent<HTMLUListElement>) => void;
}): ReactElement | null {
  if (results.length === 0 && all === undefined) return null;
  return (
    // The keys only move focus between the links inside it; the list itself takes none.
    <ul
      ref={list}
      aria-label={label}
      onKeyDown={onKeyDown}
      onClick={onListClick}
      className="border-slate-200/70 *:not-first:border-t *:not-first:border-inherit"
    >
      {results.map((item) => (
        <li key={item.href}>
          <ListRow href={item.href} size="sm" secondary={item.description}>
            {item.label}
          </ListRow>
        </li>
      ))}
      {all !== undefined && (
        <li>
          <ListRow href={all.href} size="sm">
            {all.text}
          </ListRow>
        </li>
      )}
    </ul>
  );
}

export function SearchBody({
  items,
  label,
  resultsHref,
  words: { resultsLabel, placeholder, hintLabel, noResultsLabel, countLabel, allResultsLabel },
}: {
  items: readonly SiteSearchItem[];
  label: string;
  resultsHref: ((query: string) => string) | undefined;
  words: BodyWords;
}) {
  const [query, setQuery] = useState("");
  const box = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const results = rankSiteSearch(items, query);
  const typed = query.trim() !== "";
  const all = typed && resultsHref ? resultsHref(query.trim()) : undefined;

  const onFieldKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      // Close here, so no engine spends the first Esc clearing the search field.
      event.preventDefault();
      event.currentTarget.closest("dialog")?.close();
    } else if (event.key === "Enter") {
      if (isComposing(event)) return;
      event.preventDefault();
      // The field highlights no result, so with a results page Enter goes there (its link is last).
      const links = linksIn(list.current);
      (all === undefined ? links[0] : links.at(-1))?.click();
    } else if (event.key === "ArrowDown") {
      const first = linksIn(list.current)[0];
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = linksIn(list.current);
    const at = links.findIndex((link) => link === document.activeElement);
    if (at < 0) return;
    event.preventDefault();
    const next = at + (event.key === "ArrowDown" ? 1 : -1);
    if (next < 0) box.current?.querySelector("input")?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  };

  return (
    // The role as well as the element, for tools (and testing-library) that do not map `<search>` yet.
    <search ref={box} role="search" className="flex flex-col gap-3">
      <Input
        type="search"
        icon="search"
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onFieldKey}
      />
      <div role="status" aria-live="polite" className="sr-only">
        {typed ? countLabel(results.length) : ""}
      </div>
      <SearchNote query={query} found={results.length > 0} words={{ hintLabel, noResultsLabel }} />
      <SearchResults
        list={list}
        results={results}
        all={
          all === undefined ? undefined : { href: all, text: `${allResultsLabel} ${query.trim()}` }
        }
        label={resultsLabel}
        onKeyDown={onListKey}
      />
    </search>
  );
}
