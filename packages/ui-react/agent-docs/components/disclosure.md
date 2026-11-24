## Disclosure

Group: Content

When to use: Detail the person may not need on first sight: a history, an FAQ answer, the fine print.

### The one right way
Detail the person may not need, behind a summary that says what it is, is a `Disclosure`.
```tsx
import { Disclosure, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text>Order 1042 was posted on Monday.</Text>
  <Disclosure summary="Tracking history">
    <Text>Posted Monday · Sorted Tuesday · Out for delivery Wednesday.</Text>
  </Disclosure>
</Stack>
```

### Do
- Give it a `summary` that says what is inside; the `children` are the body. It starts closed; `defaultOpen` starts it open.
- It keeps its own state. Several in a column are independent of each other.
- `bordered` draws it as a panel for a section that opens in place on a page of cards: a bordered box, the summary a full-width row that fills on hover, the body padded under a hairline.
- A collapsible section header in a list of rows is a `ListRow` with `expanded`, where the caller owns the state.
- It replaces `<details>` and `<summary>`.

### Don't
- Do not hide what the person must read to carry on, such as an error or the one thing the page is for.

A hand-built `<details>` and `<summary>` has none of the library's look or focus ring. `Disclosure` replaces it.
```tsx
import { Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text>Order 1042 was posted on Monday.</Text>
  <details>
    <summary>Tracking history</summary>
    <Text>Posted Monday · Sorted Tuesday · Out for delivery Wednesday.</Text>
  </details>
</Stack>
```

What the person must read to carry on, such as an error, is not hidden behind a summary: show it.
```tsx
import { Callout, Disclosure } from "@slashsuite/ui-react";

<Disclosure summary="Details">
  <Callout tone="danger">Your payment was declined. Your order is not placed.</Callout>
</Disclosure>
```

### Accessibility
- The summary is a real `<button>` with `aria-expanded` and `aria-controls`; Enter and Space toggle it.
- The body is a `role="group"` named by the summary, and hidden from assistive tech while closed.
- The chevron is decorative. The focus ring comes from the component.

### Props
### Disclosure
A summary line with a chevron over a body that opens and closes under it. The summary is a button with `aria-expanded`, and Enter and Space toggle it; the body is hidden while closed. It starts closed and keeps its own state; `defaultOpen` starts it open. To drive it from the app, pass `open` with `onOpenChange`. `bordered` draws it as a panel: a bordered box with the summary as a roomy row across the top (the hover fill of a `ListRow`) and the body padded under a hairline, for a section that opens in place in a page of cards. Plain, it is a line of text with the body indented under it.
- bordered: boolean (default false). Draws it as a bordered panel: the summary a full-width row, the body padded under a hairline.
- children: ReactNode (required). The body, shown while open.
- defaultOpen: boolean (default false). Starts with the body showing.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- onOpenChange: ((open: boolean) => void). Called with the new state when the summary is pressed.
- open: boolean. Whether the body shows, for an app that holds the state; pass `onOpenChange` with it.
- summary: ReactNode (required). The always-visible line: the button that toggles the body.
