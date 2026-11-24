## IconButton

Group: Actions

When to use: An action with a familiar icon and no room for a word: delete, settings, alerts.

### The one right way
`label` names the button for a screen reader and shows as its tooltip; the icon is only decoration.
```tsx
import { IconButton } from "@slashsuite/ui-react";

<IconButton label="Delete quote" tone="danger" variant="ghost" icon="close" />

```

### Do
- Always give the `label`: it is the accessible name and the tooltip, and the icon is only decoration.
- `variant="ghost"` is the quiet one for a row or a toolbar; `tone="danger"` is for delete and clear.
- `size` is `sm` (26px) inside a row or a chip, `md` (default, 38px, the height of a `Button`) or `lg` beside a large `Button`.
- An unread count is `count`, never part of the label; it is not shown at 0. The icon is `icon`, a name from the `Icon` set, never a child.
- Going to another page is `href` (through the app's `LinkProvider`), which draws the same button as a link.
- Say why it cannot be pressed with `disabledReason`: the reason becomes its tooltip in place of the label.
- An action that needs a word is a `Button`.
- A row of several icon buttons is a `Menu`: one main action in view, the rest behind it.

### Don't
A `Button` holding a glyph has no accessible name, no tooltip and the wrong box; an icon-only action is an `IconButton`.
```tsx
import { Button } from "@slashsuite/ui-react";

<Button variant="ghost" tone="danger" size="sm">
  <span aria-hidden="true">x</span>
</Button>
```

A count typed into the label shows only in the tooltip, so a sighted user never sees it on the button.
```tsx
import { IconButton } from "@slashsuite/ui-react";

<IconButton label="Alerts (3)" icon="bell" />

```

A button that sets `location` loses middle-click, the status-bar URL and crawlability.
```tsx
import { IconButton } from "@slashsuite/ui-react";

<IconButton
  label="Settings"
  variant="ghost"
  onClick={() => location.assign("#settings")}
  icon="settings"
/>
```

A bare `disabled` drops it from the tab order and gives no reason.
```tsx
import { IconButton } from "@slashsuite/ui-react";

<IconButton label="Delete quote" tone="danger" icon="close" disabled />

```

### Accessibility
- `label` is set as `aria-label`, and shows as a tooltip above the button on hover and on keyboard focus (the native `title` in a browser without CSS anchor positioning); with a `count` it reads `Alerts, 3`. The tooltip repeats the name, so it is hidden from a screen reader.
- The badge itself is `aria-hidden`, so the count is read once, through the name.
- As a button it defaults to `type="button"`; with `href` it is a real link, and `external` opens a new tab with `rel="noreferrer"`.
- `disabledReason` sets `aria-disabled` and keeps the button in the tab order; a click, Enter and Space do nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning).
- It has the component's focus ring.

### Props
### IconButton
A square button holding one icon from the `Icon` set (`icon`). `label` is its accessible name and tooltip. `variant="ghost"` drops the border for a quiet action in a row or a toolbar; `size` matches the height of a `Button` of the same size (`sm` 26px, `md` 38px, `lg` 46px; a responsive `{ base, md }` changes at 48rem) and with no `size` it takes its container's; `tone="danger"` is red, for delete and clear; `count` pins a red count to the corner; `disabledReason` blocks it and shows why. Defaults to `type="button"`. `href` makes it a link instead (the app's router link through `LinkProvider` for an in-app path, else a plain `<a>`; `external` opens a new tab), with the same look.
- count: number. A red count on the top corner at the end edge, for unread alerts. Not shown at 0; the name carries it for a screen reader, "Alerts, 3".
- disabledReason: string. Why the button cannot be pressed: it dims and is blocked (`aria-disabled`; a click, Enter and
Space do nothing) while it stays in the tab order, and the reason is its tooltip on hover,
keyboard focus and a tap, read out as its description. The name stays `label`.
- external: boolean. Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- href: string. Makes the button a link to this URL; an in-app path goes through the app's `LinkProvider`.
- icon: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase" (required). The one icon it holds, from the `Icon` set, at the button's size.
- label: string (required). The button's accessible name and its tooltip, shown on hover and on keyboard focus.
- size: Size | ResponsiveSize (default md). The button's height, matching a `Button` or `Input` of the same size. Left out, it takes the
size of the `Card`, `ListRow` or `Table` it sits in, else `md`. `{ base: "md", md: "lg" }`
changes size at the `md` breakpoint (48rem), in CSS.

Give it the same value as a responsive `Button` beside it.
- tone: "neutral" | "danger" (default neutral). `danger` is red, for delete and clear.
- variant: "outline" | "ghost" (default outline). `outline` has a border; `ghost` has none, until the hover fill.

### Types
- IconButtonTone: `"neutral" | "danger"`. An IconButton's tones: `neutral` (the default) and `danger`.
- IconButtonVariant: `"outline" | "ghost"`. An IconButton's look: `outline` with a border, or `ghost` with none until hover.
