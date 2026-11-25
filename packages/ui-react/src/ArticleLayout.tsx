import type { ReactElement, ReactNode } from "react";
import { CardGrid } from "./CardGrid.js";
import { useWait } from "./layoutWait.js";
import { MetaList } from "./MetaList.js";
import { PageHeaderContent, type PageHeaderProps } from "./PageHeader.js";
import type { Passthrough } from "./props.js";
import { Section } from "./Section.js";
import { LoadingScope } from "./skeleton.js";
import { Stack } from "./Stack.js";

export type ArticleLayoutProps = Pick<
  PageHeaderProps,
  "breadcrumbs" | "title" | "description" | "loading" | "loadingLabel"
> & {
  /** Who wrote it: a name, or a `TextLink` to their page. */
  author?: ReactNode;
  /** When it was published, as the reader reads it: "12 November 2026". */
  date?: string | undefined;
  /** The same day as an ISO date (`2026-11-12`), for the `<time>` a machine reads. */
  dateTime?: string | undefined;
  /** How long it takes to read, worked out by the app: "6 min read". */
  readingTime?: string | undefined;
  /** The lead picture under the byline: an `Image` at `width="full"`. */
  image?: ReactNode;
  /** The article itself: `Prose`, or `SectionHeading`s and `Text` paragraphs, spaced `md` apart. */
  children?: ReactNode;
  /**
   * The cards at the foot under "More like this", three to a row from `lg`: a `.map` of `Card`s or
   * `ProductTile`s. Left out, there is no foot.
   */
  related?: ReactNode;
  /**
   * The heading over `related`, for an app in another language or another word ("Recipes for this kit").
   * @default More like this
   */
  relatedTitle?: string | undefined;
} & Passthrough;

/**
 * A blog article: the title (the page's `h1`) and its lede, a byline of the author, the date and the
 * reading time in muted text, the lead picture, the body, and a "More like this" row of cards at the
 * foot. The article sits in the reading column (`max-w-3xl`) at the Container's start edge, and the
 * related cards take the Container's whole width under it. The date is a `<time>` when `dateTime`
 * says which day it is. Every part but the title is optional. While `loading` it owns the wait and
 * passes it to everything inside, the header too.
 */
export function ArticleLayout({
  breadcrumbs,
  title,
  description,
  author,
  date,
  dateTime,
  readingTime,
  image,
  children,
  related,
  relatedTitle = "More like this",
  loading,
  loadingLabel,
  ...rest
}: ArticleLayoutProps): ReactElement {
  const wait = useWait(loading, loadingLabel);
  return (
    <LoadingScope loading={wait.loading}>
      <div {...rest} {...wait.attrs} className="flex flex-col gap-16">
        <article className="max-w-3xl">
          <header className="mb-8 flex flex-col gap-3">
            <PageHeaderContent breadcrumbs={breadcrumbs} title={title} description={description} />
            <Byline author={author} date={date} dateTime={dateTime} readingTime={readingTime} />
          </header>
          {image != null && image !== false && <div className="mb-8">{image}</div>}
          <Stack>{children}</Stack>
        </article>
        {related != null && related !== false && (
          <Section title={relatedTitle}>
            <CardGrid as="ul" columns={3}>
              {related}
            </CardGrid>
          </Section>
        )}
        {wait.label}
      </div>
    </LoadingScope>
  );
}

/** The author, the date and the reading time on one muted row; nothing when none is given. */
function Byline({
  author,
  date,
  dateTime,
  readingTime,
}: Pick<ArticleLayoutProps, "author" | "date" | "dateTime" | "readingTime">): ReactNode {
  const hasAuthor = author != null && author !== false;
  if (!hasAuthor && date === undefined && readingTime === undefined) return null;
  return (
    <MetaList>
      {hasAuthor && <span>{author}</span>}
      {date !== undefined && <time dateTime={dateTime}>{date}</time>}
      {readingTime !== undefined && <span>{readingTime}</span>}
    </MetaList>
  );
}
