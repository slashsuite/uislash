import type { ComponentPage } from "./types";

/** The modal and docked layers over the page: they sit in the Feedback section of the rail, after Loading. */
export const overlayPages: ComponentPage[] = [
  {
    slug: "dialog",
    name: "Dialog",
    summary: "A modal that stops the page for one question.",
    whenToUse: "A short form or a message the reader must deal with before they go on.",
    siblings: [
      { slug: "drawer", when: "A record or a long form is worked on beside the page." },
      { slug: "confirm-dialog", when: "One yes-or-no question before an action." },
      { slug: "field-dialog", when: "Only one text value is asked for." },
      {
        slug: "bottom-sheet",
        when: "Content sits over a map or a canvas that must stay usable: not modal.",
      },
      { slug: "lightbox", when: "One photo or video is shown at full size." },
    ],
    pairs: ["Dialog/Notice", "Dialog/Form"],
    stories: ["DialogScroll"],
    usage: {
      do: [
        "Render it only while it is open: `{open && <Dialog … onClose={() => setOpen(false)} />}`. It opens itself on mount.",
        'A `title` that names the action, a `description` with the consequence, and the actions in `footer`: Cancel as `variant="ghost"` first, then the one action, `tone="danger"` when it destroys something.',
        'A form is the Dialog\'s own `onSubmit`: the body, the error and the footer are one form, so the footer\'s `Button type="submit"` and Enter in a field submit it, with no form id and no `form` attribute. The footer is Cancel (`variant="ghost"`), then the one submit button. With `onSubmit`, put no `<form method="dialog">` in the footer: it would nest a form.',
        "An error about one field is that `Field`'s `error`. An error about the whole submit (the server refused it, a conflict, no connection) is the Dialog's `error`: an alert between the body and the footer, beside the button that was pressed however tall the body is.",
        "A tall body scrolls inside the dialog, which is never taller than the screen: the title, the description and the footer stay on screen, so the actions are always in reach. A scroll that reaches the end of the body stops there and never moves the page behind. There is nothing to set.",
        'Every Dialog has a close button in its top corner, named "Close" (set `closeLabel` to the reader\'s language). A notice or a list to read needs no footer: the close button is the way out.',
        "A yes-or-no question before an action is a `ConfirmDialog`. One text field is a `FieldDialog`. A record or a long form is a `Drawer`. A message that needs no answer is a `Callout` in the page, or a `Toast` when it should not move the page.",
        'It fades and slides in, and out again on close, but a `<dialog>` only animates out while it is still in the DOM. So `onClose` is called once the exit has finished: put `setOpen(false)` there and nowhere else. Esc, the backdrop and a `<form method="dialog">` close it that way already. Your own Cancel or action button closes it by calling `.close()` on its `<dialog>`, which a click handler finds with `event.currentTarget.closest("dialog")`. A button that calls `setOpen(false)` itself unmounts the dialog at once, and it vanishes with no exit animation. After async work (a save), keep the `<dialog>` from the event before the `await` (`const dialog = event.currentTarget.closest("dialog")`) and call `dialog?.close()` when it resolves.',
      ],
    },
    accessibility: [
      "A Dialog is the browser's own `<dialog>` opened with `showModal()`: the page behind goes inert, Tab and Shift+Tab wrap inside it and Esc closes it.",
      "The fade and slide are switched off under `prefers-reduced-motion: reduce`, and then it closes at once.",
      "It is named by its `title`, an `h2`, through `aria-labelledby`.",
      'A click on the backdrop closes it, and so do the close button and a submit of a `<form method="dialog">`; every close calls `onClose`.',
      "The close button comes last in the keyboard order, after the footer, so opening still focuses the first field or the first footer button.",
      "The browser focuses the first focusable element in it when it opens; put `autoFocus` on the button that should have focus first.",
      "A tall body that holds nothing focusable, such as plain text, takes a tab stop so the arrow keys can scroll it. A tall form keeps its first focus on its first field.",
      'Once a form\'s `onSubmit` settles (a returned promise resolves or rejects), the focus moves to the first field marked invalid (`aria-invalid="true"`), so a failed submit puts the reader on what to fix.',
    ],
    api: ["Dialog"],
  },
  {
    slug: "drawer",
    name: "Drawer",
    summary: "A modal panel that slides in from the right edge.",
    whenToUse:
      "A record or a form the reader works on beside the page, with actions that stay in view.",
    siblings: [
      { slug: "dialog", when: "A question, or a short form, must be answered before going on." },
      {
        slug: "bottom-sheet",
        when: "Content sits over a map or a canvas that must stay usable: not modal.",
      },
      { slug: "field-dialog", when: "Only one text value is asked for." },
    ],
    pairs: ["Drawer/Record", "Drawer/Footer"],
    usage: {
      do: [
        "Render it only while it is open: `{open && <Drawer … onClose={() => setOpen(false)} />}`. It opens itself on mount.",
        "Use it for a record to read or edit, or a form with several fields; a yes-or-no question is a `Dialog`.",
        "The actions go in `footer`, pinned under the body, which scrolls between the header and the footer. A scroll that reaches the end of the body stops there and never moves the page behind.",
        "`width` is `sm`, `md` (the default) or `lg`; choose by the content, `sm` for one field and `lg` for a table. `description` is a muted line under the title, as on a `Dialog`.",
        "For a form, give it `onSubmit`, as on a `Dialog`: the body and the footer become one form, so a `Button type=\"submit\"` in the footer or Enter in a field submits it. What went wrong with the whole submit is `error`, pinned above the footer; a field's own error is its `Field`'s.",
        "Set `closeLabel` to the reader's language when the page is not in English.",
        'It slides out again on close, but only while it is still in the DOM, so `onClose` is called once the exit has finished: put `setOpen(false)` there and nowhere else. Esc, the scrim and the close button close it that way already. A Cancel or Save button in the `footer` closes it by calling `.close()` on its `<dialog>`, which a click handler finds with `event.currentTarget.closest("dialog")`. A button that calls `setOpen(false)` itself unmounts the drawer at once, with no exit animation. After async work, keep the `<dialog>` from the event before the `await` and call `.close()` when it resolves.',
      ],
    },
    accessibility: [
      "A Drawer is the browser's own `<dialog>` opened with `showModal()`: the page behind goes inert, Tab and Shift+Tab wrap inside it and Esc closes it.",
      "It is named by its `title`, an `h2`, through `aria-labelledby`.",
      'The header\'s close button is an `IconButton` named by `closeLabel` ("Close" by default); a click on the scrim closes it too.',
      "On a touch screen a swipe to the right drags it off: past a third of its width, or a quick flick, closes it, and a shorter one springs back. A vertical swipe scrolls the body, and a swipe that starts in a field or a slider is the field's own.",
      "Closing, or unmounting it, hands focus back to the element that opened it.",
      "The slide in and out is switched off under `prefers-reduced-motion: reduce`, and then it closes at once.",
    ],
    api: ["Drawer"],
  },
  {
    slug: "bottom-sheet",
    name: "BottomSheet",
    summary:
      "A non-modal panel docked to the bottom edge, at snap heights, over a map or a canvas.",
    whenToUse:
      "A list or details over a full-screen view (a map, a canvas) that must stay usable behind it.",
    siblings: [
      { slug: "dialog", when: "A question must be answered before going on: modal." },
      { slug: "drawer", when: "A record or a long form, modal, beside the page." },
    ],
    pairs: ["BottomSheet/Header"],
    usage: {
      do: [
        "Put it in a positioned parent (`relative`) that holds the full-screen view; it docks to that parent's bottom edge, full width on a phone and a panel at the start edge from `md` up.",
        "Hold `snap` in your state and set it in `onSnapChange`: `<BottomSheet snap={snap} onSnapChange={setSnap} …>`.",
        'List `snaps` lowest first, at least two: a number from 0 to 1 is a share of the parent\'s height, a `"120px"` string is pixels.',
        "The heading and a count go in `header`, never first in the body, so they stay put while the list scrolls.",
        "Pad the map camera by the height `onHeightChange` reports, so a pin is never hidden under the sheet. It reports on every move of a drag as well as at rest, so the camera follows the finger.",
        'Where a wide screen has room for the list beside the view, set `inlineFrom="md"` (or `"lg"`): from that width up it renders in the page\'s flow, in the column you give it, with no handle and no snaps. Below it, it is a sheet.',
        "A record or a form that stops the page is a `Drawer`; a question is a `Dialog`.",
        "Render the first snap first: the server render, and a page with no JavaScript, show a static panel at it.",
      ],
    },
    accessibility: [
      "It is a region named by `label`.",
      "The handle is a button named by `label`, with `aria-expanded` and `aria-controls` on the body. Enter and Space step through the snaps, ArrowUp and ArrowDown move one snap up or down, and Escape inside the sheet returns it to the first.",
      "Nothing behind it is inert, and focus is never trapped or moved.",
      "The settle between snaps is switched off under `prefers-reduced-motion: reduce`.",
      "The body scrolls on its own and never scrolls the page.",
    ],
    api: ["BottomSheet"],
    types: ["BottomSheetSnap"],
  },
  {
    slug: "lightbox",
    name: "Lightbox",
    summary: "A full-screen viewer for one photo or video, on a dark scrim.",
    whenToUse: "Showing a photo or a video at full size, and stepping through a set of them.",
    siblings: [
      { slug: "media-tile", when: "The pictures are shown in the page, as tiles to open." },
      { slug: "dialog", when: "A question or a form, not a picture." },
    ],
    pairs: ["Lightbox/Viewer"],
    usage: {
      do: [
        "Render it only while it is open: `{open && <Lightbox … onClose={() => setOpen(false)} />}`. It opens itself on mount.",
        "Pass one `<img>` or `<video>` as its children, with no classes: the Lightbox scales it down to fit the screen and keeps its shape.",
        "`label` names it for a screen reader. `title` and `meta` are lines above the media (who posted it, and when); `caption` is the text under it.",
        "To step through a set, pass `onPrevious` and `onNext`: each shows its button and binds its arrow key. Leave `onPrevious` out on the first item and `onNext` on the last.",
        "The scrim is near-black with light text in every theme, light themes included, so a photo reads as it would in any viewer. It takes the dark colour scheme too, so a video's own controls are dark on it.",
        "It fades out on close while it is still in the DOM, so `onClose` is called once the fade has finished: put `setOpen(false)` there and nowhere else. Esc, the scrim and the close button close it that way already.",
      ],
      dont: ["Do not draw your own scrim for media; a question about a photo is a `Dialog`."],
    },
    accessibility: [
      "A Lightbox is the browser's own `<dialog>` opened with `showModal()`: the page behind goes inert, Tab and Shift+Tab wrap inside it and Esc closes it.",
      "It is named by `label` through `aria-label`; give the `<img>` its own `alt`.",
      "The close, previous and next buttons are named Close, Previous and Next (`closeLabel`, `previousLabel` and `nextLabel` for another language), and keep a light focus ring that shows on the dark scrim in every theme.",
      "A click on the scrim around the media closes it; a click on the media or its text does not.",
      "Closing, or unmounting it, hands focus back to the element that opened it. The fade is switched off under `prefers-reduced-motion: reduce`.",
    ],
    api: ["Lightbox"],
  },
  {
    slug: "confirm-dialog",
    name: "ConfirmDialog",
    summary: "A Dialog that asks before an action.",
    whenToUse:
      "An action that destroys something or cannot be undone: delete, discard, revoke, sign out everywhere.",
    siblings: [
      { slug: "dialog", when: "A form, or a question with more than two answers." },
      { slug: "toast", when: "The action can be undone: do it, and offer Undo in a toast." },
    ],
    pairs: ["ConfirmDialog/Confirm"],
    usage: {
      do: [
        "Render it only while it is open: `{open && <ConfirmDialog … onClose={() => setOpen(false)} />}`.",
        '`title` is the question and names the action ("Delete build?"), `description` is the consequence in one sentence, and `confirm` is the action as a verb ("Delete"), never "OK" or "Yes".',
        "`tone` is `danger` (the default) for an action that destroys or cannot be undone, and `neutral` for one that can be reversed, such as Archive.",
        "`onConfirm` runs the action. Return its promise: the button is busy (`busyLabel`) until it settles, resolving closes the dialog, and a rejection shows its message above the buttons and keeps the dialog open for a retry.",
        "Set `cancel` and `closeLabel` to the reader's language when the page is not in English.",
      ],
      dont: [
        "Do not ask before an action that can be undone: do it, and offer Undo in a `Toast`.",
        "Do not build one from a `Dialog` with only the action in its footer: a confirmation always has Cancel.",
      ],
    },
    accessibility: [
      "It is an `alertdialog` on the browser's own `<dialog>`: the page behind goes inert, Tab and Shift+Tab wrap inside it and Esc closes it.",
      "It is named by its `title` and described by its `description`, so a screen reader reads the question and the consequence as it opens.",
      "It opens on Cancel, so Enter or Space pressed by habit cancels rather than destroys.",
      "Esc, the backdrop and the close button all cancel, as Cancel does; only the confirm button runs the action.",
      "While the action runs, the confirm button is busy (`aria-busy`); a rejection is announced as an alert inside the dialog.",
    ],
    api: ["ConfirmDialog"],
  },
  {
    slug: "field-dialog",
    name: "FieldDialog",
    summary: "A Dialog that asks for one text value.",
    whenToUse: "Asking for a single name or value: new project, rename, a label.",
    siblings: [
      { slug: "form-layout", when: "The form has several fields and a page of its own." },
      { slug: "dialog", when: "More than one field, or a question with no field." },
      { slug: "drawer", when: "A record or a long form with several fields." },
    ],
    pairs: ["FieldDialog/OneField"],
    usage: {
      do: [
        "Render it only while it is open, and give every string it shows: `title`, `label`, `placeholder`, `hint`, `emptyReason`, `submit` and `busyLabel`, and a `description` under the title when the question needs a sentence. `cancelLabel` rewords Cancel, for an app in another language.",
        "`onSubmit` gets the trimmed value and returns a promise. Resolving closes the dialog; rejecting shows the error message under the field and keeps the dialog open.",
        "More than one field is a `Dialog` with `onSubmit` holding its `Field`s, or a `Drawer`.",
      ],
    },
    accessibility: [
      "It is a `Dialog`: native `<dialog>`, page behind inert, Tab wraps inside, Esc closes, named by its `title`.",
      "The input has focus when it opens and is named by `label`.",
      "The submit button is never disabled: an empty submit marks the field invalid, shows `emptyReason` as its error (announced politely) and moves the focus to it. Typing clears the error.",
      "While `onSubmit` is pending the button is busy (`aria-busy`); a rejection shows in the field's error line, announced politely from a live region inside the dialog.",
    ],
    api: ["FieldDialog"],
  },
  {
    slug: "popover",
    name: "Popover",
    summary: "A button that opens a small panel beside it.",
    whenToUse:
      "A detail, a short explanation or a filter or two that belongs to one control and is not worth a page or a modal.",
    siblings: [
      { slug: "menu", when: "The panel would be a list of actions." },
      {
        slug: "disclosure",
        when: "The detail can open in the page and push what is below it down.",
      },
    ],
    pairs: ["Popover/Popover"],
    usage: {
      do: [
        "`label` names the trigger and the panel. Without `icon` the trigger is an outline button reading `label`; with `icon` it is a ghost square button, and `label` is its tooltip.",
        "Keep the panel small: a few lines, a short list of facts, a filter or two. It is never wider than 22rem or the screen.",
        "A list of actions is a `Menu`, which the arrow keys move through. A question to answer first is a `Dialog`.",
      ],
      dont: [
        "Do not put the only way to do something in a Popover: a reader who never opens it never finds it.",
        "Do not use one for a list of actions: a `Menu` is the one way.",
      ],
    },
    accessibility: [
      "It is the browser's own popover: a click outside it, Esc or the trigger closes it, and Esc puts the focus back on the trigger.",
      "Opening it moves the focus into the panel. It is not modal: the page stays usable, and Tab moves on through the panel and out of it.",
      "The trigger says whether it is open (`aria-expanded`), and the panel is a `dialog` named by `label`.",
      "Where the browser positions by anchor, the panel sits under the trigger and flips above when there is no room; elsewhere it shows in the middle of the screen.",
    ],
    api: ["Popover"],
  },
];
