## SplitBar

Group: Data

When to use: Two sides of one total: a pot split between two goals, for and against.

### The one right way
Give `names` so a screen reader hears whose share is whose, and draw the names under the bar for everyone else.
```tsx
import { Caption, Cluster, SplitBar, Stack } from "@slashsuite/ui-react";

<Stack gap="xs">
  <SplitBar a={35} b={65} label="Pot split" names={["Debt", "Renos"]} />
  <Cluster justify="between">
    <Caption as="span">Debt 35%</Caption>
    <Caption as="span">Renos 65%</Caption>
  </Cluster>
</Stack>
```

### Do
- `a` is the left party and `b` the right; each is sized by its share of `a + b`.
- Give `names` as `[left, right]`, and draw the same names under the bar yourself; the bar draws no text.
- `toneA` defaults to `danger` and `toneB` to `positive`. Set both when neither side is good or bad, e.g. `accent` and `warn`. `size` is `sm`, `md` (default) or `lg`.
- More than two parts are a `StackedBar`; progress toward a total is a `ProgressBar`.

### Don't
No `names` and nothing under the bar: the two colours are never explained, and a screen reader hears two bare percentages.
```tsx
import { SplitBar } from "@slashsuite/ui-react";

<SplitBar a={35} b={65} label="Pot split" />

```

### Accessibility
- A SplitBar has `role="img"` and an `aria-label` of `label` followed by each side's whole percent.
- With `names` it hears each name before its percent; without, only two bare percentages.
- Colour alone does not name the parties, so draw their names under the bar.

### Props
### SplitBar
A bar split between two parties, `a` on the left and `b` on the right, each sized by its share of `a + b`. `label` names the split for a screen reader, which hears both percentages; give `names` (left, right) so it hears whose is whose. Put the parties' names under the bar yourself. While `loading` it is one bone the bar's size, since 0 is a real value.
- a: number (required). The left party's amount; its share is `a` over `a + b`.
- b: number (required). The right party's amount; its share is `b` over `a + b`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). What the split is, for a screen reader, which hears it before both percentages.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- names: readonly [string, string]. The left and right parties, spoken before their percentages.
- size: "sm" | "md" | "lg" (default md). The bar's height: `sm` 6px, `md` 8px, `lg` 12px.
- toneA: "positive" | "warn" | "danger" | "accent" (default danger). The left part's colour, by what it means (`accent`, `positive`, `warn` or `danger`). Defaults to "danger".
- toneB: "positive" | "warn" | "danger" | "accent" (default positive). The right part's colour, by what it means (`accent`, `positive`, `warn` or `danger`). Defaults to "positive".
