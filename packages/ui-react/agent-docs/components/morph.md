## Morph

Group: Feedback

When to use: A card or thumbnail that opens into its own page, where the reader should see the one become the other.

### The one right way
Each card's `item` is its shop's id, so only the pressed card has a partner on the next page and it morphs.
```tsx
import { useState } from "react";
import { Button, Card, CardGrid, Morph, startPageTransition } from "@slashsuite/ui-react";

function Example() {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-do" item={open}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => startPageTransition(() => setOpen(undefined))}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-do" item={shop}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => startPageTransition(() => setOpen(shop))}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
}
```

### Do
- Wrap the card in the grid and the element on the detail page, each with the same `name` and the record's id as `item`: `<Morph name="shop" item={shop.id}>`.
- The same `name` and `item` may appear only once on a page. Two on one page and the browser skips the morph, so a list passes each record's own id.
- Start the change inside a view transition: `startPageTransition(() => setOpen(id))` for a state change, or the router's own option (TanStack Router `defaultViewTransition: true` on `createRouter`, or `viewTransition` on a `Link`; React Router's `viewTransition`, Astro's `ClientRouter`). Without one nothing morphs.
- The destination's Morph must be in the page when the navigation lands: a route that shows a pending component first has nothing to morph into.
- Inside a `PageFade` the rest of the page cross-fades while the card morphs over it.
- Portal an overlay such as a dropdown to the body: the morphing element is a stacking context, so an overlay inside it cannot rise above a sticky header outside it.
- A Morph far below the fold carries no transition name until it scrolls near, so a long list costs only what is on screen.
- With TanStack Router, call `refreshMorphs()` after it restores scroll: `router.subscribe("onRendered", () => refreshMorphs())`, after `createRouter`. Its restore lands after the render, so without the call the card scrolled back on screen is not named and Back does not shrink into it.

### Don't
Every card shares one `item`, so the page holds the same name twice and the browser skips the morph.
```tsx
import { useState } from "react";
import { Button, Card, CardGrid, Morph, startPageTransition } from "@slashsuite/ui-react";

function Example() {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-dont" item={"shop"}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => startPageTransition(() => setOpen(undefined))}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-dont" item={"shop"}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => startPageTransition(() => setOpen(shop))}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
}
```

A plain state change swaps the page at once: there is no transition to morph.
```tsx
import { useState } from "react";
import { Button, Card, CardGrid, Morph } from "@slashsuite/ui-react";

function Example() {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const letters = ["A", "B"];
  return open ? (
    <Morph name="shop-transition-dont" item={open}>
      <Card title={`Shop ${open}`} size="lg">
        <Button variant="outline" onClick={() => setOpen(undefined)}>
          Back
        </Button>
      </Card>
    </Morph>
  ) : (
    <CardGrid columns={2}>
      {letters.map((shop) => (
        <Morph key={shop} name="shop-transition-dont" item={shop}>
          <Card title={`Shop ${shop}`}>
            <Button variant="outline" onClick={() => setOpen(shop)}>
              Open Shop {shop}
            </Button>
          </Card>
        </Morph>
      ))}
    </CardGrid>
  );
}
```

### Accessibility
- A Morph is a plain `<div>` with no role, so it changes nothing for assistive technology.
- Under `prefers-reduced-motion: reduce` the element swaps with no animation, and `startPageTransition` just runs the update.
- Where the browser has no View Transitions it is a plain `<div>` and the content swaps.

### Props
### Morph
An element that grows into its counterpart on the next page, and shrinks back on Back, through the View Transitions API. Wrap the card in the list and the element on the detail page, each with the same `name` and the record's id as `item`: the browser morphs one into the other over 450 ms. The same `name` and `item` may appear only once on a page; two on one page and the browser skips the morph, so a list passes each record's own id. The morph runs only when the change is wrapped in a view transition: `startPageTransition`, or a router's own option (TanStack Router `defaultViewTransition: true` on `createRouter`, or `viewTransition` on a `Link`; React Router's `viewTransition`, Astro's `ClientRouter`). Otherwise, or where the browser has no View Transitions, it renders and behaves as a plain `<div>`. Inside a `PageFade` the page fades while this element morphs. While it is named (near the screen) the div is a stacking context, so a dropdown inside it cannot rise above a sticky header outside it: portal overlays to the body. Under `prefers-reduced-motion: reduce` it swaps with no animation; a router's own transition of the rest of the page is the router's to quiet. A Morph more than a screen above or below the viewport carries no transition name until it scrolls near, so a long list costs only what is on screen.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- item: string | number (required). Which one, usually the record's id. Any text or number; unique on the page for one `name`.
- name: string (required). What the element is, shared by the card and its detail: `"shop"`, `"product"`. Any text.

### Functions
- refreshMorphs: `refreshMorphs(): void`. measures every Morph again, so a card a router scrolled on screen after the render is named before the capture; call it from the router's `onRendered`.
