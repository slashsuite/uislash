import { useState } from "react";
import { Tabs, SegmentedControl, Stack, Text } from "@slashsuite/ui-react";

/** `Tabs` switches a view in place; the panel it controls sits right under the row. */
export const DoSwitchView = () => {
  const [value, setValue] = useState("overview");
  return (
    <Stack>
      <Tabs
        label="Project views"
        value={value}
        onChange={setValue}
        items={[
          { value: "overview", label: "Overview", controls: "panel" },
          { value: "activity", label: "Activity", controls: "panel" },
          { value: "settings", label: "Settings", controls: "panel" },
        ]}
      />
      <div id="panel" role="tabpanel">
        <Text>Showing {value}.</Text>
      </div>
    </Stack>
  );
};

/** A `SegmentedControl` that swaps the panel under it picks a value, not a view: no tab list, no panel tied to it. Switching the panel is `Tabs`. */
export const DontSwitchView = () => {
  const [value, setValue] = useState("overview");
  return (
    <Stack>
      <SegmentedControl
        label="Project views"
        value={value}
        onChange={setValue}
        items={[
          { value: "overview", label: "Overview" },
          { value: "activity", label: "Activity" },
          { value: "settings", label: "Settings" },
        ]}
      />
      <Text>Showing {value}.</Text>
    </Stack>
  );
};

/** Going to another page is not a tab: `Tabs` with `href` items are links, so the URL and history move. */
export const DoSwitchPage = () => (
  <Tabs
    label="Sections"
    items={[
      { label: "Quotes", href: "#quotes", selected: true },
      { label: "Invoices", href: "#invoices" },
    ]}
  />
);

/** A `Tabs` row that only navigates leaves the URL, the back button and a new tab behind. */
export const DontSwitchPage = () => {
  const [value, setValue] = useState("quotes");
  return (
    <Tabs
      label="Sections"
      value={value}
      onChange={(next) => {
        setValue(next);
        location.assign(`#${next}`);
      }}
      items={[
        { value: "quotes", label: "Quotes" },
        { value: "invoices", label: "Invoices" },
      ]}
    />
  );
};

/** A `count` sits muted after the label and is read as part of the tab's name. */
export const DoCount = () => {
  const [value, setValue] = useState("shots");
  return (
    <Tabs
      label="Assets"
      value={value}
      onChange={setValue}
      items={[
        { value: "shots", label: "Shots", count: 12 },
        { value: "clips", label: "Clips", count: 3 },
      ]}
    />
  );
};

/** A count typed into the label is plain text: it does not mute, and it cannot be styled the same. */
export const DontCount = () => {
  const [value, setValue] = useState("shots");
  return (
    <Tabs
      label="Assets"
      value={value}
      onChange={setValue}
      items={[
        { value: "shots", label: "Shots (12)" },
        { value: "clips", label: "Clips (3)" },
      ]}
    />
  );
};
