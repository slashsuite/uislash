## TrendChart

Group: Data

When to use: A figure over ordered time buckets: weekly counts, a trend.

### The one right way
Bars for a count in each week: each bucket stands on its own.
```tsx
import { TrendChart } from "@slashsuite/ui-react";

<TrendChart
  label="Tickets closed per week"
  buckets={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]}
  series={[{ label: "Closed", tone: "info", values: [4, 7, 3, 9, 12, 8, 6, 11] }]}
/>
```

### Do
- `buckets` are the x-axis labels in order (`W12`, `Mar`); each series' `values` has one value per bucket, in the same order. `label` names the chart.
- `series` is one or two `{ label, tone, values }`, never more; `tone` is a `VizTone`: a meaning tone, or `cat1` upwards for series that are only categories, never both in one chart. Two series draw a `Legend` under the chart; one is named by `label`.
- `kind` is `bar` (default) for a count in each bucket, or `line` for a level over time.
- Values are counts or amounts from 0 up. A negative value is drawn as 0. A missing value, a `null` or a `values` list shorter than `buckets`, draws nothing for that bucket: no bar, and the line breaks there. Values past the last bucket are ignored.
- The y-axis runs from 0 to a rounded maximum (2, 4 or 10 times a power of ten) and is labelled at 0, half and the top. With more than 8 buckets, every k-th x label is drawn, starting with the first.
- A trend inside a `StatTile` is its `trend` prop, not a chart.

### Don't
- Do not draw a line through categories that have no order.

A line joins buckets that have an order. Through categories it draws a trend that does not exist.
```tsx
import { TrendChart } from "@slashsuite/ui-react";

<TrendChart
  label="Tickets by area"
  kind="line"
  buckets={["Web", "CLI", "Docs", "Infra", "Design", "Mobile"]}
  series={[{ label: "Tickets", tone: "info", values: [14, 6, 11, 3, 9, 5] }]}
/>
```

### Accessibility
- The chart is a `figure` named by `label`. The plot and its axis labels are hidden from assistive tech.
- A visually hidden table carries every figure: `label` as its caption, a column per series and a row per bucket, with an empty cell for a missing value.
- Two series are named by a `Legend`, so colour is never the only way to tell them apart.

### Props
### TrendChart
A chart of one or two series over ordered buckets (weeks, months), as bars or a line, on a y-axis from 0. The y-axis is labelled 0, half and a rounded maximum; the x-axis names the buckets. A screen reader gets the same figures as a table. While `loading` the frame, the bucket names and the key stay drawn and the plot is one bone, since 0 is a real value.
- buckets: readonly string[] (required). The x-axis labels, in order (`"W12"`, `"Mar"`).
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- kind: "line" | "bar" (default bar). `bar` for a count in each bucket, `line` for a level over time.
- label: string (required). What the chart shows: its accessible name and the caption of its table.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- series: readonly [TrendSeries] | readonly [TrendSeries, TrendSeries] (required). One or two series, each `{ label, tone, values }`. A `null` value, or a `values` list shorter
than `buckets`, is missing. Two series draw a Legend under the chart.

### Types
- TrendSeries: `{ label: string; tone: VizTone; values: readonly (number | null)[] }`. One series of a `TrendChart`: its `label` (the table's column, the Legend's entry), its colour, and one value per bucket in the buckets' order. A `null`, or a list shorter than the buckets, is a missing value.
