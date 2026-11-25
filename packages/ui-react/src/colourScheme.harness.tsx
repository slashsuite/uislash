/**
 * The classes on <html> (or `element`): the colour-scheme head script's contract, read and set
 * as data, not look. The one place the scheme tests touch classList.
 */
export function schemeClasses(element: Element = document.documentElement): {
  has: (name: string) => boolean;
  add: (...names: string[]) => void;
  remove: (...names: string[]) => void;
  list: () => string[];
} {
  const classes = element.classList;
  return {
    has: (name) => classes.contains(name),
    add: (...names) => classes.add(...names),
    remove: (...names) => classes.remove(...names),
    list: () => [...classes],
  };
}

/**
 * jsdom has no matchMedia: stub one whose dark query answers `dark`, and return `flip`, which
 * switches the system as an OS would and fires the query's `change` listeners.
 */
export function stubSystemScheme(
  stubGlobal: (name: string, value: unknown) => unknown,
  dark: boolean,
): { flip: (dark: boolean) => void } {
  const listeners = new Set<() => void>();
  const query = {
    get matches() {
      return dark;
    },
    addEventListener: (_type: "change", listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: "change", listener: () => void) => listeners.delete(listener),
  };
  stubGlobal("matchMedia", (text: string) =>
    text === "(prefers-color-scheme: dark)" ? query : { matches: false },
  );
  return {
    flip: (next) => {
      dark = next;
      for (const listener of listeners) listener();
    },
  };
}

/** Another tab wrote `value` (or cleared it, with `null`) under the scheme's key: set it here and fire the `storage` event the browser would. */
export function storageFromAnotherTab(key: string, value: string | null): void {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
  dispatchEvent(new StorageEvent("storage", { key, newValue: value, storageArea: localStorage }));
}
