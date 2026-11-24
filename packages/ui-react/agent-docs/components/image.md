## Image

Group: Content

When to use: Showing a picture that your app serves: a screenshot, a QR code, a product shot.

### Use instead
- MediaTile (media-tile.md): The picture is a thing: it has a label, opens, or can be removed.
- Avatar (avatar.md): The picture is a person.
- OutlineRegion (outline-region.md): Areas of the picture are marked: a `RegionFrame`.

### The one right way
A picture that must be seen whole, such as a QR code or a logo, is `fit="contain"`.
```tsx
import { Image } from "@slashsuite/ui-react";

<Image src={sampleCode} alt="Pairing code" aspect="3:4" width="md" fit="contain" />

```

### Do
- `src` is your own picture, a local path or a data URL, and `alt` says what it shows. The corners are rounded and a hairline frames it on the inset surface.
- `aspect` is the shape it is cropped to: `square`, `4:3` (the default), `3:2`, `16:9`, the portrait `3:4` and `9:16`, or `natural`. The shape is reserved before the picture loads, so the page does not jump. `natural` is the exception: the picture keeps its own proportions, with nothing cropped, and the space is not reserved until it loads.
- `fit="cover"` (the default) fills the shape and crops what overflows. `fit="contain"` shows the whole picture, for a QR code or a logo that must not lose its edges.
- `framed` sets the picture on a white mat with padding and shows all of it. The mat is white in every theme, dark ones included, so a QR code scans off a dark page. Use it for a code, not for a photo.
- `width` is `sm` (96px), `md` (160px) or `lg` (256px), each a cap that a narrower parent still wins over, or `full` (the default) for the parent's width.
- With no `src`, or one that fails to load, a placeholder of the same size with a picture mark takes its place. A new `src` tries again.
- A person's photo is an `Avatar`; a clickable thumbnail with a label is a `MediaTile`; a video is a `Video`.

### Don't
`cover` crops to the shape: it cuts the corners off a code, which then cannot be scanned.
```tsx
import { Image } from "@slashsuite/ui-react";

<Image src={sampleCode} alt="Pairing code" aspect="16:9" width="md" fit="cover" />

```

### Accessibility
- An `<img>` named by `alt`. The placeholder is a `role="img"` with the same `alt`, so a missing picture is still announced.
- An empty `alt` marks the picture as decoration: it is hidden from a screen reader, placeholder included. Do that only when the text beside it says the same thing.

### Props
### Image
A picture in a fixed shape: `aspect` reserves the space before it loads, so the page does not jump, and `fit` crops it to the shape or shows all of it. The corners are rounded and the frame has a hairline. If the picture is missing or fails to load, a same-sized placeholder with a picture mark stands in, still named by `alt`. `framed` mats a code or a logo in white. A user's photo is an `Avatar`; a clickable thumbnail with a label is a `MediaTile`. While `loading` with no `src` yet it is a bone of the same shape, not the placeholder, which means there is no picture.
- alt: string (required). What the picture shows. An empty string marks it as decoration, hidden from a screen reader.
- aspect: "square" | "4:3" | "3:2" | "16:9" | "3:4" | "9:16" | "natural" (default 4:3). The shape it is cropped to: `square`, `4:3`, `3:2`, `16:9`, or the portrait `3:4` and `9:16`.
`natural` keeps the picture's own proportions instead, so nothing is cropped or letterboxed;
the space is not reserved before it loads.
- fit: "cover" | "contain" (default cover). `cover` fills the shape and crops what overflows; `contain` shows the whole picture, with the
rest of the shape left empty (a QR code, a logo).
- framed: boolean (default false). Sets the picture on a white mat with padding, always white, in every theme: a QR code is
scanned off a dark page. It shows the whole picture, as `fit="contain"`, whatever `fit` says.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- src: string. The picture, a local path or a data URL. It is never loaded for you: this is the app's own
image. Left out, or if it fails to load, the picture is replaced by a placeholder.
- width: "sm" | "md" | "lg" | "full" (default full). `sm` 96px, `md` 160px and `lg` 256px set the width, capped at the parent's; `full` fills the parent.

### Types
- ImageAspect: `"square" | "4:3" | "3:2" | "16:9" | "3:4" | "9:16" | "natural"`. The shapes an image is cropped or letterboxed to, or `natural`: no shape of its own, so the picture keeps its own proportions.
- ImageWidth: `Size | "full"`. How wide an image is: `full` fills its parent; the others are 96, 160 or 256px, capped at the parent's width.
