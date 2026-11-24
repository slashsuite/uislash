import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowDiagram, type FlowEdge, type FlowNode, Pill, type Tone } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/FlowDiagram.examples.js";

const meta: Meta = { title: "Data/FlowDiagram", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const article: { nodes: FlowNode[]; edges: FlowEdge[] } = {
  nodes: [
    { id: "draft", label: "Draft" },
    { id: "review", label: "In review" },
    { id: "live", label: "Published" },
  ],
  edges: [
    { from: "draft", to: "review", label: "submit" },
    { from: "review", to: "live", label: "approve" },
  ],
};

/** A small flow: three boxes, two arrows, each arrow named by what moves along it. */
export const LinearFlow: S = {
  render: () => <FlowDiagram label="How an article is published" {...article} />,
};

/** `direction="right"` for a short pipeline read from the start. */
export const Right: S = {
  render: () => <FlowDiagram label="How an article is published" direction="right" {...article} />,
};

/** A ticket's lifecycle, with its QA states. */
const ticketStates = [
  ["open", "Open"],
  ["in_progress", "In progress"],
  ["ready", "Ready"],
  ["merged", "Merged"],
  ["qa_ready", "Ready for QA"],
  ["qa", "In QA"],
  ["qa_rework", "QA rework"],
  ["blocked", "Blocked"],
  ["done", "Done"],
] as const;

/** The states that wait on a person, that stopped, and that are done; the rest are neutral. */
const tones: Partial<Record<string, Tone>> = {
  qa_rework: "warn",
  blocked: "danger",
  done: "positive",
};

const ticketNodes: FlowNode[] = ticketStates.map(([id, label]) => ({ id, label, tone: tones[id] }));

/** Every move a ticket can make, from → the states it can go to. */
const ticketMoves: Record<string, readonly string[]> = {
  open: ["in_progress", "ready", "blocked", "done"],
  in_progress: ["ready", "blocked", "done", "open"],
  ready: ["merged", "in_progress", "blocked", "qa_ready", "done"],
  merged: ["qa_ready", "done", "blocked"],
  qa_ready: ["qa", "blocked", "done"],
  qa: ["qa_rework", "done", "blocked"],
  qa_rework: ["in_progress", "ready", "qa", "blocked", "done"],
  blocked: ["open", "in_progress", "ready", "done"],
  done: ["open"],
};

const ticketEdges: FlowEdge[] = Object.entries(ticketMoves).flatMap(([from, to]) =>
  to.map((target) => ({ from, to: target })),
);

/**
 * A large graph: 26 states and 41 arrows, loops and arrows back up included. It is wider than
 * the room it has, so it scrolls inside its own box.
 */
export const LargeWithLoops: S = {
  render: () => (
    <FlowDiagram
      label="The states a ticket goes through"
      nodes={ticketNodes}
      edges={ticketEdges}
      active="qa"
    />
  ),
};

/** `content` goes under a box's label and the box grows to hold it: here, the items in each state. */
export const WithContent: S = {
  render: () => (
    <FlowDiagram
      label="Tickets by state"
      nodes={[
        {
          id: "todo",
          label: "To do",
          content: (
            <div className="flex flex-wrap gap-1">
              <Pill size="sm">Search</Pill>
              <Pill size="sm">Export</Pill>
              <Pill size="sm">Billing page</Pill>
            </div>
          ),
        },
        {
          id: "doing",
          label: "In progress",
          content: (
            <div className="flex flex-wrap gap-1">
              <Pill size="sm" tone="info">
                Sign in
              </Pill>
            </div>
          ),
        },
        {
          id: "blocked",
          label: "Waiting on design",
          tone: "warn",
          content: (
            <div className="flex flex-wrap gap-1">
              <Pill size="sm" tone="warn">
                Onboarding
              </Pill>
              <Pill size="sm" tone="warn">
                Empty states
              </Pill>
            </div>
          ),
        },
        { id: "done", label: "Done" },
      ]}
      edges={[
        { from: "todo", to: "doing", label: "start" },
        { from: "doing", to: "blocked", label: "ask" },
        { from: "blocked", to: "doing", label: "answer" },
        { from: "doing", to: "done", label: "ship" },
      ]}
    />
  ),
};

/** `tone="warn"` on the one box that waits on a person; its label says so too. */
export const WarningTone: S = {
  render: examples.DoTone,
};

/** `active` rings the one box a thing is in now; the hidden list says `current`. */
export const Active: S = {
  render: () => <FlowDiagram label="Where this article is" active="review" {...article} />,
};

/** `group` frames the boxes that belong together in a dashed frame named by it: here, who acts. */
export const Groups: S = {
  render: () => (
    <FlowDiagram
      label="How a support request is answered"
      nodes={[
        { id: "ask", label: "Asks", group: "Customer" },
        { id: "reply", label: "Reads the reply", group: "Customer" },
        { id: "triage", label: "Triage", group: "Support" },
        { id: "answer", label: "Answer", group: "Support" },
        { id: "fix", label: "Fix the bug", group: "Engineering", tone: "warn" },
      ]}
      edges={[
        { from: "ask", to: "triage" },
        { from: "triage", to: "answer", label: "known" },
        { from: "triage", to: "fix", label: "bug" },
        { from: "fix", to: "answer" },
        { from: "answer", to: "reply" },
      ]}
    />
  ),
};

/** At phone width the diagram scrolls inside its own box; the page does not scroll sideways. */
export const PhoneWidth: S = {
  globals: { viewport: { value: "phone", isRotated: false } },
  render: () => (
    <div className="max-w-80">
      <FlowDiagram
        label="How an article is published"
        direction="right"
        nodes={[
          ...article.nodes,
          { id: "archived", label: "Archived" },
          { id: "deleted", label: "Deleted", tone: "danger" },
        ]}
        edges={[
          ...article.edges,
          { from: "live", to: "archived", label: "a year on" },
          { from: "archived", to: "deleted", label: "purge" },
        ]}
      />
    </div>
  ),
};

/** `overlay` draws on top in the diagram's coordinates: here a dot at the middle of each arrow. */
export const Overlay: S = {
  render: () => (
    <FlowDiagram
      label="How an article is published"
      {...article}
      overlay={(layout) =>
        layout.edges.map((edge) => {
          const mid = edge.points[Math.floor(edge.points.length / 2)];
          return mid ? (
            <span
              key={edge.index}
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600"
              style={{ left: mid.x, top: mid.y }}
            />
          ) : null;
        })
      }
    />
  ),
};

export const DoTone: S = {
  render: examples.DoTone,
};

export const DontTone: S = {
  render: examples.DontTone,
};

/** While `loading` with no nodes it draws one bone the height of a small diagram. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <FlowDiagram
      loading={loading}
      label="How an article is published"
      nodes={loading ? [] : article.nodes}
      edges={article.edges}
    />
  ),
};
