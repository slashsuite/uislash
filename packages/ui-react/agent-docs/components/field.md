## Field

Group: Forms

When to use: Every text, select or file control: it gets a label, visible unless its purpose is plain from what surrounds it.

### The one right way
Every control sits in a `Field`, with no `htmlFor` and no `id`: the Field ties its label and hint to the control itself.
```tsx
import { Field, Input } from "@slashsuite/ui-react";

<Field label="Display name" hint="Shown on your reviews.">
  <Input />
</Field>
```

### Do
- Wrap every `Input`, `Textarea` and `Select` in a `Field`, with no `htmlFor` and no `id` on the control: the `Field` links its label, hint and error to the control itself, and the `label` is always in the accessibility tree. Pass `htmlFor` only when something else must name the control by a fixed id.
- `labelHidden` draws no label text but keeps it for assistive tech: use it only when the control's purpose is plain from what surrounds it (a search box in a toolbar). Otherwise leave the label visible; a placeholder is not a label. With `layout="row"` it draws as a column.
- A `hint` is the one line of help under the control.
- A validation message is `error`, not `hint`: it replaces the hint, in red.
- Inside a `FormGrid` a `Field` takes one column; `span="full"` runs it across both.
- A `Checkbox`, a `Switch`, a `RadioGroup` and a `DateField` draw their own `label` and note (a `hint`, or an `error` in its place); do not wrap them in a `Field`. A group of them is a `Fieldset`.
- `layout="row"` puts the label beside the control, for a compact setting or a drawer row: the hint or error sits under the control, and stacked rows line their controls up.

### Don't
A placeholder is not a label: it vanishes as soon as the person types, and it names nothing for a screen reader.
```tsx
import { Input } from "@slashsuite/ui-react";

<Input placeholder="Display name" />

```

An error passed as the `hint` looks like help text: it is grey and is not announced.
```tsx
import { Field, Input } from "@slashsuite/ui-react";

<Field label="Display name" hint="Pick a shorter name.">
  <Input defaultValue="A very long display name indeed" />
</Field>
```

### Accessibility
- The label is a real `<label>` tied to the control, so clicking the text focuses the control and a screen reader reads it as the control's name.
- An `error` is a `<p role="alert">`, so it is announced when it appears. The hint is plain text.
- The control is described by the hint, or by the error when there is one, through `aria-describedby`, so a screen reader on the control hears it after the alert has gone by.
- An `error` marks the control `aria-invalid` and turns its edge red.

### Props
### Field
A label above a control, with a hint or an error line under it. An error replaces the hint. Inside a `FormGrid`, `span="full"` runs the field across both columns. The `Input`, `Select`, `Textarea` or `FileDrop` inside takes the label, the note (`aria-describedby`) and, with an error, `aria-invalid` and a red edge by itself: give it no `id` and the Field no `htmlFor`. While `loading` the label is drawn and the control is a bone of its height, read from the density around it (`sm` in a `sm` card or table).
- error: ReactNode. Replaces the hint when set.
- hint: ReactNode. A muted line under the control that says more.
- htmlFor: string. A fixed id for the control inside, only when something else must name it. Unset, the Field makes one.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The text above the control.
- labelHidden: boolean (default false). Keeps the `label` in the page for assistive tech and draws no text, for a control whose purpose
is plain from what surrounds it (a search box in a toolbar). `label` stays required, so the
control always has a name. With `layout="row"` the field draws as a column: an empty label
column helps nobody.
- layout: "row" | "column" (default column). `row` puts the label beside the control, for a compact setting or a drawer row; the hint or
error sits under the control. Every row label takes the same fixed column, so stacked rows line
their controls up; a long label wraps inside it. `column` puts the label above it.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- span: "full". `full` spans every column of a `FormGrid`; unset takes one. It does nothing outside a `FormGrid`.
