import { Button, ButtonGroup, Cluster, ClusterGrow, Input, Pill, Text } from "@slashsuite/ui-react";

/** The one item that should take the room left goes in `ClusterGrow`: the input fills the row and the buttons keep their size. */
export const DoFillRow = () => (
  <Cluster>
    <ClusterGrow>
      <Input aria-label="Search" placeholder="Search invoices" />
    </ClusterGrow>
    <Button>Search</Button>
  </Cluster>
);

/** Without `ClusterGrow` the input keeps a fixed width and the rest of the row sits empty. Wrap the input in `ClusterGrow` instead. */
export const DontFillRow = () => (
  <Cluster>
    <Input aria-label="Search" placeholder="Search invoices" width="sm" />
    <Button>Search</Button>
  </Cluster>
);

/** A row of buttons is a `ButtonGroup`: it wraps on a phone and can pin one item to the end. */
export const DoButtons = () => (
  <ButtonGroup label="Invoice" end={<Button variant="outline">Back</Button>}>
    <Button>Send</Button>
    <Button variant="outline">Download</Button>
  </ButtonGroup>
);

/** `Cluster` is for every other row; a row of buttons in it does not wrap and has no end slot. */
export const DontButtons = () => (
  <Cluster>
    <Button>Send</Button>
    <Button variant="outline">Download</Button>
    <Button variant="outline">Back</Button>
  </Cluster>
);

/** An empty `ClusterGrow` is a spacer: the title stays at the start and the actions go to the end. */
export const DoSpacer = () => (
  <Cluster>
    <Text strong>Invoice 1042</Text>
    <ClusterGrow />
    <Button size="sm" variant="outline">
      Edit
    </Button>
    <Button size="sm" variant="outline" tone="danger">
      Remove
    </Button>
  </Cluster>
);

/** `justify="between"` spreads three items evenly, so the middle one floats away from the group it belongs to. */
export const DontSpacer = () => (
  <Cluster justify="between">
    <Text strong>Invoice 1042</Text>
    <Button size="sm" variant="outline">
      Edit
    </Button>
    <Button size="sm" variant="outline" tone="danger">
      Remove
    </Button>
  </Cluster>
);

/** A wrapping row of like things (a store's tags) is `Cluster as="ul"`: it puts each item in its own `li`, a list a screen reader counts. */
export const DoList = () => (
  <Cluster as="ul" aria-label="Tags">
    <Pill>Vintage</Pill>
    <Pill>Books</Pill>
    <Pill>Vinyl</Pill>
  </Cluster>
);

/** The same pills in a plain Cluster are three loose items: no list, no count. */
export const DontList = () => (
  <Cluster>
    <Pill>Vintage</Pill>
    <Pill>Books</Pill>
    <Pill>Vinyl</Pill>
  </Cluster>
);
