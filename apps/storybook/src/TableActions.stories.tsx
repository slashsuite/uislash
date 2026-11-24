import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/TableActions.examples.js";

const meta: Meta = { title: "Data/Table" };
export default meta;
type S = StoryObj;

/** A column with nothing to show in its head (a row's actions) takes `label` in place of children: the name a screen reader hears, visually hidden. */
export const ActionsColumn: S = {
  render: () => (
    <Table label="Clients">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Client</TableHeaderCell>
          <TableHeaderCell numeric>Premium</TableHeaderCell>
          <TableHeaderCell align="end" label="Actions" />
        </TableRow>
      </TableHead>
      <TableBody>
        {["Naledi Dlamini", "Pieter van Wyk"].map((client) => (
          <TableRow key={client}>
            <TableCell tone="strong">{client}</TableCell>
            <TableCell numeric>R 1 249.00</TableCell>
            <TableCell align="end">
              <Button variant="outline" size="sm">
                Open
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const DoActionsColumn: S = {
  render: examples.DoActionsColumn,
};

export const DontActionsColumn: S = {
  render: examples.DontActionsColumn,
};
