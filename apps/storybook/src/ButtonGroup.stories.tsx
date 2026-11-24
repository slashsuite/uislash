import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/ButtonGroup.examples.js";

const meta: Meta = { title: "Actions/Button", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

export const DoRow: S = {
  render: examples.DoRow,
};

export const DontRow: S = {
  render: examples.DontRow,
};

export const Group: S = {
  render: () => (
    <ButtonGroup label="Quote actions">
      <Button>Save</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="outline" tone="danger">
        Discard
      </Button>
    </ButtonGroup>
  ),
};

/** `end` sits at the far side of the row. */
export const WithEnd: S = {
  render: () => (
    <ButtonGroup
      label="Quote actions"
      end={
        <Button href="#" variant="ghost">
          Back
        </Button>
      }
    >
      <Button>Save</Button>
      <Button variant="outline">Preview</Button>
    </ButtonGroup>
  ),
};

/** On a narrow viewport the row wraps and `end` stays at the end of the last line. */
export const Wraps: S = {
  render: () => (
    <div className="w-60">
      <ButtonGroup
        end={
          <Button href="#" variant="ghost">
            Back
          </Button>
        }
      >
        <Button>Save</Button>
        <Button variant="outline">Preview</Button>
        <Button variant="outline">Duplicate</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Compact: S = {
  render: () => (
    <ButtonGroup label="Row actions">
      <Button size="sm" variant="outline">
        Edit
      </Button>
      <Button size="sm" variant="outline" tone="danger">
        Remove
      </Button>
    </ButtonGroup>
  ),
};
