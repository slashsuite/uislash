import type { Meta, StoryObj } from "@storybook/react-vite";
import { BulletItem, BulletList } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/BulletList.examples.js";

const meta: Meta = { title: "Text/BulletList" };
export default meta;
type S = StoryObj;

export const Plain: S = {
  render: () => (
    <div className="max-w-xl">
      <BulletList>
        <BulletItem>Moved the nightly build from cron to a queue.</BulletItem>
        <BulletItem>Cut the cold start from nine seconds to two.</BulletItem>
        <BulletItem>Wrote the runbook the team still uses.</BulletItem>
      </BulletList>
    </div>
  ),
};

export const WithBody: S = {
  render: () => (
    <div className="max-w-xl">
      <BulletList>
        <BulletItem>Each item is a BulletItem, in the body text.</BulletItem>
        <BulletItem>The list owns the discs, indent and gap.</BulletItem>
      </BulletList>
    </div>
  ),
};

/** `ordered`: a numbered list, for steps a reader follows in order. */
export const Ordered: S = {
  render: () => (
    <div className="max-w-xl">
      <BulletList ordered>
        <BulletItem>Install the CLI.</BulletItem>
        <BulletItem>Add a token to the CI secrets.</BulletItem>
        <BulletItem>Run the first capture.</BulletItem>
      </BulletList>
    </div>
  ),
};

export const DoItems: S = {
  render: examples.DoItems,
};

export const DontItems: S = {
  render: examples.DontItems,
};
