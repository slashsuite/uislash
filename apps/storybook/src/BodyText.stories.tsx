import type { Meta, StoryObj } from "@storybook/react-vite";
import { Caption, Lead, Mark, Overline, Stack, Text } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/BodyText.examples.js";

const meta: Meta = { title: "Text/Body text" };
export default meta;
type S = StoryObj;

export const DoParagraph: S = {
  render: examples.DoParagraph,
};

export const DontParagraph: S = {
  render: examples.DontParagraph,
};

export const DoMeaning: S = {
  render: examples.DoMeaning,
};

export const DontMeaning: S = {
  render: examples.DontMeaning,
};

export const DoLabels: S = {
  render: examples.DoLabels,
};

export const DontLabels: S = {
  render: examples.DontLabels,
};

// The options a body run takes: italic, a long string, alignment and a fixed amount width.

export const TextItalicStory: S = {
  name: "italic",
  render: () => (
    <div className="flex max-w-xl flex-col gap-2">
      <Text italic tone="muted">
        A muted hint, set italic under the field it explains.
      </Text>
      <Caption italic>Italic fine print: last synced 2 minutes ago.</Caption>
    </div>
  ),
};

export const BreakWordsStory: S = {
  name: "breakWords",
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Text>Without breakWords, a long unbroken string overflows its box:</Text>
      <Text tone="muted">
        https://example.com/lookup/trail/0f3a9c1d7b2e4f60a8c5d9e1b3f7a2c4d6e8f0a1b2c3d4e5f6
      </Text>
      <Text>With breakWords it breaks at the edge of the box:</Text>
      <Text breakWords tone="muted">
        https://example.com/lookup/trail/0f3a9c1d7b2e4f60a8c5d9e1b3f7a2c4d6e8f0a1b2c3d4e5f6
      </Text>
      <Caption breakWords>Caption: 0f3a9c1d7b2e4f60a8c5d9e1b3f7a2c4d6e8f0a1b2c3d4e5f6</Caption>
    </div>
  ),
};

export const AlignStory: S = {
  name: "align",
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      {(["start", "center", "end"] as const).map((a) => (
        <div key={a} className="flex flex-col gap-1 rounded-md border border-slate-200/70 p-3">
          <Overline align={a}>align={a}</Overline>
          <Text align={a}>Text aligned {a} in its block.</Text>
        </div>
      ))}
    </div>
  ),
};

export const MinWidthStory: S = {
  name: "minWidth amount",
  render: () => (
    <div className="flex w-72 flex-col gap-1">
      <div className="flex justify-between">
        <Overline>Funded</Overline>
        <Overline>Amount</Overline>
      </div>
      {["1,111.11", "8,888.88", "120.00"].map((v) => (
        <div key={v} className="flex items-baseline justify-between gap-3">
          <Text as="span">Pot</Text>
          <Text as="span" strong minWidth="amount">
            {v}
          </Text>
        </div>
      ))}
      <Caption>The amounts share one fixed width, so the figures line up.</Caption>
    </div>
  ),
};

const DESCRIPTION =
  "A corner shop on the high street that sells second-hand books, vinyl and the odd lamp. It opens early on Saturdays, keeps a box of free paperbacks by the door and takes cards for anything over fifty rand. The owner buys whole collections, so the shelves turn over every week.";

/** `lines` shows at most 2, 3 or 4 lines and ends in an ellipsis; with plain text the full text is the `title`. It keeps `preserveNewlines`. */
export const LinesStory: S = {
  name: "Lines",
  render: () => (
    <Stack width="compact">
      <Text lines={2}>{DESCRIPTION}</Text>
      <Text lines={3}>{DESCRIPTION}</Text>
      <Text lines={4}>{DESCRIPTION}</Text>
      <Caption lines={1}>{DESCRIPTION}</Caption>
      <Text lines={4} preserveNewlines>
        {
          "Check the header on every page.\nThe logo is the new one.\nThe footer links work.\nNo sideways scroll on a phone.\nThe dark theme reads."
        }
      </Text>
    </Stack>
  ),
};

export const EmptyLine: S = {
  render: () => <Text tone="muted">nothing here yet</Text>,
};

export const DoEmptyNote: S = {
  render: examples.DoEmptyNote,
};

export const DontEmptyNote: S = {
  render: examples.DontEmptyNote,
};

export const DoEmptyView: S = {
  render: examples.DoEmptyView,
};

export const DontEmptyView: S = {
  render: examples.DontEmptyView,
};

export const LeadStory: S = {
  name: "Lead",
  render: () => <Lead>The supporting sentence that sits under a Display heading.</Lead>,
};

/** `Mark` highlights the words a search matched, on the warn tint, inside the run around it. */
export const MarkStory: S = {
  name: "Mark",
  render: () => (
    <Text>
      Naledi asked to move the <Mark>debit order</Mark> to the 25th, so the next{" "}
      <Mark>debit order</Mark> runs then.
    </Text>
  ),
};

export const OverlineStory: S = {
  name: "Overline",
  render: () => <Overline>Section label</Overline>,
};

export const TextStory: S = {
  name: "Text",
  render: () => (
    <Text>
      Default running text. Inline by default, so an emphasised{" "}
      <Text as="span" strong>
        run of text
      </Text>{" "}
      composes right inside the sentence.
    </Text>
  ),
};

export const TextPreserveNewlines: S = {
  name: "Text preserveNewlines",
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <Text>{"Collapsed (default):\nthe note's line break is lost."}</Text>
      <Text preserveNewlines>{"Preserved:\nthe note's line break is kept."}</Text>
    </div>
  ),
};

export const InlineFigures: S = {
  name: "numeric, mono and lines",
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Text>
        Amount{" "}
        <Text as="span" strong numeric>
          1,111.11
        </Text>{" "}
        vs{" "}
        <Text as="span" strong numeric>
          8,888.88
        </Text>{" "}
        (tabular figures)
      </Text>
      <Text>
        Commit{" "}
        <Text as="span" mono>
          c870e81
        </Text>{" "}
        on{" "}
        <Caption as="span" mono>
          packages/ui-react/src/typography.tsx
        </Caption>
      </Text>
      <Text lines={1}>
        A long line of body text that does not fit the width of its container and is cut off.
      </Text>
      <Caption lines={1} tone="muted">
        packages/ui-react/src/some/very/deeply/nested/path/typography.test.tsx
      </Caption>
    </div>
  ),
};

export const TextStrongStory: S = {
  name: "Text strong",
  render: () => <Text strong>Emphasised body text</Text>,
};

export const CaptionStory: S = {
  name: "Caption",
  render: () => <Caption>Updated 2 minutes ago · HC-42</Caption>,
};

type Loading = StoryObj<{ loading: boolean }>;

/** A paragraph with no text yet is three lines of bones, the last shorter; an inline run is one. */
export const Loading: Loading = {
  args: { loading: true },
  render: ({ loading }) => {
    const words = (text: string) => (loading ? undefined : text);
    return (
      <Stack gap="xs">
        <Overline loading={loading}>{words("Overline")}</Overline>
        <Text loading={loading}>
          {words("Body copy is Text: a paragraph of running words at a readable line length.")}
        </Text>
        <Caption loading={loading}>{words("Caption: the fine print under it.")}</Caption>
      </Stack>
    );
  },
};
