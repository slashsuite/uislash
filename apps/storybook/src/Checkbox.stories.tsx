import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  Checkbox,
  Cluster,
  Fieldset,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Checkbox.examples.js";

const meta: Meta = { title: "Forms/Checkbox" };
export default meta;
type S = StoryObj;

export const Unchecked: S = {
  render: () => <Checkbox label="Open now" />,
};
export const Checked: S = {
  render: () => <Checkbox label="Open now" defaultChecked />,
};
/** Some of a group ticked: a dash in the filled box, read out as "mixed". */
export const Indeterminate: S = {
  render: () => <Checkbox label="All stores" indeterminate />,
};
export const Small: S = {
  render: () => <Checkbox label="Paid" size="sm" defaultChecked />,
};
/** No label, for a table cell: name it with `aria-label`. */
export const Bare: S = {
  render: () => <Checkbox aria-label="Select row" size="sm" />,
};
export const Disabled: S = {
  render: () => <Checkbox label="Open now" disabled />,
};
/** A label that wraps: the box sits on its first line. Every checkbox does this; there is no prop for it. */
export const MultiLine: S = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Checkbox
        label="Email me when a shop I follow posts a new find, and a weekly summary of the best ones"
        defaultChecked
      />
      <Checkbox
        label="Email me when a shop I follow posts a new find, and a weekly summary of the best ones"
        defaultChecked
      />
    </div>
  ),
};

/** `hint` is a muted line under the label that the box is described by; the box sits on the label's first line. */
export const WithDescription: S = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Checkbox
        label="Weekly summary"
        hint="One email on Mondays with the best finds from the shops you follow."
        defaultChecked
      />
      <Checkbox size="sm" label="Price drops" hint="Only for items on your watchlist." />
      <Checkbox label="Weekly summary" hint="Paused while you are away." disabled />
    </div>
  ),
};

/** `variant="card"` draws each box as an option card: the label a title, the hint its description, a ticked one with an accent edge. */
export const Cards: S = {
  render: () => (
    <div className="w-96">
      <Fieldset label="Notifications">
        <Checkbox
          variant="card"
          label="Weekly summary"
          hint="One email on Mondays with the best finds."
          defaultChecked
        />
        <Checkbox variant="card" label="Price drops" hint="Only for items on your watchlist." />
        <Checkbox variant="card" label="Shop news" hint="Paused while you are away." disabled />
        <Checkbox
          variant="card"
          size="sm"
          label="Terms"
          hint="Read them before you list."
          error="Accept the terms to continue."
        />
      </Fieldset>
    </div>
  ),
};

export const DoLabel: S = {
  render: examples.DoLabel,
};

export const DontLabel: S = {
  render: examples.DontLabel,
};

export const DoRow: S = {
  render: examples.DoRow,
};

export const DontRow: S = {
  render: examples.DontRow,
};

/** A ticked box inside a Card or a table row draws its tick above the lifted field, not under it. */
export const InCard: S = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Card title="Notifications">
        <div className="flex flex-col gap-3">
          <Checkbox label="Email me when a shop I follow posts" defaultChecked />
          <Checkbox label="Weekly summary" />
        </div>
      </Card>
      <Card title="Shops">
        <Table label="Shops">
          <TableHead>
            <TableRow>
              <TableHeaderCell>
                <Checkbox aria-label="Select all" size="sm" />
              </TableHeaderCell>
              <TableHeaderCell>Shop</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Checkbox aria-label="Select Hack Cove Finds" size="sm" defaultChecked />
              </TableCell>
              <TableCell tone="strong">Hack Cove Finds</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  ),
};

/** `sm`, `md` (the default) and `lg`: the box grows with the label. */
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Cluster key={size} gap="md">
          <Checkbox size={size} label={`Paid, ${size}`} />
          <Checkbox size={size} label={`Paid, ${size}`} defaultChecked />
        </Cluster>
      ))}
    </div>
  ),
};

export const DoDisabledReason: S = {
  render: examples.DoDisabledReason,
};

export const DontDisabledReason: S = {
  render: examples.DontDisabledReason,
};

/** While `loading` the label is drawn and the box is a bone of its size. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <Checkbox loading={loading} label="Email me when a quote is accepted" defaultChecked />
  ),
};
