## CodeExample

Group: Text

When to use: Documentation that shows a part and its source together.

### The one right way
`CodeExample` frames a rendered part with the code that makes it, in one box.
```tsx
import { Button, CodeExample } from "@slashsuite/ui-react";

<CodeExample code={'<Button variant="primary">Save</Button>'}>
  <Button variant="primary">Save</Button>
</CodeExample>
```

### Do
- Put the rendered part in `children` and its source in `code`, a string with the newlines kept.
- `caption` is one note on the example, the last band of the frame.
- Side by side in a grid, each frame is its own height, so do not pad the previews to match.
- A wide preview or a long line of code scrolls inside the frame under a thin themed scrollbar; it does not widen the page.
- `copy` adds a button beside the code that copies the code, not the preview. It needs client JS; on a page rendered to static HTML, inline `copyScript` once (see CopyButton).
- Inside a `Prose` the preview stays on the app scale, so the part looks as it does on an app screen; the caption is outside it.
- Only for documentation. A command to copy is a `CopyLine`, and code alone is a `CodeBlock`.

### Don't
A loose preview with a `CodeBlock` under it is two unrelated things: no shared frame, and they drift apart.
```tsx
import { Button, CodeBlock, Stack } from "@slashsuite/ui-react";

<Stack gap="sm">
  <Button variant="primary">Save</Button>
  <CodeBlock>{'<Button variant="primary">Save</Button>'}</CodeBlock>
</Stack>
```

### Accessibility
- A `<figure>` holds the preview and the code in `<pre><code>`; `caption` is its `<figcaption>`.
- `aria-*` and `data-*` go on the figure.

### Props
### CodeExample
One framed example: the rendered `children` on top and the `code` that makes them attached underneath, in a single bordered box with one divider between. With `copy`, a copy button beside the code copies it exactly as given (client JS; off by default). An optional `caption` is the frame's last band. The code is React, so it is coloured as TSX. The preview is its own height, never padded to match a neighbour, down to a shared minimum so two frames side by side start alike. A wide preview or a long line of code scrolls inside the frame, under a thin themed scrollbar, instead of widening the page or wrapping. Inside a `Prose` the preview stays on the app scale, so a demo looks as the component does anywhere else; the caption is outside it.
- caption: ReactNode. One note on the example, under the code.
- code: string (required). The source shown under the preview, newlines kept.
- copy: boolean (default false). A copy button beside the code. On a page rendered to static HTML without hydration, inline
`copyScript` and it works there too.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
