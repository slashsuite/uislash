## Show

Group: Layout

When to use: Content that only fits a wide screen, and its narrow-screen form: a table from `sm`, a stack of cards below it.

### The one right way
A table that only fits a wide screen is in a `Show from`; its phone form, a stack of rows, is in a `Show below` at the same breakpoint.
```tsx
import {
  Card,
  ListRow,
  Show,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Stack>
  <Show below="sm">
    <Card flush>
      <Stack as="ul" divided aria-label="Builds">
        <li>
          <ListRow secondary="main, 3 changed">Build 412</ListRow>
        </li>
        <li>
          <ListRow secondary="main, no changes">Build 411</ListRow>
        </li>
      </Stack>
    </Card>
  </Show>
  <Show from="sm">
    <Table label="Builds">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Build</TableHeaderCell>
          <TableHeaderCell>Branch</TableHeaderCell>
          <TableHeaderCell numeric>Changed</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Build 412</TableCell>
          <TableCell mono>main</TableCell>
          <TableCell numeric>3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Build 411</TableCell>
          <TableCell mono>main</TableCell>
          <TableCell numeric>0</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Show>
</Stack>
```

### Do
- Content that only fits a wide screen is in a `Show from`; its narrow-screen form is in a `Show below` at the same breakpoint: `<Show below="sm">{cards}</Show><Show from="sm">{table}</Show>`.
- Give exactly one of `from` or `below`, each `sm`, `md` or `lg`. There is no default: the reader sees the rule.
- `as="span"` inside phrasing content: a run in a `<p>`, a `Kbd` hint in a button row.
- The wrapper adds no box, so its children sit in the parent's row, grid or `Stack` and the parent's gap spaces them. To keep two items together, put a `Cluster` inside the `Show`.
- Hidden content stays mounted, so two `Show`s of one stateful panel mount it twice. A panel shown at every width that folds on a phone is a `SideColumn asideLabel`, not two `Show`s.

### Don't
- Never write `hidden sm:block` or `sm:hidden` in an app: the breakpoint is a `Show`.

The same table at every width squashes on a phone and scrolls sideways; never hide it with a class of your own either.
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@slashsuite/ui-react";

<Table label="Builds">
  <TableHead>
    <TableRow>
      <TableHeaderCell>Build</TableHeaderCell>
      <TableHeaderCell>Branch</TableHeaderCell>
      <TableHeaderCell numeric>Changed</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Build 412</TableCell>
      <TableCell mono>main</TableCell>
      <TableCell numeric>3</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Build 411</TableCell>
      <TableCell mono>main</TableCell>
      <TableCell numeric>0</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Accessibility
- Hidden is `display: none`: the content is out of the accessibility tree and the tab order, so a table hidden on a phone is not read out there.
- The reading order is the source order; `Show` moves nothing.
- It is CSS only, the same markup on the server and the client, so it works before the page hydrates and with no script.

### Props
### Show
Shows its children only from a width up (`from`) or only below it (`below`), by CSS alone: the same markup on the server and the client, with no script. Hidden is `display: none`, so the content is out of the accessibility tree and the tab order too. Shown, the wrapper adds no box, so the children sit in the parent's row, grid or Stack and take its gap. Content that only fits a wide screen is in a `Show from`; its narrow-screen form is in a `Show below` at the same breakpoint. Hidden content stays mounted, so two `Show`s of the same content mount it twice: a stateful panel shown at every width with a fold is a `SideColumn asideLabel`. `as="span"` is for phrasing content (inside a `<p>` or a button row).
- as: "div" | "span" (default div). The element: `div`, or `span` inside phrasing content.
- below: "sm" | "md" | "lg". Shown below this width, gone from it up.
- from: "sm" | "md" | "lg". Shown from this width up, gone below it.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.

### Types
- Breakpoint: `"sm" | "md" | "lg"`. A width step: `sm` 640px, `md` 768px, `lg` 1024px.
