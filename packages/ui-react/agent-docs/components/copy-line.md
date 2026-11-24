## CopyLine

Group: Actions

When to use: A command or token a reader pastes elsewhere.

### Use instead
- CopyButton (copy-button.md): Neither a line nor a code block fits, so the button is placed by hand.
- Code (code.md): The text is a block of several lines: `CodeBlock copy`.

### The one right way
One command or token to paste: `CopyLine` is the box and the copy button together.
```tsx
import { CopyLine } from "@slashsuite/ui-react";

<CopyLine text="bun add @slashsuite/ui-react" />

```

### Do
- Give the whole line as `text`; the box shows it and the button copies it.
- Several lines are a `CodeBlock`; `CopyLine` is one line.
- A long token wraps inside the box.
- `disabled` disables the button, for a line shown before the page is interactive.

### Don't
Inline code beside a loose `CopyButton` is two parts that drift apart; the text can differ from what is copied.
```tsx
import { Cluster, Code, CopyButton } from "@slashsuite/ui-react";

<Cluster>
  <Code>bun add @slashsuite/ui-react</Code>
  <CopyButton text="bun add @slashsuite/ui-react" />
</Cluster>
```

`CopyLine` is one line of text: a newline in it collapses into a space and the box runs on.
```tsx
import { CopyLine } from "@slashsuite/ui-react";

<CopyLine text={"bun install\nbun run build"} />

```

### Accessibility
- The text is a `<code>` element, so a reader can select it by hand as well.
- The button is a `CopyButton`: a native button named `Copy`, whose status region announces `Copied` after each copy.

### Props
### CopyLine
One line of mono text in a box, with a `CopyButton`: a command or a token to paste elsewhere. `disabled` disables the button, e.g. until hydration. An `id`, `data-*` and `aria-*` go on the root `<div>`, so `data-testid` lands there; the `<code>` holds only `text`.
- disabled: boolean. Disables the copy button, e.g. until hydration.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- text: string (required). The line shown, and what the button copies.
