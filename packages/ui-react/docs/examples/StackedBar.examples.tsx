import { StackedBar } from "@slashsuite/ui-react";

/** `legend` names every colour in words, with its value, under the bar. */
export const DoLegend = () => (
  <StackedBar
    items={[
      { label: "Changed", value: 24, tone: "warn" },
      { label: "New", value: 9, tone: "info" },
      { label: "Same", value: 163, tone: "muted" },
    ]}
    label="Screenshots by status"
    legend
  />
);

/** Without `legend` the colours are never named, so the bar cannot be read by anyone who cannot tell them apart. */
export const DontLegend = () => (
  <StackedBar
    items={[
      { label: "Changed", value: 24, tone: "warn" },
      { label: "New", value: 9, tone: "info" },
      { label: "Same", value: 163, tone: "muted" },
    ]}
    label="Screenshots by status"
  />
);

/** Categories with no meaning take the categorical scale, `cat1` upwards in order, so no colour says good or bad. */
export const DoCategories = () => (
  <StackedBar
    items={[
      { label: "Vintage", value: 14, tone: "cat1" },
      { label: "Books", value: 9, tone: "cat2" },
      { label: "Furniture", value: 7, tone: "cat3" },
    ]}
    label="Shops by category"
    legend
  />
);

/** The meaning tones on categories make one read as a warning and another as a failure, which they are not. */
export const DontCategories = () => (
  <StackedBar
    items={[
      { label: "Vintage", value: 14, tone: "warn" },
      { label: "Books", value: 9, tone: "danger" },
      { label: "Furniture", value: 7, tone: "positive" },
    ]}
    label="Shops by category"
    legend
  />
);
