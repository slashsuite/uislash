## Code

Group: Text

When to use: A command, name or path inside a sentence is `Code`; several lines of code are a `CodeBlock`.

### Use instead
- CopyButton (copy-button.md): Neither a `CopyLine` nor `copy` on a `CodeBlock` or `CodeExample` fits.
- CopyLine (copy-line.md): The text to copy is one line, such as an install command.

### The one right way
`Code` is one short run of code inside a sentence: a command, a name, a path.
```tsx
import { Code, Text } from "@slashsuite/ui-react";

<Text>
  Run <Code>bun install</Code> once, then <Code>bunx nx run-many -t test</Code> to check it.
</Text>
```

### Do
- Use `Code` for one short run inside a sentence. It takes the text colour and size around it, and keeps no line breaks.
- Use `CodeBlock` for several lines. Give the text as `children`, or as `lines` with one entry per line.
- `label` names the language or file (`bash`, `css`) in a caption above the code; `language` says what to colour, from `tsx`, `ts`, `js`, `json`, `bash`, `console`, `css`, `html` and `yaml`.
- A shell session is `console`: a line starting with `$ ` is a command, coloured as bash, and every other line is output. With `copy`, only the commands are copied, without the `$ `.
- A line a reader copies is a `CopyLine`, not a one-line `CodeBlock`. A rendered part shown with its code is a `CodeExample`.
- Without a `language` the code is one colour (`text`), which suits an error or a log.
- A long line wraps, so a command is never cut off and still copies as one line. `overflow="scroll"` keeps lines whole and scrolls them sideways under a thin scrollbar in the theme's colour, for code whose layout matters.
- `copy` adds a copy button beside the code. It needs client JS; on a page rendered to static HTML, inline `copyScript` once (see CopyButton).

### Don't
`Code` is inline, so its line breaks collapse into one run. Several lines are a `CodeBlock`.
```tsx
import { Code, Text } from "@slashsuite/ui-react";

<Text>
  <Code>{"bun install\nbun run build\nbun run test"}</Code>
</Text>
```

One short line a reader copies is a `CopyLine`, the smaller box. A one-line `CodeBlock` is for a command that needs a `label` or colour.
```tsx
import { CodeBlock } from "@slashsuite/ui-react";

<CodeBlock language="bash">bun add @slashsuite/ui-react</CodeBlock>

```

### Accessibility
- `Code` renders a `<code>`. `CodeBlock` renders a `<figure>` with the code in `<pre><code>`, so the line breaks are kept.
- `label` is the `<figcaption>`, which names the figure.
- `CodeBlock` takes `aria-*` and `data-*` on its figure.

### Props
### Code
Inline code: mono, on a subtle inset background. It takes the surrounding text colour and size (a touch smaller, for the mono face).
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.

### CodeBlock
A block of code: mono, in a bordered inset box. No client JS unless `copy` adds a copy button beside the code, which copies it exactly as given. `language` colours it: `tsx`, `ts`, `js`, `json`, `bash`, `console`, `css`, `html` or `yaml`. `console` is a shell session: a line starting with `$ ` is a command (coloured as bash, its `$ ` dimmed and not selectable) and any other line is output; with `copy` only the commands are copied, without the `$ `. `label` names the language or file (`bash`, `css`) in a caption above the code. `text` (the default) leaves the code in one colour, for a block that is not a language. Give the text as `children` or as `lines`. Long lines wrap, so nothing is cut off and a command stays one copyable line; `overflow="scroll"` keeps lines whole and scrolls them sideways under a thin themed scrollbar, for code whose layout matters. With `overflow="scroll"`, a strip wider than its box is a tab stop named by `label`, else "Code". Every other figure prop goes on the root `<figure>`. For one short line to copy, `CopyLine` is the smaller box.
- copy: boolean (default false). A copy button beside the code, which copies it exactly as given (a `console` block copies only
its commands). On a page rendered to static HTML without hydration, inline `copyScript` and it works there too.
- label: string. A caption above the code naming its language or file (`bash`, `theme.css`).
- language: "text" | "html" | "tsx" | "ts" | "js" | "json" | "bash" | "console" | "css" | "yaml" (default text). What the code is written in; `text` (the default) colours nothing.
- lines: string[]. The code as one array entry per line, in place of `children`.
- overflow: "wrap" | "scroll" (default wrap). What a line longer than the box does: `wrap` onto the next line (the default, nothing is cut
off), or `scroll` sideways inside the box.

### Types
- CodeLanguage: `"text" | "tsx" | "ts" | "js" | "json" | "bash" | "console" | "css" | "html" | "yaml"`. The languages a `CodeBlock` colours; `text` is plain, and `console` marks the commands of a terminal session.
