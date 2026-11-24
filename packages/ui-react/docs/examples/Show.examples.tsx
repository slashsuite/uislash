import {
  Card,
  ListRow,
  Show,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

/** A table that only fits a wide screen is in a `Show from`; its phone form, a stack of rows, is in a `Show below` at the same breakpoint. */
export const DoSwap = () => (
  <Stack>
    <Show below="sm">
      <Card flush>
        <Stack as="ul" divided aria-label="Builds">
          <li>
            <ListRow secondary="main, 3 changed">Build 412</ListRow>
          </li>
          <li>
            <ListRow secondary="main, no changes">Build 411</ListRow>
          </li>
        </Stack>
      </Card>
    </Show>
    <Show from="sm">
      <Table label="Builds">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Build</TableHeaderCell>
            <TableHeaderCell>Branch</TableHeaderCell>
            <TableHeaderCell numeric>Changed</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Build 412</TableCell>
            <TableCell mono>main</TableCell>
            <TableCell numeric>3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Build 411</TableCell>
            <TableCell mono>main</TableCell>
            <TableCell numeric>0</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Show>
  </Stack>
);

/** The same table at every width squashes on a phone and scrolls sideways; never hide it with a class of your own either. */
export const DontSwap = () => (
  <Table label="Builds">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Build</TableHeaderCell>
        <TableHeaderCell>Branch</TableHeaderCell>
        <TableHeaderCell numeric>Changed</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Build 412</TableCell>
        <TableCell mono>main</TableCell>
        <TableCell numeric>3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Build 411</TableCell>
        <TableCell mono>main</TableCell>
        <TableCell numeric>0</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
