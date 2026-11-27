import type { ComponentPropsWithoutRef, ReactElement } from "react";
import { cx, focusRing } from "./cx.js";
import { type IconName, iconGlyph } from "./icons.js";
import { renderLink } from "./link.js";
import type { Unstyled } from "./props.js";
import type { Size } from "./size.js";
import { TEXT_TONE, type TextTone } from "./typography.js";

const LINK = "rounded font-medium underline-offset-2 transition-colors";

/** The classes of an inline text link, for a router's own <Link> that should look like one. */
export const linkClass = cx(LINK, "text-violet-600 hover:text-violet-700", focusRing);

// A toned link takes its tone's text colour, shared with Table's cells and the inline roles, and
// underlines on hover in place of a hover shade.
const toneClass = (tone: Exclude<TextTone, "neutral">): string =>
  cx(LINK, TEXT_TONE[tone], "hover:underline", focusRing);

/**
 * Stretches a link's hit area over its nearest `relative` ancestor (a table row, a card), so the
 * whole of it opens the link. Add it to the one link in the row; the ancestor needs `relative`.
 * `link-stretch` marks the link, so a `TableRow` or `Card` that lifts its other links and buttons
 * above it leaves this one alone.
 */
export const linkStretchClass = "link-stretch after:absolute after:inset-0";

/**
 * A TextLink's colour: a text tone, as on the inline roles, or `quiet`, the primary ink at rest and
 * the accent on hover, for a link in a row or list of links (a footer row, a table of contents),
 * never inside a sentence, where with no colour or underline at rest it reads as plain text. This
 * extends `TextTone` outward with `quiet`, a look only a link has.
 */
export type TextLinkTone = TextTone | "quiet";

// The ink at rest, the accent on hover; focus draws the accent ring, as on every link.
const QUIET = cx(LINK, "text-slate-900 hover:text-violet-700", focusRing);

// The tone's colour, the quiet ink, or the accent with its hover shade.
function colourClass(tone: TextLinkTone | undefined): string {
  if (tone === "quiet") return QUIET;
  if (tone === undefined || tone === "neutral") return linkClass;
  return toneClass(tone);
}

// The trailing icon: one size, a touch under the text's, sitting on the baseline.
const ICON = "ms-1 inline-block size-[0.875em] align-[-0.125em] [&>svg]:size-full";

/** A TextLink's pinned type size, on the `Size` scale; left out, it takes the size of the text around it. */
export type TextLinkSize = Size;

const SIZE: Record<TextLinkSize, string> = {
  sm: "text-sm/5",
  md: "text-sm/5",
  lg: "text-base/6",
};

type TextLinkProps = {
  /**
   * The link's own type size: `sm` is `text-sm`, `md` `text-sm` and `lg` `text-base`. Left out, it
   * takes the size of the text around it: a link inside prose has no default size.
   */
  size?: TextLinkSize | undefined;
  /**
   * A meaning's colour, as on the inline roles: `warn` for a warning link, `danger`, `positive`,
   * `info` or `muted`; or `quiet`, the primary ink at rest and the accent on hover, for a row or list
   * of links and never inside a sentence. Left out, the
   * link is the accent colour.
   */
  tone?: TextLinkTone | undefined;
  /** An icon after the words (`chevron-right`, say), at one size on the baseline; it is decorative and hidden from assistive tech. */
  icon?: IconName | undefined;
  /** The monospace face, for a path, an id or a command. */
  mono?: boolean | undefined;
  /** Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`. */
  external?: boolean | undefined;
  /**
   * The link covers its nearest `relative` ancestor, so the whole row or card is the click target.
   *
   * Put it on the one link of a `Card` or a `TableRow` (a table row's first cell): any other link
   * or button in it sits above the link and is clickable on its own. An action that is not
   * navigation stays a `Button` in an actions column.
   */
  stretch?: boolean | undefined;
  /** Always underlined, for a link set inside running text, where colour alone does not mark it (WCAG 1.4.1). */
  underline?: boolean | undefined;
  /** Where the link goes; an in-app path goes through the app's `LinkProvider`. */
  href: string;
} & Unstyled<Omit<ComponentPropsWithoutRef<"a">, "href">>;

/**
 * An inline text link in the accent colour. Every anchor prop goes on the `<a>`; an in-app `href`
 * is drawn by the app's router link through `LinkProvider`.
 * `size` pins the type size (`sm`, `md` or `lg`), `tone` gives it a meaning's colour (or `quiet`,
 * ink that turns the accent on hover) and `mono` sets the monospace face. `icon` puts one of the
 * library's icons after the words, hidden from assistive tech: the words name the link.
 */
export function TextLink({
  size,
  tone,
  mono = false,
  external = false,
  stretch = false,
  underline = false,
  href,
  icon,
  children,
  ...rest
}: TextLinkProps): ReactElement {
  return renderLink({
    ...rest,
    href,
    external,
    className: cx(
      colourClass(tone),
      size && SIZE[size],
      mono && "font-mono",
      stretch && linkStretchClass,
      underline && "underline",
    ),
    children:
      icon === undefined ? (
        children
      ) : (
        <>
          {children}
          <span aria-hidden="true" className={ICON}>
            {iconGlyph(icon)}
          </span>
        </>
      ),
  });
}
