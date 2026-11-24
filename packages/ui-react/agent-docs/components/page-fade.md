## PageFade

Group: Feedback

When to use: A site where the frame stays put and only the content between pages should fade.

### The one right way
`PageFade` wraps only the content that changes between pages; the frame around it, with the control, stays put.
```tsx
import { useState } from "react";
import {
  PageFade,
  SegmentedControl,
  Stack,
  startPageTransition,
  Text,
} from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("overview");
  const items = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
  ];
  return (
    <Stack gap="sm">
      <SegmentedControl
        label="Page"
        items={items}
        value={value}
        onChange={(next) => startPageTransition(() => setValue(next))}
      />
      <PageFade>
        <Text>The {value} page.</Text>
      </PageFade>
    </Stack>
  );
}
```

### Do
- Wrap what changes between pages, once per page, and leave the header and footer outside it.
- Start the change inside a view transition: `startPageTransition(() => setPage(next))` for a state change, or the router's own option (TanStack Router `viewTransition`, React Router's `viewTransition`, Astro's `ClientRouter`). Without one nothing fades.
- Leave `name` off: the whole page cross-fades and the frame, the same on both pages, looks still.
- Give a `name` only to a second region that must fade apart from the page, and only one no taller than the screen: a named region is captured at its full height. Each named one on a page needs its own `name`, and it is a stacking context, so portal an overlay inside it to the body.

### Don't
Wrapping the frame too makes the control fade with the content, so the page flickers instead of changing in place.
```tsx
import { useState } from "react";
import {
  PageFade,
  SegmentedControl,
  Stack,
  startPageTransition,
  Text,
} from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("overview");
  const items = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
  ];
  return (
    <PageFade>
      <Stack gap="sm">
        <SegmentedControl
          label="Page"
          items={items}
          value={value}
          onChange={(next) => startPageTransition(() => setValue(next))}
        />
        <Text>The {value} page.</Text>
      </Stack>
    </PageFade>
  );
}
```

A plain state change swaps the content at once: there is no transition to fade.
```tsx
import { useState } from "react";
import { Button, PageFade, Stack, Text } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("overview");
  return (
    <Stack gap="sm">
      <Button
        variant="outline"
        onClick={() => setValue(value === "overview" ? "activity" : "overview")}
      >
        Switch page
      </Button>
      <PageFade>
        <Text>The {value} page.</Text>
      </PageFade>
    </Stack>
  );
}
```

### Accessibility
- A PageFade is a plain `<div>` with no role, so it changes nothing for assistive technology.
- Under `prefers-reduced-motion: reduce` the content swaps with no fade, and `startPageTransition` just runs the update.
- Where the browser has no View Transitions it is a plain `<div>` and the content swaps.

### Props
### PageFade
The page's content area, cross-faded by the View Transitions API when the route changes. Wrap what changes between pages, once per page. With no `name` the fade is the browser's own cross-fade of the whole viewport; the frame around the content (header, footer) stays still because it is the same on both pages. A `name` names this box so it fades apart from the page, for a second region; a named region is captured at its full height, so name only a region no taller than the screen, and give each named one on a page its own `name`. The fade runs only when the navigation is wrapped in a view transition: `startPageTransition`, or a router's own option (TanStack Router `viewTransition`, React Router's `viewTransition` prop, Astro's `ClientRouter`). Otherwise, or where the browser has no View Transitions, it renders and behaves as a plain `<div>`. A named PageFade is a stacking context, so a dropdown inside it cannot rise above a sticky header outside it: portal overlays to the body. The default one is not. Under `prefers-reduced-motion: reduce` the content swaps with no fade; a named one quiets only its own box, and a router's own transition of the rest of the page is the router's to quiet.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- name: string. A view-transition name for this box, a CSS identifier (letters, digits, `-`, `_`), for a region no taller than the screen that fades apart from the page.

### Functions
- startPageTransition: `startPageTransition(update: () => void): void`. runs a synchronous state change inside a view transition, so a PageFade cross-fades; call it from an event handler.
