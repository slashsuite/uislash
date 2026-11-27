import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppShell,
  AppShellBrand,
  Button,
  Code,
  Pill,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextLink,
} from "@slashsuite/ui-react";

const meta: Meta = { title: "Data/Table" };
export default meta;
type S = StoryObj;

const flags = [
  {
    name: "Checkout v2",
    key: "checkout-v2",
    note: "The new checkout, behind a flag while it beds in.",
    uses: "1 204",
  },
  { name: "Saved carts", key: "saved-carts", note: "Keeps a cart across devices.", uses: "312" },
  {
    name: "Gift cards",
    key: "gift-cards",
    note: "Sells and redeems gift cards at the till and online.",
    uses: "48",
  },
];

/** The cell that names its row is a `TableHeaderCell` in the body row: a row header, drawn strong. */
export const RowHeaders: S = {
  render: () => (
    <Table label="Customers">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>City</TableHeaderCell>
          <TableHeaderCell numeric>Owed</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableHeaderCell>Acme Ltd</TableHeaderCell>
          <TableCell>Cape Town</TableCell>
          <TableCell>R 12 400</TableCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell>Blue Crane Bakery</TableHeaderCell>
          <TableCell>Durban</TableCell>
          <TableCell>R 860</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

function Flags() {
  return (
    <Table label="Flags">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Flag</TableHeaderCell>
          <TableHeaderCell>Note</TableHeaderCell>
          <TableHeaderCell numeric>Uses</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {flags.map((flag) => (
          <TableRow key={flag.key}>
            <TableCell>
              <TextLink href={`#${flag.key}`}>{flag.name}</TextLink> <Code>{flag.key}</Code>
            </TableCell>
            <TableCell>{flag.note}</TableCell>
            <TableCell>{flag.uses}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** On a phone: a link, a key and a figure never break; prose wraps to its floor, and the table scrolls in its card. */
export const NarrowScroll: S = {
  render: () => (
    <div className="max-w-[390px]">
      <Flags />
    </div>
  ),
};

/** The same table under an `AppShell`: while it scrolls sideways its head stays at its top, not pushed down over the rows by the header's height. */
export const NarrowScrollInAppShell: S = {
  render: () => (
    <AppShell brand={<AppShellBrand href="#" label="Flags" />}>
      <div className="max-w-[390px]">
        <Flags />
      </div>
    </AppShell>
  ),
};

function Builds() {
  return (
    <Table label="Builds" narrow="stack">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Build</TableHeaderCell>
          <TableHeaderCell>Branch</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell numeric>Changed</TableHeaderCell>
          <TableHeaderCell label="Actions" />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow stripe="danger">
          <TableHeaderCell>#412</TableHeaderCell>
          <TableCell mono>main</TableCell>
          <TableCell>
            <Pill tone="danger">failed</Pill>
          </TableCell>
          <TableCell>3</TableCell>
          <TableCell>
            <Button size="sm">Review</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell>#411</TableHeaderCell>
          <TableCell mono>fix/cart-totals</TableCell>
          <TableCell>
            <Pill tone="positive">passed</Pill>
          </TableCell>
          <TableCell>0</TableCell>
          <TableCell>
            <Button size="sm">Review</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

/** `narrow="stack"`: on a phone each row is a card, the first column its title and each other cell a line under its column's title; with room it is a table. */
export const Stacked: S = { render: () => <Builds /> };
