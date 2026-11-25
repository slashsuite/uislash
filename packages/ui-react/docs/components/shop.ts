import type { ComponentPage } from "./types";

/** The pages for selling things: they sit in the Content section of the rail, after the media. */
export const shopPages: ComponentPage[] = [
  {
    slug: "price",
    name: "Price",
    summary: "A price as the app formatted it, with the old price struck through on a sale.",
    whenToUse: "Showing what something costs: on a product tile, a product's page or a cart line.",
    siblings: [
      { slug: "product-tile", when: "The price is one thing for sale in a shop's grid." },
    ],
    pairs: ["Price/Sale"],
    usage: {
      do: [
        '`value` is the price already formatted for the reader ("R52", "€12.50"): the app owns the currency and the locale, and `Price` formats nothing.',
        "`was` is the price before a sale. It follows `value` struck through and a step smaller, and a screen reader hears \"R52, was R65\".",
        "`size` is `sm` for a dense row, `md` (the default) for a tile and `lg` for a product's own page.",
        "Figures are tabular, so a column of prices lines up.",
      ],
      dont: [
        "Do not strike a price through by hand: the strike is silent, so the old price reads as a second price.",
      ],
    },
    accessibility: [
      'The old price carries a screen-reader-only ", was ", since a strike says nothing out loud.',
      "While `loading` with no `value` yet it is a bone of its size and `aria-busy`.",
      "`id`, `data-*` and `aria-*` go on the price.",
    ],
    api: ["Price"],
  },
  {
    slug: "product-tile",
    name: "ProductTile",
    summary: "One thing for sale: its picture, name and price, as one link to its page.",
    whenToUse: "A shop's grid of products, or a row of them on a landing page.",
    siblings: [
      { slug: "price", when: "The price stands alone: a cart line or a product's own page." },
      { slug: "media-tile", when: "The tile is a photo or a video to open, not a thing to buy." },
    ],
    pairs: ["ProductTile/Grid"],
    usage: {
      do: [
        "`href` is the product's page; the whole tile is one link, and an in-app path goes through `LinkProvider`.",
        "`name` and `price` are the tile's words; `was` adds the old price on a sale, as `Price` does.",
        '`status` puts a word on the picture\'s top-left corner: `sale` in the danger tone, `sold-out` on the media scrim. `statusLabel` is that word in the app\'s own language.',
        "`src` is the picture, cropped `square` (the default) or `3:4` for clothes on a person. It is decoration: the name says what it is.",
        "Put a set of them in a `CardGrid` with `as=\"ul\"`, and `minColumns={2}` to keep two to a row on a phone.",
      ],
      dont: [
        "Do not link the picture and the name apart: that is two stops for a keyboard, and the picture's link has no name.",
      ],
    },
    accessibility: [
      'One link, named by what it says: "Linen shirt, R52, was R65, Sale". The picture has an empty `alt`.',
      "While `loading` the picture, name and price that are not here yet are bones and the link is `aria-busy`.",
      "`id`, `data-*` and `aria-*` go on the link.",
    ],
    api: ["ProductTile"],
    types: ["ProductTileStatus"],
  },
  {
    slug: "cart-button",
    name: "CartButton",
    summary: "The header's cart: the bag icon, how many things are in it and what they come to.",
    whenToUse: "A shop's header, to open the cart from any page.",
    pairs: ["CartButton/Drawer"],
    usage: {
      do: [
        "`count` is how many things are in the cart; `0` is shown, so the header does not shift as things go in.",
        '`total` is what they come to, formatted by the app ("R480"). Left out, only the count shows.',
        "`onClick` opens the cart in a `Drawer`; pass `aria-expanded` and `aria-controls` with the drawer's state. `href` makes it a link to the cart's page instead.",
        '`label` (default "Cart") and `itemsLabel` (default "1 item" or "n items") are its words, for an app in another language.',
      ],
      dont: [
        "Do not draw a cart icon with a bare number: a screen reader hears a number with nothing to say what it counts.",
      ],
    },
    accessibility: [
      'Named by its label, the count in words and the total: "Cart, 2 items, R480". The chip and the total are drawn for the eye and hidden from a screen reader, which hears the words.',
      "`id`, `data-*` and `aria-*` go on the button or the link.",
    ],
    api: ["CartButton"],
  },
];
