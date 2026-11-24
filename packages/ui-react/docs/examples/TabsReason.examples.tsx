import { useState } from "react";
import { Tabs } from "@slashsuite/ui-react";

/** `disabledReason` on a tab: it dims and chooses nothing, the arrow keys still reach it, and the reason is its tooltip. */
export const DoDisabledReason = () => {
  const [value, setValue] = useState("overview");
  return (
    <Tabs
      label="Project views"
      items={[
        { value: "overview", label: "Overview" },
        { value: "builds", label: "Builds" },
        { value: "billing", label: "Billing", disabledReason: "Only an owner sees billing" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
};

/** A bare `disabled` tab is skipped by the arrows and never says why. */
export const DontDisabledReason = () => {
  const [value, setValue] = useState("overview");
  return (
    <Tabs
      label="Project views"
      items={[
        { value: "overview", label: "Overview" },
        { value: "builds", label: "Builds" },
        { value: "billing", label: "Billing", disabled: true },
      ]}
      value={value}
      onChange={setValue}
    />
  );
};
