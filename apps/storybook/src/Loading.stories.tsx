import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  KeyValue,
  KeyValueList,
  Markdown,
  MetaList,
  Pill,
  Stack,
  StatTile,
  Text,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Loading.examples.js";

const meta: Meta = { title: "Feedback/Loading" };
export default meta;
type S = StoryObj<{ loading: boolean }>;

type Quote = { total: string; customer: string; lines: string; vat: string };
const QUOTE: Quote = {
  total: "R 18 400",
  customer: "Cove Hardware",
  lines: "R 16 000",
  vat: "R 2 400",
};

export const DoWait: S = {
  render: examples.DoWait,
};

export const DontWait: S = {
  render: examples.DontWait,
};

/** Every text and figure part while it waits, each with its known caption drawn. Flip `loading` to land the data. */
export const Parts: S = {
  args: { loading: true },
  render: ({ loading }) => {
    const data = loading ? undefined : QUOTE;
    return (
      <div className="max-w-md">
        <KeyValueList loading={loading} loadingLabel="Loading the quote">
          <KeyValue label="Customer">{data?.customer}</KeyValue>
          <KeyValue label="VAT">{data?.vat}</KeyValue>
        </KeyValueList>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <StatTile loading={loading} label="Total" value={data?.total} />
          <Stack gap="xs">
            <Text loading={loading}>{data && "Cove Hardware asked for a second quote."}</Text>
            <MetaList loading={loading}>{data ? ["Q-1043", "Cove Hardware"] : []}</MetaList>
            <div className="flex gap-2">
              <Pill loading={loading} tone="positive">
                {data && "Accepted"}
              </Pill>
              <Badge loading={loading} count={3} />
            </div>
            <Markdown loading={loading} md={data && "- **Two** lines changed"} />
          </Stack>
        </div>
      </div>
    );
  },
};

export const DoPage: S = {
  render: examples.DoPage,
};

export const DontPage: S = {
  render: examples.DontPage,
};
