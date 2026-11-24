import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Field, Select } from "@slashsuite/ui-react";
import { CompactApp } from "./typeSteps";
import * as examples from "../../../packages/ui-react/docs/examples/Select.examples.js";

const meta: Meta = { title: "Forms/Select" };
export default meta;
type S = StoryObj;

const rating = [
  { value: "5", label: "★★★★★ (5)" },
  { value: "4", label: "★★★★ (4)" },
  { value: "3", label: "★★★ (3)" },
  { value: "2", label: "★★ (2)" },
  { value: "1", label: "★ (1)" },
];

export const Default: S = {
  render: () => <Select defaultValue="5" items={rating} />,
};
export const Small: S = {
  render: () => <Select size="sm" width="md" aria-label="Rating" defaultValue="5" items={rating} />,
};
/** A fixed width replaces the full width: `xs`, `sm`, `md` or `lg`, on the scale an `Input` takes. */
export const FixedWidths: S = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(["xs", "sm", "md", "lg"] as const).map((width) => (
        <Select key={width} width={width} aria-label={width} defaultValue="5" items={rating} />
      ))}
    </div>
  ),
};
export const AutoWidth: S = {
  render: () => <Select width="auto" aria-label="Rating" defaultValue="5" items={rating} />,
};
/** `width="fill"` grows to the room left in a row, so the button beside it stays on the line. */
export const FillWidth: S = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex max-w-lg flex-wrap items-center gap-2">
      <Select width="fill" aria-label="Rating" defaultValue="5" items={rating} />
      <Button>Apply</Button>
    </div>
  ),
};
export const Disabled: S = {
  render: () => <Select defaultValue="5" disabled items={rating} />,
};

export const DoChoice: S = {
  render: examples.DoChoice,
};

export const DontChoice: S = {
  render: examples.DontChoice,
};

/** `sm`, `md` (the default) and `lg`. */
const sizes = () => (
  <div className="flex flex-wrap items-center gap-2">
    {(["sm", "md", "lg"] as const).map((size) => (
      <Select
        key={size}
        size={size}
        width="md"
        aria-label={`Rating ${size}`}
        defaultValue="5"
        items={rating}
      />
    ))}
  </div>
);

export const Sizes: S = {
  render: sizes,
};

/** The same sizes in an app that set `AppShell density="compact"`: each is one type step down. */
export const SizesCompact: S = {
  parameters: { layout: "fullscreen" },
  render: () => <CompactApp>{sizes()}</CompactApp>,
};

/** In an errored `Field`, the select takes a red edge and is described by the error. */
export const Invalid: S = {
  render: () => (
    <div className="max-w-md">
      <Field label="Rating" error="Pick a rating.">
        <Select defaultValue="1" items={rating} />
      </Field>
    </div>
  ),
};
