import { Card, ListRow } from "@slashsuite/ui-react";

/** `disabledReason` on a button row: it dims and does nothing, stays in the tab order, and the reason is its tooltip. */
export const DoDisabledReason = () => (
  <Card flush>
    <ListRow onClick={() => undefined} trailing="R 1 850">
      Rent
    </ListRow>
    <ListRow
      divided
      onClick={() => undefined}
      trailing="R 640"
      disabledReason="Paid by the landlord this month"
    >
      Water
    </ListRow>
  </Card>
);

/** A row that silently ignores its click leaves the person tapping it again. */
export const DontDisabledReason = () => (
  <Card flush>
    <ListRow onClick={() => undefined} trailing="R 1 850">
      Rent
    </ListRow>
    <ListRow divided onClick={() => undefined} trailing="R 640">
      Water
    </ListRow>
  </Card>
);
