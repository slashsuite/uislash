import { useState } from "react";
import { Button, Dialog, Lightbox } from "@slashsuite/ui-react";
import { sampleScenes } from "./sampleScene.js";

/** A photo or a video opens in a Lightbox: full screen, on its own dark scrim, with steps between items. */
export const DoViewer = () => {
  const [at, setAt] = useState<number | null>(null);
  const photo = at === null ? undefined : sampleScenes[at];
  return (
    <>
      <Button variant="outline" onClick={() => setAt(0)}>
        View photos
      </Button>
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

/** A Dialog is for a question: its panel boxes a photo in at a form's width, on the theme's light surface. */
export const DontViewer = () => {
  const [open, setOpen] = useState(false);
  const photo = sampleScenes[0];
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        View photo
      </Button>
      {open && photo && (
        <Dialog title="Anna" onClose={() => setOpen(false)}>
          <img src={photo.src} alt={photo.alt} />
        </Dialog>
      )}
    </>
  );
};
