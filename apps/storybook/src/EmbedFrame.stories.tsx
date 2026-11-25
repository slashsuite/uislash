import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmbedFrame } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/EmbedFrame.examples.js";

const meta: Meta = { title: "Content/EmbedFrame" };
export default meta;
type S = StoryObj;

/** A blank page stands in for the embed, so no story depends on the network. */
const embed = <iframe title="Map of the shops" src="about:blank" sandbox="allow-scripts" />;

/** `status` is `ready`, `loading` (a pulsing cover, the region busy) or `error` (the error words, announced). */
export const Statuses: S = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-3 gap-4">
      <EmbedFrame label="Map, ready" height="sm">
        {embed}
      </EmbedFrame>
      <EmbedFrame label="Map, loading" height="sm" status="loading">
        {embed}
      </EmbedFrame>
      <EmbedFrame
        label="Map, failed"
        height="sm"
        status="error"
        errorLabel="The map could not load. Check the address below."
      >
        {embed}
      </EmbedFrame>
    </div>
  ),
};

/** `height` is `sm` 18rem, `md` 24rem (the default) or `viewport`, 55% of the screen's height. */
export const Heights: S = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-3 items-start gap-4">
      {(["sm", "md", "viewport"] as const).map((height) => (
        <EmbedFrame key={height} label={`Map, ${height}`} height={height} status="loading">
          {embed}
        </EmbedFrame>
      ))}
    </div>
  ),
};

export const DoStatus: S = {
  render: examples.DoStatus,
};

export const DontStatus: S = {
  render: examples.DontStatus,
};
