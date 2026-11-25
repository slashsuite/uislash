/** Join class names, dropping falsy parts. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** The keyboard focus ring every interactive control shares. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";

/**
 * A heading's lines are balanced, so a two-line title does not end on one orphaned word; prose is
 * wrapped `pretty`, which keeps a short last line off a paragraph. Only the wrap style is set, so a
 * `lines` clamp (one line with an ellipsis) still wins; a browser that has neither wraps as before.
 */
export const balanced = "[text-wrap-style:balance]";
export const pretty = "[text-wrap-style:pretty]";

/**
 * A fill that carries meaning (a bar's progress, the drop line, the current pill) in forced
 * colours: there every background is painted the page's Canvas, so the fill would vanish. A system
 * colour the page names is kept, so the fill takes the system's Highlight; `!` beats a theme's scoped remap of the stock fill.
 */
export const forcedFill = "forced-colors:bg-[color:Highlight]!";

/**
 * The same ring drawn inside the control, for one that fills a box which clips anything outside
 * it (a table's sortable title, a scroller). `focusRing` with `-outline-offset-2` added would not
 * do, since `outline-offset-2` comes later in the CSS and wins.
 */
export const insetFocusRing =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600";

/**
 * On a row or card that holds a stretched link (`link-stretch`): every interactive descendant sits
 * above that link and is clickable on its own. `z-10` needs a position, so each gets `relative`,
 * except one that is already `absolute` and the stretched link itself. The row or card is `isolate`,
 * its own stacking context: its `z-10` descendants rank only inside it, so they cannot tie with or
 * paint over the page's sticky bars (AppShell's header, a StickyBar).
 */
export const liftInteractive =
  "isolate [&_:is(a,button,label,select,textarea,input,summary):not(.link-stretch):not(.absolute)]:relative [&_:is(a,button,label,select,textarea,input,summary):not(.link-stretch)]:z-10";

/**
 * A scrollbar in the theme's muted ink instead of the native grey one, at the native width so it
 * stays easy to grab, for a box that scrolls sideways (code). `scrollbar-color` takes no Tailwind colour utility, so the thumb is the
 * element's own text colour (`currentColor`, a palette utility every theme remaps) and the track is
 * transparent. The element must not hold text of its own: put the readable colour on an inner box.
 */
export const themedScrollbar = "text-slate-400 [scrollbar-color:currentColor_transparent]";
