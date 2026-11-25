/**
 * The keyboard focus ring every interactive control shares, and the same ring drawn inside the
 * control, for one that fills a box which clips anything outside it (a table's sortable title, a
 * scroller). `focusRing` with `-outline-offset-2` added would not do, since `outline-offset-2` comes
 * later in the CSS and wins. Both are core's, so the native controls draw the same ring.
 */
import { FOCUS_RING, FOCUS_RING_INSET } from "@slashsuite/core";

export const focusRing = FOCUS_RING;
export const insetFocusRing = FOCUS_RING_INSET;
