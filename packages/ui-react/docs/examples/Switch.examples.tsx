import { useState } from "react";
import { Cluster, Switch, Table, TableBody, TableCell, TableRow, Text } from "@slashsuite/ui-react";

/** A Switch takes a `label`: the whole label is the click target, and it names the switch. */
export const DoLabel = () => {
  const [checked, setChecked] = useState(true);
  return <Switch label="Live in staging" checked={checked} onChange={setChecked} />;
};

/** Words beside the switch, not in it, name nothing: clicking the words does nothing. */
export const DontLabel = () => {
  const [checked, setChecked] = useState(true);
  return (
    <Cluster gap="sm">
      <Switch aria-label="Live in staging" checked={checked} onChange={setChecked} />
      <Text>Live in staging</Text>
    </Cluster>
  );
};

/** In a table cell there is no room for words: leave the `label` out, use `size="sm"` and name the switch with `aria-label`. */
export const DoRow = () => {
  const [checked, setChecked] = useState(true);
  return (
    <Table label="Flags">
      <TableBody>
        <TableRow>
          <TableCell mono>checkout-v2</TableCell>
          <TableCell>
            <Switch
              size="sm"
              aria-label="checkout-v2 in staging"
              checked={checked}
              onChange={setChecked}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

/** `disabledReason` says why it cannot flip: it washes out, keeps its focus and shows the reason as its tooltip. */
export const DoDisabledReason = () => (
  <Switch
    label="Live in production"
    checked={false}
    onChange={() => undefined}
    disabledReason="Pass the staging check first"
  />
);

/** A bare `disabled` switch drops out of the tab order and never says why. */
export const DontDisabledReason = () => (
  <Switch label="Live in production" checked={false} onChange={() => undefined} disabled />
);
