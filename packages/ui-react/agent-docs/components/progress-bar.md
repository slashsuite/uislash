## ProgressBar

Group: Data

When to use: How far something has got toward a whole: money saved, steps done.

### The one right way
Say in words how far along it is, beside the bar. The bar shows the share and the words give the figures.
```tsx
import { Caption, Cluster, ProgressBar, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Cluster justify="between">
    <Text as="span">Kitchen funded</Text>
    <Caption as="span">R 45 000 of R 75 000</Caption>
  </Cluster>
  <ProgressBar value={45000} max={75000} label="Kitchen funded" />
</Stack>
```

### Do
- `value` is on the scale of `max`, which is 100 unless you pass one: three of twelve is `value={3} max={12}`. A fraction such as `0.25` is read as a quarter of one percent. A value past `max` is held at full.
- `label` is required and names what the bar measures.
- Say the figures in words beside the bar; the bar draws none.
- `tone` is `accent`, `positive`, `warn` or `danger`; `size` is `sm`, `md` (default) or `lg`.
- A share between two parties is a `SplitBar`; the parts of one whole are a `StackedBar`.

### Don't
A bare bar: nobody can tell what it measures or how much it holds.
```tsx
import { ProgressBar } from "@slashsuite/ui-react";

<ProgressBar value={60} label="Kitchen funded" />

```

A fraction such as `0.25` is read as a quarter of one percent, not a quarter of the bar.
```tsx
import { ProgressBar } from "@slashsuite/ui-react";

<ProgressBar value={0.25} label="Months saved" />

```

### Accessibility
- A ProgressBar has `role="progressbar"`, `aria-label` set to `label`, and `aria-valuemin`, `aria-valuemax` and `aria-valuenow` on a 0 to 100 scale.
- The announced percent is whole, and is never 0 or 100 unless the value truly is.
- The bar draws no text, so the words beside it carry the figures for everyone.

### Props
### ProgressBar
A thin horizontal bar with a filled share, for progress toward a total. `value` is held between 0 and `max`. `label` names what it measures, for a screen reader, which also hears the percentage. While `loading` it is one bone the bar's size, since 0 is a real value.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). What the bar measures, for a screen reader, which also hears the percentage.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- max: number (default 100). The value that fills the bar; `value` is drawn as its share of this. Defaults to 100.
- size: "sm" | "md" | "lg" (default md). The bar's height: `sm` 6px, `md` 8px, `lg` 12px.
- tone: "positive" | "warn" | "danger" | "accent" (default accent). What the progress means: `accent` (the default) plain progress, `positive` done or on track,
`warn` at risk, `danger` over a limit or failed.
- value: number (required). How far along, held between 0 and `max`.

### Types
- BarSize: `"sm" | "md" | "lg"`. 6px, 8px or 12px tall.
- BarTone: `"positive" | "warn" | "danger" | "accent"`. The colour of a bar's fill.
