## StackedBar

Group: Data

When to use: The make-up of one whole in three or more parts: results by status, spend by group.

### The one right way
`legend` names every colour in words, with its value, under the bar.
```tsx
import { StackedBar } from "@slashsuite/ui-react";

<StackedBar
  items={[
    { label: "Changed", value: 24, tone: "warn" },
    { label: "New", value: 9, tone: "info" },
    { label: "Same", value: 163, tone: "muted" },
  ]}
  label="Screenshots by status"
  legend
/>
```

### Do
- `items` are `{ label, value, tone }` in the order to draw; `tone` is `muted`, `positive`, `warn`, `danger`, `info`, `neutral` (a grey apart from `muted`) or `accent`, and you map your own roles onto them. Five distinguishable parts are `warn`, `info`, `danger`, `neutral` and `muted`.
- Categories with no meaning (shops by kind, spend by group) take the categorical scale, `cat1` to `cat8`, from `cat1` upwards in order; good and bad take the meaning tones; never both in one chart. Each theme publishes the same eight as `--hc-cat-1` to `--hc-cat-8`, so a map pin can match its `Legend`.
- Set `legend` so every colour is named in words under the bar, with its value.
- `Legend` alone is the key for colours drawn elsewhere, such as a `TableRow` `stripe`. An item with `swatch: "dashed"` is a dashed ring with no fill, the key for an outline drawn over the chart.
- `size` is `sm`, `md` (default) or `lg`. A part with no value is zero wide.
- Two parties are a `SplitBar`; progress toward a total is a `ProgressBar`.

### Don't
Without `legend` the colours are never named, so the bar cannot be read by anyone who cannot tell them apart.
```tsx
import { StackedBar } from "@slashsuite/ui-react";

<StackedBar
  items={[
    { label: "Changed", value: 24, tone: "warn" },
    { label: "New", value: 9, tone: "info" },
    { label: "Same", value: 163, tone: "muted" },
  ]}
  label="Screenshots by status"
/>
```

The meaning tones on categories make one read as a warning and another as a failure, which they are not.
```tsx
import { StackedBar } from "@slashsuite/ui-react";

<StackedBar
  items={[
    { label: "Vintage", value: 14, tone: "warn" },
    { label: "Books", value: 9, tone: "danger" },
    { label: "Furniture", value: 7, tone: "positive" },
  ]}
  label="Shops by category"
  legend
/>
```

### Accessibility
- The bar has `role="img"` and an `aria-label` of `label` followed by every part's name and whole percent; rounded, they may not add up to exactly 100.
- A `Legend` is a list. Its swatches are hidden from assistive tech and its labels are always drawn, so colour is never the only signal.

### Props
### StackedBar
A bar of any number of parts, each sized by its share of the sum, in the order given. A part with no value is zero wide. `label` names the bar for a screen reader, which hears every part's name and whole percent (rounded, so they may not add up to exactly 100). `legend` draws a `Legend` under the bar, each part's label with its value, so the colours are named in words. While `loading` the bar is one bone (0 is a real value) and the key keeps the names it has, without their values.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: readonly StackedSegment[] (required). The parts in order, each a `label`, a `value` (its share is the value over the sum) and a `tone`.
- label: string (required). What the bar shows, for a screen reader, which hears it before every part's name and percent.
- legend: boolean (default false). Draw the key under the bar. Defaults to false.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- size: "sm" | "md" | "lg" (default md). The bar's height: `sm` 6px, `md` 8px, `lg` 12px.

### Legend
A key to the colours of a chart or a row stripe: a swatch in the `VizTone` colour (a filled dot, or a dashed ring with `swatch="dashed"`), its `label` and an optional `detail` after it. Colour alone does not say it, so the label is always drawn. `StackedBar legend` draws one under the bar from its segments. While `loading` with no `items` it draws three entries of bones.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: readonly LegendItem[] (required). One entry per colour: its `label`, its `tone`, an optional `swatch` and `detail` (a count, a share).
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.

### Types
- LegendItem: `{ label: string; tone: VizTone; swatch?: "solid" | "dashed"; detail?: string | number }`. One entry of a `Legend`: the `label` the colour stands for, its swatch, and an optional `detail` (a count, a share) after it.
- StackedSegment: `{ label: string; value: number; tone: VizTone }`. One part of a `StackedBar`: its `label`, its `value` (its share is `value` over the sum) and its colour.
- VizTone: `TextTone | "cat1" | "cat2" | "cat3" | "cat4" | "cat5" | "cat6" | "cat7" | "cat8"`. The colour of a `StackedBar` segment, a `Legend` swatch or a `TrendChart` series: the `TextTone` names, painted as a fill, or a category colour, `cat1` to `cat8`. On a chart `neutral` is a grey of its own that sits apart from `muted` (for "unmeasured" next to "same"), and `accent` is the theme's accent, apart from `info`. Categories with no meaning take `cat1` upwards in order; good and bad take the meaning tones; one chart never mixes the two.
