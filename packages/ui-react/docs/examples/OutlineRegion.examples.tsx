import { OutlineRegion, RegionFrame } from "@slashsuite/ui-react";
import { sampleShot, sampleShotSize } from "./sampleShot.js";

/** A `label` says why the area is marked, so a reader can tell an ignored area from a flagged one. */
export const DoLabel = () => (
  <RegionFrame src={sampleShot} alt="The dashboard">
    <OutlineRegion
      rect={{ x: 228, y: 4, width: 80, height: 20 }}
      within={sampleShotSize}
      label="ignored"
      hatched
    />
  </RegionFrame>
);

/** An unlabelled box leaves the reader to guess what it marks and where it came from. */
export const DontLabel = () => (
  <RegionFrame src={sampleShot} alt="The dashboard">
    <OutlineRegion rect={{ x: 228, y: 4, width: 80, height: 20 }} within={sampleShotSize} />
  </RegionFrame>
);
