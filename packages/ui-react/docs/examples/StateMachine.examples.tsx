import { StateMachine } from "@slashsuite/ui-react";

/** One state waits on a person, and only it is `human`: it stands out, and its tag says so. */
export const DoKind = () => (
  <StateMachine
    label="Article flow"
    states={[
      { id: "draft", label: "Draft", kind: "initial", owner: "writer" },
      { id: "review", label: "In review", kind: "human", owner: "editor" },
      { id: "published", label: "Published", kind: "terminal" },
    ]}
    transitions={[
      { from: "draft", to: "review", event: "submit" },
      { from: "review", to: "draft", event: "send back" },
      { from: "review", to: "published", event: "approve" },
    ]}
    items={[{ id: "A-12", label: "Spring launch post", state: "review" }]}
  />
);

/** Every state marked `human`: nothing stands out, and the tags say nothing. */
export const DontKind = () => (
  <StateMachine
    label="Article flow"
    states={[
      { id: "draft", label: "Draft", kind: "human", owner: "writer" },
      { id: "review", label: "In review", kind: "human", owner: "editor" },
      { id: "published", label: "Published", kind: "human" },
    ]}
    transitions={[
      { from: "draft", to: "review", event: "submit" },
      { from: "review", to: "draft", event: "send back" },
      { from: "review", to: "published", event: "approve" },
    ]}
    items={[{ id: "A-12", label: "Spring launch post", state: "review" }]}
  />
);
