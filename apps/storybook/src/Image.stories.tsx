import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "@slashsuite/ui-react";
import { sampleCode } from "../../../packages/ui-react/docs/examples/sampleCode.js";
import {
  samplePortrait,
  sampleScenes,
} from "../../../packages/ui-react/docs/examples/sampleScene.js";
import { sampleShot } from "../../../packages/ui-react/docs/examples/sampleShot.js";
import * as examples from "../../../packages/ui-react/docs/examples/Image.examples.js";

const meta: Meta = { title: "Content/Image" };
export default meta;
type S = StoryObj;

const harbour = sampleScenes[0] ?? { src: "", alt: "", caption: "" };

export const Default: S = {
  render: () => (
    <div className="max-w-md">
      <Image src={harbour.src} alt={harbour.alt} />
    </div>
  ),
};

/** `aspect` reserves the shape before the picture loads: square, 4:3, 3:2, 16:10, 16:9, and the portrait 3:4 and 9:16. */
export const Aspects: S = {
  render: () => (
    <div className="grid grid-cols-3 items-end gap-4">
      {(["square", "4:3", "3:2", "16:10", "16:9", "3:4", "9:16"] as const).map((aspect) => (
        <Image key={aspect} src={harbour.src} alt={`Harbour, ${aspect}`} aspect={aspect} />
      ))}
    </div>
  ),
};

/** `sm` is 96px, `md` 160px, `lg` 256px and `xl` 448px wide; `full` fills its parent. */
export const Widths: S = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["sm", "md", "lg", "xl", "full"] as const).map((width) => (
        <Image key={width} src={harbour.src} alt={`Harbour, ${width}`} width={width} />
      ))}
    </div>
  ),
};

/** `natural` keeps the picture's own proportions: nothing is cropped or letterboxed, and the space is not reserved before it loads. */
export const Natural: S = {
  render: () => (
    <div className="flex items-start gap-4">
      <Image src={samplePortrait.src} alt={samplePortrait.alt} aspect="natural" width="md" />
      <Image src={harbour.src} alt={harbour.alt} aspect="natural" width="md" />
    </div>
  ),
};

/** `mat="white"` sets a QR code on a white mat with padding. The mat stays white in every theme, so the code scans off a dark page. */
export const Framed: S = {
  render: () => (
    <div className="flex items-start gap-4">
      <Image src={sampleCode} alt="Pairing code" aspect="square" width="md" mat="white" />
      <Image
        src={sampleCode}
        alt="Pairing code, unframed"
        aspect="square"
        width="md"
        fit="contain"
      />
    </div>
  ),
};

/** `mat="page"` sets a screenshot on a mat in the theme's page tone, with padding, so its own edge does not run into the page. */
export const MatPage: S = {
  render: () => (
    <div className="flex items-start gap-4">
      <Image src={sampleShot} alt="The settings page" aspect="16:10" width="lg" mat="page" />
      <Image src={sampleShot} alt="The settings page, no mat" aspect="16:10" width="lg" />
    </div>
  ),
};

/** `crop="top"` keeps the top of a tall picture when `cover` crops it, as a page screenshot's header. */
export const CropTop: S = {
  render: () => (
    <div className="flex items-start gap-4">
      <Image src={samplePortrait.src} alt="Portrait, centre crop" aspect="16:10" width="lg" />
      <Image
        src={samplePortrait.src}
        alt="Portrait, top crop"
        aspect="16:10"
        width="lg"
        crop="top"
      />
    </div>
  ),
};

/** `href` makes the picture a link that opens the full file in a new tab, named by `alt`. */
export const Linked: S = {
  render: () => (
    <Image src={harbour.src} alt={harbour.alt} aspect="16:10" width="lg" href={harbour.src} />
  ),
};

/** `priority` loads the picture first and at once, for the one picture above the fold; every other picture loads lazily. */
export const Priority: S = {
  render: () => <Image src={harbour.src} alt={harbour.alt} aspect="16:9" width="xl" priority />,
};

/** `cover` fills the shape and crops; `contain` shows the whole picture inside the shape. */
export const Fits: S = {
  render: () => (
    <div className="flex items-start gap-4">
      <Image src={harbour.src} alt="Harbour, cover" aspect="square" width="md" fit="cover" />
      <Image src={harbour.src} alt="Harbour, contain" aspect="square" width="md" fit="contain" />
    </div>
  ),
};

/** With no `src`, or one that fails to load, a placeholder of the same size stands in, still named by `alt`. */
export const Missing: S = {
  render: () => (
    <div className="flex items-start gap-4">
      <Image alt="No preview yet" aspect="square" width="md" />
      <Image src="/does-not-exist.jpg" alt="Broken link" aspect="square" width="md" />
    </div>
  ),
};

export const DoFit: S = {
  render: examples.DoFit,
};

export const DontFit: S = {
  render: examples.DontFit,
};

/** While `loading`, a picture with no `src` yet is a bone of its shape, not the placeholder. */
export const Loading: StoryObj<{ loading: boolean }> = {
  args: { loading: true },
  render: ({ loading }) => (
    <Image
      loading={loading}
      src={loading ? undefined : samplePortrait.src}
      alt={samplePortrait.alt}
      aspect="3:4"
      width="md"
    />
  ),
};
