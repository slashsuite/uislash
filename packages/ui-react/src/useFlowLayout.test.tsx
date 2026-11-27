// @vitest-environment jsdom
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import type { FlowDirection, FlowLayout } from "./flowLayout.js";
import { render } from "./render.harness.js";
import { useFlowLayout } from "./useFlowLayout.js";

// Each render hands the hook fresh arrays, the way FlowDiagram's and StateMachine's callers do.
function Probe({
  direction,
  seen,
}: {
  direction: FlowDirection;
  seen: FlowLayout[];
}): ReactElement {
  const { canvas, drawn } = useFlowLayout(
    [
      { id: "a", label: "Draft" },
      { id: "b", label: "Sent" },
    ],
    [{ from: "a", to: "b", label: "send" }],
    direction,
  );
  seen.push(drawn);
  return <div ref={canvas} />;
}

describe("useFlowLayout", () => {
  it("keeps the layout while its input is the same, and lays out again when it changes", () => {
    const seen: FlowLayout[] = [];
    const { rerender } = render(<Probe direction="down" seen={seen} />);
    rerender(<Probe direction="down" seen={seen} />);
    expect(seen.at(-1)).toBe(seen[0]);

    rerender(<Probe direction="right" seen={seen} />);
    expect(seen.at(-1)).not.toBe(seen[0]);
    expect(seen.at(-1)).toMatchObject({ nodes: [{ id: "a" }, { id: "b" }] });
  });
});
