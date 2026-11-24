import { Button, Callout, ErrorPage, Section, Stack } from "@slashsuite/ui-react";

/** The tone matches how much the message matters: `warn` for a thing to check before going on. */
export const DoTone = () => (
  <Stack gap="sm">
    <Callout tone="info">The import runs overnight.</Callout>
    <Callout tone="warn" title="3 uncategorised.">
      Sort them before the month closes.
    </Callout>
  </Stack>
);

/** `danger` on a plain note cries wolf: when everything is red, a real failure no longer stands out. */
export const DontTone = () => (
  <Stack gap="sm">
    <Callout tone="danger">The import runs overnight.</Callout>
    <Callout tone="danger" title="3 uncategorised.">
      Sort them before the month closes.
    </Callout>
  </Stack>
);

/** The action goes in `actions`, at the end of the row, so every callout puts it in the same place. */
export const DoAction = () => (
  <Callout
    tone="warn"
    title="Import failed."
    actions={
      <Button size="sm" variant="outline">
        Retry
      </Button>
    }
  >
    The last file did not finish.
  </Callout>
);

/** A button inside the body drops under the text and leaves the row without its action. */
export const DontAction = () => (
  <Callout tone="warn" title="Import failed.">
    The last file did not finish. <Button size="sm">Retry</Button>
  </Callout>
);

/** A section that failed to load is a danger `Callout`: a title that says what failed and one button that tries again. The rest of the page stays. */
export const DoRetry = () => (
  <Section title="Recent builds">
    <Callout
      tone="danger"
      title="The builds did not load."
      actions={<Button size="sm">Try again</Button>}
    >
      Nothing was lost; the list is still on the server.
    </Callout>
  </Section>
);

/** A whole error page inside one section takes over the screen for a part that failed. */
export const DontRetry = () => (
  <Section title="Recent builds">
    <ErrorPage />
  </Section>
);
