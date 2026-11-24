import { useState } from "react";
import { Cluster, Lightbox, MediaTile } from "@slashsuite/ui-react";
import { sampleScenes } from "./sampleScene.js";

/** A thumbnail that opens a photo is a `MediaTile` with `onClick` that opens a `Lightbox`, which steps through the set. */
export const DoViewer = () => {
  const [at, setAt] = useState<number | null>(null);
  const photo = at === null ? undefined : sampleScenes[at];
  return (
    <>
      <Cluster>
        {sampleScenes.map((scene, index) => (
          <MediaTile
            key={scene.src}
            src={scene.src}
            alt={scene.alt}
            label="Anna"
            caption={`09:1${index}`}
            onClick={() => setAt(index)}
          />
        ))}
      </Cluster>
      {at !== null && photo && (
        <Lightbox
          label={photo.alt}
          title="Anna"
          caption={photo.caption}
          onClose={() => setAt(null)}
          onPrevious={at > 0 ? () => setAt(at - 1) : undefined}
          onNext={at < sampleScenes.length - 1 ? () => setAt(at + 1) : undefined}
        >
          <img src={photo.src} alt={photo.alt} />
        </Lightbox>
      )}
    </>
  );
};

/** A bare `<img>` in a button has no shape, frame or label, and no placeholder when it fails to load. */
export const DontViewer = () => (
  <button type="button">
    <img src={sampleScenes[0]?.src} alt={sampleScenes[0]?.alt} width={120} />
  </button>
);
