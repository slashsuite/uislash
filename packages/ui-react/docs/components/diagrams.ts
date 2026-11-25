import type { ComponentPage } from "./types";

/** The Data section's diagrams: boxes and arrows laid out from plain data. */
export const diagramPages: ComponentPage[] = [
  {
    slug: "flow-diagram",
    name: "FlowDiagram",
    summary: "Boxes joined by arrows, laid out for you: a flow, a pipeline, a state machine.",
    whenToUse:
      "Things that move from one step to another along named arrows, loops and branches included: a review flow, a deploy pipeline, the states an order goes through.",
    pairs: ["FlowDiagram/Tone"],
    usage: {
      do: [
        "Give it `nodes` (`{ id, label }`) and `edges` (`{ from, to }`, by id) and nothing else: it ranks the boxes along the arrows and routes every arrow round them, loops and arrows back included. Their order is only a hint.",
        "`label` on an edge is a word or two: the event or the action that moves along it (`submit`, `approve`).",
        "`direction` is `down` (default) for a flow read from the top, or `right` for a short pipeline read from the start.",
        "`tone` says what a box means: `warn` for a step that waits on a person, `danger` for a failure, `positive` for done. Say it in the label too, and leave the rest `neutral`.",
        "`content` goes under a box's label and the box grows to hold it: a few `Pill`s, a short list. It is display only, so no links or buttons.",
        "`group` frames boxes that belong together (a lane, an owner) in a dashed frame named by it. `active` rings the one box a thing is in now.",
        "`overlay` draws on top of the diagram in its own coordinates, from each box's place and each arrow's SVG path (`FlowLayout`): a marker on an arrow, a count over a box.",
        "A diagram wider or taller than its room scrolls inside its own box, so the page never scrolls sideways.",
      ],
      dont: [
        "Do not colour every box: a tone on every step means nothing.",
        "Do not draw steps that only run in a line with no branch or loop: that is `Steps`.",
      ],
    },
    accessibility: [
      "The diagram is an image named by `label`, with the count of boxes and arrows. It takes the keyboard focus so a diagram that scrolls can be scrolled with the arrow keys.",
      "A visually hidden list after it carries every box, in `nodes` order: its label, `current` for `active`, its group, its content, and an item per arrow out of it naming the target and the arrow's label.",
      "`overlay` is hidden from assistive tech and the pointer: say in a box's label or content what it shows.",
    ],
    api: ["FlowDiagram"],
    types: [
      "FlowNode",
      "FlowEdge",
      "FlowDirection",
      "FlowLayout",
      "FlowNodeBox",
      "FlowEdgePath",
      "FlowBox",
      "FlowPoint",
    ],
  },
  {
    slug: "state-machine",
    name: "StateMachine",
    summary: "A state machine, drawn, with the things moving through it as dots.",
    whenToUse:
      "The states a thing goes through and the events that move it, with where each thing is now: tickets in a workflow, orders in fulfilment, jobs in a queue.",
    pairs: ["StateMachine/Kind"],
    usage: {
      do: [
        "Give it `states` (`{ id, label, kind, owner }`), `transitions` (`{ from, to, event }`) and `items` (`{ id, label, state, href }`), plain data with no layout: it is drawn like a `FlowDiagram`.",
        "`kind` says what a state is: `human` for a state waiting on a person (the warn tone), `failed` for an error (danger), `terminal` for done (muted), `initial` for the start. Each is also a tag in words. Leave the rest `normal`.",
        "`owner` is the role or lane that acts in a state, a tag on its box.",
        "Keep a state's `label` short: every box is drawn one size, so the boxes line up, and a long label wraps inside it and makes every box a line taller.",
        "An item's `id` is its short ref, shown by its dot; its `label` is the full name, its tooltip and what a screen reader says. Give `href` and the dot is a link.",
        "Change an item's `state` and its dot runs along the arrow to its new box; there is nothing to call.",
        "`active` rings the one state that is current, for a machine with one thing in it.",
        "Made with xstate? `fromXState(machine)` gives `states` and `transitions`; its `state` option maps your own `meta` onto `kind` and `owner`.",
      ],
      dont: [
        'Do not leave an item out because its state is unknown: it goes in the "Not in any state" box, where someone sees it.',
        "Do not mark every state `human` or `failed`: the one that needs a person no longer stands out.",
      ],
    },
    accessibility: [
      "The drawing is an image named by `label`, with the count of states and transitions; the box round it is a group named by `label`, and takes the keyboard focus so a machine that scrolls can be scrolled with the arrow keys.",
      "Each dot is named by its item's label and its state (`Fix the login, in Review`), and takes the focus; one with `href` is a link. A box with more than six shows a `+N` button that shows the rest.",
      "A visually hidden list after it carries every state, its tags and the transitions out of it, as `FlowDiagram`'s does.",
      "With reduced motion a dot moves to its new state at once, with no run.",
    ],
    api: ["StateMachine"],
    types: [
      "StateMachineDefinition",
      "StateMachineState",
      "StateMachineKind",
      "StateMachineTransition",
      "StateMachineItem",
      "XStateMachineLike",
      "XStateNodeConfig",
      "XStateTransitionConfig",
      "XStateStateInput",
    ],
    functions: [
      {
        name: "fromXState",
        text: "Turns an xstate v5 machine, or its config, into `states` and `transitions`: one state per top-level state node, one transition per target in its `on`. The package does not depend on xstate.",
        example: '<StateMachine label="Orders" {...fromXState(orderMachine)} items={orders} />',
      },
    ],
  },
];
