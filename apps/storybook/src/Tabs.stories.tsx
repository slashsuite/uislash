import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Breadcrumbs, Button, Tabs, PageHeader, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Tabs.examples.js";

const meta: Meta = { title: "Navigation/Tabs" };
export default meta;
type S = StoryObj;

const views = ["overview", "activity", "settings"].map((value) => ({
  value,
  label: value[0]?.toUpperCase() + value.slice(1),
  controls: "panel",
}));

export const DoSwitchView: S = {
  render: examples.DoSwitchView,
};

export const DontSwitchView: S = {
  render: examples.DontSwitchView,
};

export const DoSwitchPage: S = {
  render: examples.DoSwitchPage,
};

export const DontSwitchPage: S = {
  render: examples.DontSwitchPage,
};

export const DoCount: S = {
  render: examples.DoCount,
};

export const DontCount: S = {
  render: examples.DontCount,
};

/** The caller owns `value`; click a tab, or Tab in and use the arrow keys, Home and End. */
export const Default: S = {
  render: () => {
    const [value, setValue] = useState("overview");
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <Tabs label="Project views" items={views} value={value} onChange={setValue} />
        <div id="panel" role="tabpanel">
          <Text>Showing {value}.</Text>
        </div>
      </div>
    );
  },
};

/** An item takes `data-*` attributes (a test id, an analytics hook) on its button or link, and nothing else: no class, no style. */
export const WithDataAttributes: S = {
  render: () => {
    const [value, setValue] = useState("overview");
    return (
      <Tabs
        label="Project views"
        items={views.map((v) => ({ ...v, "data-testid": `tab-${v.value}` }))}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const WithDisabledTab: S = {
  render: () => {
    const [value, setValue] = useState("overview");
    return (
      <Tabs
        label="Project views"
        items={[
          { value: "overview", label: "Overview" },
          { value: "activity", label: "Activity", disabled: true },
          { value: "settings", label: "Settings" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/** The current tab is a filled pill, as a row of page links draws it, with no rule under the row. */
export const Pill: S = {
  render: () => {
    const [value, setValue] = useState("overview");
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <Tabs label="Project views" items={views} value={value} onChange={setValue} />
        <div id="panel" role="tabpanel">
          <Text>Showing {value}.</Text>
        </div>
      </div>
    );
  },
};

/** A `count` sits muted after the label and is part of the tab's name ("Shots 12"), in both variants. */
export const WithCounts: S = {
  render: () => {
    const [value, setValue] = useState("shots");
    const items = [
      { value: "shots", label: "Shots", count: 12 },
      { value: "clips", label: "Clips", count: 0 },
      { value: "notes", label: "Notes" },
    ];
    return (
      <div className="flex max-w-xl flex-col gap-6">
        <Tabs label="Assets" items={items} value={value} onChange={setValue} />
        <Tabs label="Assets" items={items} value={value} onChange={setValue} />
      </div>
    );
  },
};

/** A tab with `disabledReason` shows the reason as its tooltip; the arrow keys reach it and choose nothing. */
export const WithDisabledReason: S = {
  render: () => {
    const [value, setValue] = useState("overview");
    const items = [
      { value: "overview", label: "Overview" },
      { value: "activity", label: "Activity", disabledReason: "No activity yet" },
      { value: "settings", label: "Settings" },
    ];
    return (
      <div className="flex max-w-xl flex-col gap-6">
        <Tabs label="Project views" items={items} value={value} onChange={setValue} />
        <Tabs label="Project views" items={items} value={value} onChange={setValue} />
      </div>
    );
  },
};

/** `disabled` on the row disables every tab, e.g. until the page has hydrated. */
export const Disabled: S = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-6">
      <Tabs label="Project views" items={views} value="overview" onChange={() => {}} disabled />
      <Tabs label="Project views" items={views} value="overview" onChange={() => {}} disabled />
    </div>
  ),
};

/** The pill variant in `PageHeader`'s `tabs` slot, with counts, under the actions. */
export const InPageHeader: S = {
  render: () => {
    const [value, setValue] = useState("shots");
    return (
      <div className="max-w-3xl">
        <PageHeader
          breadcrumbs={<Breadcrumbs items={["Projects", "Launch film"]} />}
          title="Launch film"
          description="Updated 2 minutes ago"
          actions={<Button>Upload</Button>}
          tabs={
            <Tabs
              label="Assets"
              value={value}
              onChange={setValue}
              items={[
                { value: "shots", label: "Shots", count: 12 },
                { value: "clips", label: "Clips", count: 3 },
                {
                  value: "exports",
                  label: "Exports",
                  disabled: true,
                  title: "Nothing exported yet",
                },
              ]}
            />
          }
        />
        <Text>Showing {value}.</Text>
      </div>
    );
  },
};

/** Each tab's `href` is drawn by the app's own Link through `LinkProvider`; `value` marks the current route and gets `aria-current`. */
export const WithRouterLink: S = {
  render: () => (
    <Tabs
      label="Business"
      value="quotes"
      items={[
        { value: "quotes", label: "Quotes", href: "/quotes" },
        { value: "invoices", label: "Invoices", href: "/invoices" },
        { value: "traces", label: "Traces", href: "https://example.com/traces", external: true },
      ]}
    />
  ),
};

/** The vertical pill rail takes `size`: `sm`, `md` (the default, 38px) or `lg`. */
export const PillSizes: S = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-3 items-start gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tabs
          key={size}
          orientation="vertical"
          size={size}
          label={`Project views, ${size}`}
          items={views.map(({ value, label }) => ({ value, label }))}
          value="overview"
          onChange={() => {}}
        />
      ))}
    </div>
  ),
};
