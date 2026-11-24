import { CodeBlock } from "@slashsuite/ui-react";

/** A few lines to read or copy go in one `CodeBlock`, with `label` naming the language or file. */
export const DoSnippet = () => (
  <CodeBlock
    label="bash"
    language="bash"
    lines={["bun add @slashsuite/ui-react", "bun add @slashsuite/themes"]}
  />
);

/** One short line a reader copies is a `CopyLine`, the smaller box. A one-line `CodeBlock` is for a command that needs a `label` or colour. */
export const DontSnippet = () => (
  <CodeBlock language="bash">bun add @slashsuite/ui-react</CodeBlock>
);
