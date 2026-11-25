import {
  Cluster,
  Code,
  MetaList,
  TableOfContents,
  TextLink,
  type LinkAdapter,
  LinkProvider,
} from "@slashsuite/ui-react";

/** Stands in for a router's <Link>: the app's adapter, set once on a `LinkProvider`. */
const FakeLink: LinkAdapter = ({ href, ...rest }) => <a {...rest} href={`#${href}`} />;

/** The links block of the Gallery: a TextLink in a sentence, toned TextLinks, MetaList rows (a row of links (then a mixed one and a mono one), a TextLink drawn by the LinkProvider adapter and a row with a stretched link, a TextLink with an icon and a quiet one, a Cluster as a nav and a TableOfContents. */
export function GalleryLinks() {
  return (
    <LinkProvider link={FakeLink}>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-slate-700">
          Email <TextLink href="mailto:hello@example.com">hello@example.com</TextLink>, or read the{" "}
          <TextLink href="#terms" external>
            terms
          </TextLink>
          .
        </p>
        <p className="flex gap-4">
          <TextLink href="#sm" size="sm">
            TextLink sm
          </TextLink>
          <TextLink href="#path" size="md" mono>
            TextLink md mono
          </TextLink>
          <TextLink href="#skipped" tone="warn">
            TextLink warn
          </TextLink>
          <TextLink href="#failed" tone="danger">
            TextLink danger
          </TextLink>
          <TextLink href="#all" icon="chevron-right">
            TextLink icon
          </TextLink>
          <TextLink href="#quiet" tone="quiet">
            TextLink quiet
          </TextLink>
        </p>
        <Cluster as="nav" aria-label="Footer" gap="md">
          <TextLink href="#docs">Docs</TextLink>
          <TextLink href="#pricing">Pricing</TextLink>
          <TextLink href="#blog">Blog</TextLink>
        </Cluster>
        <TableOfContents
          current="install"
          items={[
            { id: "install", label: "Install", level: 2 },
            { id: "usage", label: "Usage", level: 2 },
            { id: "themes", label: "Themes", level: 3 },
          ]}
        />
        <MetaList>
          <TextLink href="#privacy">Privacy</TextLink>
          <TextLink href="#terms">Terms</TextLink>
          <TextLink href="/contact">Contact</TextLink>
        </MetaList>
        <MetaList>
          <TextLink href="#branch">hc-139</TextLink>
          <Code>0f9d376</Code>
          <span>26 Oct 2026</span>
        </MetaList>
        <MetaList mono>
          <span>chromium</span>
          <span>desktop</span>
          <span>1280×800</span>
        </MetaList>
        <div className="relative flex max-w-sm justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
          <TextLink href="#quote-12" stretch>
            Quote 12
          </TextLink>
          <span className="text-slate-500">the whole row opens it</span>
        </div>
      </div>
    </LinkProvider>
  );
}
