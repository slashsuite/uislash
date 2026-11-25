import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardGrid, Pill, Text } from "@slashsuite/ui-react";

/** Card's `hue`, `dashed`, `onPress`, `more` and `width`, apart from Card.stories.tsx so each file stays short. */
const meta: Meta = { title: "Content/Card" };
export default meta;
type S = StoryObj;

/** `hue` paints a set of peer cards, one hue each, such as one card per product: the theme picks each fill and edge. It is not a status, and the title still names each card. */
export const PeerHues: S = {
  render: () => (
    <CardGrid columns={3}>
      <Card hue="orange" title="ob" titleStyle="name">
        <Text tone="muted">Tasks, secrets and deploys.</Text>
      </Card>
      <Card hue="violet" title="UISlash" titleStyle="name">
        <Text tone="muted">The components and their themes.</Text>
      </Card>
      <Card hue="sky" title="PixelSlash" titleStyle="name" href="/pixelslash">
        <Text tone="muted">Visual checks on every pull request.</Text>
      </Card>
      <Card hue="green" title="Thriftloop" titleStyle="name">
        <Text tone="muted">Second-hand stores near you.</Text>
      </Card>
      <Card hue="yellow" title="BeerLab" titleStyle="name">
        <Text tone="muted">A brewery shop.</Text>
      </Card>
      <Card hue="blue" title="Hack Cove" titleStyle="name">
        <Text tone="muted">The studio behind them.</Text>
      </Card>
    </CardGrid>
  ),
};

/** `dashed` draws a dashed edge for a card that stands for something not real yet; with `bar` the strip's edge is dashed too, beside the real one drawn solid. */
export const DashedBar: S = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card bar title="Measured">
        <Text>412 ms on the median page load.</Text>
      </Card>
      <Card bar dashed title="Imagined">
        <Text tone="muted">Under 200 ms once images are lazy.</Text>
      </Card>
      <Card dashed title="Planned">
        <Text tone="muted">A dashed card with no bar.</Text>
      </Card>
    </div>
  ),
};

/** `onPress` makes the whole card one button, named by its title: a card the user picks. A picked one says so with `aria-pressed` and a `Pill`. */
export const ButtonCard: S = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card
        title="Long Street"
        titleStyle="name"
        onPress={() => undefined}
        aria-pressed
        badge={<Pill tone="positive">Picked</Pill>}
      >
        <Text tone="muted">Open until six.</Text>
      </Card>
      <Card title="Kloof Street" titleStyle="name" onPress={() => undefined} aria-pressed={false}>
        <Text tone="muted">Open until five.</Text>
      </Card>
    </div>
  ),
};

/** `more` draws a "Read more" line at the foot of a link card; `moreLabel` sets its words. The link is still named by the title. */
export const ReadMore: S = {
  render: () => (
    <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card href="/posts/subgrid" title="Cards that line up" titleStyle="name" more>
        <Text tone="muted">How subgrid keeps every card's body on one line.</Text>
      </Card>
      <Card
        href="/posts/peer"
        title="One hue per product"
        titleStyle="name"
        more
        moreLabel="Read the post"
      >
        <Text tone="muted">Peer cards the theme paints.</Text>
      </Card>
    </div>
  ),
};

/** `width="sm"` caps a card at 24rem, for one that stands alone in a wide column. */
export const NarrowWidth: S = {
  render: () => (
    <Card width="sm" title="Sign in">
      <Text tone="muted">One card, no wider than a phone.</Text>
    </Card>
  ),
};
