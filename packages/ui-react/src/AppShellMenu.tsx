import { type ReactElement, type ReactNode, type RefObject, useEffect, useRef } from "react";
import { ContainerFrame } from "./Container.js";
import { cx, focusRing } from "./cx.js";

// AppShell's `md` step: below it the header is always in menu mode.
const WIDE = "(width >= 48rem)";

const ICON = {
  viewBox: "0 0 20 20",
  width: 16,
  height: 16,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "shrink-0 text-slate-500",
} as const;

/**
 * The header's Menu button: a native `popovertarget` for the panel, so it opens and closes by
 * pointer, Enter and Space and is announced with its expanded state, with no script (a page that
 * never hydrates still has its menu). Shown below `md`, and from `md` while the nav is `folded`.
 * Its icon follows the panel (`:popover-open`) through the header's `group/shell`.
 */
export function AppShellMenuButton({
  label,
  panelId,
  folded,
}: {
  label: string;
  panelId: string;
  folded: boolean;
}): ReactElement {
  return (
    <button
      type="button"
      popoverTarget={panelId}
      className={cx(
        "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 select-none hover:bg-slate-50",
        focusRing,
        !folded && "md:hidden",
      )}
    >
      <svg {...ICON} className={cx(ICON.className, "group-has-[:popover-open]/shell:hidden")}>
        <path d="M3 5.5h14M3 10h14M3 14.5h14" />
      </svg>
      <svg {...ICON} className={cx(ICON.className, "hidden group-has-[:popover-open]/shell:block")}>
        <path d="M5 5l10 10M15 5L5 15" />
      </svg>
      {label}
    </button>
  );
}

// Menu mode: the browser's popover, in the top layer, hung under the sticky header across the
// screen. The UA box (inset 0, auto margins, fit-content, its border and padding, Canvas colours)
// is replaced; the ink is the shell's.
const PANEL_MENU =
  "fixed inset-x-0 top-(--app-header) bottom-auto m-0 h-auto max-h-[calc(100dvh-var(--app-header))] w-auto max-w-none overflow-y-auto overscroll-contain border-x-0 border-y border-slate-200 bg-white p-0 text-inherit shadow-lg";

/** Close the panel if it is open; one that is not shown, or a browser with no popover API, does nothing. */
function hide(panel: HTMLElement | null): void {
  if (panel && "hidePopover" in panel) panel.hidePopover();
}

/**
 * Unfolding puts the panel back in the row, so it must not stay open in the top layer: close it when
 * the header is in row mode and the screen is from `md`. Hiding a popover that is not shown does
 * nothing.
 */
function useCloseInRowMode(panel: RefObject<HTMLElement | null>, rowMode: boolean): void {
  useEffect(() => {
    const el = panel.current;
    // jsdom (a consumer's own tests) has neither the popover API nor matchMedia.
    if (!rowMode || !el || !("hidePopover" in el) || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const wide = window.matchMedia(WIDE);
    const close = () => {
      if (wide.matches) hide(el);
    };
    close();
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, [panel, rowMode]);
}

/** `menuControls`' wrapper: wrapping at the top of the menu; in row mode, last in the row. */
function controlsClass(rowMode: boolean, alone: boolean): string {
  return cx(
    "flex flex-wrap items-center gap-2",
    rowMode && "md:order-last md:flex-nowrap md:*:shrink-0 md:[&>.w-full]:w-auto",
    rowMode && alone && "md:ml-auto",
  );
}

/**
 * The one home of AppShell's `nav`, `subnav` and `menuControls`: each is rendered once, here, so a
 * field keeps its state, ids stay unique and a screen reader meets each landmark once. It is a
 * `popover="auto"` panel the Menu button targets, so it light-dismisses on a click outside and on
 * Escape, and hands the focus back to the button, all the browser's.
 *
 * In row mode (from `md`, nav not `folded`) the panel draws no box of its own (`display: contents`,
 * over the UA's `display: none`): its parts are the header row's items, the nav after the brand and
 * the `menuControls` last (`order`), and the subnav hangs as the header's second row. In menu mode
 * (below `md`, or `folded`) it is the dropdown, `menuControls` on top, then the nav and the subnav.
 * Script closes it when a link in it is followed (for a router that does not reload) and when the
 * header leaves menu mode while it is open.
 */
export function AppShellMenuPanel({
  id,
  controls,
  controlsAlone,
  nav,
  subnav,
  folded,
  subnavRow,
}: {
  id: string;
  /** AppShell's `menuControls`: at the top of the panel in menu mode, last in the row otherwise. */
  controls: ReactNode;
  /** No `controls` slot holds the row's end, so in row mode `menuControls` take it themselves. */
  controlsAlone: boolean;
  nav: ReactNode;
  subnav: ReactNode;
  /** From `md` the header is in menu mode too: the nav did not fit the row. */
  folded: boolean;
  /** The subnav's own row from `md` (a scroll row with its fade, drawn by the header); no box in menu mode. */
  subnavRow: (subnav: ReactNode) => ReactNode;
}): ReactElement {
  const panel = useRef<HTMLDivElement>(null);
  const rowMode = !folded;
  useCloseInRowMode(panel, rowMode);

  return (
    <div
      ref={panel}
      id={id}
      popover="auto"
      className={cx(PANEL_MENU, rowMode && "md:contents")}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a[href]")) hide(panel.current);
      }}
    >
      <ContainerFrame className={cx("flex flex-col gap-3 py-3", rowMode && "md:contents")}>
        {controls && <div className={controlsClass(rowMode, controlsAlone)}>{controls}</div>}
        {nav && (
          <div
            // From `md` the nav is a row item of its own (the row's `*:shrink-0` does not reach through
            // `contents`): it keeps its full width, so a nav too wide overflows the row and folds.
            className={cx(
              "flex flex-col gap-3",
              rowMode && "md:shrink-0 md:flex-row md:items-center md:gap-4 md:*:shrink-0",
            )}
          >
            {nav}
          </div>
        )}
        {subnav && (
          <div className={cx("flex flex-col gap-3", rowMode && "md:contents")}>
            {subnavRow(subnav)}
          </div>
        )}
      </ContainerFrame>
    </div>
  );
}
