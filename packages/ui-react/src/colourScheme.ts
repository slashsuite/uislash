/** The two colour schemes a site switches between: `light` and `dark`. */
export type ColourScheme = "light" | "dark";

const STORAGE_KEY = "hackcove:colour-scheme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const isScheme = (value: unknown): value is ColourScheme => value === "light" || value === "dark";

/** The class each scheme puts on `<html>`: none for light and `dark` for dark, unless the app's theme says otherwise (a light theme with a scope class of its own). */
export type ColourSchemeClasses = { light: string; dark: string };

const DEFAULT_CLASSES: ColourSchemeClasses = { light: "", dark: "dark" };

/** The class for `scheme`: what to render on `<html>` on the server so the first paint is right. `""` for the default light scheme. */
export function schemeClass(
  scheme: ColourScheme,
  schemes: ColourSchemeClasses = DEFAULT_CLASSES,
): string {
  return schemes[scheme];
}

/** Which scheme `root` is in: dark when it carries the dark class, else light. */
export function appliedColourScheme(
  root: HTMLElement = document.documentElement,
  schemes: ColourSchemeClasses = DEFAULT_CLASSES,
): ColourScheme {
  return schemes.dark !== "" && root.classList.contains(schemes.dark) ? "dark" : "light";
}

/** Put `scheme` on `root` (the `<html>` element by default): its class from `schemes` (default `dark` for dark and none for light), the other scheme's class taken off, and `color-scheme` so native controls and scrollbars follow. */
export function applyColourScheme(
  scheme: ColourScheme,
  root: HTMLElement = document.documentElement,
  schemes: ColourSchemeClasses = DEFAULT_CLASSES,
): void {
  const other = scheme === "dark" ? "light" : "dark";
  if (schemes[other] !== "") root.classList.remove(schemes[other]);
  if (schemes[scheme] !== "") root.classList.add(schemes[scheme]);
  root.style.colorScheme = scheme;
}

/** The stored choice, or `undefined` when nothing is stored (the page follows the system) or storage throws. */
function storedColourScheme(): ColourScheme | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isScheme(stored) ? stored : undefined;
  } catch {
    return undefined; // storage blocked: private mode, or no window at all
  }
}

/** The system's scheme, or `undefined` where there is no `matchMedia` (server rendering). */
export function systemColourScheme(): ColourScheme | undefined {
  if (typeof matchMedia !== "function") return undefined;
  return matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** The stored choice, else the system preference. `fallback` (default `"light"`) is for when neither is available: server rendering, or storage that throws with no `matchMedia`. */
export function readColourScheme(fallback: ColourScheme = "light"): ColourScheme {
  return storedColourScheme() ?? systemColourScheme() ?? fallback;
}

/** Remember `scheme` for the next visit, or with `"system"` forget the choice so the page follows the system again. A storage error is swallowed, so private mode does not crash. */
export function storeColourScheme(scheme: ColourScheme | "system"): void {
  try {
    if (scheme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // Not remembered; the page still switches for this visit.
  }
}

/**
 * Keep `root` on the stored scheme, else the system's, as either changes: a choice made or cleared in
 * another tab (the `storage` event), and the system switching while nothing is stored (the dark
 * query's `change` event). Returns the function that stops listening.
 */
export function followColourScheme(
  root: HTMLElement = document.documentElement,
  schemes: ColourSchemeClasses = DEFAULT_CLASSES,
): () => void {
  const sync = () =>
    applyColourScheme(readColourScheme(appliedColourScheme(root, schemes)), root, schemes);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) sync();
  };
  const query = typeof matchMedia === "function" ? matchMedia(DARK_QUERY) : undefined;
  addEventListener("storage", onStorage);
  query?.addEventListener("change", sync);
  return () => {
    removeEventListener("storage", onStorage);
    query?.removeEventListener("change", sync);
  };
}

/**
 * JavaScript to inline in `<head>`, before first paint: applies the stored scheme, else the
 * system one, to `<html>` as `applyColourScheme` does. Without it a light user sees a dark flash.
 * It then keeps following, as `followColourScheme` does: a choice made in another tab, and the system
 * switching while nothing is stored.
 */
export const colourSchemeScript = `(function(){var r=document.documentElement,k=${JSON.stringify(STORAGE_KEY)},q=typeof matchMedia==="function"?matchMedia(${JSON.stringify(DARK_QUERY)}):null;function a(){var s;try{s=localStorage.getItem(k)}catch(e){}if(s!=="light"&&s!=="dark")s=q?q.matches?"dark":"light":null;if(s){r.classList.toggle("dark",s==="dark");r.style.colorScheme=s}}a();if(q&&q.addEventListener)q.addEventListener("change",a);addEventListener("storage",function(e){if(e.key===k||e.key===null)a()})})()`;
