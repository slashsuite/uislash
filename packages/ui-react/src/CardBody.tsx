import type { ReactNode } from "react";
import { CardBar, CardHeader, CardHeading, CardIcon, CardInset } from "./CardParts.js";
import { cx } from "./cx.js";
import { ScrollBody } from "./scrollBody.js";
import type { HeadingLevel } from "./headingLevel.js";
import type { IconName } from "./icons.js";
import type { Size } from "./size.js";

/** The padding of a card's body by `size`. */
export const BODY_PAD: Record<Size, string> = { sm: "p-3", md: "p-5", lg: "p-6" };

/** The options a card resolved (`cardForm` in `Card.tsx`) that shape its body. */
type BodyForm = {
  flush: boolean;
  bar: boolean;
  dashed: boolean;
  regions: boolean;
  icon: IconName | undefined;
  fill: boolean;
  footer: boolean;
  size: Size;
};

type BodyParts = {
  title: string | undefined;
  titleStyle: "overline" | "name" | undefined;
  level: HeadingLevel;
  count: number | undefined;
  status: ReactNode;
  actions: ReactNode;
  inset: ReactNode;
  children: ReactNode;
  headingId: string | undefined;
};

function insetBand(form: BodyForm, inset: ReactNode): ReactNode {
  if (!inset) return null;
  return (
    <CardInset size={form.size} bleed={!form.flush}>
      {inset}
    </CardInset>
  );
}

/** With `fill` the body takes the room the header (and a footer) leave, and only it scrolls. */
const SCROLL = "min-h-0 flex-1 overflow-y-auto";

/**
 * The room a scroller with no padding of its own gives a focus ring at its edge: `focusRing` draws
 * 2px out past a 2px offset, so 4px inside the scroller, given back by the same margin outside it.
 */
const RING_ROOM = "-m-1 p-1";

/** What names a filled body when it takes a tab stop: the card's heading, or its title where the heading has no id. */
function scrollName(parts: BodyParts): { label?: string; labelledBy?: string } {
  if (!parts.title) return {};
  return parts.headingId ? { labelledBy: parts.headingId } : { label: parts.title };
}

/** The padding the body takes itself, when the root has none: never on a flush card. */
const pad = (form: BodyForm) => !form.flush && BODY_PAD[form.size];

/** The icon, header, inset band and children of a card with no bar. */
function plainBody(form: BodyForm, heading: ReactNode, parts: BodyParts): ReactNode {
  const content = (
    <>
      {form.icon && <CardIcon name={form.icon} size={form.size} />}
      <CardHeader heading={heading} actions={parts.actions} size={form.size} />
      {insetBand(form, parts.inset)}
      {form.fill ? (
        <ScrollBody {...scrollName(parts)} className={cx(SCROLL, !form.flush && RING_ROOM)}>
          {parts.children}
        </ScrollBody>
      ) : (
        parts.children
      )}
    </>
  );
  if (form.fill) {
    return <div className={cx("flex min-h-0 flex-1 flex-col", pad(form))}>{content}</div>;
  }
  // With a footer the root has no padding, so the body pads itself and takes the room left over.
  return form.footer ? <div className={cx("flex-1", pad(form))}>{content}</div> : content;
}

/**
 * A card in a `CardGrid align="regions"`: its header, body and footer are rows of the grid's
 * subgrid, so each starts where its neighbours' do. The root has no padding; each row pads itself.
 */
function regionsBody(form: BodyForm, heading: ReactNode, parts: BodyParts): ReactNode {
  if (form.bar) {
    return (
      <>
        <CardBar heading={heading} actions={parts.actions} size={form.size} dashed={form.dashed} />
        <div className={pad(form) || undefined}>
          {insetBand(form, parts.inset)}
          {parts.children}
        </div>
      </>
    );
  }
  return (
    <>
      <div className={cx(pad(form), "pb-0")}>
        {form.icon && <CardIcon name={form.icon} size={form.size} />}
        <CardHeader heading={heading} actions={parts.actions} size={form.size} />
        {insetBand(form, parts.inset)}
      </div>
      <div className={cx(pad(form), "pt-0")}>{parts.children}</div>
    </>
  );
}

/** A bar card's body. With `fill` the inset band stays put above the scroller, as it does without a bar. */
function barBody(form: BodyForm, parts: BodyParts): ReactNode {
  if (!form.fill) {
    return (
      <div className={cx(form.footer && "flex-1", pad(form)) || undefined}>
        {insetBand(form, parts.inset)}
        {parts.children}
      </div>
    );
  }
  return (
    <>
      {parts.inset && <div className={cx(pad(form), "pb-0")}>{insetBand(form, parts.inset)}</div>}
      <ScrollBody
        {...scrollName(parts)}
        className={cx(
          SCROLL,
          pad(form),
          Boolean(parts.inset) && (form.flush ? "pt-0" : "-mt-1 pt-1"),
        )}
      >
        {parts.children}
      </ScrollBody>
    </>
  );
}

export function cardBody(form: BodyForm, parts: BodyParts): ReactNode {
  const heading = parts.title && (
    <CardHeading
      id={parts.headingId}
      title={parts.title}
      titleStyle={parts.titleStyle}
      level={parts.level}
      count={parts.count}
      status={parts.status}
      bar={form.bar}
      spaced={!form.bar && !parts.actions}
      size={form.size}
    />
  );
  if (form.regions) return regionsBody(form, heading, parts);
  if (!form.bar) return plainBody(form, heading, parts);
  return (
    <>
      <CardBar heading={heading} actions={parts.actions} size={form.size} dashed={form.dashed} />
      {barBody(form, parts)}
    </>
  );
}
