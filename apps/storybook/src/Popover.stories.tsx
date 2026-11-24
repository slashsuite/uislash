import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyValue, KeyValueList, Popover } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Popover.examples.js";

const meta: Meta = { title: "Feedback/Popover" };
export default meta;
type S = StoryObj;

/** Open when the story loads, under its labelled trigger; a click away or Esc closes it. */
export const Default: S = {
  render: () => (
    <div className="flex justify-end p-6 pb-48">
      <Popover label="Filters" defaultOpen>
        Only paid orders from the last 30 days are shown.
      </Popover>
    </div>
  ),
};

/** An icon trigger, named by its tooltip: a ghost square button, the panel aligned to its end. */
export const Icon: S = {
  render: () => (
    <div className="flex justify-end p-6 pb-48">
      <Popover label="Build details" icon="more" defaultOpen>
        <KeyValueList>
          <KeyValue label="Commit">982a166</KeyValue>
          <KeyValue label="Shots">412</KeyValue>
        </KeyValueList>
      </Popover>
    </div>
  ),
};

/** The trigger at each `size`, shut: `sm` for a row or a toolbar, `md` by default, `lg` for a hero. */
export const Sizes: S = {
  render: () => (
    <div className="flex items-center gap-3 p-6">
      <Popover label="Filters" size="sm">
        Only paid orders are shown.
      </Popover>
      <Popover label="Filters">Only paid orders are shown.</Popover>
      <Popover label="Filters" size="lg">
        Only paid orders are shown.
      </Popover>
    </div>
  ),
};

export const DoPopover: S = {
  render: examples.DoPopover,
};

export const DontPopover: S = {
  render: examples.DontPopover,
};
