## Pagination

Group: Navigation

When to use: A list split into pages that the reader moves through: a directory, search results, an archive.

### The one right way
`pageHref` gives the URL of each page, so the page lives in the URL: back, a new tab and a shared link all work.
```tsx
import { Pagination } from "@slashsuite/ui-react";

<Pagination
  label="Directory pages"
  page={4}
  pageCount={12}
  pageHref={(page) => (page > 1 ? `?page=${page}` : "?")}
/>
```

### Do
- Give `pageHref` the URL of a page; the page lives in the URL, so back, a new tab and a shared link work. Each link goes through the app's `LinkProvider`.
- `page` is the page shown, from 1, and `pageCount` how many there are; a stale page past the end draws the last one, and a single page draws nothing.
- One Pagination under the list; a long list may add one above it too, each with its own `label`.
- The count line ("21 to 40 of 312") is a `Caption` beside it, not part of it.
- `previousLabel`, `nextLabel` and `pageLabel` carry the words for another language.

### Don't
Buttons that set the page in state: no URL, so the back button, a new tab and a shared link all lose the page.
```tsx
import { Button, Cluster } from "@slashsuite/ui-react";

<Cluster gap="xs">
  <Button size="sm" variant="outline" onClick={() => undefined}>
    First
  </Button>
  <Button size="sm" variant="outline" onClick={() => undefined}>
    Previous
  </Button>
  <span>Page 4 of 12</span>
  <Button size="sm" variant="outline" onClick={() => undefined}>
    Next
  </Button>
  <Button size="sm" variant="outline" onClick={() => undefined}>
    Last
  </Button>
</Cluster>
```

### Accessibility
- A `<nav>` named by `label`. Every page is a link, and the current one has `aria-current="page"`.
- Previous on the first page and Next on the last are plain text, not links, so there is no dead stop in the tab order.
- The gaps (`…`) are `aria-hidden`. Below `sm` the numbers give way to `pageLabel` ("Page 4 of 12") between Previous and Next.

### Props
### Pagination
Page links for a long list: Previous, the page numbers and Next, in a `<nav>` named by `label`. Each is a link to `pageHref(page)`, drawn by the app's router link through `LinkProvider`, so the page lives in the URL and back, a new tab and a shared link all work. The current page is a link with `aria-current="page"`. Below `sm` the numbers give way to `pageLabel` ("Page 2 of 4"). Renders nothing for one page. The count line ("21 to 40 of 312") is the caller's `Caption`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). Names the `<nav>`. Two pagers on a page (above and below a list) each need their own.
- nextLabel: string (default Next). The next-page link's text.
- page: number (required). The page shown, from 1. Drawn clamped into `1` to `pageCount`.
- pageCount: number (required). How many pages there are. One or none draws nothing.
- pageHref: (page: number) => string (required). The URL of one page, called for every link drawn: `(page) => (page > 1 ? `?page=${page}` : "?")`.
- pageLabel: ((page: number, pageCount: number) => string) (default (at, count) => `Page ${at} of ${count}`). The summary shown in place of the numbers below `sm`. Default: `Page 2 of 4`.
- previousLabel: string (default Previous). The previous-page link's text.
