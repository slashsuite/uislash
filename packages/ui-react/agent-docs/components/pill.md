## Pill

Group: Content

When to use: A short word that says what state or kind something is: paid, draft, flaky.

### Use instead
- Badge (badge.md): A count sits on an icon.

### The one right way
The tone carries the meaning: `positive` for done, `warn` for waiting, `danger` for failed, and no tone for a draft.
```tsx
import { Cluster, Pill } from "@slashsuite/ui-react";

<Cluster>
  <Pill tone="positive" dot>
    Paid
  </Pill>
  <Pill tone="warn" dot>
    Due
  </Pill>
  <Pill tone="danger" dot>
    Overdue
  </Pill>
  <Pill dot>Draft</Pill>
</Cluster>
```

### Do
- Choose `tone` by meaning: `positive` for done or good, `warn` for waiting or at risk, `danger` for failed, `neutral` (the default) for a draft or no state, `info` for a note; `accent` for a kind or category that is none of those.
- `size` is `sm`, `md` (default) or `lg`; with none, a Pill takes the size of the `Card`, `ListRow` or `Table` it sits in.
- `dot` adds a leading dot in the Pill's colour; `round` swaps the rounded-square corners for a full pill shape. Use one look across a view.
- `name` makes a two-tone `name: value` pill (`<Pill name="Weight">72 kg</Pill>`): the name keeps the tone's tint and the children sit on the surface beside it. Keep the name to a word or two.
- `onRemove` adds an x button after the text, for a chip the reader can drop (an attachment, a filter); `removeLabel` names it (`Remove invoice.pdf`) and is required with it. On a link or button Pill the x is a separate button beside it, never nested inside.
- A Pill that goes somewhere takes `href` (`external` for a new tab; an in-app one goes through your router's `Link` on `LinkProvider`); one that does something takes `onClick`.
- A Pill beside a card's title is the Card's `status`, not a hand-built row.
- A message to read is a `Callout`, and an action is a `Button`.

### Don't
- Never make a row of clickable `Pill`s a filter: a filter is pressed `Button`s in a `Fieldset`.

One tone for every status says nothing: a reader cannot tell Paid from Overdue at a glance. Pick the tone by what the status means.
```tsx
import { Cluster, Pill } from "@slashsuite/ui-react";

<Cluster>
  <Pill tone="accent" dot>
    Paid
  </Pill>
  <Pill tone="accent" dot>
    Due
  </Pill>
  <Pill tone="accent" dot>
    Overdue
  </Pill>
</Cluster>
```

A Pill inside a `TextLink` is two parts doing one job, and the Pill's own hover dim and focus ring go unused. Give the Pill the `href`.
```tsx
import { Pill, TextLink } from "@slashsuite/ui-react";

<TextLink href="#flakes">
  <Pill tone="warn" round>
    3 flaky
  </Pill>
</TextLink>
```

### Accessibility
- A two-tone Pill reads "Weight: 72 kg" to a screen reader (a visually hidden colon follows the label). The x of `onRemove` is a `<button type="button">` with `removeLabel` as its `aria-label` and its tooltip, with the icon `aria-hidden`.
- A plain Pill is a `<span>`; the dot is `aria-hidden`. The tone is colour only, so the text must say the status itself.
- With `href` it is a link and with `onClick` a `<button type="button">`; both dim on hover and show the focus ring.
- `external` adds `target="_blank"` and `rel="noreferrer"`.

### Props
### Pill
A small tinted label whose `tone` says what it means; `dot` adds a leading dot in the pill's own text colour, `round` swaps the rounded-md corners for a full pill shape, and `size` steps the text (with none, it takes its container's). `name` makes it two-tone, `name: value`: the name keeps the tone's tint and the children, the value, sit on the surface beside it. `href` makes it a link (the app's router link through `LinkProvider` for an in-app path, else a plain `<a>`; `external` opens a new tab) and `onClick` makes it a button, each with a hover dim and the focus ring. `onRemove` adds an x button after the text (named by `removeLabel`), a separate button beside a link or button pill rather than nested in it. `title` is its tooltip and description; a plain pill with one takes a tab stop. While `loading` with no text yet it is a bone of its size.
- children: ReactNode. The pill's text; while `loading`, none yet draws the pill as a bone of its size.
- dot: boolean. A leading dot in the pill's own text colour.
- external: boolean. Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- href: string. Makes the pill a link to this URL; an in-app path goes through the app's `LinkProvider`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- name: string. The name half of a two-tone `name: value` pill: `children` is the value. The name keeps the
tone's tint and the value sits on a plain surface beside it, in a hairline border. Keep the
name to a word or two (`Weight`, `Sleep`).
- onClick: MouseEventHandler<HTMLButtonElement>. A Pill that is a button: runs `onClick`. Defaults to `type="button"`.
- onRemove: (() => void). Adds a small x button after the text that calls this: for a chip the reader can drop (an attachment, a filter). It sits beside a link or button pill, never inside it.
- removeLabel: string. The x button's accessible name and tooltip: `Remove invoice.pdf`. Required with `onRemove`.
- round: boolean. A full pill shape in place of the rounded-md corners.
- size: "sm" | "md" | "lg" (default the container's, else md). `sm` is smaller text, for a dense row; `lg` larger, beside a heading. Left out, a Pill takes
the size of the `Card`, `ListRow` or `Table` it sits in, else `md`.
- title: string. The detail behind a pill whose text is short or cut off (the full status, a date): its tooltip
on hover, keyboard focus and a tap, and its description. A plain pill with a title is focusable.

Keep anything a reader needs on the pill itself.
- tone: "neutral" | "info" | "positive" | "warn" | "danger" | "accent" (default neutral). What the pill means: `neutral`, `info`, `positive`, `warn` or `danger`, or `accent` for a
category that is none of those.

### Types
- PillTone: `Tone | "accent"`. A Pill's tones: the five meanings, and `accent` for a category that is none of them.
