import {
  Cluster,
  ColourSchemeToggle,
  Input,
  ListRow,
  SiteSearch,
  Stack,
} from "@slashsuite/ui-react";

/** `SiteSearch` in the header's `controls`, beside the colour toggle, given every page: one search, on every page, with a shortcut. */
export const DoHeader = () => (
  <Cluster gap="sm">
    <SiteSearch
      label="Search components"
      items={[
        { label: "Dialog", description: "A modal window.", href: "#dialog" },
        { label: "Tabs", description: "Switch a view in place.", href: "#tabs" },
      ]}
    />
    <ColourSchemeToggle size="sm" store={false} />
  </Cluster>
);

/** A field and a hand-filtered list in the page body is a second search with no shortcut, no keys and no count read out. Use `SiteSearch`. */
export const DontHeader = () => (
  <Stack gap="sm">
    <Input type="search" aria-label="Filter" icon="search" defaultValue="dia" />
    <div>
      <ListRow href="#dialog" size="sm">
        Dialog
      </ListRow>
      <ListRow href="#field-dialog" size="sm" divided>
        FieldDialog
      </ListRow>
    </div>
  </Stack>
);
