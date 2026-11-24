import { useState } from "react";
import { SegmentedControl } from "@slashsuite/ui-react";

/** A mode or a range chosen in place: the caller owns `value`, and `label` names the group. */
export const DoMode = () => {
  const [value, setValue] = useState("week");
  return (
    <SegmentedControl
      label="Range"
      items={[
        { value: "day", label: "Daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
};

/** An on/off setting is a `Checkbox`, not a two-option SegmentedControl. */
export const DontMode = () => {
  const [value, setValue] = useState("on");
  return (
    <SegmentedControl
      label="Email me"
      items={[
        { value: "on", label: "On" },
        { value: "off", label: "Off" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
};

/** An option that cannot be chosen yet stays in the group with a `disabledReason` that says why. */
export const DoDisabledReason = () => {
  const [value, setValue] = useState("split");
  return (
    <SegmentedControl
      label="Split"
      items={[
        { value: "split", label: "Split" },
        { value: "even", label: "Even" },
        { value: "custom", label: "Custom", disabledReason: "Needs two or more people" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
};

/** A bare `disabled` option leaves the person guessing why it is greyed out. */
export const DontDisabledReason = () => {
  const [value, setValue] = useState("split");
  return (
    <SegmentedControl
      label="Split"
      items={[
        { value: "split", label: "Split" },
        { value: "even", label: "Even" },
        { value: "custom", label: "Custom", disabled: true },
      ]}
      value={value}
      onChange={setValue}
    />
  );
};

/** Options that go to another page are links: `href` on each, and `value` marks the current page. */
export const DoLinks = () => (
  <SegmentedControl
    label="Journal"
    value="daily"
    items={[
      { value: "daily", label: "Daily", href: "#daily" },
      { value: "weekly", label: "Weekly", href: "#weekly" },
    ]}
  />
);

/** Buttons that navigate from `onChange` are not links: they cannot be opened in a new tab or copied, and the current page is not marked as one. */
export const DontLinks = () => (
  <SegmentedControl
    label="Journal"
    value="daily"
    items={[
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
    ]}
    onChange={(value) => window.location.assign(`#${value}`)}
  />
);
