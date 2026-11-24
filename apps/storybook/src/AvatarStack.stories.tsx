import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarStack, Stack } from "@slashsuite/ui-react";
import { samplePhoto } from "./samplePhoto";
import * as examples from "../../../packages/ui-react/docs/examples/AvatarStack.examples.js";

const meta: Meta = { title: "Content/AvatarStack" };
export default meta;
type S = StoryObj;

const team = [
  "Ada Lovelace",
  "Grace Hopper",
  "Linus Torvalds",
  "Margaret Hamilton",
  "Dennis Ritchie",
  "Ken Thompson",
  "Barbara Liskov",
].map((name) => ({ name }));

export const Default: S = {
  render: () => (
    <AvatarStack items={[{ name: "Jacobus Langner", src: samplePhoto }, ...team.slice(0, 3)]} />
  ),
};

/** `max` shows the first few and a "+N" chip for the rest; the chip's `title` names who it stands for. */
export const Overflow: S = {
  render: () => <AvatarStack items={team} max={3} />,
};

export const Sizes: S = {
  render: () => (
    <Stack gap="sm">
      {(["sm", "md", "lg", "xl", "2xl", "3xl"] as const).map((size) => (
        <AvatarStack key={size} items={team} max={3} size={size} />
      ))}
    </Stack>
  ),
};

/** `xs`, the smallest, for a dense table row or a byline. */
export const ExtraSmall: S = {
  render: () => <AvatarStack items={team} max={3} size="xs" />,
};

/** `shape="square"` for a stack of orgs or teams. */
export const Square: S = {
  render: () => (
    <AvatarStack
      items={["Hack Cove", "PixelSlash", "Omnibus", "Thrifty", "Quotes"].map((name) => ({ name }))}
      max={3}
      size="lg"
      shape="square"
    />
  ),
};

export const DoMax: S = {
  render: examples.DoMax,
};

export const DontMax: S = {
  render: examples.DontMax,
};

/** While `loading`, a stack with no members yet is three avatar bones. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <AvatarStack
      loading={loading}
      items={loading ? [] : [{ name: "Mia Botha" }, { name: "Sipho Dube" }, { name: "Ana Lima" }]}
    />
  ),
};
