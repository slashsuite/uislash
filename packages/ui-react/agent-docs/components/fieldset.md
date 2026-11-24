## Fieldset

Group: Forms

When to use: Several controls that answer one question or belong together, under one name.

### Use instead
- Tabs (tabs.md): One choice switches the panel right under the row.
- SegmentedControl (segmented-control.md): Exactly one of two to five options is on: a mode or a range.
- Button (button.md): One toggle on its own, not a named group: a `Button` with `pressed`.

### The one right way
Checkboxes for one question go in a `Fieldset`, so a screen reader hears the question on entering the group.
```tsx
import { Checkbox, Fieldset } from "@slashsuite/ui-react";

<Fieldset label="What is wrong?">
  <Checkbox label="Wrong opening hours" />
  <Checkbox label="Closed for good" />
</Fieldset>
```

### Do
- Several checkboxes answering one question: a `Fieldset` with the `Checkbox`es straight inside.
- A set of fields that belong together (opening hours, a low and high pair): a `Fieldset` round `Field`s, in a `FormGrid` for a row.
- The filter chips of one facet: a `Fieldset` round a `ButtonGroup` of `variant="outline"` `size="sm"` `Button`s with `pressed`. One `Fieldset` per facet; stack several in a `Stack`.
- The `label` names the group in the `Field` label's look. A `hint` is one muted line under the group, and an `error` replaces it in red.
- One choice of several is a `RadioGroup`, which is its own group: never put it in a `Fieldset`. One control is a `Field`, or a `Checkbox` or `Switch` on its own.

### Don't
Bold text over loose checkboxes looks like a group, but the question is not their name.
```tsx
import { Checkbox, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Text strong>What is wrong?</Text>
  <Checkbox label="Wrong opening hours" />
  <Checkbox label="Closed for good" />
</Stack>
```

Chips with no group have no name: a screen reader hears a row of buttons and not what they filter.
```tsx
import { Button, Cluster } from "@slashsuite/ui-react";

<Cluster gap="xs" wrap>
  <Button variant="outline" size="sm" pressed>
    Vintage
  </Button>
  <Button variant="outline" size="sm" pressed={false}>
    Books
  </Button>
  <Button variant="outline" size="sm" pressed={false}>
    Now
  </Button>
</Cluster>
```

A `RadioGroup` inside a `Fieldset` is two names for one question.
```tsx
import { Fieldset, Radio, RadioGroup } from "@slashsuite/ui-react";

<Fieldset label="Detection">
  <RadioGroup label="Kind" defaultValue="layout">
    <Radio value="layout" label="Layout" />
    <Radio value="colour" label="Colour" />
  </RadioGroup>
</Fieldset>
```

### Accessibility
- A `<fieldset>` named by its `<legend>`, so a screen reader announces the group's name on entering it.
- The hint, or the error in its place, is the group's `aria-describedby`; the error is a `role="alert"` line, announced when it appears.
- `disabled` on the group disables every control in it.

### Props
### Fieldset
A labelled group of controls: several `Checkbox`es answering one question, a set of `Field`s that belong together, or the filter chips of one facet (a `ButtonGroup` of `outline` `sm` pressed `Button`s). It is a `<fieldset>` named by its `label`, drawn as its `<legend>` in the `Field` label's look, over the children in one column; a `ButtonGroup` or a `FormGrid` inside lays out a row. `hint` is a muted line under the group and its `aria-describedby`; `error` replaces it in red with `role="alert"`. `disabled` disables every control inside. One choice of several is a `RadioGroup`, never inside a `Fieldset`. Other props go on the `<fieldset>`.
- children: ReactNode. `Checkbox`es, `Field`s (in a `FormGrid` for a row), or a `ButtonGroup` of chips.
- error: ReactNode. A red line under the group, in place of the hint, announced as an alert.
- hint: ReactNode. A muted line under the group.
- label: ReactNode (required). The group's name, drawn as its `<legend>`.
