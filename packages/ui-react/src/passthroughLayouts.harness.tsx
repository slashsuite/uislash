import type { ReactElement } from "react";
import * as ui from "./index.js";

/** The side-column layouts', the article's and the closing band's cases of `CASES` (`passthrough.harness.tsx`), each given the probe attributes `a`. */
export function layoutCases(a: Record<string, string>): Record<string, () => ReactElement> {
  return {
    SideColumn: () => (
      <ui.SideColumn aside="a" {...a}>
        x
      </ui.SideColumn>
    ),
    SidebarLayout: () => (
      <ui.SidebarLayout aside="r" {...a}>
        x
      </ui.SidebarLayout>
    ),
    DocsLayout: () => (
      <ui.DocsLayout nav={[]} asideLabel="Docs" title="t" {...a}>
        x
      </ui.DocsLayout>
    ),
    ArticleLayout: () => (
      <ui.ArticleLayout title="T" {...a}>
        x
      </ui.ArticleLayout>
    ),
    CallToAction: () => <ui.CallToAction title="T" actions="a" {...a} />,
  };
}
