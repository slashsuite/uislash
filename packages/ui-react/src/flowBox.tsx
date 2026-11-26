/** One box of a `FlowDiagram` or a `StateMachine`, placed. Internal. */
import type { ReactElement } from "react";
import { TONE_SURFACE, TONE_TEXT } from "./Callout.js";
import { cx } from "./cx.js";
import type { ViewNode, ViewTone } from "./FlowDiagram.js";
import type { FlowNodeBox } from "./flowLayout.js";
import { contentKey, labelKey, nodeKey } from "./useFlowLayout.js";

/** A box's frame by tone: the Callout's soft surfaces, a white box for `neutral`, a grey one for `muted`. */
const NODE_TONE: Record<ViewTone, string> = {
  ...TONE_SURFACE,
  neutral: "border-slate-300 bg-white",
  muted: "border-slate-200 bg-slate-50",
};

/** A box's ink by tone; `neutral` is the primary ink, `muted` the quiet one. */
const NODE_INK: Record<ViewTone, string> = {
  ...TONE_TEXT,
  neutral: "text-slate-900",
  muted: "text-slate-500",
};

/** A bar of `colour` (a text colour utility) across a box's top edge. */
function AccentBar({ colour }: { colour: string }): ReactElement {
  return (
    <span aria-hidden="true" className={cx("absolute inset-x-0 top-0 h-1 bg-current", colour)} />
  );
}

/** A box's frame: its tone's surface and ink, its size, the ring when `active`, and room for its accent bar. */
function frameClass(node: ViewNode, active: boolean, uniform: boolean): string {
  const tone = node.tone ?? "neutral";
  return cx(
    "rounded-lg border px-3 py-2 text-sm",
    node.accent && "relative overflow-hidden",
    uniform ? "flex size-full flex-col" : "w-max max-w-72 shrink-0",
    NODE_TONE[tone],
    NODE_INK[tone],
    active && "outline-2 outline-offset-2 outline-violet-600",
  );
}

/**
 * One box, placed: its label and content, sized by them, centred in the slot the layout gave it.
 * A `uniform` box fills its slot instead, its label measured alone and wrapped to the box's width,
 * its content at the bottom.
 */
export function FlowBoxView({
  box,
  node,
  active,
  uniform,
}: {
  box: FlowNodeBox;
  node: ViewNode;
  active: boolean;
  uniform: boolean;
}): ReactElement {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
    >
      <div
        {...(uniform ? {} : { "data-measure": nodeKey(box.id) })}
        className={frameClass(node, active, uniform)}
      >
        {node.accent && <AccentBar colour={node.accent} />}
        <div
          {...(uniform ? { "data-measure": labelKey(box.id) } : {})}
          className={cx("font-medium", uniform && "break-words")}
        >
          {node.label}
        </div>
        {node.content != null && (
          <div
            {...(uniform ? { "data-measure": contentKey(box.id) } : {})}
            className={uniform ? "mt-auto pt-2" : "mt-2"}
          >
            {node.content}
          </div>
        )}
      </div>
    </div>
  );
}
