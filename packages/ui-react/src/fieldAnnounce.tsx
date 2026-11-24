import { type ReactNode, type ReactPortal, type RefCallback, useCallback, useState } from "react";
import { createPortal } from "react-dom";

/** The attribute that marks a field-error region. */
const REGION = "data-field-errors";

/**
 * The polite live region for field errors under `host`, made on first use and shared by every field
 * there: a hidden `<div aria-live="polite">` as the host's last child. The host is the open dialog the
 * field sits in, or `body`: a modal dialog makes the rest of the page inert, and a screen reader
 * does not announce a live region in inert content.
 */
function errorRegion(host: HTMLElement): HTMLElement {
  const found = host.querySelector<HTMLElement>(`:scope > [${REGION}]`);
  if (found) return found;
  const region = document.createElement("div");
  region.setAttribute(REGION, "");
  region.setAttribute("aria-live", "polite");
  region.className = "sr-only";
  host.append(region);
  return region;
}

/**
 * Announces a field's error through its page's (or dialog's) one polite live region, not a
 * `role="alert"` of its own. Put `anchor` on the field's drawn error line: it places the field in
 * its dialog, if any. The text leaves the region when the line unmounts. The field still draws its
 * error in place and names it in the control's `aria-describedby`.
 */
export function useErrorAnnouncement(error: ReactNode): {
  anchor: RefCallback<HTMLElement>;
  announcement: ReactPortal | null;
} {
  const [region, setRegion] = useState<HTMLElement | null>(null);
  const anchor = useCallback((node: HTMLElement | null) => {
    if (node) setRegion(errorRegion(node.closest("dialog") ?? document.body));
  }, []);
  return { anchor, announcement: region ? createPortal(<p>{error}</p>, region) : null };
}
