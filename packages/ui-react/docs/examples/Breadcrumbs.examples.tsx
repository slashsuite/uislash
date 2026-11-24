import { Breadcrumbs } from "@slashsuite/ui-react";

/** A parent crumb is `{ label, href }` and the last is plain text: the trail that leads back up, ending at the current page. */
export const DoTrail = () => (
  <Breadcrumbs
    items={[
      { label: "Projects", href: "#projects" },
      { label: "Launch film", href: "#launch-film" },
      "Shots",
    ]}
  />
);

/** Parents given as plain text look like the trail but lead nowhere, so a reader cannot go back up. */
export const DontTrail = () => <Breadcrumbs items={["Projects", "Launch film", "Shots"]} />;

/** Breadcrumbs show where the page sits in a hierarchy. */
export const DoHierarchy = () => (
  <Breadcrumbs
    items={[{ label: "Acme", href: "#acme" }, { label: "Quotes", href: "#quotes" }, "Quote 12"]}
  />
);

/** Siblings are not a hierarchy: switching between peer sections is `Tabs` of links. */
export const DontHierarchy = () => (
  <Breadcrumbs
    items={[
      { label: "Quotes", href: "#quotes" },
      { label: "Invoices", href: "#invoices" },
      "Receipts",
    ]}
  />
);
