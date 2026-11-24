## Input

Group: Forms

When to use: A short piece of text: a name, an amount, a search term.

### The one right way
An amount is a `prefix` for the currency and `numeric`, which lines the digits up and brings up the number keypad.
```tsx
import { Input } from "@slashsuite/ui-react";

<Input prefix="R" numeric width="md" aria-label="Amount" defaultValue="49.90" />

```

### Do
- Put an `Input` in a `Field`. Without one, name it with `aria-label`.
- A search box is `type="search"` with an `icon`; the clear button appears by itself.
- `prefix` is short text inside the border before the value, such as a currency symbol. It is for a plain field, not one with an `icon` or `type="search"`.
- A figure is `numeric`: an amount is `<Input prefix="R" numeric />` in a `Field`, and a count or a whole number is `<Input numeric inputMode="numeric" />`. It right-aligns the digits in tabular figures and brings up the number keypad. A unit other than a currency goes in the `label` ("UIF rate (%)").
- `size="sm"` is for a dense form or a table row, `size="lg"` for a sign-in or search form that stands alone; `md` is the default.
- `width` is `full` by default; `xs`, `sm`, `md` and `lg` are fixed widths for a short value; `fill` grows to the room beside other items in a row; `auto` is as wide as the browser makes it.
- A paragraph is a `Textarea`; a choice from a list is a `Select`; a date is a `DateField`.

### Don't
- Do not use `type="number"` for an amount or a count a person types: the browser drops "1 250" and "12,400.00", the mouse wheel changes the value under a scrolling page, and the spinner arrows sit where the figure should end.

A currency typed into the placeholder is gone as soon as the person types, and nothing keeps the digits aligned.
```tsx
import { Input } from "@slashsuite/ui-react";

<Input placeholder="R 0.00" width="md" aria-label="Amount" />

```

`type="number"` drops "1 250", puts spinner arrows where the figure should end, and lets the mouse wheel change the value as the page scrolls.
```tsx
import { Field, Input } from "@slashsuite/ui-react";

<Field label="Quantity">
  <Input type="number" width="xs" defaultValue="12" />
</Field>
```

A plain text input used for search has no icon and no way to clear it.
```tsx
import { Input } from "@slashsuite/ui-react";

<Input aria-label="Search shops" placeholder="Search by name or suburb…" />

```

### Accessibility
- An `Input` is a native `<input>`: it takes `type`, `inputMode`, `autoComplete`, `required`, `disabled` and the `aria-*` and `data-*` props.
- A `type="search"` field shows a clear button while it has a value, named "Clear search" or by `clearLabel`; it is hidden when the field is disabled or read-only.
- The `icon` is decorative and hidden from assistive tech.
- A `numeric` field is a text field with a number keypad (`inputMode="decimal"` unless you pass your own), so it is read and kept exactly as typed.
- In a `Field`, the `Field` around it gives it its label and its hint or error as `aria-describedby`, and an error marks it `aria-invalid` with a red edge.
- The focus ring comes from the component.

### Props
### Input
A text input. `icon` names a leading icon inside the field (`icon="search"`). `prefix` puts short text inside the border before the value, such as a currency symbol; it is for a plain field, not with an `icon` or `type="search"`. `numeric` is a field for a figure: an amount (`<Input prefix="R" numeric />`) or a count (`numeric inputMode="numeric"`). It right-aligns the value in tabular figures and brings up the phone's number keypad (`inputMode="decimal"` unless you pass your own), and stays a text field, so "1 250" is kept as typed; never use `type="number"` for a figure a person types. `type="search"` drops the browser's own search look and shows a clear button at the trailing edge while the field has a value, named by `clearLabel`. The `ref` reaches the `<input>`.
- clearLabel: string (default Clear search). The name of a `type="search"` field's clear button, for an app in another language.
- disabled: boolean (native). Disables the field; say why in its `Field` hint.
- icon: "page" | "grid" | "search" | "table" | "type" | "diff" | "baseline" | "review" | "ci" | "self-host" | "privacy" | "capture" | "branch" | "theme" | "speed" | "chevron-right" | "chevron-down" | "close" | "external-link" | "settings" | "bell" | "check" | "plus" | "more" | "window" | "card" | "pointer" | "field" | "compass" | "briefcase". A leading icon inside the field, by name (`search`). Not with `prefix`.
- name: string (native). The key the value posts under in a form.
- numeric: boolean (default false). A field for a figure (an amount, a count): the value right-aligned in tabular figures, and
`inputMode="decimal"` unless you pass your own (`numeric` for a whole number). It stays a
text field, so the value is kept as typed; parsing it is yours. Ignored on `type="search"`.
- placeholder: string (native). A hint shown while the field is empty; never the label.
- prefix: string. Short text inside the border before the value (a currency symbol). For a plain field: not with `icon` or `type="search"`.
- ref: Ref<HTMLInputElement>. The `<input>` itself, for focus control.
- required: boolean (native). The form will not submit while the field is empty.
- size: "sm" | "md" | "lg" (default md). `sm` is compact, `text-sm` with less padding, for dense forms and table rows; `md` is `text-base`;
`lg` is `text-lg` with more padding, for a hero form. Under an `AppShell density="compact"` each
is one type step down, and on a touch screen a field is never under 16px.
- type: string (native). The kind of value: `"text"`, `"email"`, `"search"`, `"password"` and the rest.
- width: "sm" | "md" | "lg" | "xs" | "auto" | "fill" | "full" (default full). `full` (default) fills the parent; `fill` grows to fill the room left in a row beside other items (it can shrink to nothing, so buttons stay on the line); `xs`, `sm`, `md`, `lg` are fixed; `auto` adds no width class, so the control is as wide as the browser makes it.

### Types
- ControlSize: `"sm" | "md" | "lg"`. A control's size: the library's one `Size` scale.
- ControlWidth: `"sm" | "md" | "lg" | "xs" | "full" | "fill" | "auto"`. `full` fills the parent (the default); `fill` grows to the space left in a flex row; `auto` adds no width class, so the control is as wide as the browser makes it; the rest are fixed.
