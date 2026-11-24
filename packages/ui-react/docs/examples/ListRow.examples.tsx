import { Button, Card, ListRow, Stack } from "@slashsuite/ui-react";

/** Rows sit in a `Stack divided` in a `Card flush`: the Stack draws the line between them. */
export const DoList = () => (
  <Card flush>
    <Stack divided>
      <ListRow trailing="R 9 500">Rent</ListRow>
      <ListRow trailing="R 1 850">Transport</ListRow>
      <ListRow href="#bills" trailing="3">
        Bills
      </ListRow>
    </Stack>
  </Card>
);

/** Rows in a Card that is not `flush` sit inside its padding, so the hover fill stops short of the edges and the lines do not run across. */
export const DontList = () => (
  <Card>
    <Stack divided>
      <ListRow trailing="R 9 500">Rent</ListRow>
      <ListRow trailing="R 1 850">Transport</ListRow>
    </Stack>
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
