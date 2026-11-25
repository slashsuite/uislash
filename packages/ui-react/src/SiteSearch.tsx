import {
  type MouseEvent,
  type ReactElement,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "./Button.js";
import { Dialog } from "./Dialog.js";
import { Icon } from "./Icon.js";
import { IconButton } from "./IconButton.js";
import { Kbd } from "./Kbd.js";
import type { Passthrough } from "./props.js";
import { type BodyWords, englishCount, SearchBody, type SiteSearchItem } from "./siteSearchBody.js";
import type { Size } from "./size.js";

export { rankSiteSearch, type SiteSearchItem } from "./siteSearchBody.js";

// The shortcut's key reads ⌘ K on Apple platforms. The server cannot know, so it renders Ctrl K and
// the client swaps after hydration.
const noSubscribe = (): (() => void) => () => {};
const isApple = (): boolean =>
  /mac|iphone|ipad|ipod/i.test(typeof navigator === "undefined" ? "" : navigator.userAgent);

/** Ctrl+K or Cmd+K with no other modifier, the one shortcut that opens the search. */
function isShortcut(event: globalThis.KeyboardEvent): boolean {
  return (
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "k"
  );
}

type SiteSearchProps = {
  /** Every page to search, in the order ties are listed (the rail's order). */
  items: readonly SiteSearchItem[];
  /**
   * The dialog's title and the phone's icon button's accessible name: "Search components". The wide
   * button is named by its own text, `buttonLabel`.
   */
  label: string;
  /**
   * The name of the list of matches, for an app in another language.
   * @default Results
   */
  resultsLabel?: string | undefined;
  /**
   * The wide button's text, which is also its accessible name.
   * @default Search
   */
  buttonLabel?: string | undefined;
  /**
   * The search field's placeholder.
   * @default Search
   */
  placeholder?: string | undefined;
  /**
   * The muted line under the field before anything is typed.
   * @default Type a name
   */
  hintLabel?: string | undefined;
  /**
   * The muted line when nothing matches; the typed text follows it: "No results for tabel".
   * @default No results for
   */
  noResultsLabel?: string | undefined;
  /**
   * What a screen reader hears for the number of matches once something is typed.
   * @default `No results`, `1 result`, `4 results`
   */
  countLabel?: ((count: number) => string) | undefined;
  /**
   * The site's full results page for a query, built from the typed text (trimmed):
   * `(query) => "/search?q=" + encodeURIComponent(query)`. Given, a link to it is the last row
   * once something is typed, matches or not, and Enter in the field goes there.
   */
  resultsHref?: ((query: string) => string) | undefined;
  /**
   * The full results link's text; the typed text follows it: "See all results for tabel".
   * @default See all results for
   */
  allResultsLabel?: string | undefined;
  /**
   * The trigger's height and text, on the scale of a `Button` and an `IconButton`, so it lines up
   * with the other controls in a header row.
   * @default sm
   */
  size?: Size | undefined;
} & Passthrough;

type WordProps = Omit<SiteSearchProps, "items" | "label" | "buttonLabel" | "resultsHref" | "size">;

/** The dialog's words, each with its English default, apart from the props the root span takes. */
function splitWords({
  resultsLabel = "Results",
  placeholder = "Search",
  hintLabel = "Type a name",
  noResultsLabel = "No results for",
  countLabel = englishCount,
  allResultsLabel = "See all results for",
  ...rest
}: WordProps): { words: BodyWords; rest: Passthrough } {
  return {
    words: { resultsLabel, placeholder, hintLabel, noResultsLabel, countLabel, allResultsLabel },
    rest,
  };
}

/**
 * The site's search: a header button that opens a dialog with a search field over a list of links
 * to the pages that match. Put it in `AppShell`'s `controls` and pass every page as `items`. Ctrl+K
 * (⌘ K on a Mac) opens it from anywhere on the page, and the button shows that key. Typing filters
 * by name, then by `keywords`, then by description; Enter opens the first result (or, with
 * `resultsHref`, the full results page), the arrow keys move through them, and Esc closes it and
 * puts focus back where it was. The field is a `<search>` landmark. Render it once per page.
 */
export function SiteSearch({
  items,
  label,
  buttonLabel = "Search",
  resultsHref,
  size = "sm",
  ...props
}: SiteSearchProps): ReactElement {
  const { words, rest } = splitWords(props);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const apple = useSyncExternalStore(noSubscribe, isApple, () => false);
  const keys = apple ? "⌘ K" : "Ctrl K";

  // Before paint, so a client-rendered trigger that is on screen already answers the shortcut.
  useLayoutEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || !isShortcut(event)) return;
      event.preventDefault();
      // Only the press that opens it records the opener; `close` clears it.
      if (!opener.current && document.activeElement instanceof HTMLElement) {
        opener.current = document.activeElement;
      }
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // A pointer click does not focus a button in every engine, so the trigger is remembered by hand.
  const openFrom = (event: MouseEvent<HTMLElement>) => {
    opener.current = event.currentTarget;
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    const back = opener.current;
    opener.current = null;
    if (back?.isConnected && back !== document.body) back.focus();
  };

  return (
    <span {...rest} className="inline-flex">
      <span className="hidden sm:inline-flex">
        <Button
          variant="outline"
          size={size}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={openFrom}
        >
          <Icon name="search" size="sm" />
          {buttonLabel}
          {/* The chip's box does not count toward the line, so the button is a Button's height. */}
          <span className="-my-1 inline-flex">
            <Kbd aria-hidden="true">{keys}</Kbd>
          </span>
        </Button>
      </span>
      <span className="inline-flex sm:hidden">
        <IconButton
          label={label}
          size={size}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={openFrom}
          icon="search"
        />
      </span>
      {open && (
        <Dialog title={label} width="md" onClose={close}>
          <SearchBody items={items} label={label} resultsHref={resultsHref} words={words} />
        </Dialog>
      )}
    </span>
  );
}
