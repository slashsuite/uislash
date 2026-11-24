import type { ReactNode } from "react";
import { ChatMessage, ChatThread, EmptyState, Stack } from "@slashsuite/ui-react";

/** The docs and Storybook show every example of this file in it. A chat takes the width it is given, so the examples give it a realistic one. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <Stack width="narrow">{children}</Stack>
);

/** Nothing to show yet is the thread's `empty`, which goes away with the first message. */
export const DoEmpty = () => (
  <ChatThread label="New chat" empty={<EmptyState title="No messages yet" level={3} />} />
);

/** A made-up message is not an empty state: a screen reader reads it as something somebody said. */
export const DontEmpty = () => (
  <ChatThread label="New chat">
    <ChatMessage role="assistant" author="Helper">
      No messages yet
    </ChatMessage>
  </ChatThread>
);
