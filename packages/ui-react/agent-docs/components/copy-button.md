## CopyButton

Group: Actions

When to use: A value the page already shows that a reader will paste elsewhere.

### Use instead
- CopyLine (copy-line.md): The text to copy is one line, such as a command.
- Code (code.md): The text to copy is a block of code: `CodeBlock copy`, or `CodeExample copy` in docs.

### The one right way
`CopyButton` writes `text` to the clipboard and swaps its label to `copiedLabel`.
```tsx
import { CopyButton } from "@slashsuite/ui-react";

<CopyButton text="hc_live_9f2c41" label="Copy token" copiedLabel="Token copied" />

```

### Do
- `text` is what is copied; `copiedLabel` shows in place of the label for two seconds once it is on the clipboard.
- Name what is copied in `label` and `copiedLabel` (`"Copy token"`, `"Token copied"`) when the page has more than one.
- A command or token in its own box is a `CopyLine`, which carries this button.
- Place a `CopyButton` yourself only when neither a `CopyLine` nor `copy` on a `CodeBlock` or `CodeExample` fits.
- On a page rendered to static HTML and never hydrated, inline `copyScript` once, as `colourSchemeScript` is: every `CopyButton`, `CopyLine`, and `CodeBlock` or `CodeExample` with `copy` then works. A hydrated button copies for itself and the script stays out of its way.

### Don't
- Do not write the clipboard call by hand in a `Button`.

A hand-rolled copy Button gives no feedback and does not survive a refused clipboard.
```tsx
import { Button } from "@slashsuite/ui-react";

<Button
  variant="ghost"
  size="sm"
  onClick={() => {
    void navigator.clipboard.writeText("hc_live_9f2c41");
  }}
>
  Copy token
</Button>
```

### Accessibility
- A native `<button>` with `type="button"` and a focus ring from the component.
- The accessible name is always `label`. A copy shows `copiedLabel` for two seconds and a polite status region beside the button announces it, again on every copy.
- A refused or missing clipboard leaves the label unchanged; nothing is announced.

### Props
### CopyButton
Writes `text` to the clipboard and shows `copiedLabel` for two seconds, then `label` again. Defaults to `type="button"`. Its accessible name stays `label`; a polite status region beside it announces `copiedLabel` on each copy. A refused or missing clipboard leaves it on `label`. Every other button prop, `disabled` included, goes on the `<button>`. On a page rendered to static HTML without hydration, inline `copyScript` and the button works there too.
- copiedLabel: string (default Copied). The text shown for two seconds once the copy has gone through, and announced.
- label: string (default Copy). The button's text, and its accessible name.
- text: string (required). What goes on the clipboard.

### Functions
- copyScript: `copyScript: string`. A string of JavaScript to inline once on a page rendered to static HTML: one click listener on `document` that makes every copy button work without hydration.
```tsx
<script is:inline set:html={copyScript} />
```
