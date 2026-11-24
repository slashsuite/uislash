## ColourSchemeToggle

Group: Actions

When to use: A site that offers both schemes: one toggle in the header or controls.

### The one right way
One `ColourSchemeToggle` in the page header: it switches `<html>`, remembers the choice and shows the scheme you would switch to.
```tsx
import { ColourSchemeToggle } from "@slashsuite/ui-react";

<ColourSchemeToggle />

```

### Do
- Use one `ColourSchemeToggle` per site. It switches `<html>` between light and dark and remembers the choice in `localStorage`.
- `size` is `sm`, `md` (default) or `lg`, the same squares as `IconButton`.
- Put `colourSchemeScript` inline in `<head>`, so the stored or system scheme is on `<html>` before first paint and neither scheme flashes the other. It knows only the `dark` class.
- A light theme with a class of its own passes `schemes`, as in `schemes={{ light: "my-light", dark: "dark" }}`; render the same class on `<html>` on the server with `schemeClass`, and leave the head script out.
- An app that knows the scheme on the server (from a cookie) passes it as `defaultValue`, sets `store={false}` and persists from `onChange`. It then leaves the head script out.

### Don't
- Do not build a switch from your own buttons; the functions below are what the toggle itself calls.

Two hand-rolled buttons forget the choice, and nothing shows which scheme is on.
```tsx
import { applyColourScheme, Button, ButtonGroup } from "@slashsuite/ui-react";

<ButtonGroup label="Colour scheme">
  <Button variant="outline" size="sm" onClick={() => applyColourScheme("light")}>
    Light
  </Button>
  <Button variant="outline" size="sm" onClick={() => applyColourScheme("dark")}>
    Dark
  </Button>
</ButtonGroup>
```

Without `schemes` the toggle only adds and removes `dark`, so the light theme's own class is never put back.
```tsx
import { ColourSchemeToggle } from "@slashsuite/ui-react";

<ColourSchemeToggle />

```

### Accessibility
- It is a button named `Switch to dark theme` or `Switch to light theme`, so the name says the action, and the icon is `aria-hidden`. The name follows the class on `<html>` through CSS before hydration, with no script; only the tooltip waits for the client.
- The icon shown is the scheme you would switch to: the moon on a light page, the sun on a dark one. It follows the class on `<html>` through CSS, so it is right on the first frame.
- `applyColourScheme` also sets `color-scheme` on `<html>`, so native controls and scrollbars follow.

### Props
### ColourSchemeToggle
A sun/moon button that switches `<html>` between light and dark and remembers the choice. It shows the scheme you would switch to. Pair it with `colourSchemeScript` in `<head>`, unless you pass `schemes` or `defaultValue`: the script knows only the `dark` class and the stored choice, so an app that sets the scheme itself leaves it out. An app whose light scheme has a class of its own passes `schemes` (`{ light: "my-light", dark: "dark" }`); the toggle swaps those classes, and `schemeClass` gives the same one for the server to render on `<html>`. An app that knows the scheme on the server (from a cookie) passes it as `defaultValue`, so the server markup, the hydrating client and the `<html>` class agree; persist a change from `onChange`. The icon and the button's accessible name follow the class on `<html>` through CSS (the name is two visually hidden "Switch to …" spans, one hidden by `display:none`), so even without `defaultValue` a dark page shows the sun and is named "Switch to light theme" from the first frame, with no script. Only the tooltip catches up once the client has hydrated. `store={false}` skips `localStorage`, for an app that keeps the choice in a server cookie and writes it from `onChange`. Every other button prop (`id`, `data-*`, `aria-*`) goes on the button.
- defaultValue: (ColourScheme & (string | number | readonly string[])) (default light). The scheme the server rendered. What the server and the hydrating client show; the real state follows right after.
- onChange: (scheme: ColourScheme) => void. Called with the new scheme after a click, for an app that persists the choice itself (a cookie).
- schemes: ColourSchemeClasses (default { light: "", dark: "dark" }). The class each scheme puts on `<html>`.
- size: "sm" | "md" | "lg" (default md). The button's height, as an `IconButton`'s.
- store: boolean (default true). Remember the choice in `localStorage`. `false` leaves persisting to `onChange`.

### Types
- ColourScheme: `"light" | "dark"`. The two colour schemes a site switches between: `light` and `dark`.
- ColourSchemeClasses: `{ light: string; dark: string }`. The class each scheme puts on `<html>`: none for light and `dark` for dark, unless the app's theme says otherwise (a light theme with a scope class of its own).

### Functions
- applyColourScheme: `applyColourScheme(scheme: ColourScheme, root?: HTMLElement, schemes?: ColourSchemeClasses): void`. Puts a scheme on `<html>`: its class, the other scheme's class taken off, and `color-scheme`.
```tsx
button.addEventListener("click", () => {
  const next = readColourScheme() === "dark" ? "light" : "dark";
  applyColourScheme(next);
  storeColourScheme(next);
});
```
- schemeClass: `schemeClass(scheme: ColourScheme, schemes?: ColourSchemeClasses): string`. The class a scheme puts on `<html>`, for the server to render so the first paint is right; empty for the default light scheme.
```tsx
<html className={schemeClass(scheme, { light: "my-light", dark: "dark" })}>
```
- colourSchemeScript: `colourSchemeScript: string`. A string of JavaScript to inline in `<head>` before first paint: applies the stored scheme, else the system one.
```tsx
<head>
  <script dangerouslySetInnerHTML={{ __html: colourSchemeScript }} />
</head>
```
- readColourScheme: `readColourScheme(fallback?: ColourScheme): ColourScheme`. The stored choice, else the system preference, with a fallback (default light) when neither is available, as on the server.
```tsx
const scheme = readColourScheme(); // the stored choice, else the system's, else light
```
- storeColourScheme: `storeColourScheme(scheme: ColourScheme): void`. Remembers a scheme in `localStorage` for the next visit; a storage error is swallowed.
```tsx
storeColourScheme(next); // read back on the next visit
```
