## RadioGroup

Group: Forms

When to use: A setting or answer with two to five options the person should see side by side: a visibility, a delivery method, a type.

### The one right way
One of a few options, all visible, is a `RadioGroup`: the group has a name and each option its label.
```tsx
import { Radio, RadioGroup } from "@slashsuite/ui-react";

<RadioGroup label="Shop type" defaultValue="vintage">
  <Radio value="vintage" label="Vintage" />
  <Radio value="books" label="Books" />
</RadioGroup>
```

### Do
- Give the `RadioGroup` a `label` that names the question, and a `Radio` per option with its own `label` and a `value`.
- Keep the choice with `defaultValue`, or control it with `value` and `onChange(value)`. `name` posts it in a form.
- A `hint` on a `Radio` is a muted line under its label, for the option that needs a sentence; a `hint` on the group is a line under the group's label.
- An `error` on the group is a red line under the options and marks every circle red; it is the same wording rule as `Field`'s. The group draws its own label and error, so it is never put in a `Field`.
- `disabled` on the group disables every option; on a `Radio` it disables that one. Say why in the group's `hint`.
- `required` marks a choice the form cannot submit without; the group is `aria-required`.
- `size` (`sm`, `md` the default, `lg`) sets every circle and label, to match the `Input`s around it.
- More than five options, or a list that grows, is a `Select`. Several ticks are `Checkbox`es. Switching a view in place is a `SegmentedControl`.

### Don't
Checkboxes allow several ticks: they cannot say "one of these", and the screen reader hears no group.
```tsx
import { Checkbox, Stack } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Checkbox label="Vintage" defaultChecked />
  <Checkbox label="Books" />
</Stack>
```

### Accessibility
- The group is a `role="radiogroup"` named by its label; each `Radio` is a native `<input type="radio">` inside its `<label>`, so clicking the words chooses it.
- The group is one tab stop. The arrow keys move between the options and choose, wrapping at each end and skipping a disabled one.
- An `error` is a `role="alert"` line and the group is `aria-invalid`; a `hint` is the option's `aria-describedby`.
- The focus ring is drawn round the option that has focus, by the component.

### Props
### RadioGroup
A named group of radios, one chosen. The `label` names the group; `hint` is a muted line under the options that says more (the group's description); an `error` replaces it with a red line (`role="alert"`) and marks the group invalid. Give it `value` and `onChange`, or `defaultValue` and let it keep the choice. `name` posts the choice in a form. The arrow keys move between the radios and choose, and the group is one tab stop. `size` sizes every radio in the group, the same scale as a `Checkbox`. While `loading` the labels are drawn and each circle is a bone.
- children: ReactNode (required). The `Radio`s.
- defaultValue: string. The `value` chosen to begin with, when the group keeps its own choice.
- disabled: boolean. Disables every radio.
- error: ReactNode. Shown under the options in red with `role="alert"`; marks the group invalid. Like `Field`'s `error`.
- hint: ReactNode. A muted line under the options that says more; it describes the group. Replaced by `error`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The group's visible name, above the options.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- name: string. The form field the choice posts under.
- onChange: (value: string) => void. Called with the chosen radio's `value`.
- required: boolean. Marks the choice required: the group is `aria-required`, and a form will not submit with no option chosen.
- size: "sm" | "md" | "lg" (default md). The size of every radio in the group: `sm` is `text-xs` and a smaller circle, `lg` `text-base`
and a larger one.
- value: string. The `value` of the chosen radio.

### Radio
One option of a `RadioGroup`: a `label` and, under it, an optional `hint`. Click the label or the circle. While `loading` the circle is a bone.
- disabled: boolean. Disables this radio alone.
- hint: ReactNode. A muted line under the label that says more. It is the radio's `aria-describedby`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode (required). The text beside the circle.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- value: string (required). What the group's `value` becomes when this one is chosen.
