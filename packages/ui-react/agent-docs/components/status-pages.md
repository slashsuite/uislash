## Status pages

Group: Pages

When to use: A route that cannot show its content: use the status page that names the state.

### Use instead
- Callout (callout.md): Only a part of the page failed, and the rest of it shows.
- EmptyState (empty-state.md): The page works and has nothing in it yet.

### The one right way
A missing page is `NotFound`: the reader needs a way home, and a retry would load the same nothing.
```tsx
import { NotFound } from "@slashsuite/ui-react";

<NotFound />

```

### Do
- Pick the page by the state: `NotFound` for a missing page (404), `Forbidden` for a page the reader may not see (403), `ErrorPage` for a failure (500), `Offline` for no connection, `Maintenance` for a site that is down on purpose.
- The copy is fixed, so every site reads the same. Change the heading with `title` and the text with children only when the state needs a specific line.
- Every page but `Maintenance` links "Back to home", to `LinkProvider`'s `home` (`/` by default). `Maintenance` has none: home is the site that is down.
- Say where home is once, on the provider (`<LinkProvider home="/app">`).
- `onRetry` adds a "Try again" button on `ErrorPage` and `Offline`; `actions` replaces it with the buttons that fit, and the home link turns outline beside them.
- A button worded differently goes in `actions`: it comes first, and "Back to home" stays beside it. There is no label prop.
- A part of a page that failed to load is not an `ErrorPage`: it is a `Callout tone="danger"` with a title and a retry `Button` in its `actions`, and the rest of the page stays.
- Render one as the content of an `AppShell`, or on its own in a `Container`.

### Don't
- Do not offer a retry where trying again cannot help.
- Never put a stack trace in `detail`.
- Never wire a home link on each page; a page takes no home prop.

`ErrorPage` with a retry for a missing page promises that trying again helps, and it does not.
```tsx
import { ErrorPage } from "@slashsuite/ui-react";

<ErrorPage onRetry={() => {}} />

```

A stack trace shows the reader your internals and buries the one line they can act on.
```tsx
import { ErrorPage } from "@slashsuite/ui-react";

<ErrorPage
  detail={
    "TypeError: Cannot read properties of undefined\n  at loadBuild (build.ts:42:9)\n" +
    "  at async handler (route.ts:17:3)"
  }
  onRetry={() => {}}
/>
```

### Accessibility
- Each page is a `CenteredLayout` card, so the title is the page's `h1` and the copy under it is a paragraph.
- `detail` is shown in a `CodeBlock` labelled "Error".
- The buttons are a `Button` and a `Button` with `href`, with their own focus rings; "Back to home" is a real link.
- The pages do not set an HTTP status; send the 404, 403 or 500 from the server.

### Props
### NotFound
404: the page is not there. `numeral` draws a large "404" above the title, for a site whose 404 is a designed page; the digits are fixed. Off, the page is the title and copy alone.
- actions: ReactNode. The page's own buttons, before "Back to home", which turns outline beside them. This is the one
way to a button worded differently; there is no label prop.
- children: ReactNode. Replaces the default body copy.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- numeral: boolean (default false). Draws a large "404" above the title. Off by default. The digits are fixed: there is no text prop.
- title: ReactNode. Replaces the default heading.

### Forbidden
403: signed in, or not, but not allowed here. The page for a route that exists and the reader may not see; a route that is not there is a `NotFound`.
- actions: ReactNode. The page's own buttons, before "Back to home", which turns outline beside them. This is the one
way to a button worded differently; there is no label prop.
- children: ReactNode. Replaces the default body copy.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- title: ReactNode. Replaces the default heading.

### ErrorPage
500 or any failure. `detail` is the error text, shown in a `CodeBlock` under the copy; pass it only where a reader may see it (a request id, a message), never a stack trace. `onRetry` adds a "Try again" button, unless `actions` replaces it.
- actions: ReactNode. The page's own buttons, before "Back to home", which turns outline beside them. This is the one
way to a button worded differently; there is no label prop.
- children: ReactNode. Replaces the default body copy.
- detail: string. The error text, in a `CodeBlock` under the copy: a request id or a message a reader may see, never a stack trace.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- onRetry: () => void. Adds a "Try again" button that calls it, unless `actions` replaces the button.
- title: ReactNode. Replaces the default heading.

### Offline
The device has no connection. `onRetry` adds a "Try again" button, unless `actions` replaces it.
- actions: ReactNode. The page's own buttons, before "Back to home", which turns outline beside them. This is the one
way to a button worded differently; there is no label prop.
- children: ReactNode. Replaces the default body copy.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- onRetry: () => void. Adds a "Try again" button that calls it, unless `actions` replaces the button.
- title: ReactNode. Replaces the default heading.

### Maintenance
The site is down on purpose and will be back: the page for planned downtime, such as an upgrade. A failure is an `ErrorPage`, and no connection is `Offline`. It has no "Back to home": home is the site that is down.
- actions: ReactNode. The page's own buttons, before "Back to home", which turns outline beside them. This is the one
way to a button worded differently; there is no label prop.
- children: ReactNode. Replaces the default body copy.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- title: ReactNode. Replaces the default heading.
