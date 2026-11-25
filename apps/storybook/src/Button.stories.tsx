import type { Meta, StoryObj } from "@storybook/react-vite";
import { buttonFixtures } from "@slashsuite/core";
import { Button, ButtonGroup } from "@slashsuite/ui-react";
import { ButtonFixture } from "./ButtonFixture";
import { CompactApp } from "./typeSteps";
import * as examples from "../../../packages/ui-react/docs/examples/Button.examples.js";

const meta: Meta = { title: "Actions/Button" };
export default meta;
type S = StoryObj;

/** One primary action per view, with the quieter variants beside it. */
export const Default: S = {
  render: () => (
    <ButtonGroup label="Quote actions">
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </ButtonGroup>
  ),
};

export const DoOnePrimary: S = {
  render: examples.DoOnePrimary,
};

export const DontOnePrimary: S = {
  render: examples.DontOnePrimary,
};

export const DoDisabledReason: S = {
  render: examples.DoDisabledReason,
};

export const DontDisabledReason: S = {
  render: examples.DontDisabledReason,
};

export const DoNavigate: S = {
  render: examples.DoNavigate,
};

export const DontNavigate: S = {
  render: examples.DontNavigate,
};

export const DoDestructive: S = {
  render: examples.DoDestructive,
};

export const DontDestructive: S = {
  render: examples.DontDestructive,
};

export const Variants: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Variants} />,
};
/** `variant="dashed"`: a dashed outline in muted text that fills its container, like a dashed Card: the "add another" row at the foot of a list. A leading icon is just a child. */
export const Dashed: S = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Button variant="dashed">Add a budget line</Button>
      <Button variant="dashed" size="sm" icon="plus">
        Add a category
      </Button>
      <Button variant="dashed" disabledReason="Pick a month first">
        Add a line
      </Button>
      <Button variant="dashed" busy="Adding…">
        Add a line
      </Button>
    </div>
  ),
};
export const Small: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Small} />,
};
export const Danger: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Danger} />,
};
/** `tone="positive"` is green, for accept and approve. Pair it with a red-outline reject. */
export const Positive: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Positive} />,
};
/** The review bar: Accept and Reject side by side. */
export const ReviewBar: S = {
  render: () => (
    <ButtonGroup label="Review">
      <Button tone="positive" size="sm">
        Accept
      </Button>
      <Button tone="danger" variant="outline" size="sm">
        Reject
      </Button>
    </ButtonGroup>
  ),
};
/** `pressed` makes a toggle on the outline and ghost variants: `aria-pressed`, neutral when off and the tone's primary fill when on. */
export const Pressed: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Pressed} />,
};
/** No box: text with an underline on hover, for an action inside a sentence or a table cell. */
export const LinkLook: S = {
  render: () => (
    <p className="max-w-xl text-sm text-slate-700">
      Row 14 of 90.{" "}
      <Button variant="link" size="sm">
        Edit
      </Button>{" "}
      <Button variant="link" size="sm" tone="danger">
        Remove
      </Button>{" "}
      <Button variant="link" size="sm" disabledReason="Already archived">
        Archive
      </Button>
    </p>
  ),
};
export const Disabled: S = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["neutral", "positive", "danger"] as const).map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-2">
          <Button tone={tone} disabled>
            Save
          </Button>
          <Button tone={tone} variant="outline" disabled>
            Cancel
          </Button>
          <Button tone={tone} variant="ghost" disabled>
            Skip
          </Button>
          <Button tone={tone} variant="link" disabled>
            Edit
          </Button>
        </div>
      ))}
    </div>
  ),
};
export const Blocked: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Blocked} />,
};
export const Busy: S = {
  render: () => <ButtonFixture fixture={buttonFixtures.Busy} />,
};
export const AsLink: S = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button href="#" variant="outline">
        List your shop
      </Button>
      <Button href="#" variant="outline" size="sm">
        List your shop
      </Button>
      <Button href="https://example.com" external tone="danger" variant="ghost">
        External
      </Button>
    </div>
  ),
};
/** An in-app `href` is drawn by the app's router Link through `LinkProvider`; here a stand-in. No router lives in @slashsuite/ui-react. */
export const WithRouterLink: S = {
  render: () => <Button href="/quotes">New quote</Button>,
};

/** `sm`, `md` (the default) and `lg`: the one size scale every control shares. */
const sizes = () => (
  <div className="flex flex-wrap items-center gap-2">
    {(["sm", "md", "lg"] as const).map((size) => (
      <Button key={size} size={size}>
        Save {size}
      </Button>
    ))}
    {(["sm", "md", "lg"] as const).map((size) => (
      <Button key={size} href="#quotes" size={size} variant="outline">
        Quotes {size}
      </Button>
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
