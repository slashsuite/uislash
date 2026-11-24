import type { ReactNode } from "react";
import { ChatComposer, Stack } from "@slashsuite/ui-react";

/** The docs and Storybook show every example of this file in it. A chat takes the width it is given, so the examples give it a realistic one. */
export const Frame = ({ children }: { children: ReactNode }) => (
  <Stack width="narrow">{children}</Stack>
);

/** While a reply arrives, `busy` keeps the box open and offers Stop. */
export const DoBusy = () => (
  <ChatComposer label="Message" busy onSend={() => undefined} onStop={() => undefined} />
);

/** `disabled` during a reply takes the box away from a reader mid-thought, with no way to stop the reply. */
export const DontBusy = () => <ChatComposer label="Message" disabled onSend={() => undefined} />;
