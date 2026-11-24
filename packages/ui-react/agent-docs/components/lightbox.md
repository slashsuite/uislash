## Lightbox

Group: Feedback

When to use: Showing a photo or a video at full size, and stepping through a set of them.

### Use instead
- MediaTile (media-tile.md): The pictures are shown in the page, as tiles to open.
- Dialog (dialog.md): A question or a form, not a picture.

### The one right way
A photo or a video opens in a Lightbox: full screen, on its own dark scrim, with steps between items.
```tsx
import { useState } from "react";
import { Button, Lightbox } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Do
- Render it only while it is open: `{open && <Lightbox … onClose={() => setOpen(false)} />}`. It opens itself on mount.
- Pass one `<img>` or `<video>` as its children, with no classes: the Lightbox scales it down to fit the screen and keeps its shape.
- `label` names it for a screen reader. `title` and `meta` are lines above the media (who posted it, and when); `caption` is the text under it.
- To step through a set, pass `onPrevious` and `onNext`: each shows its button and binds its arrow key. Leave `onPrevious` out on the first item and `onNext` on the last.
- The scrim is near-black with light text in every theme, light themes included, so a photo reads as it would in any viewer.
- It fades out on close while it is still in the DOM, so `onClose` is called once the fade has finished: put `setOpen(false)` there and nowhere else. Esc, the scrim and the close button close it that way already.

### Don't
- Do not draw your own scrim for media; a question about a photo is a `Dialog`.

A Dialog is for a question: its panel boxes a photo in at a form's width, on the theme's light surface.
```tsx
import { useState } from "react";
import { Button, Dialog } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Accessibility
- A Lightbox is the browser's own `<dialog>` opened with `showModal()`: the page behind goes inert, focus stays inside it and Esc closes it.
- It is named by `label` through `aria-label`; give the `<img>` its own `alt`.
- The close, previous and next buttons are named Close, Previous and Next (`closeLabel`, `previousLabel` and `nextLabel` for another language), and keep a light focus ring that shows on the dark scrim in every theme.
- A click on the scrim around the media closes it; a click on the media or its text does not.
- Closing, or unmounting it, hands focus back to the element that opened it. The fade is switched off under `prefers-reduced-motion: reduce`.

### Props
### Lightbox
A full-screen photo or video viewer on the browser's own `<dialog>`: it is opened with `showModal()` on mount, so render it only while it is open. The page behind goes inert, Esc closes it and focus stays inside; a click on the scrim around the media and its text closes it too. The scrim stays near-black with light text in every theme. `onPrevious` and `onNext` add step buttons and the arrow keys.
- caption: ReactNode. Muted text on the scrim under the media.
- children: ReactNode (required). The media: one `<img>` or `<video>`, scaled down to fit the screen.
- closeLabel: string (default Close). The close button's name, for an app in another language.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: string (required). The viewer's accessible name, e.g. "Photo from Anna".
- meta: ReactNode. A muted line under the title, e.g. when.
- nextLabel: string (default Next). The next button's name.
- onClose: () => void (required). Called when the viewer closes: Esc, a click on the scrim or the close button.
- onNext: (() => void). Shows a next button and binds ArrowRight. Leave it out at the last item.
- onPrevious: (() => void). Shows a previous button and binds ArrowLeft. Leave it out at the first item.
- previousLabel: string (default Previous). The previous button's name.
- title: ReactNode. A line on the scrim above the media, e.g. who posted it.
