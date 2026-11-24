import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code, MetaList, TextLink } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/MetaList.examples.js";

const meta: Meta = { title: "Text/MetaList" };
export default meta;
type S = StoryObj;

export const Text: S = {
  render: () => (
    <MetaList>
      <span>chromium</span>
      <span>desktop</span>
      <span>1280×800</span>
    </MetaList>
  ),
};

export const Mixed: S = {
  render: () => (
    <MetaList>
      <TextLink href="#branch">hc-139</TextLink>
      <Code>0f9d376</Code>
      <span>26 Oct 2026</span>
    </MetaList>
  ),
};

export const Mono: S = {
  render: () => (
    <MetaList mono>
      <span>hc-139</span>
      <span>0f9d376</span>
      <span>2026-10-26</span>
    </MetaList>
  ),
};

export const Wraps: S = {
  render: () => (
    <div className="w-48">
      <MetaList>
        <span>chromium</span>
        <span>desktop</span>
        <span>1280×800</span>
        <span>dark theme</span>
      </MetaList>
    </div>
  ),
};

export const DoFacts: S = {
  render: examples.DoFacts,
};

export const DontFacts: S = {
  render: examples.DontFacts,
};

const links = [
  <TextLink key="privacy" href="#privacy">
    Privacy
  </TextLink>,
  <TextLink key="terms" href="#terms">
    Terms
  </TextLink>,
  <TextLink key="email" href="mailto:hello@example.com">
    hello@example.com
  </TextLink>,
];

/** A row of links: each link stays whole, so a line breaks only between them. */
export const Links: S = { render: () => <MetaList>{links}</MetaList> };

/** `separator="•"` swaps the dot for a bullet. */
export const LinksBullet: S = {
  render: () => <MetaList separator="•">{links}</MetaList>,
};

/** `separator="none"` leaves only the gap. */
export const LinksNoSeparator: S = {
  render: () => <MetaList separator="none">{links}</MetaList>,
};

export const LinksWrap: S = {
  render: () => (
    <div className="w-48">
      <MetaList>{links}</MetaList>
    </div>
  ),
};

export const DoFooter: S = {
  render: examples.DoFooter,
};

export const DontFooter: S = {
  render: examples.DontFooter,
};

type Loading = StoryObj<{ loading: boolean }>;

/** A row with no facts yet draws three word-sized bones. */
export const Loading: Loading = {
  args: { loading: true },
  render: ({ loading }) => (
    <MetaList loading={loading}>{loading ? [] : ["chromium", "desktop", "2 min ago"]}</MetaList>
  ),
};
