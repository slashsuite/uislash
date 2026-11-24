## Tabs

Group: Navigation

When to use: Tabs switch a panel on the same page. A row of links to other pages is `Tabs` with link items.

### Use instead
- SegmentedControl (segmented-control.md): One value is picked from two to five, and no panel switches under the row.
- Fieldset (fieldset.md): Toggles that can be on together narrow a list: pressed `Button`s in a `Fieldset`, one per facet.

### The one right way
`Tabs` switches a view in place; the panel it controls sits right under the row.
```tsx
import { useState } from "react";
import { Tabs, Stack, Text } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("overview");
  return (
    <Stack>
      <Tabs
        label="Project views"
        value={value}
        onChange={setValue}
        items={[
          { value: "overview", label: "Overview", controls: "panel" },
          { value: "activity", label: "Activity", controls: "panel" },
          { value: "settings", label: "Settings", controls: "panel" },
        ]}
      />
      <Text id="panel" role="tabpanel">
        Showing {value}.
      </Text>
    </Stack>
  );
}
```

### Do
- `Tabs` switches a view in place; the caller owns `value` and `onChange`, and the panel sits right under the row.
- Going to another page is link items (`href`, and `selected` on the current one): links, so the URL, the back button and a new tab all work.
- A `count` sits muted after the label and is read as part of the tab's name.
- Across, tabs are always underline, under a `PageHeader` too. `orientation="vertical"` is the pill rail, the current tab filled, for a `SidebarLayout` aside, and only the rail takes `size`.
- `size` (`sm`, `md` the default, `lg`) sets the vertical rail on the control scale, so it lines up with a `Button` of the same size; the underline row has one size.
- A tab that cannot be chosen yet takes a `disabledReason` that says why.
- Pill links with `orientation="vertical"` are the rail of a `SidebarLayout`: one link per line.

### Don't
A `SegmentedControl` that swaps the panel under it picks a value, not a view: no tab list, no panel tied to it. Switching the panel is `Tabs`.
```tsx
import { useState } from "react";
import { SegmentedControl, Stack, Text } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("overview");
  return (
    <Stack>
      <SegmentedControl
        label="Project views"
        value={value}
        onChange={setValue}
        items={[
          { value: "overview", label: "Overview" },
          { value: "activity", label: "Activity" },
          { value: "settings", label: "Settings" },
        ]}
      />
      <Text>Showing {value}.</Text>
    </Stack>
  );
}
```

A `Tabs` row that only navigates leaves the URL, the back button and a new tab behind.
```tsx
import { useState } from "react";
import { Tabs } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("quotes");
  return (
    <Tabs
      label="Sections"
      value={value}
      onChange={(next) => {
        setValue(next);
        location.assign(`#${next}`);
      }}
      items={[
        { value: "quotes", label: "Quotes" },
        { value: "invoices", label: "Invoices" },
      ]}
    />
  );
}
```

A count typed into the label is plain text: it does not mute, and it cannot be styled the same.
```tsx
import { useState } from "react";
import { Tabs } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("shots");
  return (
    <Tabs
      label="Assets"
      value={value}
      onChange={setValue}
      items={[
        { value: "shots", label: "Shots (12)" },
        { value: "clips", label: "Clips (3)" },
      ]}
    />
  );
}
```

A bare `disabled` tab is skipped by the arrows and never says why.
```tsx
import { useState } from "react";
import { Tabs } from "@slashsuite/ui-react";

function Example() {
  const [value, setValue] = useState("overview");
  return (
    <Tabs
      label="Project views"
      items={[
        { value: "overview", label: "Overview" },
        { value: "builds", label: "Builds" },
        { value: "billing", label: "Billing", disabled: true },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
```

A stack of ghost link `Button`s is not a nav landmark, and nothing marks the current page.
```tsx
import { Button, Stack } from "@slashsuite/ui-react";

<Stack gap="xs">
  <Button href="#overview" variant="ghost">
    Overview
  </Button>
  <Button href="#button" variant="ghost">
    Button
  </Button>
  <Button href="#card" variant="ghost">
    Card
  </Button>
</Stack>
```

### Accessibility
- The row is a tab list named by `label`; the arrow keys, Home and End move between the tabs, and a `disabled` tab is skipped.
- A tab with `disabledReason` is `aria-disabled`: the arrow keys reach it and choose nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning).
- Give the panel `role="tabpanel"` and a tab `controls` that points at its `id`.
- A tab is a `button` with `role="tab"` and `aria-selected`; only the current tab is in the tab order, and the arrow keys move and choose.
- Link items form a `<nav>` named by `label`; the current link gets `aria-current="page"`.

### Props
### Tabs
Tabs for switching a view in place or between pages. Across (the default) they are underline tabs: a row over a bottom rule, the current tab underlined in the accent. `orientation="vertical"` is the pill rail instead, the current tab filled, for a `SidebarLayout` aside, and takes a `size`. `items` are `{ value, label }` buttons (`value` and `onChange` are the caller's state; the arrow keys, Home and End move between tabs) or links (`href`, an in-app one through `LinkProvider`; `selected` on an item, or `value`, marks the current one, which gets `aria-current`). An item may carry a `count`, and a button one `disabledReason` (it stays reachable by the arrows and its reason is a tooltip) or a bare `disabled`; `disabled` on the row disables every tab. `label` names the tab list. The panel is the caller's: give it `role="tabpanel"`, and a tab `controls` to point at it.
- disabled: boolean. Every option is disabled, e.g. until the page has hydrated.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: Tab[] (required). The options in order: `{ value, label }` buttons, or links (`href`), the current link marked by its `selected` or by a `value` equal to the group's. Either may carry a `count`; a button may be `disabled`.
- label: string (required). The accessible name of the group.
- onChange: ((value: string) => void). Called with the option's `value` when one is chosen, by click or arrow key.
- orientation: "horizontal" | "vertical" (default horizontal). `horizontal` is a row of underline tabs over a bottom rule; `vertical` is the pill rail, a
column at the rail's width for a `SidebarLayout` aside, where the up and down arrows move
between button tabs.
- size: "sm" | "md" | "lg" (default md). The pills' height and text, on the scale of a `Button`. Only the vertical rail takes a `size`.
- value: string. The `value` of the current option; for links, an alternative to `selected` on the item.

### Types
- Tab: `{ label: ReactNode; count?: number; title?: string; value: string; disabled?: boolean; disabledReason?: string; controls?: string } | { label: ReactNode; count?: number; title?: string; value?: string; selected?: boolean; external?: boolean; href: string }`. One tab of a Tabs row: a button with a `value`, or a link with an `href`; never both kinds in one row.
