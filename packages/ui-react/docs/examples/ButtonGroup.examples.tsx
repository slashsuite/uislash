import { Button, ButtonGroup } from "@slashsuite/ui-react";

/** A `ButtonGroup` spaces and wraps its buttons, and `end` pushes one item to the far side. */
export const DoRow = () => (
  <ButtonGroup
    label="Quote actions"
    end={
      <Button href="#quotes" variant="ghost">
        Back
      </Button>
    }
  >
    <Button>Save</Button>
    <Button variant="outline">Preview</Button>
  </ButtonGroup>
);

/** Buttons loose in a div have no gap, do not wrap as one row, and the group has no name. */
export const DontRow = () => (
  <div>
    <Button>Save</Button>
    <Button variant="outline">Preview</Button>
    <Button href="#quotes" variant="ghost">
      Back
    </Button>
  </div>
);
