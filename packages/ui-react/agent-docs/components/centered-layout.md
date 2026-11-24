## CenteredLayout

Group: Page layouts

When to use: Sign-in, a landing page, or a not-found or error page.

### The one right way
Sign-in, landing, not-found and error pages are one narrow card, centred.
```tsx
import { Button, CenteredLayout, Field, Input } from "@slashsuite/ui-react";

<CenteredLayout title="Sign in" description="Use your Hack Cove account.">
  <Field label="Email" htmlFor="do-page-email">
    <Input id="do-page-email" type="email" placeholder="you@example.com" />
  </Field>
  <Button>Continue</Button>
</CenteredLayout>
```

### Full page
A whole sign-in page: the shell with its brand and nav, then one narrow card, centred.
```tsx
import {
  AppShell,
  Button,
  CenteredLayout,
  Field,
  Input,
  Tabs,
} from "@slashsuite/ui-react";

<AppShell
  brand={<a href="#">Hack Cove</a>}
  nav={
    <Tabs
      label="Main"
      items={[
        { label: "Quotes", href: "#quotes", selected: true },
        { label: "Clients", href: "#clients" },
      ]}
    />
  }
>
  <CenteredLayout title="Sign in" description="Use your Hack Cove account.">
    <Field label="Email" htmlFor="full-page-email">
      <Input id="full-page-email" type="email" placeholder="you@example.com" />
    </Field>
    <Button>Continue</Button>
  </CenteredLayout>
</AppShell>
```

### Do
- Give it a `title` and a `description`; the `children` are the card's content: a `Field` or two and a `Button`.
- It is the one layout that does not share the start edge: it is centred, at a fixed offset from the top.
- A form inside the app is `FormLayout`, not this.
- The ready-made status pages (not found, forbidden, offline, error, maintenance) are already built on it.
- `mark` is drawn first in the card, above the title: a large status numeral, as the status pages draw. It is not a heading.

### Don't
`FormLayout` is for a form inside the app: its wide column hangs off the left edge, which is wrong for a sign-in. Use `CenteredLayout`.
```tsx
import { Button, Field, FormLayout, Input } from "@slashsuite/ui-react";

<FormLayout
  title="Sign in"
  description="Use your Hack Cove account."
  actions={<Button type="submit">Continue</Button>}
>
  <Field label="Email" htmlFor="dont-page-email">
    <Input id="dont-page-email" type="email" placeholder="you@example.com" />
  </Field>
</FormLayout>
```

### Accessibility
- The title is the page's `h1`.
- The card is a plain `div`, not a landmark; the shell's `main` holds it.
- Give each control a `Field`, so every input has a label.

### Props
### CenteredLayout
A narrow card (`max-w-md`) centred in the Container at a fixed offset from the top, for sign-in, landing, not-found and error pages. The one layout that does not share the start edge. While `loading` it owns the wait and passes it to everything inside, the header too.
- description: ReactNode. A muted line under the title.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- mark: ReactNode. Drawn first in the card, above the title, e.g. a large status numeral. Not a heading.
- title: ReactNode (required). The card's `h1`.
