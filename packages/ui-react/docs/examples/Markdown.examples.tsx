import { Markdown } from "@slashsuite/ui-react";

/** `Markdown` renders headings, bullets and numbered lists, `**bold**`, links, pictures and tables, as React nodes and never as HTML. */
export const DoSummary = () => (
  <Markdown
    md={
      "## What I did\n- **HC-142** shipped the EmptyState\n- Fixed the Pill label wrap\n\n" +
      "### Next\n1. Review the Steps copy\n2. Read [the ticket](https://example.com)"
    }
  />
);

/** A `#` title, a code span, a quote or HTML is not supported: each shows as literal text. */
export const DontSummary = () => (
  <Markdown
    md={"# What I did\n> Shipped the EmptyState\n\nRun `bun install`, then <b>restart</b>."}
  />
);
