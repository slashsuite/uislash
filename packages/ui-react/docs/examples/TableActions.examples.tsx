import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

/** A row's actions get a column of their own whose head has a `label`: the head keeps its column and a screen reader hears "Actions". */
export const DoActionsColumn = () => (
  <Table label="Clients">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Client</TableHeaderCell>
        <TableHeaderCell align="end" label="Actions" />
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell tone="strong">Naledi Dlamini</TableCell>
        <TableCell align="end">
          <Button variant="outline" size="sm">
            Open
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

/** An empty header cell leaves the column with no name, so a screen reader hears a column of unlabelled buttons. */
export const DontActionsColumn = () => (
  <Table label="Clients">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Client</TableHeaderCell>
        <TableHeaderCell align="end" />
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell tone="strong">Naledi Dlamini</TableCell>
        <TableCell align="end">
          <Button variant="outline" size="sm">
            Open
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
