## SiteSearch

Group: Navigation

When to use: A site with more pages than a reader can scan in its nav: a docs site, an app with many sections.

### The one right way
`SiteSearch` in the header's `controls`, beside the colour toggle, given every page: one search, on every page, with a shortcut.
```tsx
import { Cluster, ColourSchemeToggle, SiteSearch } from "@slashsuite/ui-react";

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
```

### Do
- Put one `SiteSearch` in `AppShell`'s `controls`, on every page, and pass every page as `items`: `{ label, description, href, keywords }`.
- `label` names the phone's icon button and titles the dialog: say what is searched ("Search components"). `resultsLabel` names the list of matches, "Results" by default, for an app in another language.
- Give `items` in the nav's order: results of the same rank keep it.
- `keywords` are other names a page answers to (the exports it documents); they match but are not shown.
- A result ranks by the name starting with the text, then the name containing it, then a keyword, then the description.
- From `sm` up the button reads Search with its key (Ctrl K, or ⌘ K on a Mac); below `sm` it is the search icon alone.
- It searches names, not page text, and needs no service.

### Don't
A field and a hand-filtered list in the page body is a second search with no shortcut, no keys and no count read out. Use `SiteSearch`.
```tsx
import { Input, ListRow, Stack } from "@slashsuite/ui-react";

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
```

### Accessibility
- Ctrl+K or Cmd+K opens it from anywhere on the page; the button carries `aria-keyshortcuts`.
- It opens a `Dialog` titled by `label` with focus in the search field; Esc closes it and focus goes back to where it was.
- Enter opens the first result. ArrowDown moves from the field to the results and ArrowUp and ArrowDown move between them; they are links, so Tab reaches them too.
- A polite live region reads the result count as you type ("3 results").

### Props
### SiteSearch
The site's search: a header button that opens a dialog with a search field over a list of links to the pages that match. Put it in `AppShell`'s `controls` and pass every page as `items`. Ctrl+K (⌘ K on a Mac) opens it from anywhere on the page, and the button shows that key. Typing filters by name, then by `keywords`, then by description; Enter opens the first result, the arrow keys move through them, and Esc closes it and puts focus back where it was. Render it once per page.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- items: readonly SiteSearchItem[] (required). Every page to search, in the order ties are listed (the rail's order).
- label: string (required). The dialog's title and the phone's icon button's accessible name: "Search components". The wide
button is named by its own text, "Search".
- resultsLabel: string (default Results). The name of the list of matches, for an app in another language.

### Types
- SiteSearchItem: `{ label: string; description?: string; href: string; keywords?: string[] }`. One page the search can find.
