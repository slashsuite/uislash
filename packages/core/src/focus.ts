/**
 * The keyboard focus ring every interactive control shares, on every renderer: a 2px accent
 * outline 2px out. `FOCUS_RING_INSET` draws it inside, for a control that fills a box which clips
 * anything outside it (a table's sortable title, a scroller).
 */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";
export const FOCUS_RING_INSET =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600";
