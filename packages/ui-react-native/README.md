# @slashsuite/ui-react-native

The UISlash components for React Native, built natively (no react-native-web). They draw from the
same token tables as `@slashsuite/ui-react` (through `@slashsuite/core`) and the same themes (each
theme's generated `<id>.native.json` in `@slashsuite/themes`), so a theme reskins an app as it
reskins a site.

Not published yet: Button is the first component, on the foundations every other one will stand on.

## Use

Wrap the app in a `ThemeProvider` with a theme, and compose the parts. As on the web, no component
takes `style` or `className`.

```tsx
import type { NativeTheme } from "@slashsuite/core";
import latte from "@slashsuite/themes/catppuccin-latte.native.json";
import { Button, ThemeProvider } from "@slashsuite/ui-react-native";

// A JSON import widens `scheme` to a string; the file is generated to the NativeTheme shape.
const theme = latte as NativeTheme;

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button onClick={save}>Save</Button>
    </ThemeProvider>
  );
}
```

`useColourScheme` follows the system's light or dark setting, or a choice the person saved, so an
app can pick the light or dark theme of a pair.

## How it works

- **`src/theme/`** turns a class string from core's tables into styles: colours from the theme,
  layout and type from Tailwind's fixed scale, `hover:` as the pressed state, `focus-visible:` as
  focused and `disabled:` as disabled. Each style is split into the box (the View) and the text
  (the Text), which stands in for CSS inheritance. A web-only class (a transition, a cursor) is
  dropped by name; any other unknown class throws.
- **`src/foundation/`** is what every component stands on: text that inherits its style and caps
  font scaling at 1.3 (`renderText`, `TextStyleProvider`), breakpoints and `Stack`/`Cluster`,
  links through the app's router (`LinkProvider`), overlays over the theme's scrim, icons in the
  text colour, the `a11y()` mapping of aria props, `onClick` as the press, and 44pt hit areas.
- **`src/components/`** holds the components.

## Rules

`bun run lint` adds the native rules (`scripts/native-lint.ts`): no text straight inside a View, no
class string that fails to resolve in every theme, no colour literal and no `StyleSheet.create`.
`scripts/fixtures/bad.tsx` is a planted file that breaks each one, and the test proves each fires.

A component in core's parity manifest (`packages/core/parity.json`) has a twin in
`@slashsuite/ui-react`. Change both in one pull request, or add a `Parity: follow-up <ref>` line to
its body.

## License

MIT
