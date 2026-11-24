import { Checkbox, Cluster, Text } from "@slashsuite/ui-react";

/** A yes or no is a `Checkbox` with its `label`: the whole label is the click target. */
export const DoLabel = () => (
  <Checkbox label="Email me when a shop I follow posts" defaultChecked />
);

/** A checkbox with the words beside it, not in it, names nothing: clicking the words does nothing. */
export const DontLabel = () => (
  <Cluster gap="sm">
    <Checkbox />
    <Text>Email me when a shop I follow posts</Text>
  </Cluster>
);

/** In a table cell there is no room for words: leave the `label` out, use `size="sm"` and name the box with `aria-label`. */
export const DoRow = () => <Checkbox size="sm" aria-label="Select row" />;

/** Words beside a box in a table cell crowd the row and repeat the row's own name. Leave the `label` out and name the box with `aria-label`. */
export const DontRow = () => <Checkbox label="Select row" />;

/** `disabledReason` says why the box cannot change: it dims, keeps its focus and shows the reason as its tooltip. */
export const DoDisabledReason = () => (
  <Checkbox label="Email the team" disabledReason="Add an email address first" />
);

/** A bare `disabled` box drops out of the tab order and never says why. */
export const DontDisabledReason = () => <Checkbox label="Email the team" disabled />;
