import type { ComponentPage } from "./types";

/** The pages for video and pictures: they sit in the Content section of the rail, after KeyValueList. */
export const mediaPages: ComponentPage[] = [
  {
    slug: "video",
    name: "Video",
    summary: "A video with controls, full width, in a fixed shape.",
    whenToUse: "Showing a recording or a walkthrough that your app serves.",
    siblings: [
      {
        slug: "media-tile",
        when: "The video is one of a set of things to open: a tile with `video`.",
      },
      { slug: "audio", when: "The recording is sound only: a voice note or a clip." },
      { slug: "embed-frame", when: "The video is a third party's player in an `<iframe>`." },
    ],
    pairs: ["Video/Captions"],
    usage: {
      do: [
        "`src` is your own video file. It loads only the metadata until it is played, and lazily where the browser can, so the page does not pull the whole file.",
        "`aspect` is the player's shape, `16:9` unless set: `square`, `4:3`, `3:2`, `16:10`, `16:9`, the portrait `3:4` and `9:16`. The shape is reserved before the video loads, and a clip of another shape fits inside it, letterboxed.",
        "Give a `captions` WebVTT file for any video with speech; it is offered as the default track.",
        "`poster` is the image shown before play; use a local one.",
        "The children are the text for a browser that cannot play the video.",
      ],
    },
    accessibility: [
      "A native `<video controls>`: play, seek, volume and fullscreen work by keyboard through the browser's controls.",
      '`captions` adds a `<track kind="captions" default>`, so captions are on by default.',
    ],
    api: ["Video"],
  },
  {
    slug: "audio",
    name: "Audio",
    summary: "A sound clip with the browser's own controls, at one fixed size.",
    whenToUse: "Playing a voice note, a recording or a clip that your app serves.",
    siblings: [{ slug: "video", when: "The recording has pictures: the video player." }],
    pairs: ["Audio/Label"],
    usage: {
      do: [
        "`src` is your own audio file. It loads only the metadata until it is played, and lazily where the browser can.",
        '`label` names the player, as "Voice note from Anna, 0:14": a clip has no visible title, so say what it is and how long.',
        "The player is full width up to 20rem, one size everywhere: set it in a `Stack` or a `Card`.",
        "The children are the text for a browser that cannot play the file.",
      ],
    },
    accessibility: [
      "A native `<audio controls>` named by `label`: play, seek and volume work by keyboard through the browser's controls.",
      "Speech in a clip that matters needs a transcript beside it, in the text of the page.",
    ],
    api: ["Audio"],
  },
  {
    slug: "embed-frame",
    name: "EmbedFrame",
    summary:
      "A fixed-height, rounded frame for a map or an embedded page, with a loading and an error state.",
    whenToUse: "Showing a third party's map, player or form in an `<iframe>` inside your page.",
    siblings: [{ slug: "video", when: "The video is your own file: the native player." }],
    pairs: ["EmbedFrame/Status"],
    usage: {
      do: [
        "Put the `<iframe>` or the map's container as the child: it fills the frame, which rounds and clips its corners and draws the hairline.",
        "`height` is `sm` (18rem), `md` (24rem, the default) or `viewport`, 55% of the screen's height, for a map that is the page's main content.",
        "`status` is `ready` (the default), `loading` or `error`. Set it from the embed's own load and error events: `loading` lays a pulsing cover over the embed, `error` lays `errorLabel` over it.",
        "`label` names the frame for a screen reader; give the `<iframe>` its own `title` as well.",
        '`errorLabel` says what failed and what to do, as "The map could not load. Check the address below."; the default is "Could not load.".',
      ],
    },
    accessibility: [
      "A region named by `label`. While `loading` it is `aria-busy` and says `loadingLabel` to a screen reader.",
      "The error words are an alert, announced when they appear. The embed stays mounted under both covers.",
    ],
    api: ["EmbedFrame"],
  },
  {
    slug: "colour-swatch",
    name: "ColourSwatch",
    summary: "A small square in a colour, with its name and its hex value.",
    whenToUse: "Showing a colour as data: one read off a page, a screenshot, a brand or a theme.",
    siblings: [{ slug: "image", when: "What is shown is a picture, not one colour." }],
    pairs: ["ColourSwatch/Value"],
    usage: {
      do: [
        "`value` is the colour as `#rrggbb`. Anything else draws an empty swatch and leaves the value out, so a bad value never paints the page.",
        '`label` says what the colour is, as "Background" or "Accent". The hex value follows it in mono, lower case.',
        "A list of colours is a `Stack` of swatches, or swatches in the cells of a `Table`.",
      ],
    },
    accessibility: [
      "The square is decorative and hidden from a screen reader; the label and the hex value say the colour in text.",
      "A hairline edges the square, so a colour close to the page's own still shows.",
    ],
    api: ["ColourSwatch"],
  },
  {
    slug: "image",
    name: "Image",
    summary: "A picture in a fixed shape, with a placeholder if it is missing.",
    whenToUse: "Showing a picture that your app serves: a screenshot, a QR code, a product shot.",
    siblings: [
      {
        slug: "media-tile",
        when: "The picture is a thing: it has a label, opens, or can be removed.",
      },
      { slug: "avatar", when: "The picture is a person." },
      { slug: "outline-region", when: "Areas of the picture are marked: a `RegionFrame`." },
      { slug: "colour-swatch", when: "What is shown is one colour, with its hex value." },
    ],
    pairs: ["Image/Fit"],
    usage: {
      do: [
        "`src` is your own picture, a local path or a data URL, and `alt` says what it shows. The corners are rounded and a hairline frames it on the inset surface. It loads lazily; give `priority` to the one picture at the top of the page, so it loads first.",
        "`aspect` is the shape it is cropped to: `square`, `4:3` (the default), `3:2`, `16:10`, `16:9`, the portrait `3:4` and `9:16`, or `natural`. The shape is reserved before the picture loads, so the page does not jump. `natural` is the exception: the picture keeps its own proportions, with nothing cropped, and the space is not reserved until it loads.",
        '`fit="cover"` (the default) fills the shape and crops what overflows, from the centre, or from the top with `crop="top"` for a page screenshot. `fit="contain"` shows the whole picture, for a QR code or a logo that must not lose its edges.',
        '`mat` is `white` or `page`, with padding, and shows all of the picture. A QR code, a barcode or a logo takes `mat="white"`: it is white in every theme, dark ones included, so a code scans off a dark page. A screenshot on a page takes `mat="page"`, the page\'s own tone. Leave it out for a photo, not a mat.',
        "`width` is `sm` (96px), `md` (160px), `lg` (256px) or `xl` (448px), each a cap that a narrower parent still wins over, or `full` (the default) for the parent's width.",
        "`href` makes the picture a link that opens the full file in a new tab, named by `alt`: a screenshot a reader wants to see at full size.",
        "With no `src`, or one that fails to load, a placeholder of the same size with a picture mark takes its place. A new `src` tries again.",
        "A person's photo is an `Avatar`; a clickable thumbnail with a label is a `MediaTile`; a video is a `Video`.",
      ],
    },
    accessibility: [
      'An `<img>` named by `alt`. The placeholder is a `role="img"` with the same `alt`, so a missing picture is still announced.',
      "With `href` it is a link named by `alt` that opens in a new tab, with the focus ring from the component.",
      "An empty `alt` marks the picture as decoration: it is hidden from a screen reader, placeholder included. Do that only when the text beside it says the same thing.",
    ],
    api: ["Image"],
    types: ["ImageAspect", "ImageWidth"],
  },
  {
    slug: "media-tile",
    name: "MediaTile",
    summary: "A thumbnail with a label and a caption, that can open a Lightbox.",
    whenToUse:
      "A photo or video in a grid or a strip, that opens full size when it is picked: a status, a gallery, an attachment.",
    siblings: [
      { slug: "image", when: "The picture is only shown, with no label, click or remove." },
      { slug: "video", when: "The video plays in the page: the player." },
      { slug: "lightbox", when: "One photo or video opens over the page, at full size." },
    ],
    pairs: ["MediaTile/Viewer"],
    usage: {
      do: [
        "`src` and `alt` are the thumbnail, cropped to `aspect` (portrait `3:4` by default; `natural` shows the picture whole at its own proportions, as a chat does) at `width` (`md`, 160px, by default; `full` fills a grid cell).",
        '`label` is a short line on the picture\'s bottom edge, on the same near-black scrim as the `Lightbox`, in every theme: who posted it, or "Earlier". `caption` is muted text under the picture, such as when.',
        '`video` draws a play mark; say it is a video in `alt` too. `badge` is a short word in the top corner on the same scrim, such as "New" or a count, and is part of the tile\'s name.',
        "`onRemove` adds a round remove button on the picture's corner, named \"Remove\" and `alt`: a photo attached to a form, until it is sent. It is its own button beside the tile's, so the tile can still open a `Lightbox`.",
        "`onClick` makes the whole tile one button. Open a `Lightbox` from it, and keep the open item in your own state. Without `onClick` the tile is a plain block.",
        'With no `src`, the tile shows the `Image` placeholder, so a tile that is only a label ("Earlier") needs no picture.',
        "A row of tiles that runs past the page is a `ScrollStrip`; a wrapping grid is a `CardGrid`.",
        "A picture that is only shown, with no label, click or remove, is an `Image`.",
      ],
    },
    accessibility: [
      'A tile with `onClick` is a real `<button type="button">` named by `alt` and `label`, with the focus ring from the component; Enter and Space open it.',
      "The play mark is decorative and hidden from a screen reader.",
      "`id`, `data-*` and `aria-*` go on the tile.",
    ],
    api: ["MediaTile"],
  },
  {
    slug: "scroll-strip",
    name: "ScrollStrip",
    summary: "One row of tiles or avatars that scrolls sideways.",
    whenToUse:
      "A row of media or people that is longer than the page is wide: recent statuses, a team.",
    pairs: ["ScrollStrip/Row"],
    usage: {
      do: [
        "Put `MediaTile`s or `Avatar`s as the children and name the strip with `label`. They keep their own width and never shrink or wrap.",
        "`gap` is a `Cluster`'s: `xs`, `sm` (the default) or `md`; the `Size` type lists every default that is not `md`.",
        "It scrolls only when the items run past its width, with a thin themed scrollbar, and the items snap to the start edge.",
      ],
      dont: [
        "Do not use it for a few items that fit: that is a `Cluster`. A grid that wraps is a `CardGrid`.",
      ],
    },
    accessibility: [
      'A `role="group"` named by `label`. It takes keyboard focus (`tabindex="0"`) with a focus ring, so the arrow keys scroll it without a pointer.',
      "`id`, `data-*` and `aria-*` go on the strip.",
    ],
    api: ["ScrollStrip"],
  },
];
