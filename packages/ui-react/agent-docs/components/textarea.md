## Textarea

Group: Forms

When to use: Text that runs to a sentence or a paragraph: a review, a note, a message.

### The one right way
Text that runs to a paragraph is a `Textarea` in a `Field`, so the person can see what they wrote.
```tsx
import { Field, Textarea } from "@slashsuite/ui-react";

<Field label="Review" htmlFor="do-review" hint="What did you find? How were the prices?">
  <Textarea id="do-review" rows={4} />
</Field>
```

### Do
- Put a `Textarea` in a `Field`, as with an `Input`.
- `rows` is 3 unless you set it; set more for a long answer.
- `size` and `width` are the same choices as on `Input`. In a `Field` it fills the row; on its own it is as wide as its longest choice.
- One line of text is an `Input`.
- `mono` sets the monospace face, for pasted CSV or statement text where the columns must line up.

### Don't
An `Input` is one line: a paragraph typed into it scrolls out of sight.
```tsx
import { Field, Input } from "@slashsuite/ui-react";

<Field label="Review" htmlFor="dont-review" hint="What did you find? How were the prices?">
  <Input id="dont-review" />
</Field>
```

### Accessibility
- A `Textarea` is a native `<textarea>`: it takes `name`, `required`, `disabled`, `maxLength` and the `aria-*` props.
- In a `Field`, the `Field` around it gives it its label and its hint or error as `aria-describedby`, and an error marks it `aria-invalid` with a red edge.
- The focus ring comes from the component.

### Props
### Textarea
A multi-line text input, styled like `Input`. `rows` defaults to 3. Takes `size`, `width` and `mono` too. The `ref` reaches the `<textarea>`, for focus control.
- disabled: boolean (native). Disables the field; say why in its `Field` hint.
- mono: boolean (default false). The monospace face, for pasted CSV or statement text, where the columns must line up. Off by default.
- name: string (native). The key the value posts under in a form.
- placeholder: string (native). A hint shown while the field is empty; never the label.
- ref: Ref<HTMLTextAreaElement>. The `<textarea>` itself, for focus control.
- rows: number (native). How many lines tall it starts.
- size: "sm" | "md" | "lg" (default md). `sm` is compact, `text-sm` with less padding, for dense forms and table rows; `md` is `text-base`;
`lg` is `text-lg` with more padding, for a hero form. Under an `AppShell density="compact"` each
is one type step down, and on a touch screen a field is never under 16px.
- width: "sm" | "md" | "lg" | "xs" | "auto" | "fill" | "full" (default full). `full` (default) fills the parent; `fill` grows to fill the room left in a row beside other items (it can shrink to nothing, so buttons stay on the line); `xs`, `sm`, `md`, `lg` are fixed; `auto` adds no width class, so the control is as wide as the browser makes it.
