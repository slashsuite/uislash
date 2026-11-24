## Badge

Group: Content

When to use: A count of unread or pending things that sits on an icon button.

### Use instead
- Pill (pill.md): The label is words, such as a status.

### The one right way
`count` on an `IconButton` pins the count to the corner and adds it to the button's name ("Alerts, 3").
```tsx
import { IconButton } from "@slashsuite/ui-react";

<IconButton label="Alerts" count={3} icon="bell" />

```

### Do
- On an icon, give the `IconButton` a `count`; it pins the Badge to the corner and puts the count in the button's name.
- A `count` above 99 reads `99+`.
- Show a Badge only when there is something to count: a `count` of 0 still draws a `0`, so leave it out instead.
- A tinted label with words in it is a `Pill`, not a Badge.

### Don't
A Pill beside the button is not pinned to it and a screen reader never hears it as part of the button. Use `count`.
```tsx
import { Cluster, IconButton, Pill } from "@slashsuite/ui-react";

<Cluster>
  <IconButton label="Alerts" icon="bell" />
  <Pill tone="danger" round>
    3
  </Pill>
</Cluster>
```

A count is not a `Pill`: a Pill is a status label, and it prints `120` where a Badge caps at `99+`.
```tsx
import { Cluster, Pill } from "@slashsuite/ui-react";

<Cluster>
  <Pill>7</Pill>
  <Pill>120</Pill>
</Cluster>
```

### Accessibility
- A Badge is a `<span>` with the number as its text.
- Inside an `IconButton`, the Badge is `aria-hidden` and the count is part of the button's `aria-label` and `title` ("Alerts, 3"), so it is announced once.
- `corner` pins the Badge to its nearest positioned parent; `IconButton` already provides one.

### Props
### Badge
A small red count, 10px, for sitting on an icon. An icon with a count is an `IconButton` with its `count`, which pins the Badge to its corner and puts the count in the button's name. A count above 99 reads `99+`. While `loading` it is a bone of its size: a count is a number, so 0 is a value and not a gap.
- corner: boolean (default false). Pin it to the top corner at the end edge of its `relative` parent, over the icon.
- count: number (required). The number shown; above 99 it reads `99+`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
