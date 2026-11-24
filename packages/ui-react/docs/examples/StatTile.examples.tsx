import { CardGrid, StatTile } from "@slashsuite/ui-react";

/** Pass the value already formatted, with its unit: `R 4 250`, `Mar 2029`, `12%`. */
export const DoFigure = () => (
  <CardGrid columns={2}>
    <StatTile label="Left over" value="R 4 250" hint="after all bills" />
    <StatTile label="Debt-free" value="Mar 2029" />
  </CardGrid>
);

/** A raw number has no unit or grouping, so the tile shows a figure nobody can read at a glance. */
export const DontFigure = () => (
  <CardGrid columns={2}>
    <StatTile label="Left over" value={4250.5} />
    <StatTile label="Savings" value={1250000} />
  </CardGrid>
);

/** `tone` colours the value, and a sign and a `hint` say what the colour means. */
export const DoTone = () => (
  <CardGrid columns={2}>
    <StatTile label="Left over" value="+R 4 250" hint="surplus" tone="positive" accent />
    <StatTile label="Total interest" value="−R 12 400" hint="shortfall" tone="danger" accent />
  </CardGrid>
);

/** The same tones with no sign and no hint: red and green are the only difference, so the meaning is lost without colour. */
export const DontTone = () => (
  <CardGrid columns={2}>
    <StatTile label="Left over" value="R 4 250" tone="positive" accent />
    <StatTile label="Total interest" value="R 12 400" tone="danger" accent />
  </CardGrid>
);
