import type { ComponentPage } from "./types";

/** The pages for choosing and entering numbers: they sit in the Forms section of the rail, after Select. */
export const numberPages: ComponentPage[] = [
  {
    slug: "combobox",
    name: "Combobox",
    summary: "A text field that filters a list of choices as the person types.",
    whenToUse:
      "One choice from more items than a `Select` reads well: a country, a time zone, a teammate.",
    pairs: ["Combobox/TimeZone"],
    usage: {
      do: [
        "Give it a `label`; it draws its own label, `hint` and `error`, so it is never put in a `Field`.",
        "`items` are a `Select`'s: `{ value, label, disabled? }`. Typing filters them by label; the chevron opens the whole list.",
        "Keep it with `defaultValue`, or control it with `value` and `onChange(value)`; `name` posts the chosen `value`.",
        "Say what an empty filter means in another language with `emptyLabel`.",
        "`size` and `width` are the same choices as on `Input`. Up to a dozen choices is a `Select`, and up to five a `RadioGroup`.",
      ],
      dont: ["Do not make the person scroll a long `Select` for their entry."],
    },
    accessibility: [
      "React Aria's combobox: the input is a `combobox` with the label as its name, and the list a `listbox` it controls.",
      "Arrow keys move through the list, Enter picks, Escape closes it; the chevron button is out of the tab order.",
      "A `hint` and an `error` are the field's description; an `error` marks it `aria-invalid` and is announced politely.",
      "Inside a modal `Dialog` the list draws in the dialog, so it stays reachable.",
    ],
    api: ["Combobox"],
  },
  {
    slug: "number-field",
    name: "NumberField",
    summary: "A number typed or stepped with minus and plus buttons.",
    whenToUse:
      "A quantity, a count or an amount the person sets exactly: items in a cart, guests, a price.",
    pairs: ["NumberField/Quantity"],
    usage: {
      do: [
        "Give it a `label`; it draws its own label, `hint` and `error`, so it is never put in a `Field`.",
        "Set `minValue` and `maxValue`: the buttons stop there, and a typed number outside them is clamped when the field is left.",
        "`step` is how far a button or an arrow key moves it; a typed number snaps to it.",
        '`formatOptions` writes it as a currency (`{ style: "currency", currency: "EUR" }`), a percent or with fixed decimals, in the app\'s locale; `name` posts the plain number.',
        "Keep it with `defaultValue`, or control it with `value` and `onChange(number)`.",
        "`size` and `width` are the same choices as on `Input`. Name the buttons in another language with `decrementLabel` and `incrementLabel`.",
        "A level set by eye is a `Slider`. A choice from a few fixed numbers is a `Select` or a `RadioGroup`.",
      ],
      dont: [
        "Do not use a `Select` of numbers for a count: it caps the count and makes the person scroll.",
      ],
    },
    accessibility: [
      "React Aria's number field: the input is a `textbox` with the label as its name, and the arrow keys, Page Up and Page Down step it.",
      'The minus and plus buttons are named after the label ("Decrease Quantity") and kept out of the tab order, since the keys do the same.',
      "A `hint` and an `error` are the field's description; an `error` marks it `aria-invalid` and is announced politely.",
    ],
    api: ["NumberField"],
  },
  {
    slug: "slider",
    name: "Slider",
    summary: "A level between two ends, set by dragging, with its value beside it.",
    whenToUse:
      "A value set by eye where near enough is fine: an opacity, a volume, a price range filter.",
    pairs: ["Slider/Level"],
    usage: {
      do: [
        "Put a `Slider` in a `Field`, which names it and draws its hint and error, as an `Input`.",
        "Set `min`, `max` and `step`; without them it runs 0 to 100 in steps of 1 and starts halfway.",
        'Its value is written beside the track; `formatOptions` sets how (`{ style: "percent" }` for 0 to 1) and assistive tech reads it the same way.',
        "Keep it with `defaultValue`, or control it with `value` and the input's own `onChange`.",
        "`size` and `width` are the same choices as on `Input`.",
        "A figure the person must hit exactly is a `NumberField`.",
      ],
    },
    accessibility: [
      'A native `<input type="range">`: arrow keys, Page Up, Page Down, Home and End move it, and it keeps the browser\'s touch handling.',
      '`aria-valuetext` is the written value, so a screen reader hears "40%", not "0.4".',
      "The focus ring comes from the component.",
    ],
    api: ["Slider"],
  },
];
