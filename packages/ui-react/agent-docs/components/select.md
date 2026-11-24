## Select

Group: Forms

When to use: One choice from a list of about five or more: a category, a country, a rating.

### The one right way
Choosing one of several is a `Select` in a `Field`.
```tsx
import { Field, Select } from "@slashsuite/ui-react";

<Field label="Category" htmlFor="do-category">
  <Select
    id="do-category"
    defaultValue="books"
    items={[
      { value: "books", label: "Books" },
      { value: "clothes", label: "Clothes" },
      { value: "furniture", label: "Furniture" },
      { value: "records", label: "Records" },
      { value: "toys", label: "Toys" },
    ]}
  />
</Field>
```

### Do
- Put a `Select` in a `Field` and give it its choices as `items` (`{ value, label, disabled? }`); set `defaultValue` or control it with `value` and `onChange`.
- A yes or no is a `Checkbox`.
- Two to five modes switched in place are a `SegmentedControl`.
- `size` and `width` are the same choices as on `Input`.

### Don't
A yes or no is not a choice from a list: it is a `Checkbox`.
```tsx
import { Field, Select } from "@slashsuite/ui-react";

<Field label="Open now" htmlFor="dont-open">
  <Select
    id="dont-open"
    defaultValue="yes"
    items={[
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ]}
  />
</Field>
```

### Accessibility
- A `Select` is a native `<select>`, so it keeps the browser's arrow, its keyboard handling and its mobile picker.
- In a `Field`, the `Field` around it gives it its label and its hint or error as `aria-describedby`, and an error marks it `aria-invalid` with a red edge.
- The focus ring comes from the component.

### Props
### Select
A native `<select>` styled like `Input`, keeping the browser's own arrow, over its `items`. Takes `size` and `width` too: inside a `Field` it fills the row, and on its own it is as wide as its longest choice. The `ref` reaches the `<select>`.
- disabled: boolean (native). Disables the select; say why in its `Field` hint.
- items: readonly { value: string; label: string; disabled?: boolean }[] (required). The choices, in order.
- name: string (native). The key the value posts under in a form.
- ref: Ref<HTMLSelectElement>. The `<select>` itself, for focus control.
- size: "sm" | "md" | "lg" (default md). `sm` is compact, `text-sm` with less padding, for dense forms and table rows; `md` is `text-base`;
`lg` is `text-lg` with more padding, for a hero form. Under an `AppShell density="compact"` each
is one type step down, and on a touch screen a field is never under 16px.
- width: "sm" | "md" | "lg" | "xs" | "auto" | "fill" | "full" (default full inside a `Field`, `auto` outside one). As an `Input`'s `width`.
