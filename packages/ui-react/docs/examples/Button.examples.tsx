import { Button, ButtonGroup } from "@slashsuite/ui-react";

/** One primary action per view: the quieter variants carry the rest. */
export const DoOnePrimary = () => (
  <ButtonGroup>
    <Button>Save</Button>
    <Button variant="outline">Cancel</Button>
  </ButtonGroup>
);

/** Two primaries compete for the eye, and nobody can tell which action the view is about. */
export const DontOnePrimary = () => (
  <ButtonGroup>
    <Button>Save</Button>
    <Button>Save and close</Button>
  </ButtonGroup>
);

/** `disabledReason` greys the button and shows the reason as a tooltip on hover, keyboard focus and a tap; the button stays in the tab order. */
export const DoDisabledReason = () => <Button disabledReason="Pick a shop first">Save</Button>;

/** A bare `disabled` leaves the user guessing why nothing happens. */
export const DontDisabledReason = () => <Button disabled>Save</Button>;

/** Going to another page is a link: `Button` with `href` keeps the anchor, middle-click and the URL. */
export const DoNavigate = () => (
  <Button href="#quotes" variant="outline">
    Open quotes
  </Button>
);

/** A button that sets `location` loses middle-click, the status-bar URL and crawlability. */
export const DontNavigate = () => (
  <Button variant="outline" onClick={() => location.assign("#quotes")}>
    Open quotes
  </Button>
);

/** A destructive action is `tone="danger"`, so the red says what the button does before it is read. */
export const DoDestructive = () => (
  <ButtonGroup>
    <Button tone="danger">Delete quote</Button>
    <Button variant="outline">Cancel</Button>
  </ButtonGroup>
);

/** A delete in the primary look reads as the safe, expected action; the tone is what warns. */
export const DontDestructive = () => (
  <ButtonGroup>
    <Button>Delete quote</Button>
    <Button variant="outline">Cancel</Button>
  </ButtonGroup>
);
