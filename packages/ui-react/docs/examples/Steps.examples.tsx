import { Code, Step, Steps } from "@slashsuite/ui-react";

/** `Steps` numbers itself: give each `Step` a `title` and a line of detail, in the order they are done. */
export const DoNumbers = () => (
  <Steps aria-label="Get started">
    <Step title="Install the CLI">
      Run <Code>bun add -d pixelslash</Code> in your repo.
    </Step>
    <Step title="Upload a build">
      Run <Code>pixelslash upload</Code>.
    </Step>
  </Steps>
);

/** Typed numbers double up with the ones `Steps` draws, and drift when a step is added. Leave the numbering to `Steps`. */
export const DontNumbers = () => (
  <Steps aria-label="Get started">
    <Step title="1. Install the CLI">Run bun add -d pixelslash in your repo.</Step>
    <Step title="2. Upload a build">Run pixelslash upload.</Step>
  </Steps>
);

/** `Steps` is for things done in order, from the first to the last. */
export const DoOrder = () => (
  <Steps>
    <Step title="Sign in" />
    <Step title="Pick a project" />
    <Step title="Upload a build" />
  </Steps>
);

/** Numbering features that have no order tells the reader there is a sequence to follow. Use a `BulletList`. */
export const DontOrder = () => (
  <Steps>
    <Step title="Light and dark themes" />
    <Step title="Keyboard shortcuts" />
    <Step title="Email digests" />
  </Steps>
);
