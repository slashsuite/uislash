import { useState } from "react";
import {
  Button,
  Card,
  CardGrid,
  KeyValue,
  KeyValueList,
  Stack,
  StatTile,
  Text,
  ListLayout,
  ListRow,
} from "@slashsuite/ui-react";

/**
 * Give the part `loading` and the same tree it draws with data: the captions it knows stay, and a
 * bone stands where each figure will land. A button lands the data here; an app passes its query's
 * pending flag.
 */
export const DoWait = () => {
  const [vat, setVat] = useState<string | undefined>(undefined);
  return (
    <Stack gap="md">
      <Button variant="outline" onClick={() => setVat(vat === undefined ? "R 2 400" : undefined)}>
        {vat === undefined ? "Land the data" : "Wait again"}
      </Button>
      <Card>
        <KeyValueList loading={vat === undefined} loadingLabel="Loading the quote">
          <KeyValue label="Customer">{vat && "Cove Hardware"}</KeyValue>
          <KeyValue label="Lines">{vat && "R 16 000"}</KeyValue>
          <KeyValue label="VAT">{vat}</KeyValue>
        </KeyValueList>
      </Card>
    </Stack>
  );
};

/** A "Loading..." line drops every caption the reader could already see, and the page jumps when the rows arrive. */
export const DontWait = () => (
  <Card>
    <Text tone="muted">Loading...</Text>
  </Card>
);

/**
 * Set `loading` once, on the page layout, and render the page you render with data: the header,
 * the actions and the filters draw as themselves, and every part inside waits with the layout.
 */
export const DoPage = () => {
  const [rows, setRows] = useState<string[] | undefined>(undefined);
  return (
    <ListLayout
      title="Quotes"
      loading={rows === undefined}
      loadingLabel="Loading quotes"
      actions={
        <Button
          variant="outline"
          onClick={() => setRows(rows === undefined ? ["Q-1043", "Q-1042", "Q-1041"] : undefined)}
        >
          {rows === undefined ? "Land the data" : "Wait again"}
        </Button>
      }
    >
      <CardGrid>
        <StatTile label="Open" value={rows && "3"} />
        <StatTile label="Total" value={rows && "R 41 200"} />
        <StatTile label="Accepted" value={rows && "1"} />
      </CardGrid>
      <Card flush>
        {rows?.map((ref, i) => (
          <ListRow key={ref} divided={i > 0}>
            {ref}
          </ListRow>
        ))}
      </Card>
    </ListLayout>
  );
};

/** A page swapped for a "Loading..." line loses its header and actions, and jumps when the data lands. */
export const DontPage = () => <Text tone="muted">Loading quotes...</Text>;
