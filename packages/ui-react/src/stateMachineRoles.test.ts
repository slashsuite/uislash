import { describe, expect, it } from "vitest";
import type { StateMachineState, StateMachineTransition } from "./StateMachine.js";
import { moverOf, toneByRole } from "./stateMachineRoles.js";

const states: StateMachineState[] = [
  { id: "draft", label: "Draft", owner: "writer" },
  { id: "review", label: "Review", owner: "editor" },
  { id: "again", label: "Again", owner: "writer" },
  { id: "done", label: "Done", kind: "terminal" },
];
const transitions: StateMachineTransition[] = [
  { from: "draft", to: "review" },
  { from: "review", to: "done", actor: "owner" },
];

describe("toneByRole", () => {
  it("gives the owners the scale in state order, then the actors", () => {
    expect([...toneByRole(states, transitions)]).toEqual([
      ["writer", "cat1"],
      ["editor", "cat2"],
      ["owner", "cat3"],
    ]);
  });

  it("keeps a pin and gives the others the next colour no role is pinned to", () => {
    expect([...toneByRole(states, transitions, { owner: "cat1", editor: "cat5" })]).toEqual([
      ["writer", "cat2"],
      ["editor", "cat5"],
      ["owner", "cat1"],
    ]);
  });

  it("wraps past the eighth colour", () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ id: `s${i}`, label: "S", owner: `r${i}` }));
    const tones = toneByRole(many, []);
    expect(tones.get("r7")).toBe("cat8");
    expect(tones.get("r8")).toBe("cat1");
  });

  it("has no roles for a machine with no owners or actors", () => {
    expect(toneByRole([{ id: "a", label: "A" }], [{ from: "a", to: "a" }]).size).toBe(0);
  });
});

describe("moverOf", () => {
  const owners = new Map(states.map((s) => [s.id, s.owner]));
  it("is the actor when there is one", () => {
    expect(moverOf({ from: "draft", to: "review", actor: "editor" }, owners)).toBe("editor");
  });
  it("is the from state's owner when there is no actor", () => {
    expect(moverOf({ from: "draft", to: "review" }, owners)).toBe("writer");
  });
  it("is nobody for an unowned state with no actor", () => {
    expect(moverOf({ from: "done", to: "draft" }, owners)).toBeUndefined();
  });
});
