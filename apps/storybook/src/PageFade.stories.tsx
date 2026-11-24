import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PageFade, SegmentedControl, startPageTransition, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/PageFade.examples.js";

const meta: Meta = { title: "Feedback/PageFade" };
export default meta;
type S = StoryObj;

const pages = [
  { value: "overview", label: "Overview", text: "The overview page: a summary of the project." },
  { value: "activity", label: "Activity", text: "The activity page: what changed, and when." },
];

/**
 * The frame stays put and the content cross-fades. The route change stands in as a state change
 * wrapped in `startPageTransition`; a router's own view-transition option does the same job.
 * With `prefers-reduced-motion: reduce`, or in a browser without View Transitions, it just swaps.
 */
export const Default: S = {
  render: () => {
    const [value, setValue] = useState("overview");
    const page = pages.find((p) => p.value === value);
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <SegmentedControl
          label="Page"
          items={pages}
          value={value}
          onChange={(next) => startPageTransition(() => setValue(next))}
        />
        <PageFade>
          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
            <Text>{page?.label}</Text>
            <Text as="span">{page?.text}</Text>
          </div>
        </PageFade>
      </div>
    );
  },
};

export const DoChangingArea: S = {
  render: examples.DoChangingArea,
};

export const DontChangingArea: S = {
  render: examples.DontChangingArea,
};

export const DoTransition: S = {
  render: examples.DoTransition,
};

export const DontTransition: S = {
  render: examples.DontTransition,
};
