import { Button, Cluster, Pagination } from "@slashsuite/ui-react";

/** `pageHref` gives the URL of each page, so the page lives in the URL: back, a new tab and a shared link all work. */
export const DoLinks = () => (
  <Pagination
    label="Directory pages"
    page={4}
    pageCount={12}
    pageHref={(page) => (page > 1 ? `?page=${page}` : "?")}
  />
);

/** Buttons that set the page in state: no URL, so the back button, a new tab and a shared link all lose the page. */
export const DontLinks = () => (
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
);
