import type { ReactElement, ReactNode } from "react";
import { Button } from "./Button.js";
import { CodeBlock } from "./CodeBlock.js";
import { useHome } from "./link.js";
import { CenteredLayout } from "./PageLayouts.js";
import type { Passthrough } from "./props.js";

// Whole pages for the states every site has: not found, failed, offline, down for maintenance,
// not allowed. Each is a CenteredLayout card with fixed copy, so they look the same on every site
// and in every theme. Render one as the content of an AppShell, or on its own in a Container.

type StatusPageProps = {
  /** Replaces the default heading. */
  title?: ReactNode;
  /** Replaces the default body copy. */
  children?: ReactNode;
  /**
   * The page's own buttons, before "Back to home", which turns outline beside them. This is the one
   * way to add a button; `homeLabel` and `retryLabel` only reword the built-in ones.
   */
  actions?: ReactNode;
} & Passthrough;

/** The pages that link home. */
type HomewardProps = StatusPageProps & {
  /**
   * The button to the `LinkProvider`'s `home`, for an app in another language.
   * @default Back to home
   */
  homeLabel?: string | undefined;
};

/** The pages that can try again. */
type RetryProps = HomewardProps & {
  /** Adds a "Try again" button that calls it, unless `actions` replaces the button. */
  onRetry?: () => void;
  /**
   * The button `onRetry` adds, for an app in another language.
   * @default Try again
   */
  retryLabel?: string | undefined;
};

type Copy = { title: string; body: string };

type StatusPageInner = HomewardProps & {
  copy: Copy;
  extra?: ReactNode;
  mark?: ReactNode;
  /** Whether the page links home. Fixed per page: only `Maintenance` does not. */
  homeward?: boolean;
};

/** `label` ("Back to home"), to the `LinkProvider`'s `home`: the primary button alone, outline after the page's actions. */
function HomeLink({ outline, label }: { outline: boolean; label: string }): ReactElement {
  return (
    <Button href={useHome()} variant={outline ? "outline" : "primary"}>
      {label}
    </Button>
  );
}

function StatusPage({
  copy,
  title,
  children,
  actions,
  extra,
  mark,
  homeward = true,
  homeLabel = "Back to home",
  ...rest
}: StatusPageInner): ReactElement {
  const home = homeward && <HomeLink outline={Boolean(actions)} label={homeLabel} />;
  return (
    <CenteredLayout
      {...rest}
      mark={mark}
      title={title ?? copy.title}
      description={children ?? copy.body}
    >
      {extra}
      {(actions || home) && (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {home}
        </div>
      )}
    </CenteredLayout>
  );
}

const retry = (onRetry: (() => void) | undefined, label = "Try again"): ReactNode =>
  onRetry && <Button onClick={onRetry}>{label}</Button>;

/**
 * 404: the page is not there. `numeral` draws a large "404" above the title, for a site whose 404
 * is a designed page; the digits are fixed. Off, the page is the title and copy alone.
 */
export function NotFound({
  numeral = false,
  ...props
}: HomewardProps & {
  /** Draws a large "404" above the title. Off by default. The digits are fixed: there is no text prop. */
  numeral?: boolean | undefined;
}): ReactElement {
  return (
    <StatusPage
      copy={{
        title: "Page not found",
        body: "The page you are looking for does not exist or has moved.",
      }}
      mark={
        numeral ? (
          <p className="text-6xl font-semibold tracking-tight text-violet-600">404</p>
        ) : undefined
      }
      {...props}
    />
  );
}

/**
 * 500 or any failure. `detail` is the error text, shown in a `CodeBlock` under the copy; pass it
 * only where a reader may see it (a request id, a message), never a stack trace. `onRetry` adds a
 * "Try again" button, unless `actions` replaces it.
 */
export function ErrorPage({
  detail,
  detailLabel = "Error",
  onRetry,
  retryLabel,
  actions,
  ...props
}: RetryProps & {
  /** The error text, in a `CodeBlock` under the copy: a request id or a message a reader may see, never a stack trace. */
  detail?: string;
  /**
   * The name of the `detail` block, for an app in another language.
   * @default Error
   */
  detailLabel?: string | undefined;
}): ReactElement {
  return (
    <StatusPage
      copy={{
        title: "Something went wrong",
        body: "An error stopped this page from loading. You can try again.",
      }}
      actions={actions ?? retry(onRetry, retryLabel)}
      extra={detail && <CodeBlock label={detailLabel}>{detail}</CodeBlock>}
      {...props}
    />
  );
}

/** The device has no connection. `onRetry` adds a "Try again" button, unless `actions` replaces it. */
export function Offline({ onRetry, retryLabel, actions, ...props }: RetryProps): ReactElement {
  return (
    <StatusPage
      copy={{
        title: "You are offline",
        body: "Check your connection and try again.",
      }}
      actions={actions ?? retry(onRetry, retryLabel)}
      {...props}
    />
  );
}

/**
 * The site is down on purpose and will be back: the page for planned downtime, such as an upgrade.
 * A failure is an `ErrorPage`, and no connection is `Offline`. It has no "Back to home": home is
 * the site that is down.
 */
export function Maintenance(props: StatusPageProps): ReactElement {
  return (
    <StatusPage
      homeward={false}
      copy={{
        title: "Down for maintenance",
        body: "We are making improvements and will be back shortly.",
      }}
      {...props}
    />
  );
}

/**
 * 403: signed in, or not, but not allowed here. The page for a route that exists and the reader may
 * not see; a route that is not there is a `NotFound`.
 */
export function Forbidden(props: HomewardProps): ReactElement {
  return (
    <StatusPage
      copy={{
        title: "Access denied",
        body: "You do not have permission to view this page.",
      }}
      {...props}
    />
  );
}
