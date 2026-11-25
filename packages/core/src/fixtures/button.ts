/**
 * Button's story fixtures: the stories both renderers draw from the same data, so a web story and
 * its native shot share one story id (`actions-button--variants`). Each is a row of Buttons; the
 * renderer lays the row out by `layout` and draws each item with its own Button.
 */
import type { ButtonSize, ButtonTone, ButtonVariant } from "../button.js";
import type { StoryFixture } from "./types.js";

/** One Button in a fixture: its label and the props that change its look or state. */
export type ButtonFixtureItem = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
  pressed?: boolean;
  disabledReason?: string;
  busy?: boolean | string;
};

const TITLE = "Actions/Button";

const fixture = (
  story: string,
  layout: StoryFixture<ButtonFixtureItem>["layout"],
  items: ButtonFixtureItem[],
): StoryFixture<ButtonFixtureItem> => ({ title: TITLE, story, layout, items });

export const buttonFixtures = {
  Variants: fixture("Variants", "wrap", [
    { label: "Save" },
    { label: "Cancel", variant: "outline" },
    { label: "Skip", variant: "ghost" },
    { label: "Edit", variant: "link" },
  ]),
  Small: fixture("Small", "wrap-center", [
    { label: "Save", size: "sm" },
    { label: "Cancel", size: "sm", variant: "outline" },
    { label: "Skip", size: "sm", variant: "ghost" },
    { label: "Edit", size: "sm", variant: "link" },
    { label: "Remove", size: "sm", tone: "danger", variant: "outline" },
  ]),
  Danger: fixture("Danger", "wrap-center", [
    { label: "Delete", tone: "danger" },
    { label: "Clear", tone: "danger", variant: "outline" },
    { label: "Remove", tone: "danger", variant: "ghost" },
    { label: "Remove", tone: "danger", variant: "link" },
    { label: "Delete", tone: "danger", size: "sm" },
    { label: "Blocked", tone: "danger", disabledReason: "Nothing to delete" },
    { label: "Delete", tone: "danger", busy: "Deleting…" },
  ]),
  Positive: fixture("Positive", "wrap-center", [
    { label: "Accept", tone: "positive" },
    { label: "Accept", tone: "positive", variant: "outline" },
    { label: "Accept", tone: "positive", variant: "ghost" },
    { label: "Accept", tone: "positive", variant: "link" },
    { label: "Accept", tone: "positive", size: "sm" },
    { label: "Blocked", tone: "positive", disabledReason: "Nothing to accept" },
    { label: "Accept", tone: "positive", busy: "Accepting…" },
  ]),
  Pressed: fixture("Pressed", "wrap-center", [
    { label: "Flag", variant: "outline", pressed: false },
    { label: "Flag", variant: "outline", pressed: true },
    { label: "Flag", variant: "ghost", pressed: true },
    { label: "Accepted", variant: "outline", tone: "positive", pressed: true },
    { label: "Rejected", variant: "outline", tone: "danger", pressed: true },
  ]),
  Blocked: fixture("Blocked", "wrap", [
    { label: "Save", disabledReason: "Pick a shop first" },
    { label: "Cancel", variant: "outline", disabledReason: "Pick a shop first" },
    { label: "Skip", variant: "ghost", disabledReason: "Pick a shop first" },
  ]),
  Busy: fixture("Busy", "wrap", [
    { label: "Save", busy: "Saving…" },
    { label: "Cancel", variant: "outline", busy: "Cancelling…" },
    { label: "Skip", variant: "ghost", busy: true },
  ]),
} satisfies Record<string, StoryFixture<ButtonFixtureItem>>;
