import { Button, CodeBlock, CodeExample, Stack } from "@slashsuite/ui-react";

/** `CodeExample` frames a rendered part with the code that makes it, in one box. */
export const DoPreview = () => (
  <CodeExample code={'<Button variant="primary">Save</Button>'}>
    <Button variant="primary">Save</Button>
  </CodeExample>
);

/** A loose preview with a `CodeBlock` under it is two unrelated things: no shared frame, and they drift apart. */
export const DontPreview = () => (
  <Stack gap="sm">
    <Button variant="primary">Save</Button>
    <CodeBlock>{'<Button variant="primary">Save</Button>'}</CodeBlock>
  </Stack>
);
