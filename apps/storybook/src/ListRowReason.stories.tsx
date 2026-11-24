import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Card, ListRow } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/ListRowReason.examples.js";

const meta: Meta = { title: "Data/ListRow" };
export default meta;
type S = StoryObj;

export const DoDisabledReason: S = {
  render: examples.DoDisabledReason,
};

export const DontDisabledReason: S = {
  render: examples.DontDisabledReason,
};

/** While `loading`, what a row has is drawn and an empty label is a bone. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <Card flush>
      <ListRow loading={loading} trailing="Today">
        {loading ? null : "Cove Hardware"}
      </ListRow>
      <ListRow loading={loading} divided leading={<Avatar name={loading ? "" : "Mia Botha"} />}>
        {loading ? null : "Mia Botha"}
      </ListRow>
    </Card>
  ),
};
