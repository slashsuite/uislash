import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatComposer, Stack } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/ChatComposer.examples.js";

const meta: Meta = {
  title: "Content/ChatComposer",
  parameters: { layout: "padded" },
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

const noop = () => undefined;

/** Enter sends and Shift+Enter is a newline; the box grows with its text from 2 rows to 8. */
export const Default: S = {
  render: () => <ChatComposer label="Message" placeholder="Ask a question" onSend={noop} />,
};

/** Send pressed on an empty box: nothing is sent, and `emptyReason` shows under the box until the next keystroke. */
export const EmptySend: S = {
  render: () => <ChatComposer label="Message" placeholder="Ask a question" onSend={noop} />,
  play: ({ canvasElement }) => {
    const form = canvasElement.querySelector("form");
    if (!form) throw new Error("no ChatComposer");
    form.requestSubmit();
  },
};

/** While `busy` the button is Stop, and the reader can go on typing the next message. */
export const Busy: S = {
  render: () => (
    <ChatComposer label="Message" placeholder="Ask a question" busy onSend={noop} onStop={noop} />
  ),
};

/** `busy` with no `onStop`, for a reply that cannot be stopped: Send stays disabled and no Stop is drawn. */
export const BusyNoStop: S = {
  render: () => <ChatComposer label="Message" placeholder="Ask a question" busy onSend={noop} />,
};

/** `disabled` turns off the box and the button, for a chat that cannot take a message at all. */
export const Disabled: S = {
  render: () => (
    <ChatComposer label="Message" placeholder="This chat is closed" disabled onSend={noop} />
  ),
};

/** `sendLabel` and `stopLabel` are the button's words. */
export const Labels: S = {
  render: () => (
    <Stack gap="sm">
      <ChatComposer label="Message" sendLabel="Post" onSend={noop} />
      <ChatComposer label="Reply" stopLabel="Cancel" busy onSend={noop} onStop={noop} />
    </Stack>
  ),
};

export const DoBusy: S = {
  render: examples.DoBusy,
};

export const DontBusy: S = {
  render: examples.DontBusy,
};
