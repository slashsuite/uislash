import {
  type ReactElement,
  type ReactNode,
  type ToggleEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { buttonClass } from "./Button.js";
import { cx } from "./cx.js";
import { Icon } from "./Icon.js";
import { look } from "./IconButton.js";
import type { IconName } from "./icons.js";
import { definedProps, type Passthrough } from "./props.js";
import type { Size } from "./size.js";
import { Tipped, type TriggerProps } from "./Tooltip.js";

export type PopoverProps = Passthrough & {
  /** The trigger's accessible name and the panel's. Without `icon` it is the trigger's visible text. */
  label: string;
  /**
   * Makes the trigger a ghost square button holding this glyph, named by `label` (shown as its
   * tooltip). Without it the trigger is an outline `Button` reading `label`, with a chevron.
   */
  icon?: IconName | undefined;
  /** What the panel holds: a few lines, a short list, a filter or two. */
  children: ReactNode;
  /**
   * The trigger's height, the same steps as `IconButton` and `Button`: `sm` inside a row or a card
   * header. The panel does not change with it.
   * @default md
   */
  size?: Size | undefined;
  /** Opens on mount, for a story or a test that shows the open panel. */
  defaultOpen?: boolean | undefined;
};

/**
 * The panel. Where the browser places a popover by its anchor, it sits under the trigger, aligned to
 * its end, and flips above (or to the other side) when there is no room; elsewhere it keeps the
 * browser's own place for a popover, the middle of the screen.
 */
const PANEL = cx(
  "w-max max-w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-lg outline-none",
  "supports-[anchor-name:--a]:inset-auto supports-[anchor-name:--a]:m-0 supports-[anchor-name:--a]:my-1",
  "[position-area:bottom_span-left] [position-try-fallbacks:flip-block,flip-inline]",
);

/** The trigger's face: the glyph, or the label and a chevron. */
function Face({ icon, label, size }: { icon: IconName | undefined; label: string; size: Size }) {
  if (icon) return <Icon name={icon} size={size} />;
  return (
    <>
      {label}
      <Icon name="chevron-down" size={size} />
    </>
  );
}

/**
 * A button that opens a small panel of content beside it: a detail, a short list, a filter. It is
 * the browser's own popover, rendered in place: a click outside it, Esc or the trigger closes it,
 * and the focus goes back to the trigger. It is not modal: the page stays usable, and Tab moves from
 * the trigger into the panel and on. A list of actions is a `Menu`; a question to answer first is a
 * `Dialog`. `data-*` and `aria-*` land on the trigger.
 */
export function Popover({
  label,
  icon,
  children,
  size = "md",
  defaultOpen = false,
  ...rest
}: PopoverProps): ReactElement {
  const id = useId();
  const panelId = `${id}-panel`;
  const anchor = `--hc-pop${id.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen) panel.current?.showPopover();
  }, [defaultOpen]);

  // The tooltip's props come after the caller's, merged with them; its anchor joins the panel's.
  const trigger = ({ style, ...own }: TriggerProps<HTMLButtonElement>) => (
    <button
      {...definedProps(rest)}
      {...own}
      type="button"
      popoverTarget={panelId}
      aria-expanded={open}
      {...(icon ? { "aria-label": label } : {})}
      className={icon ? look({ variant: "ghost", size }) : buttonClass("outline", { size })}
      style={{ anchorName: [style?.anchorName, anchor].filter(Boolean).join(", ") }}
    >
      <Face icon={icon} label={label} size={size} />
    </button>
  );

  return (
    <>
      {icon ? (
        <Tipped<HTMLButtonElement> text={label} describes={false} own={definedProps(rest)}>
          {trigger}
        </Tipped>
      ) : (
        trigger({})
      )}
      <div
        ref={panel}
        id={panelId}
        popover="auto"
        role="dialog"
        aria-label={label}
        // A click on its text keeps the focus in the panel, so Esc returns it to the trigger.
        tabIndex={-1}
        onToggle={(event: ToggleEvent<HTMLDivElement>) => setOpen(event.newState === "open")}
        className={PANEL}
        style={{ positionAnchor: anchor }}
      >
        {children}
      </div>
    </>
  );
}
