import { type ComponentPropsWithoutRef, type ReactElement, type ReactNode, useId } from "react";
import type { Tone } from "./tone.js";
import { CardBadge } from "./CardBadge.js";
import { cardBody } from "./CardBody.js";
import { InCard, InRegions, useRegions } from "./cardContext.js";
import { cardControl, splitRootAttrs } from "./cardControl.js";
import { type CardHue, cardClass, cardForm, withFooter } from "./cardForm.js";
import { CardFooter, CardMore } from "./CardParts.js";
import { cx } from "./cx.js";
import { DensityProvider } from "./density.js";
import { type HeadingLevel, HeadingLevelProvider, useHeadingLevel } from "./headingLevel.js";
import type { IconName } from "./icons.js";
import type { Passthrough } from "./props.js";
import { GapProvider } from "./stackGap.js";
import { busy, type LoadingProps, LoadingScope, useLoading } from "./skeleton.js";
import { CardWait } from "./cardWait.js";

export type { CardHue } from "./cardForm.js";
import type { Size } from "./size.js";

type CardBase = LoadingProps & {
  /** The card's heading (a small uppercase label unless `titleStyle` says otherwise). It names the card, which is then an `article`. */
  title?: string;
  /**
   * The title's heading level, 2 to 6. It does not change how the title looks.
   * @default one below the heading that holds the card: 2 on the page, 3 in a `Section`
   */
  level?: HeadingLevel | undefined;
  /**
   * How the `title` is set. `overline` is the small uppercase label of a panel; `name` is the same
   * heading in sentence case and the primary ink, for a card whose title is a name (a shop, a listing,
   * an event). Count, status, actions, `bar` and `size` work the same with both.
   * @default overline
   */
  titleStyle?: "overline" | "name";
  /** A small number beside the title (how many rows the card holds). Needs a `title`. */
  count?: number;
  /** A `Pill` (or any node) directly beside the title and count, not at the far end like `actions`. Needs a `title`. */
  status?: ReactNode;
  /** Put the title, count and actions in a tinted strip above the body, edge to edge. */
  bar?: boolean;
  /** No padding and `overflow-hidden`: the body (a table, a list) fills the card. */
  flush?: boolean;
  /**
   * A dashed edge, for a card that stands for something not real yet: a plan, a draft, an imagined
   * result beside a real one. With `bar` the strip's lower edge is dashed too.
   */
  dashed?: boolean;
  /**
   * One of the library's icons, drawn at feature size in the accent colour above the title: the
   * mark of a feature card. Ignored with `bar` and `flush`.
   *
   * Pick it by the idea it stands for.
   */
  icon?: IconName;
  /**
   * A band across the card, edge to edge inside its padding, under the title and above the
   * children: a `ProgressBar` or a strip of colour that runs the card's full width.
   *
   * A bordered sub-card inside a card is a nested `Card tone="neutral"`, not a hand-built box.
   */
  inset?: ReactNode;
  /**
   * A `Pill` (or any small node) pinned in the top corner at the end edge, over the content and
   * inside the radius, with no change to the layout. On a titled link card the link is named by the
   * title alone; an untitled one is named by its whole content, badge included. A link or button in
   * it is clickable on its own.
   *
   * Use it for a category (`Pill tone="info"`) or a flag on the thing itself.
   */
  badge?: ReactNode;
  /**
   * The warn tone's strong border in place of the card's own, for the one card in a set that needs
   * a look (a run that differed). It keeps the card's fill. Name why in the card too (a `Pill` in
   * `badge`, or the body); the border alone says nothing to a screen reader.
   *
   * Add `tone="warn"` for the warn surface too.
   */
  attention?: boolean;
  /**
   * `sm` is dense padding on the body, heading and bar, and makes a `Button`, `IconButton` or `Pill`
   * inside with no `size` of its own `sm` too; `lg` is one step roomier than `md`.
   *
   * `sm` suits a dense dashboard, `lg` a card that stands alone.
   * @default md
   */
  size?: Size;
  /**
   * `sm` caps the card at 24rem, for a card that stands alone in a wide column (a sign-in panel, a
   * plan). Left out, the card takes the width it is given.
   */
  width?: "sm" | undefined;
  children: ReactNode;
} & CardSurface;

/** `tone` and `hue` paint the same fill and edge, so a card takes one or the other. */
type CardSurface =
  | {
      /** A soft fill and border in the Callout's tones, for a data panel with a status. Ignored with `bar`. */
      tone?: Tone | undefined;
      hue?: undefined;
    }
  | {
      tone?: undefined;
      /**
       * One hue of a set of peer cards, such as one card per product: a soft fill and edge the theme
       * paints. It is not a status (that is `tone`), and the title still names the card. Ignored with
       * `bar` and `dashed`.
       */
      hue?: CardHue | undefined;
    };

type CardPanelProps = CardBase & {
  /** Buttons or links at the end of the header: in the strip with `bar`, else beside the title. */
  actions?: ReactNode;
  /** A tinted strip across the bottom of the card, under a hairline, for the card's own actions or a total. It stays at the foot when the card is stretched in a `CardGrid`. */
  footer?: ReactNode;
  /**
   * Take the parent's full height: the title or bar stays put and the body scrolls. The parent sets
   * the height.
   *
   * For a panel in a fixed-height layout, such as a sheet over a map. Put links or controls in the
   * body, so a keyboard can reach and scroll it.
   */
  fill?: boolean;
  href?: undefined;
  external?: undefined;
  more?: undefined;
  moreLabel?: undefined;
  onPress?: undefined;
} & Omit<ComponentPropsWithoutRef<"article">, "title" | "className" | "style" | "children">;

type CardLinkProps = CardBase & {
  actions?: undefined;
  footer?: undefined;
  fill?: undefined;
  onPress?: undefined;
  /** Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`. */
  external?: boolean | undefined;
  /**
   * Makes the whole card one link to this URL, with no `actions` or `footer`; an in-app path goes
   * through the app's `LinkProvider`. The link is named by the card's title.
   */
  href: string;
  /**
   * A "Read more" line with an arrow at the foot of the card, in the accent colour: the cue that the
   * card goes somewhere, for a post or an article. Draw it on every card of a set or on none.
   */
  more?: boolean | undefined;
  /**
   * The words of the `more` line.
   * @default "Read more"
   */
  moreLabel?: string | undefined;
} & Passthrough &
  /** The link's own: a file to save, a `rel` beyond `external`'s, and a press to track. */
  Pick<ComponentPropsWithoutRef<"a">, "download" | "rel" | "onClick">;

type CardButtonProps = CardBase & {
  actions?: undefined;
  footer?: undefined;
  fill?: undefined;
  href?: undefined;
  external?: undefined;
  more?: undefined;
  moreLabel?: undefined;
  /**
   * Makes the whole card one button that runs this, stretched over the card like a link card's link
   * and named by its title: a card the user picks (a store, a plan). With no `actions`, `footer` or
   * `href`. A picked card says so with `aria-pressed` and its own words (a `Pill` in `badge`).
   */
  onPress: () => void;
} & Passthrough;

type CardProps = CardPanelProps | CardLinkProps | CardButtonProps;

function isCardLink(props: CardProps): props is CardLinkProps {
  return props.href !== undefined;
}

function isCardButton(props: CardProps): props is CardButtonProps {
  return props.onPress !== undefined;
}

/**
 * A bordered panel with an optional title, count and status. A titled card is an `article` named by
 * its title, one with only an `aria-label` an `article` too, and any other a `div`. Two opt-in forms
 * for data views: `flush` drops the padding and clips the corners, for a table that runs edge to
 * edge; `bar` puts the title, count and `actions` in a tinted strip across the top, over the body.
 * A flush card has no padding for a `title`, so give it a `bar`. An empty state is an `EmptyState`,
 * which draws its own dashed frame. Inside a card a `Stack` is `xs` apart, and the title's
 * heading level is one below the heading that holds the card. `size="sm"` is the dense padding and `size="lg"` the
 * roomy one, the same on a `ListRow` and a `FileDrop`. `tone` is the Callout's set, for a data panel that carries a status
 * (a soft fill and border, no shadow); a message is still a `Callout`, and `bar` has no tone. `hue`
 * paints one of a set of peer cards in its own hue, the theme's; it is not a status, and `tone`,
 * `bar` and `dashed` win over it. `dashed` draws a dashed edge for a card that stands for something
 * not real yet, and with `bar` the strip's edge is dashed too. `width="sm"` caps the card at 24rem. A
 * titled panel is named by its title: the root gets
 * `aria-labelledby` pointing at the heading, unless the caller passes its own `aria-label` or
 * `aria-labelledby`, which wins. Other props (`id`, `data-*`, `aria-*`) go on the root. The root is `relative`, so a
 * `TextLink stretch` inside it covers the card. A card with an `id` is an anchor target: `#id`
 * scrolls it clear of the sticky header (and a `subnav`) and outlines it in the accent colour while
 * it is the target.
 *
 * `icon` is one of the library's icons at feature size in the accent colour, above the title: the
 * mark of a feature card. It sits in the padded body, so `bar` and `flush` have none.
 *
 * `footer` is a tinted strip across the bottom, under a hairline, for the card's own actions or a
 * total; in a `CardGrid` it stays at the foot of a card that is stretched to the row's height. It
 * suits a panel, not a card that is a link.
 *
 * `fill` makes a panel take its parent's full height (the parent sets it): the title or bar and the
 * `inset` band stay put and the body scrolls, with room inside it for a focus ring at its edge. Not
 * on a link card.
 *
 * `href` makes the whole card one link: a hover border and the focus ring, with the link stretched
 * over the card, so it takes no `actions` or `footer`. `onPress` makes it one button the same way. A
 * `TextLink`, `Button` or `Checkbox` in the body sits above the link and is clickable on its own. An
 * in-app `href` is drawn by the app's router link through `LinkProvider`. `external` opens it in a
 * new tab, and `more` draws a "Read more" line at its foot. On a link or button card `id`, `data-*`
 * and the describing `aria-*` (`aria-describedby`, `aria-details`, …) go on the card root; the
 * control's own `aria-label`, `aria-labelledby`, `aria-current` and `aria-pressed` stay on it. The
 * link or button is named by the card's title; an untitled one by the card's text, through the root's
 * id, which is generated when the caller gives none.
 *
 * In a `CardGrid align="regions"` the card's header, body and footer line up with its neighbours'
 * across the row.
 *
 * While `loading` a card with no children draws three lines of text bones, a `flush` one three
 * `ListRow` bones; what it has (its title, its children) draws as usual.
 */
export function Card(props: CardProps): ReactElement {
  const level = useHeadingLevel(props.level);
  const regions = useRegions();
  const { loading, owner } = useLoading(props.loading);
  const shown = {
    ...props,
    ...busy(owner, loading),
    children: (
      <CardWait loading={loading} owner={owner} label={props.loadingLabel} flush={props.flush}>
        {props.children}
      </CardWait>
    ),
  };
  return (
    <InCard>
      <InRegions value={false}>
        <GapProvider gap="xs">
          <DensityProvider size={props.size === "sm" ? "sm" : null}>
            <LoadingScope loading={loading}>
              {props.title ? (
                <HeadingLevelProvider level={level}>
                  {cardOf(shown, level, regions)}
                </HeadingLevelProvider>
              ) : (
                cardOf(shown, level, regions)
              )}
            </LoadingScope>
          </DensityProvider>
        </GapProvider>
      </InRegions>
    </InCard>
  );
}

/** Whether a caller named the card: a card with a name is an article, as a plain div may carry no `aria-label`. */
function hasOwnName(rest: {
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
}) {
  return rest["aria-label"] !== undefined || rest["aria-labelledby"] !== undefined;
}

/** The card in its form, its title at `level`. An untitled card adds no heading, so what is inside keeps the level of what holds it. */
function cardOf(props: CardProps, level: HeadingLevel, regions: boolean): ReactElement {
  if (isCardLink(props) || isCardButton(props)) {
    return <ActionCard {...props} level={level} regions={regions} />;
  }
  return <PanelCard {...props} level={level} regions={regions} />;
}

/** A card that is not a link or a button: an `article` named by its heading or the caller's name, a `div` without one. */
function PanelCard(
  props: CardPanelProps & { level: HeadingLevel; regions: boolean },
): ReactElement {
  const {
    title,
    titleStyle,
    count,
    status,
    actions,
    footer,
    bar,
    dashed,
    flush,
    tone,
    hue,
    badge,
    inset,
    attention,
    icon,
    fill,
    width,
    size = "md",
    level,
    regions,
    children,
    loading: _loading,
    loadingLabel: _loadingLabel,
    href: _href,
    external: _external,
    more: _more,
    moreLabel: _moreLabel,
    onPress: _onPress,
    ...rest
  } = props;
  const labelled = hasOwnName(rest);
  const Tag = title || labelled ? "article" : "div";
  const headingId = useId();
  const form = withFooter(
    cardForm(
      { flush, bar, dashed, tone, hue, attention, icon, fill, width, size },
      Boolean(title || actions),
      regions,
    ),
    footer,
  );
  // The title names the card; a caller's own name wins.
  const named = title && !labelled;
  return (
    <Tag {...(named ? { "aria-labelledby": headingId } : {})} {...rest} className={cardClass(form)}>
      {cardBody(form, {
        title,
        titleStyle,
        level,
        count,
        status,
        actions,
        inset,
        children,
        headingId,
      })}
      {form.footer && <CardFooter size={form.size}>{footer}</CardFooter>}
      {badge && <CardBadge size={form.size}>{badge}</CardBadge>}
    </Tag>
  );
}

/**
 * A card that is a link or a button: a `div` with the control stretched over it as an empty
 * overlay, so the card's own links and buttons are not nested in it.
 */
function ActionCard(
  props: (CardLinkProps | CardButtonProps) & { level: HeadingLevel; regions: boolean },
): ReactElement {
  const {
    title,
    titleStyle,
    count,
    status,
    actions,
    bar,
    dashed,
    flush,
    tone,
    hue,
    badge,
    inset,
    attention,
    icon,
    width,
    size = "md",
    level,
    regions,
    children,
    external: _external,
    href: _href,
    onPress: _onPress,
    more,
    moreLabel = "Read more",
    loading: _loading,
    loadingLabel: _loadingLabel,
    ...rest
  } = props;
  const form = cardForm(
    { flush, bar, dashed, tone, hue, attention, icon, width, size },
    Boolean(title),
    regions,
  );
  const generated = useId();
  const headingId = useId();
  const [root, control] = splitRootAttrs(rest);
  // An untitled card's control is named by the whole card, so the root needs an id: the caller's, else a generated one.
  const cardId = typeof root["id"] === "string" ? root["id"] : generated;
  return (
    <div
      {...root}
      id={cardId}
      className={cx(cardClass(form), "transition hover:border-violet-400")}
    >
      {cardControl(props, control, title ? headingId : cardId)}
      {cardBody(form, {
        title,
        titleStyle,
        level,
        count,
        status,
        actions,
        inset,
        children: more ? (
          <>
            {children}
            <CardMore>{moreLabel}</CardMore>
          </>
        ) : (
          children
        ),
        headingId,
      })}
      {badge && <CardBadge size={form.size}>{badge}</CardBadge>}
    </div>
  );
}
