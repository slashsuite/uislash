## Toast

Group: Feedback

When to use: A confirmation or an offer that should not move the page: Saved, Copied, Update available.

### The one right way
A confirmation is a toast the app adds to the list it holds: it leaves on its own after five seconds.
```tsx
import { useState } from "react";
import { Button, Toast, ToastRegion } from "@slashsuite/ui-react";

function Example() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  return (
    <>
      <Button
        onClick={() =>
          setToasts((all) => [
            ...all,
            { id: crypto.randomUUID(), tone: "positive", title: "Saved" },
          ])
        }
      >
        Save
      </Button>
      <ToastRegion
        toasts={toasts}
        onDismiss={(id) => setToasts((all) => all.filter((toast) => toast.id !== id))}
      />
    </>
  );
}
```

### Do
- Mount one `ToastRegion` at the root of the app, beside `AppShell`, and hold the list in state: add a `Toast` to show it, and drop it by `id` in `onDismiss`.
- Each toast is a `title`, an optional `body` line and a `tone` (`neutral`, the default, `info`, `positive`, `warn` or `danger`), on the same surfaces as a `Callout`.
- A `neutral`, `info` or `positive` toast with no `actions` leaves on its own after five seconds, paused while the pointer is over it or focus is in it. One action goes in `actions` as a `Button size="sm"`; a toast with `actions`, or a `warn` or `danger` one, stays until it is dismissed.
- A toast raised while a `Dialog` or `Drawer` is open sits under it, and can be read and dismissed once it closes.
- Anything the reader must keep, such as a token shown once, is a `Callout` in the page. A failure that must be answered is a `Dialog`, and a field's error is its `Field`'s.

### Don't
A save notice pushed into the page flow moves the form under the reader and never leaves.
```tsx
import { Callout, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Callout tone="positive">Details saved</Callout>
  <Text>The form the reader was filling in, now a line lower.</Text>
</Stack>
```

An action put in `body` is not an action to the region: the toast still leaves after five seconds, taking the button with it before the reader reaches it.
```tsx
import { Button, ToastRegion } from "@slashsuite/ui-react";

<ToastRegion
  onDismiss={() => undefined}
  toasts={[
    {
      id: "update",
      tone: "info",
      title: "Update available",
      body: <Button size="sm">Reload</Button>,
    },
  ]}
/>
```

### Accessibility
- The region is a landmark named by `label` ("Notifications") with a polite `role="status"` inside, in the page before the first toast, so each new toast is read once and the focus does not move.
- Each toast's close button is named by `dismissLabel` ("Dismiss").
- The hide pauses on hover and on focus, and under `prefers-reduced-motion` it still leaves at the same moment, with no fade.

### Props
### ToastRegion
The page's toasts: short notices fixed to the bottom of the viewport, from a list the app holds. Mount it once, at the root beside `AppShell`; add a toast to `toasts` to show it, and drop it in `onDismiss` to remove it. A `neutral`, `info` or `positive` toast with no `actions` leaves on its own after five seconds (paused while the pointer is over it or focus is in it); a `warn` or `danger` toast, or one with `actions`, stays until dismissed. The region is a named landmark with a polite `role="status"`, kept in the page while empty, so each new toast is read once. A toast raised while a `Dialog` or `Drawer` is open sits under it until it closes.
- dismissLabel: string (default Dismiss). The close button's name.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (default Notifications). The region's accessible name.
- onDismiss: (id: string) => void (required). Called by a toast's close button and when a self-hiding toast's time is up: drop it from `toasts`.
- toasts: readonly Toast[] (required). What is shown, oldest first. `[]` shows nothing and keeps the live region in the page.

### Types
- Toast: `{ id: string; title: string; body?: ReactNode; tone?: Tone; actions?: ReactNode }`. One notice in a `ToastRegion`. The caller holds the list; the region draws it.
