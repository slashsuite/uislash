/** ColourSchemeToggle switches <html>, which the toolbar's theme scope does not use. A story that shows it calls this as `beforeEach`, so the shot is the light state and leaving the story puts <html> and storage back. */
export function resetColourScheme(): () => void {
  return startColourScheme("light");
}

/** `resetColourScheme`, but starting `<html>` in `scheme`, as a server that rendered that scheme leaves it. */
export function startColourScheme(scheme: "light" | "dark"): () => void {
  const root = document.documentElement;
  const reset = () => {
    root.classList.remove("dark", "my-light");
    root.style.removeProperty("color-scheme");
  };
  reset();
  if (scheme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }
  return () => {
    reset();
    try {
      localStorage.removeItem("hackcove:colour-scheme");
    } catch {
      // storage blocked; nothing was stored
    }
  };
}
