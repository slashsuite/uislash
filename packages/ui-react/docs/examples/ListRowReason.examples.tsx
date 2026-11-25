import { Card, ListRow, Stack } from "@slashsuite/ui-react";

/** `disabledReason` on a button row: it dims and does nothing, stays in the tab order, and the reason is its tooltip. */
export const DoDisabledReason = () => (
  <Card flush>
    <Stack divided>
      <ListRow onClick={() => undefined} trailing="R 1 850">
        Rent
      </ListRow>
      <ListRow
        onClick={() => undefined}
        trailing="R 640"
        disabledReason="Paid by the landlord this month"
      >
        Water
      </ListRow>
    </Stack>
  </Card>
);

/** A row that silently ignores its click leaves the person tapping it again. */
export const DontDisabledReason = () => (
  <Card flush>
    <Stack divided>
      <ListRow onClick={() => undefined} trailing="R 1 850">
        Rent
      </ListRow>
      <ListRow onClick={() => undefined} trailing="R 640">
        Water
      </ListRow>
    </Stack>
  </Card>
);
