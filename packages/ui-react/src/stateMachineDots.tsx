import type { AnimationEvent, ReactElement } from "react";
import { cx, focusRing } from "./cx.js";
import type { FlowLayout, FlowNodeBox } from "./flowLayout.js";
import { renderLink } from "./link.js";
import { type CategoryTone, VIZ_TONE } from "./StackedBar.js";
import type { StateMachineItem } from "./StateMachine.js";
import { DOT_X, LIMIT, SLOT_W, slotAt, slotsFor } from "./stateMachineGrid.js";
import { type Move, moveCss, Travel } from "./stateMachineMoves.js";
import { useTooltip } from "./Tooltip.js";

const CATEGORIES: readonly CategoryTone[] = [
  "cat1",
  "cat2",
  "cat3",
  "cat4",
  "cat5",
  "cat6",
  "cat7",
  "cat8",
];

/** An item's colour, the same for its id wherever it is drawn. */
function colourOf(id: string): string {
  let sum = 0;
  for (const ch of id) sum = (sum * 31 + (ch.codePointAt(0) ?? 0)) % 997;
  return VIZ_TONE[CATEGORIES[sum % CATEGORIES.length] ?? "cat1"];
}

/** One dot: its colour, its short ref, its full label as name and tooltip, a link when it has `href`. */
function Dot({
  item,
  where,
  left,
  y,
  arriving,
  shift,
  shifted,
}: {
  item: StateMachineItem;
  where: string;
  left: number;
  y: number;
  arriving: boolean;
  /** Its slide from its old slot, when it has just changed slot in its box. */
  shift: Extract<Move, { kind: "shift" }> | undefined;
  shifted: () => void;
}): ReactElement {
  const { props, tooltip } = useTooltip<HTMLElement>(
    item.label,
    { describes: false, tap: item.href === undefined },
    {},
  );
  const className = cx(
    "pointer-events-auto absolute flex h-5 items-center gap-1 rounded px-1 text-sm text-slate-700",
    focusRing,
  );
  const position = {
    ...props.style,
    left: left + 2,
    top: y - 10,
    width: SLOT_W - 4,
    ...(shift ? { "--hc-sm-dx": `${shift.dx}px`, "--hc-sm-dy": `${shift.dy}px` } : {}),
  };
  const body = (
    <>
      <span
        aria-hidden="true"
        className={cx("size-2.5 shrink-0 rounded-full bg-current", colourOf(item.id))}
      />
      <span aria-hidden="true" className="truncate">
        {item.id}
      </span>
    </>
  );
  const own = {
    ...props,
    style: position,
    "aria-label": `${item.label}, in ${where}`,
    ...(arriving ? { "data-hc-sm-arrive": "" } : {}),
    ...(shift ? { "data-hc-sm-shift": shift.seq % 2 === 0 ? "b" : "a" } : {}),
    onAnimationEnd: (event: AnimationEvent<HTMLElement>) => {
      if (event.target === event.currentTarget && event.animationName.startsWith("hc-sm-shift")) {
        shifted();
      }
    },
  };
  return (
    <>
      {item.href === undefined ? (
        <span {...own} role="img" tabIndex={0} className={className}>
          {body}
        </span>
      ) : (
        renderLink({
          ...own,
          href: item.href,
          className: cx(className, "hover:underline"),
          children: body,
        })
      )}
      {tooltip}
    </>
  );
}

/** The `+N` (or "fewer") switch in a full box's last slot. */
function MoreToggle({
  hidden,
  open,
  where,
  left,
  y,
  toggle,
}: {
  hidden: number;
  open: boolean;
  where: string;
  left: number;
  y: number;
  toggle: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? `Show fewer in ${where}` : `Show ${hidden} more in ${where}`}
      onClick={toggle}
      className={cx(
        "pointer-events-auto absolute flex h-5 cursor-pointer items-center rounded px-1 text-sm font-medium text-violet-600 hover:text-violet-700",
        focusRing,
      )}
      style={{ left: left + 2, top: y - 10 }}
    >
      {open ? "fewer" : `+${hidden}`}
    </button>
  );
}

/** What the dot layer draws from: the items in each box, the boxes' names, which boxes are open, the moves, and each run's colour. */
type DotPlaces = {
  inBox: ReadonlyMap<string, readonly StateMachineItem[]>;
  names: ReadonlyMap<string, string>;
  open: ReadonlySet<string>;
  toggle: (id: string) => void;
  moves: ReadonlyMap<string, Move>;
  done: (id: string, seq: number) => void;
  /** The text colour utility of a run from one box to another, if its move has a role. */
  runColour: (from: string, to: string) => string | undefined;
};

/** The drawn diagram, with what the dot layer draws over it. */
type DotScene = DotPlaces & { layout: FlowLayout };

/** The run of an item that has just come into `box`, ending at `end`, if it has one. */
function runInto(
  item: StateMachineItem,
  box: FlowNodeBox,
  end: { left: number; y: number },
  places: DotScene,
): ReactElement | null {
  const move = places.moves.get(item.id);
  // A run needs the box it leaves; with that box gone (the last unplaced item placed) it just lands.
  if (move?.kind !== "travel" || move.to !== box.id) return null;
  if (!places.layout.nodes.some((n) => n.id === move.from)) return null;
  return (
    <Travel
      key={`${item.id}:${move.seq}`}
      move={move}
      drawn={places.layout}
      to={{ x: end.left + DOT_X, y: end.y }}
      colour={places.runColour(move.from, move.to) ?? colourOf(item.id)}
      done={() => places.done(item.id, move.seq)}
    />
  );
}

/** One item's dot in `box`, and its run there when it has just moved in. */
function placeDot(
  item: StateMachineItem,
  at: { left: number; y: number },
  box: FlowNodeBox,
  places: DotScene,
): ReactElement[] {
  const move = places.moves.get(item.id);
  const run = runInto(item, box, at, places);
  const dot = (
    <Dot
      key={`${item.id}:${box.id}`}
      item={item}
      where={places.names.get(box.id) ?? box.id}
      left={at.left}
      y={at.y}
      arriving={run !== null}
      shift={move?.kind === "shift" ? move : undefined}
      shifted={() => move && places.done(item.id, move.seq)}
    />
  );
  return run ? [dot, run] : [dot];
}

/**
 * A box's dots: every item, or the first few and the `+N` that shows the rest. An item that comes
 * in behind the `+N` runs to it.
 */
function boxDots(box: FlowNodeBox, places: DotScene): ReactElement[] {
  const here = places.inBox.get(box.id) ?? [];
  const open = places.open.has(box.id);
  const count = slotsFor(here.length, open);
  const shown = here.length <= LIMIT || open ? here : here.slice(0, LIMIT - 1);
  const dots = shown.flatMap((item, i) => placeDot(item, slotAt(box, i, count), box, places));
  if (here.length <= LIMIT) return dots;
  const at = slotAt(box, count - 1, count);
  const behind = here.slice(shown.length).flatMap((item) => runInto(item, box, at, places) ?? []);
  return [
    ...dots,
    ...behind,
    <MoreToggle
      key={`more:${box.id}`}
      hidden={here.length - shown.length}
      open={open}
      where={places.names.get(box.id) ?? box.id}
      left={at.left}
      y={at.y}
      toggle={() => places.toggle(box.id)}
    />,
  ];
}

/** Every box's dots, over the drawn diagram. */
export function dotLayer(layout: FlowLayout, places: DotPlaces): ReactElement {
  return (
    <>
      <style>{moveCss}</style>
      {layout.nodes.flatMap((box) => boxDots(box, { ...places, layout }))}
    </>
  );
}
