## BottomSheet

Group: Feedback

When to use: A list or details over a full-screen view (a map, a canvas) that must stay usable behind it.

### Use instead
- Dialog (dialog.md): A question must be answered before going on: modal.
- Drawer (drawer.md): A record or a long form, modal, beside the page.

### The one right way
The heading and the count go in `header`: they stay put while the list scrolls under them.
```tsx
import { useState } from "react";
import { BottomSheet, ListRow, Pill, SectionHeading } from "@slashsuite/ui-react";

function Example() {
  const [snap, setSnap] = useState(1);
  return (
    <BottomSheet
      label="Shops"
      snaps={[0.3, 0.75]}
      snap={snap}
      onSnapChange={setSnap}
      header={
        <>
          <SectionHeading>Shops nearby</SectionHeading>
          <Pill>12</Pill>
        </>
      }
    >
      {Array.from({ length: 12 }, (_, i) => (
        <ListRow key={i} divided={i > 0} trailing={`${i + 2}00 m`}>
          Shop {i + 1}
        </ListRow>
      ))}
    </BottomSheet>
  );
}
```

### Do
- Put it in a positioned parent (`relative`) that holds the full-screen view; it docks to that parent's bottom edge, full width on a phone and a panel at the start edge from `md` up.
- Hold `snap` in your state and set it in `onSnapChange`: `<BottomSheet snap={snap} onSnapChange={setSnap} …>`.
- List `snaps` lowest first, at least two: a number from 0 to 1 is a share of the parent's height, a `"120px"` string is pixels.
- The heading and a count go in `header`, never first in the body, so they stay put while the list scrolls.
- Pad the map camera by the height `onHeightChange` reports, so a pin is never hidden under the sheet.
- A record or a form that stops the page is a `Drawer`; a question is a `Dialog`.
- Render the first snap first: the server render, and a page with no JavaScript, show a static panel at it.

### Don't
Do not put the heading first in the body: it scrolls away with the list.
```tsx
import { useState } from "react";
import { BottomSheet, ListRow, SectionHeading } from "@slashsuite/ui-react";

function Example() {
  const [snap, setSnap] = useState(1);
  return (
    <BottomSheet label="Shops" snaps={[0.3, 0.75]} snap={snap} onSnapChange={setSnap}>
      <SectionHeading>Shops nearby</SectionHeading>
      {Array.from({ length: 12 }, (_, i) => (
        <ListRow key={i} divided={i > 0} trailing={`${i + 2}00 m`}>
          Shop {i + 1}
        </ListRow>
      ))}
    </BottomSheet>
  );
}
```

### Accessibility
- It is a region named by `label`.
- The handle is a button named by `label`, with `aria-expanded` and `aria-controls` on the body. Enter and Space step through the snaps, and Escape inside the sheet returns it to the first.
- Nothing behind it is inert, and focus is never trapped or moved.
- The settle between snaps is switched off under `prefers-reduced-motion: reduce`.
- The body scrolls on its own and never scrolls the page.

### Props
### BottomSheet
A non-modal panel docked to the bottom edge of its positioned parent, over a full-screen view (a map, a canvas) that stays usable behind it. It rests at one of its `snaps`; the handle steps through them (Enter and Space), a drag of the handle moves it and releases to the nearest snap (a fling steps on), and Escape inside it returns it to the first. Nothing is made inert and focus never moves. Full width below `md`, a panel at the start edge from `md` up.
- children: ReactNode. The scrolling body.
- footer: ReactNode. Actions pinned under the scrolling body.
- header: ReactNode. The row under the handle: a heading and a count. It stays put while the body scrolls.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). The sheet's accessible name, as a region, and its handle button's.
- onHeightChange: (px: number) => void. Called with the height (px) the sheet rests at: on mount, on every change of `snap` and when the
parent resizes. Pad a map camera by it.
- onSnapChange: (snap: number) => void (required). Called with the snap to move to: from the handle, a drag, or Escape (back to 0). Set `snap` here.
- snap: number (required). The current snap, an index into `snaps`. Render the first (0) first and a page with no JavaScript shows it.
- snaps: readonly [BottomSheetSnap, BottomSheetSnap, ...BottomSheetSnap[]] (required). The heights it rests at, lowest first, at least two: a number from 0 to 1 is a share of the
parent's height, a `"120px"` string is pixels. A snap taller than the parent is held at its height.

### Types
- BottomSheetSnap: `number | `${number}px``. A snap height: a number from 0 to 1 is a share of the parent's height, a `"120px"` string is pixels.
