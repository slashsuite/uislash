## SegmentedControl

Group: Forms

When to use: A mode or a range chosen in place: daily or weekly, split or even.

### Use instead
- Tabs (tabs.md): The choice switches the panel right under the row.
- Fieldset (fieldset.md): Several toggles can be on at once and narrow a list: pressed `Button`s in a `Fieldset`.

### The one right way
A mode or a range chosen in place: the caller owns `value`, and `label` names the group.
```tsx
import { useState } from "react";
import { SegmentedControl } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("week");
  return (
    <SegmentedControl
      label="Range"
      items={[
        { value: "day", label: "Daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
```

### Do
- Two to five short options. The caller owns `value` and `onChange`; `label` names the group.
- `size` is `sm`, `md` (default) or `lg`, the heights of a `Button`.
- `fill` when the group sits in a column (a form field): the options share its full width, so the border ends at the last option.
- An on/off setting is a `Checkbox` or a `Switch`; a long list is a `Select`.
- Switching the panel under a row of headings is `Tabs`.
- A `count` sits muted after the label.
- An option that cannot be chosen yet takes a `disabledReason` that says why; `disabled` on the group disables every option.
- Options that go to another page are links: `href` on each, drawn by the app's router link through `LinkProvider`. `value` marks the current page.

### Don't
An on/off setting is a `Checkbox`, not a two-option SegmentedControl.
```tsx
import { useState } from "react";
import { SegmentedControl } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("on");
  return (
    <SegmentedControl
      label="Email me"
      items={[
        { value: "on", label: "On" },
        { value: "off", label: "Off" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
```

A bare `disabled` option leaves the person guessing why it is greyed out.
```tsx
import { useState } from "react";
import { SegmentedControl } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("split");
  return (
    <SegmentedControl
      label="Split"
      items={[
        { value: "split", label: "Split" },
        { value: "even", label: "Even" },
        { value: "custom", label: "Custom", disabled: true },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
```

Buttons that navigate from `onChange` are not links: they cannot be opened in a new tab or copied, and the current page is not marked as one.
```tsx
import { SegmentedControl } from "@slashsuite/ui-react";

<SegmentedControl
  label="Journal"
  value="daily"
  items={[
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
  ]}
  onChange={(value) => window.location.assign(`#${value}`)}
/>
```

### Accessibility
- Buttons form a `radiogroup` named by `label`; each option is a `radio` with `aria-checked`.
- The group is one tab stop. The arrow keys (all four), Home and End move to the next enabled option and choose it.
- An option with `disabledReason` is `aria-disabled`: the arrow keys reach it and choose nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning). A `disabled` option is skipped.
- Links form a `<nav>` named by `label`, and the current one has `aria-current="page"`.
- The focus ring comes from the component.

### Props
### SegmentedControl
A joined pill group where one option is filled: a mode or a range chosen in place. `items` are `{ value, label }` buttons (`value` and `onChange` are the caller's state; the arrow keys, Home and End move the choice) or links (`href`, an in-app one drawn by the app's router `<Link>` through `LinkProvider`; `value` marks the current one, which gets `aria-current`). An item may carry a `count`, and a button one `disabledReason` (it stays reachable by the arrows and its reason is a tooltip) or a bare `disabled`; `disabled` on the group disables every option. `label` names the group. `size` matches the height of a `Button` of the same size, and `{ base, md }` changes it at 48rem. `fill` stretches the options across the group's width; `wrap` lets them wrap into full rows of a box, always or (`"narrow"`) only while the group is under 32rem wide.
- disabled: boolean. Every option is disabled, e.g. until the page has hydrated.
- fill: boolean (default false). The group takes its parent's full width and the options grow to share it, so the border ends
at the last option. Still a pill.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: Segment[] (required). The options in order: `{ value, label }` buttons, or links (`href`), the current link marked by its `selected` or by a `value` equal to the group's. Either may carry a `count`; a button may be `disabled`.
- label: string (required). The accessible name of the group.
- onChange: ((value: string) => void). Called with the option's `value` when one is chosen, by click or arrow key.
- size: Size | ResponsiveSize (default md). The control's height and text, on the scale of a `Button`. `{ base: "md", md: "lg" }` changes
size at the `md` breakpoint (48rem), in CSS.

Give it the same value as a responsive `Button` in the same row.
- value: string. The `value` of the current option; for links, an alternative to `selected` on the item.
- wrap: boolean | "narrow" (default false). The options wrap onto full rows of at most three (five are 3 then 2) in a box with rounded
corners and a line between options, instead of a pill. `"narrow"`: the box only while the group
itself is under 32rem wide (a container query, so it follows the column it sits in), and a
filled pill from 32rem up. Implies `fill`.

For five options that will not fit one row.

### Types
- Segment: `{ label: ReactNode; count?: number; title?: string; value: string; disabled?: boolean; disabledReason?: string; controls?: string } | { label: ReactNode; count?: number; title?: string; value?: string; selected?: boolean; external?: boolean; href: string }`. One option of a SegmentedControl: a button with a `value`, or a link with an `href`; never both kinds in one group.
