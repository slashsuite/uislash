## MediaTile

Group: Content

When to use: A photo or video in a grid or a strip, that opens full size when it is picked: a status, a gallery, an attachment.

### Use instead
- Image (image.md): The picture is only shown, with no label, click or remove.
- Video (video.md): The video plays in the page: the player.
- Lightbox (lightbox.md): One photo or video opens over the page, at full size.

### The one right way
A thumbnail that opens a photo is a `MediaTile` with `onClick` that opens a `Lightbox`, which steps through the set.
```tsx
import { useState } from "react";
import { Cluster, Lightbox, MediaTile } from "@slashsuite/ui-react";

function Example() {
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
}
```

### Do
- `src` and `alt` are the thumbnail, cropped to `aspect` (portrait `3:4` by default; `natural` shows the picture whole at its own proportions, as a chat does) at `width` (`md`, 160px, by default; `full` fills a grid cell).
- `label` is a short line on the picture's bottom edge, on the same near-black scrim as the `Lightbox`, in every theme: who posted it, or "Earlier". `caption` is muted text under the picture, such as when.
- `video` draws a play mark; say it is a video in `alt` too.
- `onRemove` adds a round remove button on the picture's corner, named "Remove" and `alt`: a photo attached to a form, until it is sent. It is its own button beside the tile's, so the tile can still open a `Lightbox`.
- `onClick` makes the whole tile one button. Open a `Lightbox` from it, and keep the open item in your own state. Without `onClick` the tile is a plain block.
- With no `src`, the tile shows the `Image` placeholder, so a tile that is only a label ("Earlier") needs no picture.
- A row of tiles that runs past the page is a `ScrollStrip`; a wrapping grid is a `CardGrid`.
- A picture that is only shown, with no label, click or remove, is an `Image`.

### Don't
A bare `<img>` in a button has no shape, frame or label, and no placeholder when it fails to load.
```tsx
<button type="button">
  <img src={sampleScenes[0]?.src} alt={sampleScenes[0]?.alt} width={120} />
</button>
```

### Accessibility
- A tile with `onClick` is a real `<button type="button">` named by `alt` and `label`, with the focus ring from the component; Enter and Space open it.
- The play mark is decorative and hidden from a screen reader.
- `id`, `data-*` and `aria-*` go on the tile.

### Props
### MediaTile
A thumbnail tile: a picture in a fixed shape with an optional label on its bottom edge and a caption under it. With `onClick` the whole tile is one button, which is how a grid or a `ScrollStrip` of media opens each item in a `Lightbox`. The label sits on the same near-black media scrim as the Lightbox, in every theme. The thumbnail is cropped to fill its shape, or with `aspect="natural"` shown whole. With `href` the whole tile is one link instead. `onRemove` adds a remove button for a tile that can be taken back out. While `loading` with no `src` yet the picture is a bone of its shape.
- alt: string (required). What the thumbnail shows; it is the tile's name, with `label`.
- aspect: "square" | "4:3" | "3:2" | "16:9" | "3:4" | "9:16" | "natural" (default 3:4). The shape of the thumbnail, as `Image`'s `aspect`; `natural` keeps the picture's own
proportions (a chat image) and crops nothing.
- caption: ReactNode. Muted text under the picture, e.g. when.
- external: boolean (default false). Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- href: string. Makes the whole tile one link, named as the button form is; an in-app path goes through `LinkProvider`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- label: ReactNode. A short line on the bottom edge of the picture, on the media scrim: who posted it, or "Earlier".
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- onClick: MouseEventHandler<HTMLButtonElement>. Makes the whole tile one button; open a `Lightbox` from it. Without it (or `href`) the
tile is a plain, non-interactive block.
- onRemove: (() => void). Adds a round remove button on the picture's top-right corner, named `removeLabel` and `alt`: a
photo attached to a form, until it is sent. It is its own button, beside the tile's, so a tile
with `onClick` still opens its `Lightbox`.
- removeLabel: string (default Remove). The remove button's word, before `alt` in its name and alone as its tooltip.
- src: string. The thumbnail, a local path or a data URL. Left out, or if it fails to load, a placeholder shows.
- video: boolean (default false). Draws a play mark on the thumbnail: the tile opens a video, not a photo. Say so in `alt` too.
- width: "sm" | "md" | "lg" | "full" (default md). `sm` 96px, `md` 160px or `lg` 256px wide; `full` fills the parent (a tile in a grid).
