/**
 * Resolves with what `find` returns, checking again on every DOM change and focus move. No timer or
 * frame: the visual capture pauses the page clock, so neither would ever fire.
 */
export function until<T>(find: () => T | null | undefined): Promise<T> {
  return new Promise((resolve) => {
    const check = () => {
      const found = find();
      if (!found) return;
      observer.disconnect();
      document.removeEventListener("focusin", check);
      resolve(found);
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });
    document.addEventListener("focusin", check);
    check();
  });
}

/**
 * Opens an overlay story the way a person does: focuses the button named `name` and clicks it, so
 * the overlay is opened by its trigger and gives the focus back to it when it closes. The focus is
 * a click's, with no ring and no tooltip, so the shot shows only the open overlay. Resolves once
 * `opened` finds the open overlay.
 */
export async function openByTrigger(
  canvasElement: HTMLElement,
  name: string,
  opened: () => Element | null,
): Promise<void> {
  const trigger = [...canvasElement.querySelectorAll("button")].find(
    (button) => (button.getAttribute("aria-label") ?? button.textContent?.trim()) === name,
  );
  if (!trigger) throw new Error(`no button named "${name}" in the story`);
  trigger.focus({ focusVisible: false });
  trigger.click();
  await until(opened);
}
