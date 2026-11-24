import { Cluster, Pill, TextLink } from "@slashsuite/ui-react";

/** The tone carries the meaning: `positive` for done, `warn` for waiting, `danger` for failed, and no tone for a draft. */
export const DoStatus = () => (
  <Cluster>
    <Pill tone="positive" dot>
      Paid
    </Pill>
    <Pill tone="warn" dot>
      Due
    </Pill>
    <Pill tone="danger" dot>
      Overdue
    </Pill>
    <Pill dot>Draft</Pill>
  </Cluster>
);

/** One tone for every status says nothing: a reader cannot tell Paid from Overdue at a glance. Pick the tone by what the status means. */
export const DontStatus = () => (
  <Cluster>
    <Pill tone="accent" dot>
      Paid
    </Pill>
    <Pill tone="accent" dot>
      Due
    </Pill>
    <Pill tone="accent" dot>
      Overdue
    </Pill>
  </Cluster>
);

/** A Pill that goes somewhere takes `href`: it dims on hover and carries the focus ring. */
export const DoLink = () => (
  <Pill href="#flakes" tone="warn" round>
    3 flaky
  </Pill>
);

/** A Pill inside a `TextLink` is two parts doing one job, and the Pill's own hover dim and focus ring go unused. Give the Pill the `href`. */
export const DontLink = () => (
  <TextLink href="#flakes">
    <Pill tone="warn" round>
      3 flaky
    </Pill>
  </TextLink>
);
