import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Breadcrumbs.examples.js";

const meta: Meta = { title: "Navigation/Breadcrumbs" };
export default meta;
type S = StoryObj;

export const DoTrail: S = {
  render: examples.DoTrail,
};

export const DontTrail: S = {
  render: examples.DontTrail,
};

export const DoHierarchy: S = {
  render: examples.DoHierarchy,
};

export const DontHierarchy: S = {
  render: examples.DontHierarchy,
};

const link = (href: string, label: string) => ({ label, href });

export const Two: S = {
  render: () => <Breadcrumbs items={[link("/", "Projects"), "Hack Cove"]} />,
};

export const Four: S = {
  render: () => (
    <Breadcrumbs
      items={[link("/", "Org"), link("/project", "Project"), link("/build", "Build"), "Snapshot"]}
    />
  ),
};

export const PlainParents: S = {
  render: () => <Breadcrumbs items={["Org", "Project", "Build", "Snapshot"]} />,
};

export const LongTruncates: S = {
  render: () => (
    <div className="flex w-72">
      <Breadcrumbs
        items={[
          link("/", "An organisation with a very long name"),
          link("/project", "A project whose name keeps going well past the width"),
          link("/build", "Build 2026-10-22"),
          "The snapshot you are looking at right now, with an even longer title",
        ]}
      />
    </div>
  ),
};

/** A crumb object links with `href`, an in-app one through the app's `LinkProvider`; the last is never a link. */
export const LinkCrumbs: S = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: "Quotes", href: "/quotes" },
        { label: "Docs", href: "https://example.com/docs", external: true },
        "Quote 12",
      ]}
    />
  ),
};
