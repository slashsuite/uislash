import { Card, ProgressBar, type CardHue } from "@slashsuite/ui-react";

/** Card `inset` (a full-bleed band) and a nested `Card tone="neutral"` (the bordered sub-card). */
export function InsetAndNested() {
  return (
    <>
      <Card title="Kitchen" inset={<ProgressBar value={62} label="Kitchen progress" />}>
        Card inset: a full-bleed band.
      </Card>
      <Card title="Order 1042">
        <Card tone="neutral" size="sm">
          A bordered sub-card: Card tone neutral.
        </Card>
      </Card>
    </>
  );
}

const HUES: readonly CardHue[] = ["orange", "violet", "sky", "green", "yellow", "blue"];

/** Card `hue`: one peer card per hue, the set a theme paints. */
export function PeerHues() {
  return (
    <>
      {HUES.map((hue) => (
        <Card key={hue} hue={hue} title={`Hue ${hue}`} titleStyle="name">
          A peer card.
        </Card>
      ))}
    </>
  );
}
