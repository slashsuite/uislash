import {
  Audio,
  Avatar,
  ColourSwatch,
  EmbedFrame,
  Image,
  MediaTile,
  ScrollStrip,
} from "@slashsuite/ui-react";
import { sampleAudio } from "./sampleAudio";
import { sampleCode } from "../../../packages/ui-react/docs/examples/sampleCode.js";
import {
  samplePortrait,
  sampleScenes,
} from "../../../packages/ui-react/docs/examples/sampleScene.js";

/** The media set: an Image in three shapes, on a white mat and on a page mat, a MediaTile with a label and caption, a natural-shaped tile, a removable one and a badged one, a video tile and a placeholder tile in a ScrollStrip, an Avatar strip, then an Audio player, an EmbedFrame loading and failed, and two ColourSwatches. */
export function GalleryMedia() {
  const first = sampleScenes[0]?.src;
  const second = sampleScenes[1]?.src;
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="flex items-start gap-4">
        <Image src={first} alt="Harbour at dusk" aspect="3:2" width="md" />
        <Image src={first} alt="Harbour at dusk, whole" aspect="square" width="md" fit="contain" />
        <Image alt="No preview yet" aspect="square" width="sm" />
        <Image src={sampleCode} alt="Pairing code" aspect="square" width="sm" mat="white" />
      </div>
      <div className="flex items-start gap-4">
        <MediaTile src={samplePortrait.src} alt={samplePortrait.alt} aspect="natural" width="sm" />
        <MediaTile
          src={first}
          alt="Slip from the shop"
          aspect="square"
          width="sm"
          label="Slip"
          onRemove={() => undefined}
        />
        <MediaTile src={second} alt="Harbour by day" aspect="square" width="sm" badge="New" />
        <Image
          src={second}
          alt="Harbour by day, on a page mat"
          aspect="16:10"
          width="sm"
          mat="page"
        />
      </div>
      <ScrollStrip label="Recent statuses">
        <MediaTile src={first} alt="Harbour at dusk" label="Anna" caption="09:12" />
        <MediaTile src={second} alt="Video from Ben" label="Ben" caption="0:14" video />
        <MediaTile alt="Earlier statuses" label="Earlier" onClick={() => undefined} />
        <MediaTile src={first} alt="Harbour at dusk" label="Cleo" caption="08:40" />
      </ScrollStrip>
      <ScrollStrip label="People" gap="xs">
        {["ada", "grace", "linus", "margaret", "dennis", "ken", "barbara", "alan"].map((name) => (
          <Avatar key={name} name={name} size="lg" />
        ))}
      </ScrollStrip>
      <Audio src={sampleAudio} label="Voice note from Anna, 0:01" />
      <div className="grid grid-cols-2 gap-4">
        <EmbedFrame label="Map of the shops" height="sm" status="loading">
          <div />
        </EmbedFrame>
        <EmbedFrame label="Map of the harbour" height="sm" status="error">
          <div />
        </EmbedFrame>
      </div>
      <div className="flex flex-col gap-2">
        <ColourSwatch value="#1e293b" label="Background" />
        <ColourSwatch value="#38bdf8" label="Accent" />
      </div>
    </div>
  );
}
