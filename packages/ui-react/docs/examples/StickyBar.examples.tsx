import { Button, Card, Cluster, Input, StickyBar } from "@slashsuite/ui-react";

/** The page's filters and its bulk action go in one `StickyBar`, so they stay in reach under the header as the list scrolls. */
export const DoBar = () => (
  <StickyBar>
    <Cluster justify="between">
      <Input aria-label="Filter builds" placeholder="Filter builds" width="auto" />
      <Button size="sm" variant="outline">
        Accept all
      </Button>
    </Cluster>
  </StickyBar>
);

/** Filters in a `Card` at the top of the page scroll away with it, so the action is out of reach halfway down a long list. Use `StickyBar`. */
export const DontBar = () => (
  <Card>
    <Cluster justify="between">
      <Input aria-label="Filter builds" placeholder="Filter builds" width="auto" />
      <Button size="sm" variant="outline">
        Accept all
      </Button>
    </Cluster>
  </Card>
);
