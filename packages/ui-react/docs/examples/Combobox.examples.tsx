import { Combobox, Select } from "@slashsuite/ui-react";

/** A choice from a long list is a `Combobox`: typing a few letters finds it. */
export const DoTimeZone = () => (
  <Combobox
    label="Time zone"
    defaultValue="Europe/Amsterdam"
    width="md"
    items={[
      "Africa/Johannesburg",
      "America/New_York",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Europe/Amsterdam",
      "Europe/London",
      "Pacific/Auckland",
    ].map((zone) => ({ value: zone, label: zone.replace("_", " ") }))}
  />
);

/** A `Select` of a long list makes the person scroll through every entry for theirs. */
export const DontTimeZone = () => (
  <Select
    aria-label="Time zone"
    defaultValue="Europe/Amsterdam"
    items={[
      "Africa/Johannesburg",
      "America/New_York",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Europe/Amsterdam",
      "Europe/London",
      "Pacific/Auckland",
    ].map((zone) => ({ value: zone, label: zone.replace("_", " ") }))}
  />
);
