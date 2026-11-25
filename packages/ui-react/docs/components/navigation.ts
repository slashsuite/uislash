import type { ComponentSection } from "./types";

export const navigation: ComponentSection = {
  title: "Navigation",
  icon: "compass",
  description: "Moving between pages and views.",
  pages: [
    {
      slug: "tabs",
      name: "Tabs",
      summary: "Switch a view in place, or move between pages.",
      whenToUse:
        "Tabs switch a panel on the same page. A row of links to other pages is `Tabs` with link items.",
      siblings: [
        {
          slug: "segmented-control",
          when: "One value is picked from two to five, and no panel switches under the row.",
        },
        {
          slug: "fieldset",
          when: "Toggles that can be on together narrow a list: pressed `Button`s in a `Fieldset`, one per facet.",
        },
      ],
      pairs: [
        "Tabs/SwitchView",
        "Tabs/SwitchPage",
        "Tabs/Count",
        "TabsReason/DisabledReason",
        "TabsLinks/Rail",
      ],
      usage: {
        do: [
          "`Tabs` switches a view in place: each tab carries its `panel`, which Tabs draws under the row (beside the rail); the caller owns `value` and `onChange`.",
          'Every panel is mounted, the hidden ones too, so find in page reaches them. A view too heavy to mount before it is chosen is `null` until its tab is current (`panel: value === "a" ? <ViewA /> : null`), and find in page then skips it.',
          "Going to another page is link items (`href`, and `selected` on the current one): links, so the URL, the back button and a new tab all work.",
          "A `count` sits muted after the label and is read as part of the tab's name.",
          'Across, tabs are always underline, under a `PageHeader` too: one line that scrolls sideways, with a fade, when it is too wide. `orientation="vertical"` is the pill rail, the current tab filled, for a `SidebarLayout` aside, and only the rail takes `size`.',
          "`size` (`sm`, `md` the default, `lg`) sets the vertical rail on the control scale, so it lines up with a `Button` of the same size; the underline row has one size.",
          "A tab that cannot be chosen yet takes a `disabledReason` that says why.",
          'Pill links with `orientation="vertical"` are the rail of a `SidebarLayout`: one link per line.',
        ],
      },
      accessibility: [
        "The row is a tab list named by `label`; the arrow keys, Home and End move between the tabs, and a `disabled` tab is skipped.",
        "A tab with `disabledReason` is `aria-disabled`: the arrow keys reach it and choose nothing, and the reason shows as a tooltip on hover, keyboard focus and a tap, read out as its description (the native `title` without CSS anchor positioning).",
        'A tab\'s `panel` is a `tabpanel` labelled by the tab and named in its `aria-controls`; a hidden one is `hidden="until-found"` where the browser has it, so find in page reaches its text and switches to the tab.',
        "The current tab is told apart by more than colour: the underline, and on the rail an outline round the fill. Every tab has the same weight, so choosing one does not shift the row.",
        'A tab is a `button` with `role="tab"` and `aria-selected`; only the current tab is in the tab order, and the arrow keys move and choose.',
        'Link items form a `<nav>` named by `label`; the current link gets `aria-current="page"`.',
      ],
      api: ["Tabs"],
      types: ["Tab", "TabButton"],
    },
    {
      slug: "breadcrumbs",
      name: "Breadcrumbs",
      summary: "Where this page sits in the hierarchy.",
      whenToUse:
        "A page several levels deep that needs a way back up: org, project, build, snapshot.",
      siblings: [
        { slug: "table-of-contents", when: "The reader moves between the sections of this page." },
      ],
      pairs: ["Breadcrumbs/Trail", "Breadcrumbs/Hierarchy"],
      usage: {
        do: [
          "Give the trail in order, parents first. A crumb that links is `{ label, href }`, drawn through the app's `LinkProvider` for an in-app path; the last crumb is the current page.",
          "Breadcrumbs show a hierarchy. Peer sections are `Tabs` of links.",
          "A trail too long for its row wraps; a long parent truncates, and the current page is never cut.",
          "Put the trail in the `breadcrumbs` slot of a `PageHeader`.",
        ],
      },
      accessibility: [
        '`<nav aria-label="Breadcrumb">` around an ordered list.',
        'The last crumb is the current page: given an `href` it is a link to this page with `aria-current="page"`, else its item carries it.',
        "The `/` separators are `aria-hidden`.",
        "A parent cut short shows its whole name in a tooltip on hover, a tap and keyboard focus: on its link, or on the crumb itself, which becomes a tab stop while it is cut. The tooltip is hidden from assistive tech, which reads the whole name already.",
      ],
      api: ["Breadcrumbs"],
      types: ["Crumb"],
    },
    {
      slug: "table-of-contents",
      name: "TableOfContents",
      summary: "The headings of a long page as links, with the section being read marked.",
      whenToUse:
        "A long page of several sections, such as a guide or a reference, where a reader jumps to a section or checks where they are.",
      siblings: [
        { slug: "breadcrumbs", when: "The reader needs the way back up to a parent page." },
      ],
      pairs: ["TableOfContents/Current", "TableOfContents/Headings"],
      usage: {
        do: [
          "Give `items` the page's `h2`s and `h3`s in order, each `{ id, label, level }`: `id` is the heading's anchor and `label` its words. A level 3 entry is indented under the entry before it.",
          "`current` is the id of the section being read. The app tracks it, from the scroll position or the URL hash, and its link is marked in the accent; the rest are small and quiet.",
          '`label` is the words over the list and the name of its landmark, "On this page" by default; set it for an app in another language.',
          "Put it in a sticky `SideColumn` aside beside the page. `DocsLayout` draws its own, so a docs page passes its headings to the layout instead.",
        ],
        dont: [
          "Never list links to other pages in it: those are `Tabs` of links or a `SidebarLayout` rail.",
        ],
      },
      accessibility: [
        'A `<nav>` named by `label`, around a list of links to `#id`. The current one has `aria-current="location"`.',
        "The current link is told apart by more than colour: it is medium weight.",
      ],
      api: ["TableOfContents"],
      types: ["TableOfContentsItem"],
    },
    {
      slug: "stepper",
      name: "Stepper",
      summary: "Where the reader is in a fixed run of steps.",
      whenToUse:
        "A flow of a few steps taken in order, such as checkout or setting up an account, where the reader should see what is done and what is left.",
      pairs: ["Stepper/Progress"],
      usage: {
        do: [
          "Give every step's name in order, one or two words each, and `current`, the step in progress, from 1. Past the last step, every step is done.",
          '`label` names the list ("Checkout progress"), and `doneLabel` is the word a screen reader hears after a done step, for an app in another language.',
          "It shows progress and does not navigate: the flow's own buttons move between steps.",
          "Put it above the step's form, once per page.",
        ],
      },
      accessibility: [
        'An ordered list named by `label`; the current step has `aria-current="step"`.',
        'A done step says so in words after its name ("Cart (done)"), not only with its tick; the numbers, the tick and the lines between steps are `aria-hidden`.',
        "The current step is told apart by more than colour: its marker is outlined and its name is medium weight.",
      ],
      api: ["Stepper"],
    },
    {
      slug: "pagination",
      name: "Pagination",
      summary: "Page links for a long list.",
      whenToUse:
        "A list split into pages that the reader moves through: a directory, search results, an archive.",
      pairs: ["Pagination/Links"],
      stories: ["PaginationStates"],
      usage: {
        do: [
          "Give `pageHref` the URL of a page; the page lives in the URL, so back, a new tab and a shared link work. Each link goes through the app's `LinkProvider`.",
          "`page` is the page shown, from 1, and `pageCount` how many there are; a stale page past the end draws the last one, and a single page draws nothing.",
          "One Pagination under the list; a long list may add one above it too, each with its own `label`.",
          'The count line ("21 to 40 of 312") is a `Caption` beside it, not part of it.',
          "`previousLabel`, `nextLabel` and `pageLabel` carry the words for another language.",
        ],
      },
      accessibility: [
        'A `<nav>` named by `label`. Every page is a link, and the current one has `aria-current="page"`.',
        "Previous on the first page and Next on the last are plain text, not links, so there is no dead stop in the tab order.",
        'The gaps (`…`) are `aria-hidden`. Below `sm` the numbers give way to `pageLabel` ("Page 4 of 12") between Previous and Next.',
      ],
      api: ["Pagination"],
    },
    {
      slug: "site-search",
      name: "SiteSearch",
      summary: "Find a page by name, from a header button or Ctrl+K.",
      whenToUse:
        "A site with more pages than a reader can scan in its nav: a docs site, an app with many sections.",
      pairs: ["SiteSearch/Header"],
      usage: {
        do: [
          "Put one `SiteSearch` in `AppShell`'s `controls`, on every page, and pass every page as `items`: `{ label, description, href, keywords }`.",
          '`label` names the phone\'s icon button and titles the dialog: say what is searched ("Search components"). For an app in another language: `resultsLabel` names the list of matches ("Results"), `buttonLabel` is the wide button\'s text ("Search"), `placeholder` the field\'s ("Search"), `hintLabel` the line before typing ("Type a name"), `noResultsLabel` the words before the typed text when nothing matches ("No results for"), `allResultsLabel` the words before it on the full results link ("See all results for") and `countLabel` turns the count into what a screen reader hears ("3 results").',
          "Give `items` in the nav's order: results of the same rank keep it.",
          "`keywords` are other names a page answers to (the exports it documents); they match but are not shown.",
          "A result ranks by the name starting with the text, then the name containing it, then a keyword, then the description.",
          "From `sm` up the button reads `buttonLabel` (Search) with its key (Ctrl K, or ⌘ K on a Mac); below `sm` it is the search icon alone.",
          "It searches names, not page text, and needs no service. A site that also has a full text search page passes `resultsHref`, the page's address for a query (`(query) => '/search?q=' + encodeURIComponent(query)`): its link is the last row once something is typed, matches or not, and Enter in the field goes there.",
          "`size` sets the button's height on a `Button`'s scale (default `sm`), so it lines up with the header's other controls of the same size.",
        ],
      },
      accessibility: [
        "Ctrl+K or Cmd+K opens it from anywhere on the page; the button carries `aria-keyshortcuts`.",
        "It opens a `Dialog` titled by `label` with focus in the search field; Esc closes it and focus goes back to where it was.",
        "The field is a `search` landmark. Enter opens the first result, or with `resultsHref` the full results page; an Enter that commits an input method's composition does nothing. ArrowDown moves from the field to the results and ArrowUp and ArrowDown move between them; they are links, so Tab reaches them too.",
        'A polite live region reads the result count as you type ("3 results").',
      ],
      api: ["SiteSearch"],
      types: ["SiteSearchItem"],
    },
  ],
};
