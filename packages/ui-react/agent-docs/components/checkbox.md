## Checkbox

Group: Forms

When to use: An on/off option the person ticks: a setting, a filter, a row to select.

### The one right way
A yes or no is a `Checkbox` with its `label`: the whole label is the click target.
```tsx
import { Checkbox } from "@slashsuite/ui-react";

<Checkbox label="Email me when a shop I follow posts" defaultChecked />

```

### Do
- Give a `Checkbox` a `label`; the whole label is the click target.
- In a table cell leave the `label` out, use `size="sm"` and name the box with `aria-label`. `size="lg"` matches a large `Input`.
- A `hint` is a muted line under the label for an option that needs a sentence, and an `error` replaces it in red. The box always sits on the label's first line.
- A setting that takes effect the moment it is flipped, usually by saving it, is a `Switch`. A `Checkbox` is ticked and then submitted with the form.
- Choosing one of several is a `RadioGroup`, a `Select` or a `SegmentedControl`, not a row of checkboxes.
- Several checkboxes for one question go in a `Fieldset`.
- Say why the box cannot change with `disabledReason`.

### Don't
- Do not wrap a `Checkbox` in a `Field`; it is its own label.

A checkbox with the words beside it, not in it, names nothing: clicking the words does nothing.
```tsx
import { Checkbox, Cluster, Text } from "@slashsuite/ui-react";

<Cluster gap="sm">
  <Checkbox />
  <Text>Email me when a shop I follow posts</Text>
</Cluster>
```

Words beside a box in a table cell crowd the row and repeat the row's own name. Leave the `label` out and name the box with `aria-label`.
```tsx
import { Checkbox } from "@slashsuite/ui-react";

<Checkbox label="Select row" />

```

A bare `disabled` box drops out of the tab order and never says why.
```tsx
import { Checkbox } from "@slashsuite/ui-react";

<Checkbox label="Email the team" disabled />

```

### Accessibility
- A native `<input type="checkbox">` inside a `<label>`, so clicking the text toggles it and the label is its name.
- A bare box has no name of its own: `aria-label` is required.
- A `hint` or an `error` is the box's `aria-describedby`, added to any you pass; an `error` is `role="alert"` and marks the box `aria-invalid`.
- `disabledReason` sets `aria-disabled` and keeps the box in the tab order; a click and Space do nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning).
- The focus ring comes from the component.

### Props
### Checkbox
A checkbox with its label. It is a real `<input type="checkbox">`, drawn by the library (an empty outlined box, then a filled accent one with a check mark) so it reads the same in every theme and browser. Every prop but the label goes on the input, and `ref` reaches it. `size="sm"` is `text-xs` and a smaller box, for a dense row; `size="lg"` is `text-base` and a larger box. Leave `label` out for a bare box in a table cell, and name it with `aria-label`. The box sits on the label's first line, so a label that wraps reads from the box. `hint` is a muted line under the label that says more, like a `Field`'s; `error` replaces it with a red line (`role="alert"`) and makes the box `aria-invalid`. The note is the box's `aria-describedby`. `onChange` gets the new checked state; take `checked` with it, or `defaultChecked` alone. While `loading` the label is drawn and the box is a bone of its size.
- disabledReason: string. Why the box cannot be changed: it dims and is blocked (`aria-disabled`; a click and Space
change nothing) while it stays in the tab order, and the reason is its tooltip on hover,
keyboard focus and a tap, read out as its description.
- error: ReactNode. Replaces the hint with a red line (`role="alert"`) and makes the box `aria-invalid`.
- hint: ReactNode. A muted line under the label that says more. It is the box's `aria-describedby`.
- label: ReactNode. The text beside the box. Leave it out for a bare box (a table cell) and name it with `aria-label`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- onChange: ((checked: boolean) => void). Called with the new checked state when the person ticks or clears the box.
- ref: Ref<HTMLInputElement>. The `<input>`, for focus control.
- size: "sm" | "md" | "lg" (default md). The label's text size and the box with it.
