## FormRow

Group: Forms

When to use: `FormGrid` lays Fields out in two columns; `FormRow` puts several controls and a save button on one line.

### Use instead
- FormLayout (form-layout.md): The whole page is one form, with Save and Cancel at its end.
- Stack (stack.md): The fields run one under another in a `Card`: a `Stack as="form"` of `Field`s.

### The one right way
A row of controls with proportional widths, `actions` after them, and one `hint` under the whole row.
```tsx
import { Button, FormRow, FormRowField, Input } from "@slashsuite/ui-react";

<FormRow hint="Press Save to apply the change." actions={<Button>Save</Button>}>
  <FormRowField label="Description" htmlFor="do-row-desc" span={3}>
    <Input id="do-row-desc" defaultValue="Kitchen renovation" />
  </FormRowField>
  <FormRowField label="Amount" htmlFor="do-row-amount">
    <Input id="do-row-amount" defaultValue="12,400.00" numeric />
  </FormRowField>
</FormRow>
```

### Do
- A form of several fields is a `FormGrid` of `Field`s: two columns from `md`, one below. A long control, such as a `Textarea`, takes `span="full"`.
- A line of controls to edit one record in place is a `FormRow` of `FormRowField`s, with the save `Button` as `actions`.
- `FormRowField` `span` 1 to 4 is its share of the row's width.
- The `hint` or `error` goes on the `FormRow`, once, under the whole line. A `FormRowField` has no hint or error, and a `Field` does not belong inside a `FormRow`.
- A `FormRow` inside a `FormGrid` runs across both columns.

### Don't
A `Field` with its own hint inside a `FormRow` makes its column taller, so the controls drift out of line and the save button with them.
```tsx
import { Button, Field, FormRow, Input } from "@slashsuite/ui-react";

<FormRow actions={<Button>Save</Button>}>
  <Field label="Description" htmlFor="dont-row-desc" hint="Shown on the invoice.">
    <Input id="dont-row-desc" defaultValue="Kitchen renovation" />
  </Field>
  <Field label="Amount" htmlFor="dont-row-amount">
    <Input id="dont-row-amount" defaultValue="12,400.00" numeric />
  </Field>
</FormRow>
```

Without `span="full"` a `Textarea` takes half the width and leaves a hole beside it.
```tsx
import { Field, FormGrid, Input, Textarea } from "@slashsuite/ui-react";

<FormGrid>
  <Field label="First name" htmlFor="dont-grid-first">
    <Input id="dont-grid-first" />
  </Field>
  <Field label="Last name" htmlFor="dont-grid-last">
    <Input id="dont-grid-last" />
  </Field>
  <Field label="Notes" htmlFor="dont-grid-notes">
    <Textarea id="dont-grid-notes" />
  </Field>
</FormGrid>
```

### Accessibility
- `FormRowField` renders a `<label>` tied to its control by `htmlFor`, as `Field` does.
- The row's `error` is a `<p role="alert">`.
- Under `md` the fields and the action stack in reading order.

### Props
### FormRow
An inline-edit row: several controls side by side with proportional widths (`FormRowField` `span` 1 to 4), optional `actions` after them (a save button), and one `hint` or `error` line under the whole row. Every control sits on the bottom edge, so the actions line up with them whatever the labels do. Under `md` the fields and the actions stack. The row owns the note, so the fields beside each other keep their height: a `FormRowField` has no `hint` or `error` of its own.
- actions: ReactNode. A button or two after the last field. It keeps its own width.
- error: ReactNode. Replaces the hint when set, as `Field`'s does.
- hint: ReactNode. One muted line under the whole row.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.

### FormRowField
A compact label over one control, for a `FormRow`. `span` is its share of the row (1 default). While `loading` the label is drawn and the control is a bone of its height, as in a `Field`.
- htmlFor: string (required). The id of the control inside; the label's htmlFor.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The small label above the control.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- span: 2 | 3 | 4 | 1 (default 1). The field's share of the row, 1 to 4: a `span` of 2 is twice as wide as a 1.

### FormGrid
Two columns of `Field`s from `md`, one below it. A `Field` takes one column; `span="full"` runs it across both, and a `FormRow` is always full width.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.

### Types
- FormRowSpan: `1 | 2 | 3 | 4`. Relative widths in a `FormRow`: a field of `span` 2 is twice as wide as one of `span` 1.
