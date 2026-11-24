import { Code, Text } from "@slashsuite/ui-react";

/** `Code` is one short run of code inside a sentence: a command, a name, a path. */
export const DoInline = () => (
  <Text>
    Run <Code>bun install</Code> once, then <Code>bunx nx run-many -t test</Code> to check it.
  </Text>
);

/** `Code` is inline, so its line breaks collapse into one run. Several lines are a `CodeBlock`. */
export const DontInline = () => (
  <Text>
    <Code>{"bun install\nbun run build\nbun run test"}</Code>
  </Text>
);
