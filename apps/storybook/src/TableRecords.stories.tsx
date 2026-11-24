import type { Meta, StoryObj } from "@storybook/react-vite";
import * as examples from "../../../packages/ui-react/docs/examples/TableRecords.examples.js";

const meta: Meta = { title: "Data/Table" };
export default meta;
type S = StoryObj;

export const DoRecords: S = {
  render: examples.DoRecords,
};

export const DontRecords: S = {
  render: examples.DontRecords,
};

export const DoTotals: S = {
  render: examples.DoTotals,
};

export const DontTotals: S = {
  render: examples.DontTotals,
};

export const DoRowStatus: S = {
  render: examples.DoRowStatus,
};

export const DontRowStatus: S = {
  render: examples.DontRowStatus,
};
