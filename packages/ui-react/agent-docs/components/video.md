## Video

Group: Content

When to use: Showing a recording or a walkthrough that your app serves.

### Use instead
- MediaTile (media-tile.md): The video is one of a set of things to open: a tile with `video`.

### The one right way
`captions` is a WebVTT file offered as the default track; `children` is the text for a browser that cannot play it.
```tsx
import { Video } from "@slashsuite/ui-react";

<Video src="/media/walkthrough.webm" captions="/media/walkthrough.vtt">
  Your browser cannot play this video.
</Video>
```

### Do
- `src` is your own video file. It loads only the metadata until it is played, so the page does not pull the whole file.
- Give a `captions` WebVTT file for any video with speech; it is offered as the default track.
- `poster` is the image shown before play; use a local one.
- The children are the text for a browser that cannot play the video.

### Don't
A video with speech and no `captions` leaves out anyone who cannot hear it.
```tsx
import { Video } from "@slashsuite/ui-react";

<Video src="/media/walkthrough.webm" />

```

### Accessibility
- A native `<video controls>`: play, seek, volume and fullscreen work by keyboard through the browser's controls.
- `captions` adds a `<track kind="captions" default>`, so captions are on by default.

### Props
### Video
A `<video>` with controls, full width and rounded; it loads metadata only, so the page does not pull the file until it is played. `src` is the app's own video; `captions` is a WebVTT file, offered as the default track. `children` is the fallback for a browser that cannot play it.
- captions: string. A WebVTT file, offered as the default captions track.
- poster: string (native). The image shown before play; use a local one.
- src: string (required). The video file, the app's own.
