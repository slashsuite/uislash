import { Cluster, KeyValue, KeyValueList, Stack, Text } from "@slashsuite/ui-react";

/** Label and value pairs are a `KeyValueList`: one row per fact, the label muted, the value in tabular figures. */
export const DoFactsList = () => (
  <KeyValueList>
    <KeyValue label="Size">1280×720</KeyValue>
    <KeyValue label="Changed pixels">0.4%</KeyValue>
    <KeyValue label="Captured">2 min ago</KeyValue>
  </KeyValueList>
);

/** Rows built by hand from a `Cluster` and `Text` drift from the list's label colour and figures. Use `KeyValueList`. */
export const DontFactsList = () => (
  <Stack gap="xs">
    <Cluster justify="between">
      <Text as="span">Size</Text>
      <Text as="span">1280×720</Text>
    </Cluster>
    <Cluster justify="between">
      <Text as="span">Changed pixels</Text>
      <Text as="span">0.4%</Text>
    </Cluster>
  </Stack>
);

/** `align="start"` puts the values in one left-aligned column, for long values or a mix of short and long ones. */
export const DoAlignStart = () => (
  <KeyValueList align="start">
    <KeyValue label="Branch">hc-145-docs-for-every-export</KeyValue>
    <KeyValue label="Commit">83422a6</KeyValue>
    <KeyValue label="Captured">2 min ago</KeyValue>
  </KeyValueList>
);

/** Long values at the default `align="end"` push against the right edge in a ragged column. Long values take `align="start"`. */
export const DontAlignStart = () => (
  <KeyValueList>
    <KeyValue label="Branch">hc-145-docs-for-every-export</KeyValue>
    <KeyValue label="Commit">83422a6</KeyValue>
    <KeyValue label="Captured">2 min ago</KeyValue>
  </KeyValueList>
);
