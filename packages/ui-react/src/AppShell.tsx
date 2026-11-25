import { type ReactElement, type ReactNode, useCallback, useId, useState } from "react";
import { AppShellMenuButton, AppShellMenuPanel } from "./AppShellMenu.js";
import { ContainerFrame } from "./Container.js";
import { schemeClass, type ColourScheme, type ColourSchemeClasses } from "./colourScheme.js";
import { cx, focusRing } from "./cx.js";
import { DensityProvider } from "./density.js";
import { renderLink } from "./link.js";
import { useNavFold } from "./navFold.js";
import type { Passthrough } from "./props.js";
import { useScrollEdges } from "./scrollEdges.js";
import type { Size } from "./size.js";

/**
 * The class an app puts on its own `<html>`: it always reserves the scrollbar, so centred content
 * does not shift between a short page and a long one, and it paints the page canvas and sets the
 * type face, ink and font smoothing, so a page outside AppShell (a `CenteredLayout` sign-in, a bare
 * error page) looks like one inside it and an app writes no `<body>` or `<html>` styling of its own.
 * A theme's scope class sits on the same element, where its `.<scope> .<utility>` rules do not reach,
 * so the scope block itself sets the canvas, ink and face (unlayered, over these layered utilities).
 * AppShell never touches `<html>` itself. Several classes: add them with `className`, or split them
 * for `classList.add(...)`.
 */
export const appShellRootClass =
  "overflow-y-scroll bg-gray-50 font-sans text-slate-900 antialiased";

/**
 * Everything an app puts on its own `<html>` from the scheme the server knows: that scheme's class
 * (`schemeClass`) and the shell's root class, joined: `<html className={appShellRootClassFor(scheme,
 * schemes)}>`.
 */
export function appShellRootClassFor(scheme: ColourScheme, schemes?: ColourSchemeClasses): string {
  return cx(schemeClass(scheme, schemes), appShellRootClass);
}

const LOGO_BOX: Record<Size, string> = { sm: "size-5", md: "size-6", lg: "size-8" };

/**
 * The `brand` slot as one link: a logo and a label inside the same `<a>`, so the whole brand is the
 * way home. The label names the link; the logo is decoration and hidden from assistive tech.
 * `collapse` shows only the logo below `sm`, the label staying in the accessible name. An in-app
 * `href` is drawn by the app's router link through `LinkProvider`.
 */
export function AppShellBrand({
  logo,
  logoSize = "md",
  label,
  collapse = false,
  href,
  ...rest
}: Passthrough & {
  /** The name beside the logo. It is the link's accessible name. */
  label: ReactNode;
  /**
   * Where the brand links, usually the app's home (`/`).
   *
   * With a router it goes through the app's `LinkProvider`, like every link.
   */
  href: string;
  /** The logo slot's box: sm 20px, md 24px (the default, an `Avatar size="sm"`), lg 32px. An `<img>` or `<svg>` logo fills it. */
  logoSize?: Size;
} & (
    | {
        /** The mark before the label, e.g. an `Avatar` or an `<img>`. */
        logo?: ReactNode;
        collapse?: false | undefined;
      }
    | {
        logo: ReactNode;
        /** Below `sm` only the logo shows; the label is visually hidden and still names the link. Needs a `logo`. */
        collapse: true;
      }
  )): ReactElement {
  return renderLink({
    ...rest,
    href,
    className: cx("flex items-center gap-2 rounded", focusRing),
    children: (
      <>
        {logo && (
          <span
            aria-hidden="true"
            className={cx(
              "flex shrink-0 items-center justify-center [&>img]:size-full [&>svg]:size-full",
              LOGO_BOX[logoSize],
            )}
          >
            {logo}
          </span>
        )}
        <span className={collapse ? "sr-only sm:not-sr-only" : undefined}>{label}</span>
      </>
    ),
  });
}

// One fixed-height row that never wraps; its children keep their width. From `md` it scrolls sideways
// if it must; below `md` nothing in the header scrolls (the nav is in the menu), so it only clips.
const ROW = "items-center gap-4 overflow-x-clip whitespace-nowrap md:overflow-x-auto *:shrink-0";

// From `md`, while a row has more to scroll to on a side, that edge fades out (a mask, so it follows
// any theme). `ScrollRow` sets `data-more-start` / `data-more-end` (and `data-more` for either); a
// row that fits has none and is untouched. The gradient runs from the inline start, so it flips
// right to left. While the keyboard's focus is in the row (`focus-visible`) the mask is off, so a
// focus ring at a faded edge stays whole. Below `md` there is no mask, which would clip the menu.
const FADE =
  "[--fade-dir:to_right] rtl:[--fade-dir:to_left] md:data-more-start:[--fade-start:2rem] md:data-more-end:[--fade-end:2rem] md:data-more:[mask-image:linear-gradient(var(--fade-dir),transparent,#000_var(--fade-start,0px),#000_calc(100%_-_var(--fade-end,0px)),transparent)] md:data-more:has-focus-visible:[mask-image:none]";

/** A row in a Container, with the fade on whichever side still has content to scroll to. `onRow` is also handed the row. */
function ScrollRow({
  className,
  onRow,
  children,
}: {
  className: string;
  onRow?: ((row: HTMLElement | null) => void) | undefined;
  children: ReactNode;
}) {
  const [row, setRow] = useState<HTMLElement | null>(null);
  useScrollEdges(row, "x");
  const attach = useCallback(
    (element: HTMLElement | null) => {
      setRow(element);
      onRow?.(element);
    },
    [onRow],
  );
  return (
    <ContainerFrame ref={attach} className={cx(ROW, FADE, className)}>
      {children}
    </ContainerFrame>
  );
}

/** The subnav's own row from `md`, hung under the header row; folded, or below `md`, it draws no box. */
function subnavRowFor(folded: boolean): (links: ReactNode) => ReactNode {
  return function SubnavRow(links) {
    return (
      <ScrollRow
        className={cx(
          "max-md:contents",
          folded
            ? "contents"
            : "md:absolute md:inset-x-0 md:top-[calc(env(safe-area-inset-top)+3.5rem)] md:flex md:h-12",
        )}
      >
        {links}
      </ScrollRow>
    );
  };
}

/**
 * The row's end: `controls`, then the Menu button (`children`). Below `md` this wrapper may shrink
 * (the row's `*:shrink-0` is overridden), so a crowded `controls` clips inside its own box and the
 * button stays on screen; from `md` it keeps its width and the row scrolls.
 */
function HeaderEnd({
  controls,
  folded,
  children,
}: {
  controls: ReactNode;
  folded: boolean;
  children: ReactNode;
}): ReactElement {
  return (
    <div
      className={cx(
        "ml-auto flex min-w-0 items-center gap-2 max-md:shrink!",
        !controls && !folded && "md:hidden",
      )}
    >
      {controls && (
        // Clips below `md` only, with 4px of room each side so a focus outline is not cut.
        <div className="flex min-w-0 items-center gap-2 *:shrink-0 max-md:-mx-1 max-md:overflow-x-clip max-md:px-1 [&>.w-full]:w-auto">
          {controls}
        </div>
      )}
      {children}
    </div>
  );
}

/** The sticky header's box. From `md` the subnav row hangs in its bottom padding (it is the panel's, positioned on the header). */
function headerClass(subnavRow: boolean, hideChromeInPrint: boolean): string {
  return cx(
    "group/shell sticky top-0 z-10 border-b border-slate-200 bg-white/95 pt-[env(safe-area-inset-top)]",
    subnavRow && "md:pb-12",
    hideChromeInPrint && "print:hidden",
  );
}

/**
 * The sticky header: one row of slots in order, brand, the menu panel (`nav`, `subnav` and
 * `menuControls`, each rendered once), the free `children`, then `controls` and the Menu button at
 * the end. `controls` have a wrapper of their own that shrinks and clips, and the button sits beside
 * it, so a crowded `controls` never pushes the Menu off a phone screen. From `md` the panel's parts
 * are the row's (`AppShellMenuPanel`) and the subnav is a second row under it; a nav that does not
 * fit folds the header back into menu mode (`folded`). It pads by the top safe-area inset.
 */
function AppShellHeader({
  brand,
  nav,
  controls,
  menuControls,
  subnav,
  menuLabel,
  folded,
  onRow,
  hideChromeInPrint,
  children,
}: {
  brand: ReactNode;
  nav: ReactNode;
  controls: ReactNode;
  menuControls: ReactNode;
  subnav: ReactNode;
  menuLabel: string;
  folded: boolean;
  onRow: (row: HTMLElement | null) => void;
  hideChromeInPrint: boolean;
  children: ReactNode;
}): ReactElement {
  const panelId = `${useId()}-menu`;
  const menu = !!(nav || subnav || menuControls);
  return (
    <header className={headerClass(!!subnav && !folded, hideChromeInPrint)}>
      <ScrollRow className="flex h-14" onRow={onRow}>
        {brand && (
          <div className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
            {brand}
          </div>
        )}
        {menu && (
          <AppShellMenuPanel
            id={panelId}
            controls={menuControls}
            controlsAlone={!controls}
            nav={nav}
            subnav={subnav}
            folded={folded}
            subnavRow={subnavRowFor(folded)}
          />
        )}
        {children}
        {(controls || menu) && (
          <HeaderEnd controls={controls} folded={folded}>
            {menu && <AppShellMenuButton label={menuLabel} panelId={panelId} folded={folded} />}
          </HeaderEnd>
        )}
      </ScrollRow>
    </header>
  );
}

/** The shell's own box: the canvas, ink and face, the bottom inset, and the header's height. */
function shellClass(subnavRow: boolean): string {
  return cx(
    "flex min-h-dvh flex-col bg-gray-50 pb-[env(safe-area-inset-bottom)] font-sans text-slate-900 antialiased",
    // The sticky header's height (its rows, the top inset and the bottom border), for a bar
    // that sticks under it. Below `md` it is one row whatever the slots are: the subnav is in the
    // menu, and so it is when the nav has folded.
    "[--app-header:calc(3.5rem+1px+env(safe-area-inset-top))]",
    subnavRow && "md:[--app-header:calc(6.5rem+1px+env(safe-area-inset-top))]",
    // A link or focus that scrolls to any element with an id stops below the sticky header.
    "[&_[id]]:scroll-mt-[calc(var(--app-header,0px)+1rem)]",
  );
}

/** The page's first tab stop, shown only while it has the focus: it moves the focus to `target`. */
function SkipLink({ target, label }: { target: string; label: string }): ReactElement {
  return (
    <a
      href={`#${target}`}
      className={cx(
        "sr-only z-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:not-sr-only focus:fixed focus:top-[calc(env(safe-area-inset-top)+0.5rem)] focus:left-[calc(env(safe-area-inset-left)+0.5rem)]",
        focusRing,
      )}
    >
      {label}
    </a>
  );
}

/**
 * The main area, the skip link's target: focusable from script only, so it takes the focus with no
 * ring of its own. In a Container unless `bleed`.
 */
function ShellMain({
  id,
  bleed,
  hideChromeInPrint,
  children,
}: {
  id: string;
  bleed: boolean;
  hideChromeInPrint: boolean;
  children: ReactNode;
}): ReactElement {
  return (
    <main id={id} tabIndex={-1} className="flex flex-1 flex-col outline-none">
      {bleed ? (
        children
      ) : (
        <ContainerFrame className={cx("py-8", hideChromeInPrint && "print:p-0")}>
          {children}
        </ContainerFrame>
      )}
    </main>
  );
}

/** The type step an app sets once on its `AppShell`: `compact` is one step down for the whole app. */
export type AppShellDensity = "compact";

/**
 * The page frame: it paints the page canvas and sets the type face, ink and font smoothing
 * (`antialiased`), so an app writes no page-background or font rule of its own (a theme remaps
 * the canvas and the font stacks). A sticky one-row header, an optional second `subnav` row, the main area and an
 * optional footer. Header, main and footer each sit in a `Container`, so pages never set their own
 * width or padding. `bleed` drops main's Container (the header keeps its own), for a layout that
 * needs the whole width (`FullBleedLayout`). Main is a flex column. `SidebarLayout` needs no
 * `bleed`: its rail and canvas share the header's Container.
 *
 * The header row is laid out by its slots, left to right: `brand`, `nav`, then `header` (anything
 * the slots do not cover), then `controls`, pushed to the end. An app writes no wrapper or
 * styling for any of them: an item that only fits a wide screen goes in a `Show from`. A bar
 * that sticks under the header as the page scrolls is a `StickyBar`.
 *
 * On a phone (below `md`) the header is one 56px row at every page: `brand`, `header`, `controls`
 * and a "Menu" button (`menuLabel`), and `nav` and `subnav` move into that menu, so every link is
 * reachable and nothing scrolls sideways. The menu is the browser's popover (`popovertarget`), so
 * it works with the keyboard, closes on Escape and a click outside, hands focus back to the button,
 * and opens on a page that never hydrates. From `md` the header is the
 * row, and the `subnav` row, as they are, except that a `nav` too wide for the row folds into the
 * Menu and comes back when the screen is wide enough (measured, with script; a `subnav` never
 * folds, it scrolls sideways with a fade).
 *
 * The edges need nothing from the app: with `viewport-fit=cover` every Container clears the
 * safe-area insets at the sides, the header the top one and the shell the bottom one; and an
 * element with an `id` anywhere inside lands below the sticky header when a link or focus scrolls
 * to it.
 *
 * `controls` stay in the row at every width, so keep them few (a theme toggle, the viewer's avatar);
 * on a phone a crowded `controls` clips, and the Menu button is never the part cut off. Pickers and
 * actions that do not fit a phone row go in `menuControls`: rendered once, they sit in the row after
 * `controls` from `md`, and below `md` at the top of the Menu, above `nav` and `subnav`.
 */
export function AppShell({
  brand,
  nav,
  controls,
  menuControls,
  header,
  subnav,
  menuLabel = "Menu",
  footer,
  bleed = false,
  printChrome = true,
  density,
  skipLabel = "Skip to content",
  children,
  ...rest
}: {
  /** The brand: a logo and a name, in the header's brand type, with the gap between them. `AppShellBrand` makes both one link. */
  brand?: ReactNode;
  /** The main navigation, e.g. a `Tabs` of links (it is already a `<nav>`). Below `md` it is in the menu. */
  nav?: ReactNode;
  /** The end of the row: a picker, a theme toggle. Gap-2, vertically centred; no child shrinks, and a full-width control (a `Select` at its default) sizes to its content. */
  controls?: ReactNode;
  /**
   * Pickers and actions that do not fit a phone row, such as a project `Select` and a Sign out
   * `Button`. From `md` they sit in the row after `controls`; below `md` they are at the top of the
   * Menu, above `nav` and `subnav`. Rendered once, so a field keeps its state and ids stay unique.
   * `controls` stay in the row at every width, so keep those few.
   */
  menuControls?: ReactNode;
  /**
   * The escape hatch: a free node in the header row, after `brand` and `nav`.
   *
   * Only for a node no other slot covers: prefer `brand`, `nav` and `controls`.
   */
  header?: ReactNode;
  /** A second fixed-height row under the header from `md`, e.g. a `Tabs` of links. Below `md` it is in the menu with `nav`. */
  subnav?: ReactNode;
  /**
   * The phone menu button's name, for an app in another language. Only drawn below `md`, and only
   * when `nav`, `subnav` or `menuControls` is given.
   * @default Menu
   */
  menuLabel?: string;
  /** The page footer: small muted text in a `Container`, under a hairline. Hidden in print with `printChrome={false}`. */
  footer?: ReactNode;
  /**
   * Main without a Container, for a full-bleed layout.
   *
   * For a layout that needs the whole width, such as `FullBleedLayout`; `SidebarLayout` needs no
   * `bleed`.
   */
  bleed?: boolean;
  /**
   * Whether a print shows the header and footer. `false` prints only the page: the header and
   * footer are hidden, and main's Container drops its padding (the page margin is then `@page`'s).
   *
   * The screen is unchanged.
   * @default true
   */
  printChrome?: boolean;
  /**
   * The app's type step, set once here and nowhere else: `compact` sets text, headings and controls
   * one step down everywhere inside, for an app's dense chrome. Left out, text is 16px, as a site's.
   */
  density?: AppShellDensity | undefined;
  /**
   * The skip link's words, for an app in another language. The link is the page's first tab stop,
   * hidden until it has the focus, and moves the focus past the header to the main area.
   * @default Skip to content
   */
  skipLabel?: string;
  children: ReactNode;
} & Passthrough): ReactElement {
  const hideChromeInPrint = !printChrome;
  const mainId = `${useId()}-main`;
  const [row, setRow] = useState<HTMLElement | null>(null);
  const folded = useNavFold(row, !!nav);
  return (
    <DensityProvider type={density}>
      <div {...rest} className={shellClass(!!subnav && !folded)}>
        <SkipLink target={mainId} label={skipLabel} />
        <AppShellHeader
          brand={brand}
          nav={nav}
          controls={controls}
          menuControls={menuControls}
          subnav={subnav}
          menuLabel={menuLabel}
          folded={folded}
          onRow={setRow}
          hideChromeInPrint={hideChromeInPrint}
        >
          {header}
        </AppShellHeader>
        <ShellMain id={mainId} bleed={bleed} hideChromeInPrint={hideChromeInPrint}>
          {children}
        </ShellMain>
        {footer && (
          <footer className={cx("border-t border-slate-200", hideChromeInPrint && "print:hidden")}>
            <ContainerFrame className="py-6 text-sm text-slate-500">{footer}</ContainerFrame>
          </footer>
        )}
      </div>
    </DensityProvider>
  );
}
