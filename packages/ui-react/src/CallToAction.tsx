import { type ReactElement, type ReactNode, useId } from "react";
import { Cluster } from "./Cluster.js";
import { type HeadingLevel, useHeadingLevel } from "./headingLevel.js";
import type { Passthrough } from "./props.js";
import { Lead, Overline, PageHeading } from "./typography.js";

export type CallToActionProps = {
  /** The ask, one line: "Start your first review today". Its heading names the band. */
  title: ReactNode;
  /** A small label above the title, set in the monospace face. */
  overline?: ReactNode;
  /** One sentence under the title, as a `Lead`. */
  description?: ReactNode;
  /** One or two actions: a primary `Button` and, if it has one, an `outline` or `ghost` one. */
  actions: ReactNode;
  /**
   * The title's heading level, 2 to 6. It does not change how the title looks.
   * @default one below the heading that holds the band: 2 on the page
   */
  level?: HeadingLevel | undefined;
} & Passthrough;

/**
 * The closing ask of a landing page: a rounded band on the subtle surface with a hairline edge, its
 * overline, title, one sentence and one or two actions centred in it. It is a `<section>` named by
 * its title. One per page, as the last block before the footer; a section's own actions stay in its
 * `Section`.
 */
export function CallToAction({
  title,
  overline,
  description,
  actions,
  level,
  ...rest
}: CallToActionProps): ReactElement {
  const id = useId();
  const own = useHeadingLevel(level);
  const kicker = overline != null && overline !== false;
  return (
    <section
      {...rest}
      aria-labelledby={id}
      className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center sm:px-12 sm:py-16"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <header>
          {kicker && <Overline mono>{overline}</Overline>}
          <PageHeading as={`h${own}`} id={id}>
            {title}
          </PageHeading>
        </header>
        {description != null && description !== false && <Lead>{description}</Lead>}
        <div className="pt-2">
          <Cluster justify="center">{actions}</Cluster>
        </div>
      </div>
    </section>
  );
}
