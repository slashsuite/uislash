import { FlowDiagram } from "@slashsuite/ui-react";

/** One box carries a tone, the step that waits on a person, and its label says so too. */
export const DoTone = () => (
  <FlowDiagram
    label="How a build lands"
    nodes={[
      { id: "launched", label: "Building" },
      { id: "gate", label: "Waiting on a reviewer", tone: "warn" },
      { id: "merged", label: "Merged" },
    ]}
    edges={[
      { from: "launched", to: "gate", label: "hand off" },
      { from: "gate", to: "launched", label: "send back" },
      { from: "gate", to: "merged", label: "land" },
    ]}
  />
);

/** A tone on every box means nothing: the one that needs a person no longer stands out. */
export const DontTone = () => (
  <FlowDiagram
    label="How a build lands"
    nodes={[
      { id: "launched", label: "Building", tone: "info" },
      { id: "gate", label: "Waiting on a reviewer", tone: "warn" },
      { id: "merged", label: "Merged", tone: "positive" },
    ]}
    edges={[
      { from: "launched", to: "gate", label: "hand off" },
      { from: "gate", to: "launched", label: "send back" },
      { from: "gate", to: "merged", label: "land" },
    ]}
  />
);
