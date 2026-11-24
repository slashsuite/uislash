import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  ButtonGroup,
  ChatMessage,
  Image,
  Markdown,
  Pill,
  Stack,
} from "@slashsuite/ui-react";
import { sampleScenes } from "../../../packages/ui-react/docs/examples/sampleScene.js";
import * as examples from "../../../packages/ui-react/docs/examples/ChatMessage.examples.js";

const meta: Meta = {
  title: "Content/ChatMessage",
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

const scene = sampleScenes[0] ?? { src: "", alt: "" };

/** `user` sits on the right on the inset fill, `assistant` on the left on the surface. */
export const Roles: S = {
  render: () => (
    <Stack gap="sm">
      <ChatMessage role="user" author="Ada">
        When does the harbour market open?
      </ChatMessage>
      <ChatMessage role="assistant" author="Helper">
        At eight, every Saturday.
      </ChatMessage>
    </Stack>
  ),
};

/** `meta` is the small line above the bubble: a sender and a time, already formatted. */
export const MetaLine: S = {
  render: () => (
    <Stack gap="sm">
      <ChatMessage role="user" author="Ada" meta="Ada, 09:14">
        Are we still on for lunch?
      </ChatMessage>
      <ChatMessage role="assistant" author="Grace" meta="Grace, 09:16">
        Yes, one o'clock.
      </ChatMessage>
    </Stack>
  ),
};

/** Plain text keeps its line breaks, and a long word wraps inside the bubble. */
export const PlainText: S = {
  render: () => (
    <Stack gap="sm">
      <ChatMessage role="user" author="Ada">
        {"Eggs\nFlour\nButter"}
      </ChatMessage>
      <ChatMessage role="assistant" author="Helper">
        https://example.com/a/very/long/link/that/has/nowhere/to/break/and/runs/on/and/on/past/the/width/of/the/bubble/and/well/beyond/it/all/the/way/to/the/end
      </ChatMessage>
    </Stack>
  ),
};

/** The body is what the caller passes: a `Markdown` for an AI reply, an `Image` for media. */
export const RichBody: S = {
  render: () => (
    <Stack gap="sm">
      <ChatMessage role="assistant" author="Helper">
        <Markdown md={"## The plan\n- **Sweat** the leeks\n- Add the potatoes"} />
      </ChatMessage>
      <ChatMessage role="user" author="Ada">
        <Image src={scene.src} alt={scene.alt} width="lg" aspect="3:2" />
      </ChatMessage>
    </Stack>
  ),
};

/** `actions` is a row under the bubble on the message's own side: buttons or reaction `Pill`s. */
export const Actions: S = {
  render: () => (
    <Stack gap="sm">
      <ChatMessage
        role="assistant"
        author="Helper"
        actions={
          <ButtonGroup>
            <Button size="sm" variant="ghost">
              Copy
            </Button>
            <Button size="sm" variant="ghost">
              Retry
            </Button>
          </ButtonGroup>
        }
      >
        At eight, every Saturday.
      </ChatMessage>
      <ChatMessage
        role="user"
        author="Ada"
        actions={
          <>
            <Pill round>👍 2</Pill>
            <Pill round>🎉 1</Pill>
          </>
        }
      >
        We got the stall.
      </ChatMessage>
    </Stack>
  ),
};

/** `streaming` draws the caret after the reply so far; with no children it is the pending state, the caret alone. */
export const Streaming: S = {
  render: () => (
    <Stack gap="sm">
      <ChatMessage role="assistant" author="Helper" streaming />
      <ChatMessage role="assistant" author="Helper" streaming>
        Start by sweating the leeks in
      </ChatMessage>
    </Stack>
  ),
};

export const DoStreaming: S = {
  render: examples.DoStreaming,
};

export const DontStreaming: S = {
  render: examples.DontStreaming,
};

export const DoActions: S = {
  render: examples.DoActions,
};

export const DontActions: S = {
  render: examples.DontActions,
};
