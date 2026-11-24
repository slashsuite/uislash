import { Button, Card, ListRow } from "@slashsuite/ui-react";

/** Rows sit in a `Card flush`, and `divided` draws the line between them on every row after the first. */
export const DoList = () => (
  <Card flush>
    <ListRow trailing="R 9 500">Rent</ListRow>
    <ListRow divided trailing="R 1 850">
      Transport
    </ListRow>
    <ListRow divided href="#bills" trailing="3">
      Bills
    </ListRow>
  </Card>
);

/** Rows in a Card that is not `flush` sit inside its padding, so the hover fill stops short of the edges and the lines do not run across. */
export const DontList = () => (
  <Card>
    <ListRow trailing="R 9 500">Rent</ListRow>
    <ListRow divided trailing="R 1 850">
      Transport
    </ListRow>
  </Card>
);

/** A row that holds its own buttons has no `href` and no `onClick`, and the buttons go in `actions`. */
export const DoRowActions = () => (
  <Card flush>
    <ListRow
      actions={
        <>
          <Button size="sm" variant="outline">
            Reject
          </Button>
          <Button size="sm">Accept</Button>
        </>
      }
    >
      Grace Hopper
    </ListRow>
  </Card>
);
