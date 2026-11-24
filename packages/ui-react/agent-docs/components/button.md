## Button

Group: Actions

When to use: An action that changes something in place: save, cancel, delete, retry.

### Use instead
- Fieldset (fieldset.md): Toggles that filter a list: a `Fieldset` round a `ButtonGroup` of pressed `Button`s, one per facet.
- TextLink (text-link.md): The link is a destination in running text.

### The one right way
One primary action per view: the quieter variants carry the rest.
```tsx
import { Button, ButtonGroup } from "@slashsuite/ui-react";

<ButtonGroup>
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</ButtonGroup>
```

### Do
- Put one primary Button in a view. The other actions use `variant="outline"`, `"ghost"` or `"link"`; `variant="dashed"` is the full-width "add another" row at the foot of a list.
- Group the actions in a `ButtonGroup`, so the row spaces and wraps the same everywhere; `end` pushes one item, such as a Back link, to the far side, and `label` names the group.
- Say why a button cannot be pressed with `disabledReason`; use `busy` while the work is in flight.
- Going to another page is a `Button` with `href`: a real `<a>` with the same look, drawn by the app's router link through `LinkProvider`.
- A destructive action is `tone="danger"`, an accept is `tone="positive"`; `size="sm"` is for a button inside a row or a card header, `size="lg"` for the one action of a hero or a sign-in form.
- `pressed` makes a toggle. `busy` disables it while the work is in flight, and `busy="Saving"` also shows that label: one prop, `busy={saving && "Saving"}`.
- An icon-only action is an `IconButton`, not a Button holding a glyph.
- `variant="link"` is only for a `<button>`, an action, that sits in running text. A destination in text is a `TextLink`, and one that must look like a button is a `Button` with `href`.

### Don't
Two primaries compete for the eye, and nobody can tell which action the view is about.
```tsx
import { Button, ButtonGroup } from "@slashsuite/ui-react";

<ButtonGroup>
  <Button>Save</Button>
  <Button>Save and close</Button>
</ButtonGroup>
```

A bare `disabled` leaves the user guessing why nothing happens.
```tsx
import { Button } from "@slashsuite/ui-react";

<Button disabled>Save</Button>

```

A button that sets `location` loses middle-click, the status-bar URL and crawlability.
```tsx
import { Button } from "@slashsuite/ui-react";

<Button variant="outline" onClick={() => location.assign("#quotes")}>
  Open quotes
</Button>
```

A delete in the primary look reads as the safe, expected action; the tone is what warns.
```tsx
import { Button, ButtonGroup } from "@slashsuite/ui-react";

<ButtonGroup>
  <Button>Delete quote</Button>
  <Button variant="outline">Cancel</Button>
</ButtonGroup>
```

Buttons loose in a div have no gap, do not wrap as one row, and the group has no name.
```tsx
import { Button } from "@slashsuite/ui-react";

<div>
  <Button>Save</Button>
  <Button variant="outline">Preview</Button>
  <Button href="#quotes" variant="ghost">
    Back
  </Button>
</div>
```

### Accessibility
- A Button is a native `<button>` and defaults to `type="button"`, so it never submits a form by accident.
- `disabledReason` blocks the button with `aria-disabled` and keeps it in the tab order, so a keyboard reaches it; a click, Enter and Space do nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as the button's description. In a browser without CSS anchor positioning the reason is its native `title`.
- `busy` sets `aria-busy` and disables the button until the work is done.
- Every Button has a focus ring from the component, so the keyboard focus is always visible.
- The `count` chip is part of the button's name: `Splits, 3` (a `count` of 0 is shown as `Splits, 0`). Pass `aria-expanded` on a button that opens something, so a screen reader hears whether it is open.

### Props
### Button
A button in the primary, outline, ghost, link or dashed style (the link has no box: text with an underline on hover, for an in-line action; `dashed` is the full-width "add" row, a dashed outline with muted text that fills its container). `icon` puts an `Icon` before the label. `size="sm"` is compact and `size="lg"` larger, `size={{ base: "md", md: "lg" }}` changes at 48rem, and with no `size` it takes its container's; `tone="positive"` is green and `tone="danger"` is red; `pressed` makes it a toggle: neutral when off, the tone's fill when on. `count` puts a small number chip after the label; the chip is part of the name, and a button that opens something also takes `aria-expanded`. Defaults to `type="button"`. `disabledReason` and `busy` are the two disabled states that say more than a plain `disabled`, which keeps its half-opacity look; `busy="Saving"` also swaps the label. `ref` reaches the `<button>` or the `<a>`. `href` makes it a link instead, with the same look (the app's router link through `LinkProvider` for an in-app path, else a plain `<a>`; `external` opens a new tab).
- busy: string | boolean. The work is in flight: disabled, `aria-busy`, keeps its colour. Wins over `disabledReason`. A
string is also the label while busy, in place of the children: `busy={saving && "Saving"}`.
- count: number. A small number in a chip after the label: how many are behind the button (the splits a row
has, the comments on a thread). It is part of the button's name, "Splits, 3", and `0` is
shown. For a button that opens something, also pass `aria-expanded`.

Pass `aria-controls` for what it opens too; the caller owns that state.
- disabled: boolean (native). Disables the button; say why with `disabledReason` instead where there is a reason.
- disabledReason: string. Why the button cannot be pressed: greys it flat and blocks it (`aria-disabled`, its click,
Enter and Space do nothing) while it stays in the tab order, and shows the reason as its
tooltip on hover, keyboard focus and a tap, read out as its description.
- external: boolean. Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- href: string. Makes the button a link to this URL; an in-app path goes through the app's `LinkProvider`.
- icon: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase". An icon from the `Icon` set before the label, decorative, at the button's size.
- pressed: boolean. A toggle: sets `aria-pressed`. On `outline` and `ghost`, `false` draws the neutral off look
and `true` the tone's primary fill, so a row of filter chips shows the selected one plainly.
Left out, the button is not a toggle, has no `aria-pressed` and keeps its variant's look.
- ref: ((instance: HTMLButtonElement | null) => void | (() => VoidOrUndefinedOnly)) | RefObject<HTMLButtonElement | null> | ((instance: HTMLAnchorElement | null) => void | (() => VoidOrUndefinedOnly)) | RefObject<...> | null. Reaches the `<button>`, or the `<a>` of a link button, to focus it or measure it.
- size: Size | ResponsiveSize (default md). `sm` is compact, for table rows and toolbars; `lg` is larger, for a hero call to action. Left
out, a Button takes the size of the `Card`, `ListRow` or `Table` it sits in, else `md`.
`{ base: "md", md: "lg" }` changes size at the `md` breakpoint (48rem), in CSS: `md` on a phone,
`lg` from 48rem up.

The first load paints the right size. Give every control in the row the same value, so it stays
aligned.
- tone: "neutral" | "positive" | "danger" (default neutral). `positive` is green, for accept and approve; `danger` is red, for delete and clear. Not for
`dashed`, which has the one look.
- type: string (native). `"button"` by default; `"submit"` submits the form the button is in.
- variant: "link" | "primary" | "outline" | "ghost" | "dashed" (default primary). `primary` is filled, for the one main action; `outline` and `ghost` are quieter; `link` is
text with an underline on hover; `dashed` is an "add another" row that fills its container.

### ButtonGroup
A wrapping row of buttons with one optional item pushed to the far end (a Back link, say). On a narrow viewport the row wraps and `end` stays at the end of the last line. `label` makes it a named `role="group"`. Directly in a `Card` footer it spans the footer, so `end` reaches the far edge.
- end: ReactNode. One item, pushed to the end of the row.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string. The accessible name of the group: sets `role="group"` and `aria-label`.

### Types
- ButtonSize: `"sm" | "md" | "lg"`. A Button's height and text, on the library's one `Size` scale.
- ButtonTone: `"neutral" | "positive" | "danger"`. A Button's tones: `neutral` (the accent fill, the default), `positive` and `danger`.
- ButtonVariant: `"primary" | "outline" | "ghost" | "link" | "dashed"`. A Button's look: `primary` the one main action, `outline` and `ghost` the others, `link` text in running text, `dashed` the add-another row.
- ResponsiveSize: `{ base: Size; md: Size }`. A size that changes with the screen: `base` at every width, `md` from Tailwind's `md` breakpoint (48rem) up. Done in CSS, so a server-rendered page paints the right size on its first load.
- Size: `"sm" | "md" | "lg"`. The one size scale of the library: `sm`, `md` and `lg`, with `md` the default. This is the one list of where it goes further and where the default is not `md`; the README and the docs point here rather than count them again. Past `sm`, `md` and `lg`, only where there is a real use, and no scale skips `md`: - `Avatar` and `AvatarStack` `size`: also `xs`, `xl`, `2xl` and `3xl`. - The gap scale (`Stack`, `Section` and `ProseLayout` `gap`): also `xs` and `xl`. - `Cluster` and `ScrollStrip` `gap`: `xs`, `sm` and `md`, the first steps of the gap scale. - `Icon` `size`: also `feature`, the mark of a feature card. - `Dialog` `width`: also `full`, the whole screen. `ChatThread` `height`: also `fill`, its parent's. Defaults that are not `md`: - `Table` `size` is `sm`, its row padding, and the buttons and pills in a table take that size; a field keeps `md`. - `Cluster` and `ScrollStrip` `gap` are `sm`: the items of a row sit closer than the blocks of a column. - `Stack` and `Section` `gap` are `xs` inside a `Card`, `Dialog`, `Drawer`, `BottomSheet`, `Callout` or `ListRow`. - A `Pill`, `Button` or `IconButton` with no `size` takes the size of the `Card`, `ListRow` or `Table` it sits in; an `EmptyState` takes its slot's. A responsive size, `{ base, md }` (`ResponsiveSize`), changes at Tailwind's `md` breakpoint (48rem) in CSS, with no script: `Button`, `IconButton`, `SegmentedControl` and `Icon` take it. With no `size` at all, because they take the size of the text or the control they sit on: `Callout`, `CopyButton`, `Kbd`, `Badge` and `Breadcrumbs`.
