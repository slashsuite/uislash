import { FlowDiagram } from "@slashsuite/ui-react";

/** One box carries a tone, the step that waits on a person, and its label says so too. */
export const DoTone = () => (
  <FlowDiagram
    label="How an article is published"
    nodes={[
      { id: "draft", label: "Draft" },
      { id: "review", label: "Waiting on a reviewer", tone: "warn" },
      { id: "live", label: "Published" },
    ]}
    edges={[
      { from: "draft", to: "review", label: "submit" },
      { from: "review", to: "draft", label: "changes" },
      { from: "review", to: "live", label: "approve" },
    ]}
  />
);

/** A tone on every box means nothing: the one that needs a person no longer stands out. */
export const DontTone = () => (
  <FlowDiagram
    label="How an article is published"
    nodes={[
      { id: "draft", label: "Draft", tone: "info" },
      { id: "review", label: "Waiting on a reviewer", tone: "warn" },
      { id: "live", label: "Published", tone: "positive" },
    ]}
    edges={[
      { from: "draft", to: "review", label: "submit" },
      { from: "review", to: "draft", label: "changes" },
      { from: "review", to: "live", label: "approve" },
    ]}
  />
);
