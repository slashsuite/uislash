import type { ReactNode } from "react";
import { Button, ChatMessage, Stack, Text } from "@slashsuite/ui-react";

/** The docs and Storybook show every example of this file in it. A chat takes the width it is given, so the examples give it a realistic one. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <Stack width="narrow">{children}</Stack>
);

/** A reply still arriving says so with `streaming`: the caret, and `aria-busy` for a screen reader. */
export const DoStreaming = () => (
  <ChatMessage role="assistant" author="Helper" streaming>
    Start by sweating the leeks in
  </ChatMessage>
);

/** Dots typed into the body say nothing to a screen reader, and are read out as text when it is done. */
export const DontStreaming = () => (
  <ChatMessage role="assistant" author="Helper">
    Start by sweating the leeks in...
  </ChatMessage>
);

/** What to do with a message goes in `actions`, under the bubble and always in view. */
export const DoActions = () => (
  <ChatMessage
    role="assistant"
    author="Helper"
    actions={
      <Button size="sm" variant="ghost">
        Retry
      </Button>
    }
  >
    The pantry did not answer.
  </ChatMessage>
);

/** A button in the body reads as part of what was said, and is copied with it. */
export const DontActions = () => (
  <ChatMessage role="assistant" author="Helper">
    <Text>The pantry did not answer.</Text>
    <Button size="sm" variant="ghost">
      Retry
    </Button>
  </ChatMessage>
);
