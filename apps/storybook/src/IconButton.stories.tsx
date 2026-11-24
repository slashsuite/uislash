import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, IconButton } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/IconButton.examples.js";

const meta: Meta = { title: "Actions/IconButton" };
export default meta;
type S = StoryObj;

export const DoLabel: S = {
  render: examples.DoLabel,
};

export const DontLabel: S = {
  render: examples.DontLabel,
};

export const DoBadge: S = {
  render: examples.DoBadge,
};

export const DontBadge: S = {
  render: examples.DontBadge,
};

export const DoNavigate: S = {
  render: examples.DoNavigate,
};

export const DontNavigate: S = {
  render: examples.DontNavigate,
};

export const Default: S = {
  render: () => <IconButton label="Switch to dark theme" icon="theme" />,
};
export const Disabled: S = {
  render: () => <IconButton label="Switch to dark theme" disabled icon="theme" />,
};
/** `variant="ghost"` has no border until the hover fill; `tone="danger"` is red. */
export const GhostAndDanger: S = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton label="Switch to dark theme" variant="ghost" icon="theme" />
      <IconButton label="Delete" tone="danger" icon="theme" />
      <IconButton label="Delete" variant="ghost" tone="danger" icon="theme" />
      <IconButton label="Delete" variant="ghost" tone="danger" disabled icon="theme" />
    </div>
  ),
};

/** `href` draws a link with the button's look; an in-app one goes through the app's router `<Link>`. */
export const AsLink: S = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton href="#settings" label="Settings" variant="ghost" icon="theme" />
      <IconButton href="/settings" label="Settings" icon="theme" />
    </div>
  ),
};

/** `count` pins a red count to the corner, on a button or a link; `label` names the count for a screen reader. Not shown at 0. */
export const Badged: S = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton label="Alerts" count={3} icon="theme" />
      <IconButton href="#alerts" label="Alerts" variant="ghost" count={120} icon="theme" />
      <IconButton href="#alerts" label="Alerts" count={0} icon="theme" />
    </div>
  ),
};

/** `sm` 26px, `md` 38px (the default) and `lg` 46px: each as tall as a `Button` of the size. */
export const Sizes: S = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <IconButton size={size} label={`Switch to dark theme, ${size}`} icon="theme" />
          <Button size={size} variant="outline">
            Button {size}
          </Button>
        </div>
      ))}
    </div>
  ),
};

/** The tooltip: `label` shows above the button on hover and on keyboard focus. Held open by focusing it. */
export const Tooltip: S = {
  render: () => (
    <div className="px-6 pt-14 pb-6">
      <IconButton label="Settings" variant="ghost" icon="settings" />
    </div>
  ),
  play: ({ canvasElement }) => {
    canvasElement.querySelector("button")?.focus();
  },
};

export const DoDisabledReason: S = {
  render: examples.DoDisabledReason,
};

export const DontDisabledReason: S = {
  render: examples.DontDisabledReason,
};
