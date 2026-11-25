import { ColourSwatch, Stack } from "@slashsuite/ui-react";

/** Each colour as a swatch with its name and its hex value in text, so it reads without seeing the square. */
export const DoValue = () => (
  <Stack gap="sm">
    <ColourSwatch value="#1e293b" label="Background" />
    <ColourSwatch value="#38bdf8" label="Accent" />
  </Stack>
);

/** A painted square alone says nothing to a screen reader, nor to anyone who cannot tell the colours apart. */
export const DontValue = () => (
  <span style={{ display: "inline-block", width: 16, height: 16, backgroundColor: "#1e293b" }} />
);
