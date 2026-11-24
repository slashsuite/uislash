## NavigationProgress

Group: Feedback

When to use: A page load of unknown length: show at once that the click did something, until the next page renders.

### The one right way
Pass `loading` from the router's pending state: the bar shows while it is true and is gone when the page has arrived.
```tsx
import { useState } from "react";
import { Button, NavigationProgress, PageFade, Stack, Text } from "@slashsuite/ui-react";

function Example() {
  const [pending, setPending] = useState(true);
  return (
    <Stack gap="sm">
      <NavigationProgress loading={pending} />
      <Button variant="outline" onClick={() => setPending(!pending)}>
        {pending ? "The page has arrived" : "Open the store page"}
      </Button>
      <PageFade>
        <Text>{pending ? "Waiting for the next page." : "The current page."}</Text>
      </PageFade>
    </Stack>
  );
}
```

### Do
- Render it once per app, beside the page frame, and pass `loading` from the router's pending state: with TanStack Router, `loading={useRouterState({ select: (s) => s.status === "pending" })}`. It has no router dependency.
- There is nothing to configure: it draws the bar while `loading` is true and nothing while it is false. The bar is invisible for its first 150ms, so a fast navigation shows nothing.
- It is fixed to the top edge of the viewport and overlays the header, so nothing on the page moves. Pair it with `PageFade`: the bar says the page is loading, and the fade swaps the content when it arrives.
- A task with a known length and a value is a `ProgressBar`, not this.

### Don't
A `ProgressBar` needs a value, and a page load has none to give: a guessed one sits still or lies about how far along it is.
```tsx
import { ProgressBar, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="sm">
  <ProgressBar value={60} label="Loading page" />
  <Text>Waiting for the next page.</Text>
</Stack>
```

### Accessibility
- While shown it is `role="progressbar"` named by `label` ("Loading page" by default) and has no `aria-valuenow`, so it reads as an indeterminate progress bar. When hidden it is not in the page.
- Under `prefers-reduced-motion: reduce` it is a still, full-width bar with no slide.
- It takes no pointer events, so it never covers a control in the header.

### Props
### NavigationProgress
A thin indeterminate bar along the top edge of the viewport, in the accent tone, for a route change that is under way and has no known length. Pass `loading` from the router's pending state and render it once per app, beside the page frame. It draws exactly what `loading` says: the bar while it is true and nothing while it is false. The stylesheet holds it invisible for the first 150ms, so a fast navigation shows nothing. It is fixed to the viewport and overlays the top of the header, so nothing on the page moves. Under `prefers-reduced-motion: reduce` it is a still bar.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (default Loading page). The bar's accessible name.
- loading: boolean (required). True while a navigation is pending, e.g. from the router's state.
