import type { Meta, StoryObj } from "@storybook/react-vite";
import { OutlineRegion, RegionFrame } from "@slashsuite/ui-react";
import { sampleShot, sampleShotSize } from "../../../packages/ui-react/docs/examples/sampleShot.js";
import * as examples from "../../../packages/ui-react/docs/examples/OutlineRegion.examples.js";

const meta: Meta = { title: "Content/OutlineRegion" };
export default meta;
type S = StoryObj;

/** Regions over a screenshot: a plain outline, a labelled one and a hatched one for an area left out. */
export const Regions: S = {
  render: () => (
    <div className="max-w-xl">
      <RegionFrame src={sampleShot} alt="A screenshot of a dashboard">
        <OutlineRegion rect={{ x: 16, y: 40, width: 184, height: 22 }} within={sampleShotSize} />
        <OutlineRegion
          rect={{ x: 168, y: 112, width: 136, height: 72 }}
          within={sampleShotSize}
          label="manifest"
        />
        <OutlineRegion
          rect={{ x: 228, y: 4, width: 80, height: 20 }}
          within={sampleShotSize}
          label="UI"
          hatched
        />
      </RegionFrame>
    </div>
  ),
};

/** `rect` and `within` are in the picture's own pixels, so the box stays on its area however wide the picture is drawn. */
export const Scales: S = {
  render: () => (
    <div className="flex items-start gap-4">
      {["w-40", "w-80"].map((width) => (
        <div key={width} className={width}>
          <RegionFrame src={sampleShot} alt="">
            <OutlineRegion
              rect={{ x: 16, y: 112, width: 136, height: 72 }}
              within={sampleShotSize}
              label="config"
              hatched
            />
          </RegionFrame>
        </div>
      ))}
    </div>
  ),
};

/** `width`: the frame at 96, 160 and 256px, and `full`, the parent's width; the region keeps its spot at each. */
export const Widths: S = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      {(["sm", "md", "lg", "full"] as const).map((width) => (
        <RegionFrame key={width} src={sampleShot} alt="" width={width}>
          <OutlineRegion
            rect={{ x: 168, y: 112, width: 136, height: 72 }}
            within={sampleShotSize}
            label={width}
          />
        </RegionFrame>
      ))}
    </div>
  ),
};

/** `aspect`: `natural` keeps the picture's own shape; each other shape letterboxes it on the inset surface, with no crop, and the region stays on the picture. */
export const Aspects: S = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 items-start gap-4 sm:grid-cols-4">
      {(["natural", "square", "4:3", "3:2", "16:9", "3:4", "9:16"] as const).map((aspect) => (
        <RegionFrame key={aspect} src={sampleShot} alt="" aspect={aspect}>
          <OutlineRegion
            rect={{ x: 168, y: 112, width: 136, height: 72 }}
            within={sampleShotSize}
            label={aspect}
          />
        </RegionFrame>
      ))}
    </div>
  ),
};

export const DoLabel: S = {
  render: examples.DoLabel,
};

export const DontLabel: S = {
  render: examples.DontLabel,
};

/** While `loading`, a frame with no `src` yet is a bone of its shape, and the regions wait with it. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <RegionFrame
      src={loading ? undefined : sampleShot}
      alt="A screenshot of a dashboard"
      aspect="16:9"
      width="lg"
      loading={loading}
    >
      {!loading && (
        <OutlineRegion
          rect={{ x: 168, y: 112, width: 136, height: 72 }}
          within={sampleShotSize}
          label="manifest"
        />
      )}
    </RegionFrame>
  ),
};
