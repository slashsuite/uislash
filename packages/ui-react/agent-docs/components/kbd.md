## Kbd

Group: Text

When to use: A key or a shortcut the reader presses: `Esc`, `?`, `⌘S`.

### The one right way
`Kbd` is a key the reader presses: in a sentence, or as the shortcut on a button.
```tsx
import { Kbd, Text } from "@slashsuite/ui-react";

<Text>
  Press <Kbd>Esc</Kbd> to close this list, or <Kbd>⌘S</Kbd> to save.
</Text>
```

### Do
- Use `Kbd` for a key the reader presses, in a sentence or as the shortcut on a `Button`.
- A command or a name is `Code`, never `Kbd`.

### Don't
A command is `Code`, not a key. `Kbd` draws a keycap, which says "press this".
```tsx
import { Kbd, Text } from "@slashsuite/ui-react";

<Text>
  Run <Kbd>bun install</Kbd> to install.
</Text>
```

### Accessibility
- `Kbd` renders a `<kbd>` element, which marks the text as keyboard input.
- Its border takes the colour of the text around it, so it reads on plain text and on a filled button.

### Props
### Kbd
A keyboard key. Its border takes the surrounding text colour, so it reads on a filled button and on plain text.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
