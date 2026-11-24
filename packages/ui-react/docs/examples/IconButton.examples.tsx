import { Button, IconButton } from "@slashsuite/ui-react";

/** `label` names the button for a screen reader and shows as its tooltip; the icon is only decoration. */
export const DoLabel = () => (
  <IconButton label="Delete quote" tone="danger" variant="ghost" icon="close" />
);

/** A `Button` holding a glyph has no accessible name, no tooltip and the wrong box; an icon-only action is an `IconButton`. */
export const DontLabel = () => (
  <Button variant="ghost" tone="danger" size="sm">
    <span aria-hidden="true">x</span>
  </Button>
);

/** `count` pins the count to the corner and adds it to the accessible name ("Alerts, 3"). */
export const DoBadge = () => <IconButton label="Alerts" count={3} icon="bell" />;

/** A count typed into the label shows only in the tooltip, so a sighted user never sees it on the button. */
export const DontBadge = () => <IconButton label="Alerts (3)" icon="bell" />;

/** Going to another page is `href`: the same look on a real anchor, with middle-click and the URL. */
export const DoNavigate = () => (
  <IconButton href="#settings" label="Settings" variant="ghost" icon="settings" />
);

/** A button that sets `location` loses middle-click, the status-bar URL and crawlability. */
export const DontNavigate = () => (
  <IconButton
    label="Settings"
    variant="ghost"
    onClick={() => location.assign("#settings")}
    icon="settings"
  />
);

/** `disabledReason` says why it cannot be pressed: the button dims, stays in the tab order and shows the reason as its tooltip. */
export const DoDisabledReason = () => (
  <IconButton
    label="Delete quote"
    tone="danger"
    icon="close"
    disabledReason="Only the owner can delete it"
  />
);

/** A bare `disabled` drops it from the tab order and gives no reason. */
export const DontDisabledReason = () => (
  <IconButton label="Delete quote" tone="danger" icon="close" disabled />
);
