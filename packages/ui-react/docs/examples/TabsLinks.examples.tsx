import { Button, Stack, Tabs } from "@slashsuite/ui-react";

/** A rail of links is pill `Tabs` of links with `orientation="vertical"`: one nav landmark, the current page marked. */
export const DoRail = () => (
  <Tabs
    orientation="vertical"
    label="Sections"
    items={[
      { label: "Overview", href: "#overview" },
      { label: "Button", href: "#button", selected: true },
      { label: "Card", href: "#card" },
    ]}
  />
);

/** A stack of ghost link `Button`s is not a nav landmark, and nothing marks the current page. */
export const DontRail = () => (
  <Stack gap="xs">
    <Button href="#overview" variant="ghost">
      Overview
    </Button>
    <Button href="#button" variant="ghost">
      Button
    </Button>
    <Button href="#card" variant="ghost">
      Card
    </Button>
  </Stack>
);
