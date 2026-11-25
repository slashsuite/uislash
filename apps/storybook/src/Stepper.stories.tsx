import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Stepper.examples.js";

const meta: Meta = { title: "Navigation/Stepper" };
export default meta;
type S = StoryObj;

export const DoProgress: S = {
  render: examples.DoProgress,
};

export const DontProgress: S = {
  render: examples.DontProgress,
};

const STEPS = ["Cart", "Shipping", "Payment", "Review"];

/** The first step, the middle and every step done. */
export const States: S = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Stepper label="Just started" steps={STEPS} current={1} />
      <Stepper label="Half way" steps={STEPS} current={3} />
      <Stepper label="Finished" steps={STEPS} current={5} />
    </div>
  ),
};
