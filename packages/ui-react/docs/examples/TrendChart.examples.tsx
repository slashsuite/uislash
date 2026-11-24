import { TrendChart } from "@slashsuite/ui-react";

/** Bars for a count in each week: each bucket stands on its own. */
export const DoKind = () => (
  <TrendChart
    label="Tickets closed per week"
    buckets={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]}
    series={[{ label: "Closed", tone: "info", values: [4, 7, 3, 9, 12, 8, 6, 11] }]}
  />
);

/** A line joins buckets that have an order. Through categories it draws a trend that does not exist. */
export const DontKind = () => (
  <TrendChart
    label="Tickets by area"
    kind="line"
    buckets={["Web", "CLI", "Docs", "Infra", "Design", "Mobile"]}
    series={[{ label: "Tickets", tone: "info", values: [14, 6, 11, 3, 9, 5] }]}
  />
);
