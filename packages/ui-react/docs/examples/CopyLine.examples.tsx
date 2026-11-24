import { CodeBlock, Cluster, Code, CopyButton, CopyLine } from "@slashsuite/ui-react";

/** One command or token to paste: `CopyLine` is the box and the copy button together. */
export const DoCommand = () => <CopyLine text="bun add @slashsuite/ui-react" />;

/** Inline code beside a loose `CopyButton` is two parts that drift apart; the text can differ from what is copied. */
export const DontCommand = () => (
  <Cluster>
    <Code>bun add @slashsuite/ui-react</Code>
    <CopyButton text="bun add @slashsuite/ui-react" />
  </Cluster>
);

/** Several lines are a `CodeBlock`; it keeps the line breaks. */
export const DoBlock = () => (
  <CodeBlock label="bash" language="bash" lines={["bun install", "bun run build"]} />
);

/** `CopyLine` is one line of text: a newline in it collapses into a space and the box runs on. */
export const DontBlock = () => <CopyLine text={"bun install\nbun run build"} />;
