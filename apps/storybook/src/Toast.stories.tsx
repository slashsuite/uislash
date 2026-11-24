import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ToastRegion } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Toast.examples.js";

const meta: Meta = {
  title: "Feedback/Toast",
  decorators: [
    (Story) => (
      <examples.Frame>
        <Story />
      </examples.Frame>
    ),
  ],
};
export default meta;
type S = StoryObj;

export const DoSaved: S = {
  render: examples.DoSaved,
};

export const DontSaved: S = {
  render: examples.DontSaved,
};

export const DoAction: S = {
  render: examples.DoAction,
};

export const DontAction: S = {
  render: examples.DontAction,
};

/** One toast of each tone, all of which stay (each `warn`, `danger` or with an action), for the shot. */
export const Tones: S = {
  render: () => (
    <ToastRegion
      onDismiss={() => undefined}
      toasts={[
        {
          id: "neutral",
          title: "Draft kept",
          body: "It is in your drafts.",
          actions: <Button size="sm">Open</Button>,
        },
        {
          id: "info",
          tone: "info",
          title: "Update available",
          actions: <Button size="sm">Reload</Button>,
        },
        {
          id: "positive",
          tone: "positive",
          title: "Invite sent",
          actions: <Button size="sm">Undo</Button>,
        },
        { id: "warn", tone: "warn", title: "Offline", body: "Changes save when you reconnect." },
        { id: "danger", tone: "danger", title: "Not saved", body: "The server did not answer." },
      ]}
    />
  ),
};
