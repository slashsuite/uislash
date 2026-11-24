## StatTile

Group: Data

When to use: A single number a person should see first: a total, a date, a balance.

### The one right way
Pass the value already formatted, with its unit: `R 4 250`, `Mar 2029`, `12%`.
```tsx
import { CardGrid, StatTile } from "@slashsuite/ui-react";

<CardGrid columns={2}>
  <StatTile label="Left over" value="R 4 250" hint="after all bills" />
  <StatTile label="Debt-free" value="Mar 2029" />
</CardGrid>
```

### Do
- Pass `value` already formatted, with its unit and grouping (`R 4 250`, `Mar 2029`); the tile does not format.
- `label` names the figure; `hint` is one short line under it.
- `tone` is `neutral`, `positive`, `warn` or `danger`. A tone colours the value, so give it a sign or a `hint` that says the same; `accent` adds a bar in the same tone across the top.
- Lay several tiles out in a `CardGrid`. A tile is not a button or a link.
- `trend` takes the figure over time, oldest first, and draws a small line under the value in its colour, on a scale from 0. The line is decoration, so say the trend in `hint` too (`up 12% on last month`). A chart with axes is a `TrendChart`.

### Don't
A raw number has no unit or grouping, so the tile shows a figure nobody can read at a glance.
```tsx
import { CardGrid, StatTile } from "@slashsuite/ui-react";

<CardGrid columns={2}>
  <StatTile label="Left over" value={4250.5} />
  <StatTile label="Savings" value={1250000} />
</CardGrid>
```

The same tones with no sign and no hint: red and green are the only difference, so the meaning is lost without colour.
```tsx
import { CardGrid, StatTile } from "@slashsuite/ui-react";

<CardGrid columns={2}>
  <StatTile label="Left over" value="R 4 250" tone="positive" accent />
  <StatTile label="Total interest" value="R 12 400" tone="danger" accent />
</CardGrid>
```

### Accessibility
- A StatTile is plain text in a `<div>`: the caption, the value and the hint are read in that order.
- The `accent` bar is decoration and hidden from assistive tech.
- Colour alone never carries the tone; a sign or the hint says it.

### Props
### StatTile
One headline figure: an uppercase caption over a large tabular-nums value, with an optional hint line beneath. `tone` colours the value; `accent` adds a bar across the top edge in the same tone. `trend` draws a small line under the value in the same colour. Pass the value already formatted. While `loading`, a `label` or `value` not here yet is a bone; the hint and the trend are drawn only once given.
- accent: boolean (default false). A bar across the top edge in the tone's colour.
- hint: ReactNode. A muted line under the value.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The small uppercase caption over the value.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- tone: "neutral" | "positive" | "warn" | "danger" (default neutral). What the figure means: `neutral` (the default) a plain figure, `positive` good or on track,
`warn` at risk, `danger` failed or over. Say it in the text too: colour alone says nothing to a
screen reader.
- trend: readonly number[]. The figure over time, oldest first: a sparkline under the value, in its colour, on a scale
from 0. It is decoration, so say the trend in `hint` as well.
- value: ReactNode (required). The figure, already formatted, large and in tabular figures.

### Types
- StatTileTone: `"neutral" | "positive" | "warn" | "danger"`. The colour of a tile's value (and of its accent bar): plain ink, green, amber or red.
