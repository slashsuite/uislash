## Switch

Group: Forms

When to use: A setting that acts the moment it is flipped, usually by saving it to a server: a flag per environment, notifications on or off.

### The one right way
A Switch takes a `label`: the whole label is the click target, and it names the switch.
```tsx
import { useState } from "react";
import { Switch } from "@slashsuite/ui-react";

function Example() {
  const [checked, setChecked] = useState(true);
  return <Switch label="Live in staging" checked={checked} onChange={setChecked} />;
}
```

### Do
- Control it: you own `checked`, and `onChange` gets the next value. There is no uncontrolled mode.
- Give a `Switch` a `label`; the whole label is the click target. In a table cell leave the `label` out, use `size="sm"` and name it with `aria-label`: one of the two is required.
- Keep `checked` as it was while the change saves and pass `busy`: a click or a key does nothing, and it keeps its colour and its focus. Flip `checked` when the save lands.
- A `hint` is a muted line under the label for a setting that needs a sentence, and an `error` replaces it in red; the switch sits on the label's first line.
- `size` is `sm`, `md` (default) or `lg`, the same scale as a `Checkbox`.
- Say why it cannot flip with `disabledReason`.
- A value sent with a form, ticked and then submitted, is a `Checkbox`. One of several is a `RadioGroup`, a `Select` or a `SegmentedControl`.

### Don't
- Do not wrap a `Switch` in a `Field`; it is its own label.

Words beside the switch, not in it, name nothing: clicking the words does nothing.
```tsx
import { useState } from "react";
import { Cluster, Switch, Text } from "@slashsuite/ui-react";

function Example() {
  const [checked, setChecked] = useState(true);
  return (
    <Cluster gap="sm">
      <Switch aria-label="Live in staging" checked={checked} onChange={setChecked} />
      <Text>Live in staging</Text>
    </Cluster>
  );
}
```

A bare `disabled` switch drops out of the tab order and never says why.
```tsx
import { Switch } from "@slashsuite/ui-react";

<Switch label="Live in production" checked={false} onChange={() => undefined} disabled />
```

### Accessibility
- A native `<button type="button" role="switch">` with `aria-checked`, inside a `<label>`, so clicking the text flips it and the label is its name. Space and Enter flip it.
- A bare switch has no name of its own: `aria-label` is required.
- `busy` sets `aria-busy` and `aria-disabled` and keeps focus on the switch; `disabled` is the native one and takes it out of the tab order.
- `disabledReason` sets `aria-disabled` and keeps the switch in the tab order; a click, Space and Enter do nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning).
- A `hint` or an `error` is the switch's `aria-describedby`, added to any you pass; an `error` is `role="alert"` and marks the switch `aria-invalid`.
- The thumb's slide stops under `prefers-reduced-motion`. The focus ring comes from the component.

### Props
### Switch
An on/off switch for a setting that takes effect at once, usually by saving it to a server: a native `<button role="switch" aria-checked>`. The caller owns `checked` and flips it in `onChange`, or gives `defaultChecked` and the switch keeps its own state. A value sent with a form is a `Checkbox`, not a Switch. Give it a `label` (the whole label is the click target), or in a table cell leave the label out and name it with `aria-label`. `hint` is a muted line under the label; `error` replaces it with a red line (`role="alert"`) and makes the switch `aria-invalid`. The note is the switch's `aria-describedby`. `size` is `sm`, `md` (the default) or `lg`. `busy` is for the save in flight: clicks and keys do nothing, and the switch keeps its colour and its focus. `disabledReason` blocks it, focusable, with the reason as its tooltip. `disabled` is the native one, washed out. While `loading` the label is drawn and the track is a bone of its size.
- busy: boolean. The change is being saved: `aria-busy`, and a click or a key does nothing. It keeps its colour
and its focus, which a native `disabled` would lose when the save starts.
- checked: boolean. Whether it is on, when the caller owns it (with `onChange`).
- defaultChecked: boolean. Whether it starts on, when the switch keeps its own state.
- disabledReason: string. Why the switch cannot be flipped: it washes out and is blocked (`aria-disabled`; a click,
Enter and Space do nothing) while it keeps its focus, and the reason is its tooltip on hover,
keyboard focus and a tap, read out as its description.
- error: ReactNode. Replaces the hint with a red line (`role="alert"`) and makes the switch `aria-invalid`.
- hint: ReactNode. A muted line under the label that says more. It is the switch's `aria-describedby`.
- label: NonNullable<ReactNode>. The text beside the switch; the whole label is a click target.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- onChange: ((checked: boolean) => void). Called with the next value when the person flips it. Not called while `busy`.
- size: "sm" | "md" | "lg" (default md). The label's text size and the switch with it.
