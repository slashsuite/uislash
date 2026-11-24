## Divider

Group: Layout

When to use: One line between a heading and its content, or above a footer.

### The one right way
A `Divider` is one hairline between two parts of a page, here the content and its footer. The space around it is the `Stack`'s.
```tsx
import { Caption, Divider, Stack, Text } from "@slashsuite/ui-react";

<Stack gap="lg">
  <Text>The last paragraph of a page.</Text>
  <Divider />
  <Caption>Hack Cove (Pty) Ltd</Caption>
</Stack>
```

### Do
- Use it between two parts of a page that are not bordered, such as the content and its footer.
- The space around it is the layout's: put it in a `Stack`, never add margin.
- For a rule under a section title, `SectionHeading` and `Section` have `rule`. For a line between two `Section`s, put a `Divider` between them in their `Stack`.
- Rows with a line between each and no gap (a list of `ListRow`s) are a `Stack divided`, not a `Divider` after every row.

### Don't
- Do not draw it between bordered blocks such as `Card`: their borders and the `gap` already separate them.

A `Divider` and a footer placed by hand inside a `Card`: the card's own `footer` draws that strip, its line and its spacing.
```tsx
import { Caption, Card, Divider, Stack, Text } from "@slashsuite/ui-react";

<Card title="Quote 12">
  <Stack gap="lg">
    <Text>Two lines, R 1 200.</Text>
    <Divider />
    <Caption>Total R 1 200</Caption>
  </Stack>
</Card>
```

A `Divider` between two Cards is a second line on top of their borders and the gap.
```tsx
import { Card, Divider, Stack, Text } from "@slashsuite/ui-react";

<Stack>
  <Card title="Build 412">
    <Text>3 changed</Text>
  </Card>
  <Divider />
  <Card title="Build 411">
    <Text>No changes</Text>
  </Card>
</Stack>
```

### Accessibility
- It is an `<hr>`, which assistive tech announces as a separator. Use it only where the content really changes.

### Props
### Divider
A hairline rule in the theme's line colour: between a heading and its content, or above a footer. Space around it is the layout's.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
