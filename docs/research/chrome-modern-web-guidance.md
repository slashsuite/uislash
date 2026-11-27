# Chrome's modern web guidance, applied to UISlash

Researched 2026-11-24. Nothing in `packages/`, `themes/` or `apps/` was changed. This file is the
audit; every gap it found is a ticket, and none is fixed here.

## What it is

[Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) is the Chrome team's
set of best-practice guides for building on the web platform, written for coding agents and
delivered as agent skills (`npx modern-web-guidance@latest install`). Each guide is one pattern (a
dialog, a sortable table, dark mode, a form) with the markup, CSS and behaviour it recommends, which
features it needs, and their Baseline status. Version 1.0; the guide catalogue is dated
2026-11-10, with input from Mozilla and Microsoft. The guides were read from their source,
[GoogleChrome/modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src) at
commit `888035b` (2026-11-23), alongside the site's Get started, Modernization workflow, Guides,
Troubleshoot and Contribute pages.

Its default target is Baseline Widely available. UISlash's target is its own floor, the Baseline
digest of August 2026 (`AGENTS.md`, "Browser support"), so a guide's recommendation that needs a
newer feature counts as met when the library reaches the same result another way, or as n/a when
it needs no such result.

## How agents use it

When you build or change a component, read the guide for its pattern first (the ids in the tables
below are paths under `https://developer.chrome.com/docs/modern-web-guidance/guides/`) and follow
it within the browser floor. The **met** rows show where the library already does what the guide
asks, so a new component copies that. A **missed** row is an open ticket: do not copy the gap into
a new component, and do not fix it outside its ticket.

## How this was done

- The source holds 252 guides. 72 bear on a component library or its themes, and every one of
  them was read in full: the `forms`, `ui-components`, `ui-atoms` and `ui-behaviors` guides that
  match a UISlash component, plus `css`, `visual-design`, `accessibility`, `user-experience` and
  the image, video and HTML sanitising guides.
- The other 180 are out of scope for a component library: built-in AI, PWA and offline, WebAssembly,
  WebMCP, passkeys, sign-in and payments, security headers and permissions, privacy, analytics,
  page-load and scheduling performance, service workers, canvas and 3D, and plain JavaScript
  language guides. A component guide whose pattern UISlash has no component for is not listed,
  unless an audited guide named it.
- Each guide's recommendations were checked against the code with `rg`, and each verdict cites a
  file and line (paths under `packages/ui-react/src/` unless another path is given) or a test.
  **met** means the user-facing result matches the guide, including by a different technique
  where the guide's own technique needs a feature above the floor. **missed** means a UISlash component the
  guide applies to does not do it. **n/a** means no component applies, or the feature is above the
  floor and nothing is lost without it.
- Each gap became one ticket, shared where two rows are the same gap. Three gaps already had an
  open ticket, which is listed instead.

## Results

127 met, 80 missed, 15 n/a across 72 guides. The gaps cluster in five places: forms (required
markers, target size, error announcement), the toast and copy feedback, forced colours and
`prefers-contrast` (no support anywhere), the Table, and components that switch layout at a viewport
breakpoint where the guide asks for a container query.

### Forms and fields

| Guide | Recommendation | Verdict | Evidence or gap | Ticket |
| --- | --- | --- | --- | --- |
| `accessibility/accessible-error-announcement` | Error linked by `aria-describedby` only while it shows | met | `Field.tsx:40-42`. Test: `Field.control.test.tsx:68` (not invalid with only a hint). |  |
| `accessibility/accessible-error-announcement` | Field controls: aria-invalid="false" until an error shows | missed | fieldControl.ts:40 leaves aria-invalid unset with no error; Firefox and Safari then report an empty required field as invalid from page load. | HC-576 |
| `accessibility/accessible-error-announcement` | Field errors: announce through one polite live region, not a role=alert per field | missed | Each error is its own assertive role="alert": Field.tsx:16, labelWords.tsx:28, RadioGroup.tsx:97, DateField.tsx:220. | HC-577 |
| `forms/autofill-highlight-inputs` | Text controls: a non-colour :autofill ring | missed | No :autofill rule in control.ts:62 or any theme; only the browser's tint marks an autofilled field. | HC-573 |
| `forms/brand-consistent-forms` | Brand checkbox, radio and progress in the accent, with `color-scheme` per theme | met | Drawn controls use the accent: `Checkbox.tsx:31`, `RadioGroup.tsx:183`. Every theme sets `color-scheme` (e.g. `themes/catppuccin-mocha.css:25`, `themes/slash-suite.css:39`). |  |
| `forms/brand-consistent-forms` | Accent at 3:1 or better against the background (don't rely on browser auto-contrast) | met | the accent control edge rule holds the drawn Checkbox and Switch edges to 3:1 (`packages/themes-shared/src/contrastRules.ts:113`). |  |
| `forms/branded-select-styling` | Selected text and picker at 3:1 or better against the background | met | Select uses `controlClass` (`control.ts:62`), whose edge, ink and placeholder the theme contract checks (`packages/themes-shared/src/contrastRules.ts:255-275`). |  |
| `forms/branded-select-styling` | Brand the `<select>` with `appearance: base-select` | n/a | Customizable select is above the floor. `Select.tsx:21-24` keeps the native select and arrow on purpose, and is themed through palette utilities. |  |
| `forms/button-group` | Left and Right arrows move through a horizontal group; checked state shown by more than colour | met | `switcher.tsx:103-106` (Left/Right/Home/End). The checked option is filled and medium weight (`SegmentedControl.tsx:30`). Tests in `switcher.test.tsx`. |  |
| `forms/button-group` | Customizable-select listbox as a button group | n/a | The guide is a blocked draft, and `appearance: base-select` listbox is above the floor. SegmentedControl gives the same result with radio semantics (`SegmentedControl.tsx:122-124`). |  |
| `forms/form-fields-automatically-fit-contents` | ChatComposer: let the textarea grow with field-sizing: content up to a row cap | missed | ChatComposer.tsx:102 is fixed at rows={2}. field-sizing is progressive enhancement; fixed rows stay the fallback. | HC-571 |
| `forms/form-fields-automatically-fit-contents` | Auto-size inputs and selects | n/a | Inputs and Selects take fixed `width` choices by design (`control.ts:32-40`), and `field-sizing` is above the floor. |  |
| `forms/forms` | Use native semantic controls; mark helper buttons `type="button"` | met | `Input.tsx:91`, `Textarea.tsx:25`, `Select.tsx:48` are native elements. `Button.tsx:365` defaults to `type="button"`. `InlineEdit.tsx:94` and `Switch.tsx:110` set it explicitly. |  |
| `forms/forms` | Group related controls in `<fieldset>` with `<legend>` as its first child | met | `Fieldset.tsx:37-42` |  |
| `forms/forms` | Visible `<label>` tied by for/id and placed above text controls; checkbox and radio labels after the control | met | `Field.tsx:117` (`htmlFor={control.id}`, column layout at `Field.tsx:113`). `Checkbox.tsx:140-160` puts the input before its words. Test: `Field.control.test.tsx:44` "is named by the label with no htmlFor and no id". |  |
| `forms/forms` | `aria-invalid` and `aria-describedby` link a control to its hint or error | met | `fieldControl.ts:36-40`. Tests: `Field.control.test.tsx:52` "is invalid and described by the error" and `:72`. |  |
| `forms/forms` | Field text at least 16px on touch screens (no iOS zoom) | met | `density.ts:88` (`pointer-coarse:text-base`), applied to text-entry controls by `density.ts:124` through `control.ts:61`. |  |
| `forms/forms` | Control borders at least 3:1 against the background; visible `:focus-visible` ring | met | `cx.ts:7-8` (`focusRing`). The theme contract holds `border-slate-300` to the UI bar (`packages/themes-shared/src/contrastRules.ts:269-275`). |  |
| `forms/forms` | Input hints: `inputmode` for figures, never `type="number"`; autocorrect off on identifiers | met | `Input.tsx:115-121` (numeric gives `inputMode="decimal"`; the docs at `Input.tsx:18-19` forbid `type="number"`). One gap: SiteSearch sets `spellCheck={false}` but no `autoCorrect`/`autoCapitalize` (`SiteSearch.tsx:143`). |  |
| `forms/forms` | Don't disable textarea resizing | met | `Textarea.tsx:29`: the class list (`control.ts:58-62`) has no `resize-none`. |  |
| `forms/forms` | Hide inputs from view without removing them from the accessibility tree | met | `FileDrop.tsx:40` (`opacity-0` input covering the zone). `Checkbox.tsx:146` keeps the real input with `appearance-none`. |  |
| `forms/forms` | Field, RadioGroup and DateField: show a required marker in the label | missed | Field.tsx:117 draws the label with no required marker and Field has no required prop; RadioGroup.tsx:83 and DateField's label are the same. | HC-565 |
| `forms/forms` | Checkbox and Radio: a hit target of at least 44px | missed | Checkbox.tsx:12-14 and :132: the box is 14-20px and its inline-flex label sets no minimum height; RadioGroup.tsx:17-19 and :167 the same. Also ui-components/checkbox. | HC-566 |
| `forms/forms` | SiteSearch: wrap the field in a <search> landmark and turn off autocorrect and autocapitalize | missed | SiteSearch.tsx:136 wraps the field in a plain div; SiteSearch.tsx:143 sets spellCheck={false} but no autoCorrect/autoCapitalize. | HC-567 |
| `forms/forms` | Dialog form: move focus to the first invalid field after a failed submit | missed | Dialog.tsx:222-227: the noValidate form's submit handler moves no focus to the first aria-invalid field or an error summary. Also accessibility/accessible-error-announcement. | HC-568 |
| `forms/ime-safe-enter-submit` | Enter-to-send in a textarea checks `isComposing` and keyCode 229 | met | `ChatComposer.tsx:19-21` and `:78`. Test: `ChatComposer.test.tsx:45` "leaves Enter to an IME during composition". |  |
| `forms/ime-safe-enter-submit` | Keep an explicit submit button | met | `ChatComposer.tsx:111-112` (`type="submit"`). |  |
| `forms/ime-safe-enter-submit` | SiteSearch: skip Enter-to-open while an IME is composing | missed | SiteSearch.tsx:112-114 acts on Enter with no isComposing / keyCode 229 check (ChatComposer.tsx:19-21 already does it). | HC-572 |
| `forms/required-field-feedback` | Error state for an empty required field only after interaction or a submit | met | Nothing styles `:invalid`. Controls turn red only through `aria-invalid` (`control.ts:62`), which is set only from a passed `error` (`fieldControl.ts:40`). Test: `Field.control.test.tsx:62`. |  |
| `forms/required-field-feedback` | Keep the submit button enabled so the browser flags empty required fields | missed | `Button` disables only on `disabled` or `busy` (`Button.tsx:367`), but FieldDialog.tsx:85-89 disables its submit while the field is empty and ChatComposer.tsx:111-115 disables send on empty text; Dialog.tsx:222 puts noValidate on the form. | HC-636 |
| `forms/required-field-feedback` | Field, Checkbox and Switch errors: mark the error with an icon or Error text, not colour alone | missed | Field.tsx:14-19 renders the error as red text only; labelWords.tsx:26-31 (Checkbox, Switch) the same. | HC-569 |
| `forms/select-menu-interaction` | A required select starts on an empty, disabled placeholder option | met | `Select.tsx:12-19` and `:57-60`: an item may be `{ value: "", disabled: true }`, and `required` passes through to the `<select>`. |  |
| `forms/switch` | Binary toggle with switch semantics, keyboard access and a visible focus ring (native `switch` attribute is above the floor) | met | Same outcome for assistive tech: `Switch.tsx:109-121` is a `<button role="switch" aria-checked>` with `focusRing`. The docs send form values to `Checkbox` instead (`Switch.tsx:197-198`). |  |
| `forms/switch` | Theme the on state, at 3:1 or better | met | `Switch.tsx:24` uses the palette accent, which every theme remaps (the on track is `border-violet-600 bg-violet-600`, held to 3:1 by the accent control edge rule, `packages/themes-shared/src/contrastRules.ts:113`). |  |
| `forms/switch` | Thumb motion respects reduced-motion | met | `Switch.tsx:133` (`motion-reduce:transition-none`). |  |
| `forms/validate-input-after-interaction` | List the error in `aria-describedby` only while invalid, after the hint | missed | Only while invalid holds (`Field.tsx:40-42`), but the error id replaces the hint id instead of following it (`Field.control.test.tsx:72-79`). | HC-637 |
| `forms/validate-input-after-interaction` | Keep the hint or rules visible while editing | missed | `Field.tsx:14-20` draws the error in place of the hint, and `Field.control.test.tsx:72-79` asserts the hint is gone. | HC-637 |
| `forms/validate-input-after-interaction` | Text controls and Select: a user-invalid edge for native constraint failures | missed | control.ts:62 styles only aria-invalid:, so a control failing native required or pattern gets no red edge after the user interacts (:user-invalid is Baseline). Also forms/select-menu-interaction (Select.tsx:51-55). | HC-570 |
| `ui-components/checkbox` | Keep the real input; custom look via `appearance: none` with a `:focus-visible` ring | met | `Checkbox.tsx:140-148` (`appearance-none`, `focusRing`). |  |
| `ui-components/checkbox` | Checkbox: an indeterminate (mixed) look for select-all groups | missed | Checkbox.tsx:31 draws the tick only on group-has-checked; nothing draws :indeterminate, so a mixed box looks empty. Also ui-components/checkbox-group. | HC-574 |
| `ui-components/checkbox` | Checkbox and Radio: cursor-not-allowed when disabled | missed | Checkbox.tsx:135 and RadioGroup.tsx:169 give a disabled control cursor-default; Switch.tsx:81 already uses not-allowed. | HC-575 |
| `ui-components/checkbox-group` | Group under a named fieldset | met | `Fieldset.tsx:6-12`, `:37-42`. |  |

### Overlays, menus, tooltips, toasts and copy

| Guide | Recommendation | Verdict | Evidence or gap | Ticket |
| --- | --- | --- | --- | --- |
| `ui-atoms/position-aware-tooltips` | Reset popover `inset`/`margin` only where anchor positioning works | met | `inset:auto;margin:0` (`Tooltip.tsx:26`) applies only on the enhanced path (`:209`) |  |
| `ui-atoms/position-aware-tooltips` | A tooltip must not obscure the next focused control (WCAG 2.4.11) | met | Blur clears it (`Tooltip.tsx:170-174`); Tooltip.test "closes on blur" |  |
| `ui-atoms/position-aware-tooltips` | Flip a directional arrow with `@container anchored(fallback)` | n/a | Tooltip draws no arrow (`Tooltip.tsx:28-29` CHIP) |  |
| `ui-atoms/viewport-aware-dropdowns` | The panel flips at viewport edges instead of being clipped | met | Anchor positioning is newer than the floor; RAC collision flip on Menu (`Menu.tsx:161`), and the portal goes into an enclosing dialog (`Menu.tsx:80-89`; e2e "Menu in a Dialog opens in view") |  |
| `ui-atoms/viewport-aware-dropdowns` | Logical placement keywords for RTL | met | `Menu.tsx:161` `"bottom end"` (logical `end`) |  |
| `ui-atoms/viewport-aware-dropdowns` | `aria-haspopup`/`role="menu"` only with the full keyboard contract | met | Menu is a full ARIA menu with arrow, Home/End and typeahead (Menu.test rows above) |  |
| `ui-behaviors/animate-to-from-top-layer` | Transition `overlay` and `display` with `allow-discrete` | met | `Dialog.tsx:25`, `Drawer.tsx:11`, `Lightbox.tsx:18` (`transition-[...,overlay,display] transition-discrete`) |  |
| `ui-behaviors/animate-to-from-top-layer` | Entry state through `@starting-style`, with the backdrop animated too | met | `starting:open:opacity-0` and `starting:open:backdrop:opacity-0` (`Dialog.tsx:25`) |  |
| `ui-behaviors/animate-to-from-top-layer` | A reduced-motion version | met | `motion-reduce:transition-none` (`Dialog.tsx:25`); e2e `modal-exit.spec.ts` "Dialog: with reduced motion it closes at once" |  |
| `ui-behaviors/animate-to-from-top-layer` | Keep the element mounted until the exit animation ends | met | `modal.ts:6-7` waits on `getAnimations`; Dialog.test "calls onClose only after the exit transition has ended" |  |
| `ui-behaviors/declarative-dialog-popover-control` | Opening a popover leaves focus where it was | met | Tooltip calls `showPopover()` and never moves focus (`Tooltip.tsx:85`); Tooltip.test "closes on Escape and keeps the focus on the button" |  |
| `ui-behaviors/declarative-dialog-popover-control` | Open dialogs and popovers with `command`/`commandfor` | n/a | Invoker commands are newer than the Safari 18.4 floor, and the React component owns open state (it opens on mount, `modal.ts:29`) |  |
| `ui-behaviors/interest-triggered-tooltips` | Top-layer popover, anchored above the trigger with a flip | met | `Tooltip.tsx:26` `position-area:top;position-try-fallbacks:flip-block`, `popover="manual"` at `:231` |  |
| `ui-behaviors/interest-triggered-tooltips` | Feature-detect it and keep a working fallback | met | `Tooltip.tsx:209` keeps the native `title` when the API is missing; Tooltip.test "keeps the native title when the browser lacks anchor positioning" |  |
| `ui-behaviors/interest-triggered-tooltips` | Escape dismisses it without moving focus (WCAG 1.4.13) | met | `Tooltip.tsx:177-180`; e2e `tooltip.spec.ts` "an IconButton's hover tooltip closes on Escape with the pointer still over it" |  |
| `ui-behaviors/interest-triggered-tooltips` | Hoverable: the pointer can move onto the tooltip | met | The popover padding acts as a bridge (`Tooltip.tsx:24-26`), and `leave()` at `:132-136` keeps it open on the tooltip |  |
| `ui-behaviors/interest-triggered-tooltips` | Opens on keyboard focus as well as hover, and closes on blur | met | `Tooltip.tsx:163-174`; e2e `tooltip.spec.ts` "a blocked Button shows its reason on keyboard focus...Escape hides it"; Tooltip.test "closes on blur" |  |
| `ui-behaviors/light-dismiss-a-dialog` | Light dismiss on a backdrop click (`closedby="any"`) | met | `closedby` is newer than the floor; the same result comes from `useBackdropClose` (`modal.ts:53`), tested by Dialog.test "closes on a click on the backdrop, which is a click on the `<dialog>` itself" and "stays open when a press began inside..." |  |
| `ui-behaviors/light-dismiss-a-dialog` | Inner widgets take Escape before the dialog does | met | e2e `menu.spec.ts` "Menu in a Dialog opens in view, picks an item and Escape closes only the menu" |  |
| `ui-behaviors/platform-controls-dismiss-dialog` | Use a modal dialog so Esc and the back gesture close it natively | met | `modal.ts:29` `showModal()`; Dialog.test "calls onClose when the dialog closes (Esc and form method=dialog fire the same event)" |  |
| `ui-behaviors/platform-controls-dismiss-dialog` | Escape in a nested popup does not also close the dialog | met | e2e `menu.spec.ts` (Menu in a Dialog); `AppShellMenu.tsx:97-104` ignores an Escape that comes from inside a dialog |  |
| `ui-behaviors/prevent-page-scroll-under-modal-dialog` | Do not lock scroll with `overflow: hidden` on html/body | met | No body scroll lock anywhere in `packages/ui-react/src` (rg found none) |  |
| `ui-behaviors/prevent-page-scroll-under-modal-dialog` | Dialog, Drawer and Lightbox: overscroll-behavior: contain so a scroll inside does not chain to the page | missed | No overscroll rule on Dialog (Dialog.tsx:25, body :42), Drawer (Drawer.tsx:11, body :78) or Lightbox (Lightbox.tsx:18). | HC-579 |
| `ui-components/context-menu` | Trigger target at least 24x24 px | met | `IconButton.tsx:22` sm is `size-6.5` (26px) |  |
| `ui-components/context-menu` | ListRow: keep a row's Menu trigger visible instead of revealing it on hover | missed | ListRow.tsx:67 (revealOnHover) hides row actions, a Menu trigger among them, at opacity-0 until hover or focus on a fine pointer. | HC-582 |
| `ui-components/context-menu` | Right-click opens a context menu | n/a | The library has no context-menu component |  |
| `ui-components/copy-button` | `type="button"` so it never submits a form | met | `CopyButton.tsx:53`; CopyButton.test "is type=button, so it does not submit the form it sits in" |  |
| `ui-components/copy-button` | Live region outside the button, empty until a copy | met | `CopyButton.tsx:98-106`; CopyButton.test "is named by its label and announces nothing before a click" and "copies its text on a click, announces copied, and keeps its name" |  |
| `ui-components/copy-button` | Do not disable the button while the feedback shows | met | `CopyButton.tsx:63-81` never sets `disabled`; a second copy restarts the run (`:84` key) |  |
| `ui-components/copy-button` | CopyButton: show and announce a failed copy | missed | CopyButton.tsx:70 swallows the rejected clipboard write on purpose ("a denied write is not an error the page can act on"); the user gets no feedback (CopyButton.test "announces nothing when the clipboard refuses the write"). | HC-586 |
| `ui-components/copy-button` | CopyButton: clear the status text when the copied state ends | missed | CopyButton.tsx:77 fills the live region and nothing clears it; only the visual label resets (:86). | HC-587 |
| `ui-components/copy-button` | CopyLine: name what its copy button copies instead of a bare "Copy" | missed | CopyLine.tsx:22 renders CopyButton with the default label "Copy" and has no prop to name the content, so several on a page cannot be told apart. | HC-588 |
| `ui-components/copy-button` | CopyButton: a 24x24px minimum target | missed | CopyButton.tsx:11 is px-1.5 py-0.5 text-xs (about 20px tall) with no minimum size. | HC-589 |
| `ui-components/dialog` | Native `<dialog>` opened with `showModal()`, no `role`/`aria-modal` | met | `Dialog.tsx:174`, `modal.ts:29`; Dialog.test "opens as a modal on mount" |  |
| `ui-components/dialog` | Name the dialog by its visible title | met | `Dialog.tsx:177` `aria-labelledby={titleId}`; Drawer `Drawer.tsx:62` |  |
| `ui-components/dialog` | Focus the first useful control on open | met | `FieldDialog.tsx:97` `autoFocus` |  |
| `ui-components/dialog` | Style `::backdrop` | met | `Dialog.tsx:25` `backdrop:bg-slate-900/35`, also on Drawer `Drawer.tsx:11` |  |
| `ui-components/dialog` | Dialog: a built-in visible close button, and SiteSearch gets one | missed | Dialog has no close control of its own; closing depends on the optional footer (Dialog.tsx:90). SiteSearch.tsx:254 opens a Dialog with no footer, so Esc or the backdrop is the only way out. Also ui-behaviors/light-dismiss-a-dialog. | HC-578 |
| `ui-components/hovercard` | Hover card with `interestfor` / `popover="hint"` | n/a | The library has no hover card, and `interestfor` is newer than the floor |  |
| `ui-components/menu` | Trigger has `aria-haspopup` and a name | met | Menu.test "is a closed button named by its label, with aria-haspopup" |  |
| `ui-components/menu` | Arrow keys, Home, End and typeahead | met | Menu.test "moves with the arrows, wrapping, and with Home and End" and "moves to the item a typed letter starts" |  |
| `ui-components/menu` | Escape closes the menu and returns focus to the trigger | met | Menu.test "closes on Escape, running nothing"; e2e `menu.spec.ts` "the keyboard opens it, chooses an action and returns focus" |  |
| `ui-components/menu` | Place the menu below the trigger and flip at the edges | met | Anchor positioning is newer than the floor, so the JS equivalent is right: RAC `placement="bottom end"` with flip (`Menu.tsx:161`) |  |
| `ui-components/menu` | Navigation items are real `<a href>` links | met | Menu.test "draws a link item as a menuitem link, external in a new tab" |  |
| `ui-components/menu` | Menu: keep focus on the trigger when a pointer opens it | missed | Menu.tsx:125 moves focus to the first item on a pointer open, on purpose ("as the keyboard's Enter does"); the guide keeps focus on the trigger for a pointer open. Decide which. | HC-581 |
| `ui-components/navigation-drawer` | Modal `<dialog>` with a name, a close button, tap-outside and Esc | met | `Drawer.tsx:59-76`; Drawer.test "closes from the close button, named by closeLabel" and "closes on a click on the scrim" |  |
| `ui-components/navigation-drawer` | Slide animation that respects reduced motion | met | `Drawer.tsx:11` `translate-x-full ... starting:open:translate-x-full motion-reduce:transition-none` |  |
| `ui-components/navigation-drawer` | Drawer: swipe to dismiss on touch | missed | Drawer.tsx has no swipe gesture; on touch only the close button or a scrim tap closes it. | HC-580 |
| `ui-components/navigation-drawer` | Trigger exposes `aria-expanded`/`aria-controls` | n/a | The consumer owns the Drawer's trigger, and Drawer is a form slide-over, not a nav drawer |  |
| `ui-components/persistent-toast-notifications` | Container is a named region, the same one every time | met | `ToastRegion.tsx:114-115`; ToastRegion.test "keeps a named region with an empty status in the page when there are no toasts" |  |
| `ui-components/persistent-toast-notifications` | Persistent by default | missed | A plain toast (neutral, info or positive, with no action) hides after 5s (`ToastRegion.tsx:30`, `:33-36`). | HC-640 |
| `ui-components/persistent-toast-notifications` | A toast that needs action never hides, and any hide pauses while hover or focus is in it | met | Warn, danger and actioned toasts never hide (`ToastRegion.tsx:33-36`), and the hide pauses on `:hover` and `:focus-within` (`ToastRegion.tsx:30`). |  |
| `ui-components/persistent-toast-notifications` | A focusable close button that does not steal focus | met | `ToastRegion.tsx:71-77` IconButton, no autofocus; e2e `toast-region.spec.ts` "a toast with an action stays when the animations finish, and Dismiss removes it" |  |
| `ui-components/persistent-toast-notifications` | A reduced-motion version | met | `ToastRegion.tsx:30` `prefers-reduced-motion` swaps the fade for a discrete keyframe |  |
| `ui-components/persistent-toast-notifications` | ToastRegion: announce only a toast's text, plus "Actions available" when it has actions | missed | ToastRegion.tsx:121-134: the role="status" live region wraps the whole toast, buttons included, and nothing says "Actions available". | HC-583 |
| `ui-components/persistent-toast-notifications` | ToastRegion: move focus to the next toast or back when a focused toast is dismissed | missed | ToastRegion.tsx:76 only calls onDismiss; the toast unmounts and focus falls to body. No test covers focus. | HC-584 |
| `ui-components/persistent-toast-notifications` | ToastRegion: hold toasts back while a modal Dialog or Drawer is open | missed | ToastRegion.tsx:88-89 says a toast sits under the modal until it closes, but nothing holds it back: a positive toast's hide runs out unseen behind the modal. | HC-585 |

### CSS, theming, accessibility, motion and media

| Guide | Recommendation | Verdict | Evidence or gap | Ticket |
| --- | --- | --- | --- | --- |
| `accessibility/accessibility` | Show a visible `:focus-visible` outline with an offset | met | `cx.ts:7-8` (`focusRing`) |  |
| `accessibility/accessibility` | Use the native `<dialog>` with `showModal()` for modals | met | `Dialog.tsx:143-145`, `Drawer.tsx:34-36`, `Lightbox.tsx:92-93` |  |
| `accessibility/accessibility` | Link hints and errors with aria-describedby, and set aria-invalid only on error | met | `Field.tsx:44`, `:16` (`role="alert"`) |  |
| `accessibility/accessibility` | Announce dynamic content in a live region | met | `ToastRegion.tsx:122-123`, `ChatThread.tsx:87` |  |
| `accessibility/accessibility` | Give targets at least 24×24 px | missed | `IconButton.tsx:22` meets it (smallest `size-6.5`, 26px), but the Switch sm track is 20px tall (`Switch.tsx:16`), and CopyButton, the Checkbox and Radio boxes and the sort button fall short too (their own rows). | HC-638, HC-566, HC-589, HC-629 |
| `accessibility/accessibility` | AppShell: a skip link to main | missed | AppShell.tsx:374 renders <main> with no skip link before the header. | HC-603 |
| `accessibility/respect-os-text-scale` | Do not set a root font size | met | No `font-size` rule in any `themes/*.css` |  |
| `accessibility/respect-os-text-scale` | Docs and site: opt in to OS text scale with <meta name="text-scale" content="scale"> | missed | apps/hack-cove-site/src/layouts/Base.astro:38 has only the viewport meta, and the README does not mention it. Progressive enhancement: unsupported browsers ignore it. | HC-604 |
| `accessibility/respect-os-text-scale` | Badge and Button count: a min-height that grows with text instead of a fixed h-4 | missed | Badge.tsx:40 and Button.tsx:92 fix h-4 with px text, so scaled text overflows. | HC-605 |
| `css/animate-to-intrinsic-sizes` | Animate open and close to `auto` with interpolate-size, as an enhancement | n/a | No component animates to an intrinsic size; Disclosure opens instantly (`Disclosure.tsx:15`) |  |
| `css/child-state-based-styling` | Style a container from a child's state with `:has()` | met | `FileDrop.tsx:33`; also used in Checkbox, RadioGroup, ListRow and InputShell |  |
| `css/css` | Use native nesting and modern selectors, not preprocessor patterns | met | `FileDrop.tsx:33` (`has-focus-visible:`, `has-aria-invalid:`) |  |
| `css/css` | Use `@starting-style` and discrete transitions for entry and exit | met | `Dialog.tsx:25` (`transition-discrete`, `starting:open:opacity-0`) |  |
| `css/css-layout` | Use dynamic viewport units for full-height overlays | met | `AppShellMenu.tsx:124` (`max-h-[calc(100dvh-…)]`) |  |
| `css/css-layout` | Contain scroll chaining in scrolling panels | met | `AppShellMenu.tsx:124`, `BottomSheet.tsx:251` (`overscroll-contain`) |  |
| `css/css-layout` | Let flex children shrink (`min-w-0` / `min-h-0`) | met | `BottomSheet.tsx:251` (`min-h-0 flex-1`) |  |
| `css/design-token-reactivity` | Switch tokens by context; the selector fallback is fine below the floor | met | Every palette utility is remapped under the theme's scope class (`themes/catppuccin-mocha.css:24-25`), so style queries are not needed |  |
| `css/responsive-design` | Use rem breakpoints, not px | met | No `min-[…px]` breakpoints in `packages/ui-react/src`; Tailwind v4's `md:` etc. are rem |  |
| `css/responsive-design` | Respect safe-area insets on edge-anchored UI | met | `BottomSheet.tsx:28` (`pb-[env(safe-area-inset-bottom)]`) |  |
| `css/size-aware-styling` | Define a container where a component adapts | met | `SegmentedControl.tsx:138` (`@container`), `:43` (`@max-[32rem]:flex-wrap`) |  |
| `css/size-aware-styling` | FormGrid and FormRow: change layout by container width, not the viewport | missed | FormRow.tsx:27 (FormGrid) and FormRow.tsx:60 (FormRow) switch at the viewport's md, even inside a narrow Dialog or Drawer. | HC-590 |
| `performance/lazy-load-video-and-audio` | Provide captions and controls; avoid eager preload | met | `Video.tsx:21` (`controls preload="metadata"`), `:22` (`<track kind="captions">`) |  |
| `performance/lazy-load-video-and-audio` | Video: reserve its size with an aspect or width and height | missed | Video.tsx:21 is w-full with no size or aspect reserved, so it shifts layout when it loads. | HC-610 |
| `performance/lazy-load-video-and-audio` | Video: loading="lazy" for off-screen video | missed | Video.tsx:21 has no loading attribute. Browsers without it load eagerly as now. | HC-611 |
| `performance/optimize-image-priority` | Reserve the image's space to avoid layout shift | met | `Image.tsx:19-24`, `:98-99` (aspect reserved, including the placeholder) |  |
| `performance/optimize-image-priority` | Image: pass fetchpriority for the LCP picture | missed | Image.tsx:88-89 types its props as Passthrough (aria, data, id), so fetchpriority cannot reach the img. | HC-608 |
| `performance/optimize-image-priority` | Image: lazy-load pictures below the fold | missed | Image.tsx:165-172 sets no loading="lazy", and the skeleton's own loading prop shadows the native attribute name. | HC-609 |
| `security/sanitize-untrusted-html` | Never insert untrusted HTML unsanitised (`setHTML`, or DOMPurify as a fallback) | met | Markdown renders React nodes only, with no `dangerouslySetInnerHTML`: `Markdown.tsx:5-6` |  |
| `security/sanitize-untrusted-html` | Feature-detect the Sanitizer API | n/a | The library never inserts HTML strings, so there is nothing to sanitise |  |
| `ui-atoms/component-specific-light-dark-theme` | Keep a fixed-colour surface fixed in every theme | met | `Image framed`: a white mat in every theme (`Image.tsx:83-85`) |  |
| `ui-atoms/component-specific-light-dark-theme` | Lightbox: color-scheme: dark, so native video controls match its black ground | missed | Lightbox.tsx:18 is always bg-black/90 text-white with no color-scheme, so native controls stay light in a light theme. | HC-599 |
| `ui-behaviors/motion` | Animate only opacity and transform | missed | BottomSheet transitions `height` on every snap (`BottomSheet.tsx:28`). | HC-639 |
| `ui-behaviors/motion` | Keep the final state when motion is reduced | met | `NavigationProgress.tsx:14` (`width:100%; animation:none`), `ToastRegion.tsx:30` (`hc-toast-cut`) |  |
| `ui-behaviors/motion` | Hero: a pause control for the drifting glow | missed | Hero.tsx:15 loops the glow forever (41-67s) with no pause; WCAG 2.2.2 asks for one on motion over 5s. | HC-606 |
| `ui-behaviors/same-document-transitions` | Feature-detect `startViewTransition` and skip it under reduced motion | met | `PageFade.tsx:61-64` |  |
| `ui-behaviors/same-document-transitions` | Quiet the `::view-transition-*` animations under reduced motion | met | `PageFade.tsx:12`, `Morph.tsx:28` |  |
| `ui-behaviors/same-document-transitions` | Keep transition names few and temporary | met | A name applies only while near the screen: `Morph.tsx:26`, `:134` |  |
| `ui-behaviors/same-document-transitions` | startPageTransition: move focus to the new view | missed | PageFade.tsx:60-68 neither moves focus nor documents who should. | HC-607 |
| `ui-components/dark-mode-toggle` | Hide the inactive option with `display:none` | met | `ColourSchemeToggle.tsx:52-66` (CSS rules), `:152-157` (sr-only names) |  |
| `ui-components/dark-mode-toggle` | ColourSchemeToggle: a system choice that clears the stored value | missed | ColourSchemeToggle.tsx:143-145 and colourScheme.ts:62-68 store every click; there is no way back to following the system. | HC-600 |
| `ui-components/dark-mode-toggle` | ColourSchemeToggle: sync the scheme across tabs through the storage event | missed | ColourSchemeToggle.tsx:70-74 observes only the html class. | HC-601 |
| `ui-components/dark-mode-toggle` | Colour scheme: follow the system with JavaScript off | missed | The scheme is a class an inline script sets (colourScheme.ts:74); with JS off a page gets one scheme whatever the system says (themes/catppuccin-mocha.css:24-25). | HC-602 |
| `user-experience/preference-aware-ui` | Honour `prefers-color-scheme` when nothing is stored | met | `colourScheme.ts:57` (`readColourScheme`: stored value, else system) |  |
| `user-experience/preference-aware-ui` | Honour `prefers-reduced-motion` on every animation | met | `skeleton.tsx:91` (`motion-safe:animate-pulse`), `NavigationProgress.tsx:14`, `Switch.tsx:133`, `ToastRegion.tsx:30` |  |
| `visual-design/browser-ui-theming` | Theme the scrollbar with `scrollbar-color` | met | `cx.ts:26-27` |  |
| `visual-design/browser-ui-theming` | Docs site: theme-color follows the active scheme | missed | apps/hack-cove-site/src/layouts/Base.astro:44 fixes theme-color at dark #181825 while the site switches to light. | HC-594 |
| `visual-design/browser-ui-theming` | Themes: remap ::selection in every theme | missed | No ::selection rule in any themes/*.css. | HC-595 |
| `visual-design/color` | Hold text to AA and UI parts to 3:1 in every theme | met | `themes/themes.test.ts:165` "meets the contrast contract…"; `packages/themes-shared/src/contrastRules.ts:13-15` |  |
| `visual-design/color` | Keep state colours distinguishable | met | `themes/themes.test.ts:171` "meets the distinction contract…" |  |
| `visual-design/color` | Themes and components: forced-colors and prefers-contrast support | missed | No forced-colors or prefers-contrast rule in any theme or component. Fills that carry meaning (ProgressBar, the pill Tab, the SortableList drop marker) vanish in forced colours. | HC-593 |
| `visual-design/contrast-color` | Pick readable text over dynamic backgrounds with `contrast-color()` | n/a | Above the Aug 2026 floor, and no background is dynamic: every fill/ink pair is fixed per theme and tested (`themes/themes.test.ts:165`) |  |
| `visual-design/customize-scrollbar-color-and-thickness` | Give the thumb ≥3:1 against its track | met | The thumb is `text-slate-400` (`cx.ts:27`), which is held to 4.5:1 (`packages/themes-shared/src/contrastRules.ts:263-267`) |  |
| `visual-design/customize-scrollbar-color-and-thickness` | themedScrollbar: drop scrollbar-width: thin or give it a wider fallback | missed | cx.ts:27 sets [scrollbar-width:thin] on code, ScrollStrip and ChatThread. | HC-598 |
| `visual-design/dark-mode` | Declare `color-scheme` for each theme | met | `themes/catppuccin-mocha.css:25`; each of the other six theme files declares its own |  |
| `visual-design/dark-mode` | Tint native controls with `accent-color` | n/a | No component shows a native checkbox, radio, range or progress: Checkbox and Radio are drawn in the accent (`Checkbox.tsx:31`, `RadioGroup.tsx:183`). The themes remap the `accent-*` utility (`themes/catppuccin-mocha.css:217-219`) only for a consumer that uses it. |  |
| `visual-design/dark-mode` | README Light and dark: tell consumers to add <meta name="color-scheme"> | missed | packages/ui-react/README.md:454-476 leaves out the meta; only the site has it (apps/hack-cove-site/src/layouts/Base.astro:43). | HC-591 |
| `visual-design/dark-mode` | colourScheme: follow an OS scheme change live when no choice is stored | missed | colourScheme.ts:50-53 reads matchMedia once; there is no change listener. | HC-592 |
| `visual-design/typography` | Cap the line length of prose | met | `typography.tsx:504` (`max-w-[72ch]`), `PageHeader.tsx:41` |  |
| `visual-design/typography` | Use unitless or relative leading | met | `typography.tsx:494` (`text-base/6`, `/7`) |  |
| `visual-design/typography` | Badge, Pill, Button and code blocks: rem font sizes instead of px | missed | text-[10px], text-[11px], text-[12.5px] at Badge.tsx:40, Pill.tsx:94, CodeBlock.tsx:64, Button.tsx:92, CopyLine.tsx:6, CodeBody.tsx:70. | HC-596 |
| `visual-design/typography` | Typography: text-wrap balance on headings and pretty on prose | missed | No text-balance or text-pretty anywhere; heading scale at typography.tsx:313-317. | HC-597 |

### Navigation, content, tables and lists

| Guide | Recommendation | Verdict | Evidence or gap | Ticket |
| --- | --- | --- | --- | --- |
| `ui-atoms/custom-list-markers` | Plain lists use native `list-style` markers | met | `BulletList.tsx:21` (`list-disc`/`list-decimal`). |  |
| `ui-atoms/custom-list-markers` | Custom markers are CSS `::before` and counters, with list semantics kept | met | `Steps.tsx:24,63,83` (a `counter(step)` marker that is `aria-hidden`, and `role="list"` on the `list-none` `<ol>`). |  |
| `ui-atoms/icons` | Inline SVG in `currentColor`, decorative by default, `role=img` plus a name when it carries meaning | met | `Icon.tsx:63`. `icons.tsx:229` (`stroke="currentColor"`). |  |
| `ui-atoms/icons` | Icon-only controls have an accessible name | met | `IconButton.tsx:41` (`label: string` is required) and `128,152` (`aria-label`). |  |
| `ui-atoms/icons` | Icons stay visible in forced colors | met | Stroked with `currentColor` (`icons.tsx:229`), so they follow the forced text colour. No mask or background is used. |  |
| `ui-atoms/responsive-table` | Semantic `table`/`thead`/`th` with a caption that names the table | met | `Table.tsx:66-67` (an sr-only `<caption>`). `TableCells.tsx:74` (`scope="col"`). |  |
| `ui-atoms/responsive-table` | Table: row headers (th scope=row) | missed | TableCells.tsx:74 hard-codes scope="col"; no cell can be a row header. | HC-628 |
| `ui-atoms/responsive-table` | Table: the scroll wrapper is a named, focusable region | missed | Table.tsx:60-65: the overflow-x-auto div has no role, name or tabindex, so a keyboard cannot scroll a wide table. | HC-554 (open) |
| `ui-atoms/responsive-table` | Table: stack rows by container width, not the viewport | missed | Table.tsx:62 only scrolls sideways (overflow-x-auto) and never stacks; HC-269 asks for a stacked mode, which this guide would switch by container width. | HC-269 (open) |
| `ui-atoms/scrollability-affordance-hints` | A horizontal row fades at the edge that has more content | met | `AppShell.tsx:93-97` and `scrollEdges.ts:14-39`. Using `scroll` and `ResizeObserver` is the guide's own fallback, since scroll-state queries are above the floor. |  |
| `ui-atoms/scrollability-affordance-hints` | A keyboard-scrollable strip keeps a visible scrollbar as the main hint | met | `ScrollStrip.tsx:34-40` (`tabIndex=0`, a named group, `themedScrollbar`). |  |
| `ui-atoms/scrollability-affordance-hints` | AppShell scroll fades: flip for right-to-left | missed | AppShell.tsx:97 uses a physical linear-gradient(to right); there is no :dir(rtl) anywhere in the library. | HC-633 |
| `ui-atoms/single-line-overflow` | Truncate with CSS only; the full string stays in the DOM | met | `TableCells.tsx:277` and `Breadcrumbs.tsx:75` (`truncate` class). |  |
| `ui-atoms/single-line-overflow` | Truncated text: show the full text on focus and hover, not only in title | missed | TableCells.tsx:277 shows a truncated cell's full text only in title; Breadcrumbs.tsx:75 and SortableList.tsx:384 do not reveal it at all. | HC-631 |
| `ui-atoms/single-line-overflow` | AppShell header: the edge fade must not hide focus rings | missed | AppShell.tsx:96-97: the mask fades focus rings at the row's edges; stickyColumn.ts:41-46 already drops its mask on focus-visible. | HC-632 |
| `ui-atoms/state-aware-sticky-headers` | Stuck styling is progressive: the default look works when stuck | met | `StickyBar.tsx:20`: the bar always has a fill and a bottom line, so it needs no scroll-state query, which is above the floor. |  |
| `ui-atoms/state-aware-sticky-headers` | No box-model change while stuck, so it cannot flicker | met | `StickyBar.tsx:20` and the `AppShell` header (`AppShell.tsx:216`): the same padding whether stuck or not. |  |
| `ui-behaviors/anchor-positioning-tab-underline` | Selection is also exposed through ARIA, not only drawn | met | `switcher.tsx:223-231` (`aria-selected`). |  |
| `ui-behaviors/anchor-positioning-tab-underline` | Animated underline that slides between tabs | n/a | Anchor positioning is above the browser floor. The static border (`Tabs.tsx:10`) is the guide's own fallback. |  |
| `ui-behaviors/drag-and-drop` | Keyboard reordering: grab with Enter, move with arrows, drop with Enter, cancel with Escape, on a named handle | met | `SortableList.tsx:210,377-380` (react-aria drag, `aria-label={`Reorder ${title}`}`). |  |
| `ui-behaviors/drag-and-drop` | Show a drop marker in the gap rather than shifting the siblings | met | `SortableList.tsx:252-263` (`DropIndicator` line). |  |
| `ui-behaviors/drag-and-drop` | SortableItem: drag by the grip handle only | missed | SortableList.tsx:358: a pointer drags the row itself, title text and meta included. | HC-634 |
| `ui-behaviors/drag-and-drop` | SortableList: animate moves, with none under reduced motion | missed | SortableList.tsx:374: a drag only sets opacity-50; no move animation. | HC-635 |
| `ui-behaviors/responsive-disclosure` | Content stays mounted and only the disclosure folds at small sizes | met | `foldedColumn.tsx:64` renders a `<details>` whose content stays mounted. |  |
| `ui-behaviors/responsive-disclosure` | FoldedColumn and the AppShell nav: fold by container width, not the viewport | missed | foldedColumn.tsx:9-27 FOLD classes are viewport breakpoints; navFold.ts:3 always folds the nav below md. Also ui-components/navbar. | HC-614 |
| `ui-behaviors/search-hidden-content` | Hidden content stays in the DOM and opens when page search finds it | met | `Disclosure.tsx:70` (react-aria `until-found`). `foldedColumn.tsx:64` is a `<details>`, which the browser opens on a search match. |  |
| `ui-behaviors/search-hidden-content` | Tabs: a findable hidden panel (until-found, select the tab on beforematch) | missed | Tabs.tsx:72-73: the caller owns the panels, so page search cannot find text in an inactive tab. | HC-613 |
| `ui-behaviors/sortable-table` | A `<button type=button>` inside the `th`, and `aria-sort` only on the sorted column | met | `tableSort.tsx:56-67` (the button) and `TableCells.tsx:70-75` (`aria-sort` only when sorted). |  |
| `ui-behaviors/sortable-table` | Decorative sort icon (`aria-hidden`, `currentColor`), and the button keeps the column name | met | `tableSort.tsx:34-46`. |  |
| `ui-behaviors/sortable-table` | Table sort button: a 24px minimum target that fills the cell | missed | tableSort.tsx:59-63 is only w-full; the padding sits on the th (tableRow.ts:92), so the hit area is one line of text-xs. | HC-629 |
| `ui-behaviors/sortable-table` | Table: announce each sort in one role=status region | missed | tableSort.tsx:58 only calls onSort; neither Table nor SortButton has a status region. | HC-630 |
| `ui-components/accordion` | Collapsed content stays findable in page search (`hidden="until-found"` plus `beforematch`) | met | `Disclosure.tsx:70`: the panel is react-aria's `DisclosurePanel`. react-aria 3.53.1 `useDisclosure` sets `hidden="until-found"` and opens on `beforematch`. |  |
| `ui-components/accordion` | Expand marker sits beside the label, with no heading inside the summary | met | `Disclosure.tsx:67`: the chevron comes before the label inside the trigger. |  |
| `ui-components/accordion` | Disclosure: animate open and close, with none under reduced motion | missed | Disclosure.tsx:70 opens with no height transition; Chevron.tsx rotates with no transition. interpolate-size as progressive enhancement. | HC-612 |
| `ui-components/accordion` | Disclosure: no padding on the until-found panel while closed | missed | Disclosure.tsx:71: the panel keeps its padding while hidden until found. | HC-321 (open) |
| `ui-components/accordion` | Exclusive groups and an "expand all" control | n/a | The library has no accordion group component, only a single `Disclosure`. |  |
| `ui-components/breadcrumbs` | `nav` around an `ol` | met | `Breadcrumbs.tsx:60-61`. |  |
| `ui-components/breadcrumbs` | Dividers are decorative and hidden from assistive tech | met | `Breadcrumbs.tsx:68-72` (an `aria-hidden` span). |  |
| `ui-components/breadcrumbs` | Breadcrumbs: the current crumb is a link with aria-current="page" | missed | Breadcrumbs.tsx:32,65: the current crumb is plain text on purpose and aria-current sits on the li. | HC-619 |
| `ui-components/breadcrumbs` | Breadcrumbs: never truncate the current crumb; wrap or collapse long trails | missed | Breadcrumbs.tsx:75 truncates every crumb, the current one included, and has no wrap or collapse. | HC-620 |
| `ui-components/card` | Other controls in a stretched-link card stay clickable | met | `cx.ts:17-18` (`liftInteractive`), used at `Card.tsx:73`. |  |
| `ui-components/card` | Card: default the root to article | missed | Card.tsx:300 defaults to section or div; as="article" is opt-in. | HC-623 |
| `ui-components/card` | Link Card: name the link by the heading, not the whole card | missed | Card.tsx:378 gives the overlay link aria-labelledby={cardId}, the whole card, so the link name is every word in it. | HC-624 |
| `ui-components/card` | CardGrid: line up card regions across a row with subgrid | missed | CardGrid.tsx:44: align is only stretch or start; no subgrid rows. | HC-625 |
| `ui-components/content-table` | The current or selected row is exposed, not only filled | met | `Table.tsx:190` (`aria-current` on the selected row). |  |
| `ui-components/content-table` | Table: a sticky header row | missed | Table.tsx:84-86: the thead is not sticky. Also ui-atoms/responsive-table. | HC-627 |
| `ui-components/navbar` | Menu panel caps its height to the viewport (`dvh`) and scrolls | met | `AppShellMenu.tsx:124` (`max-h-[calc(100dvh-var(--app-header))]`, overflow scroll). |  |
| `ui-components/navbar` | AppShell: render the nav once instead of copying it into the phone menu | missed | AppShell.tsx:158-161 (inline nav) and AppShellMenu.tsx:23-48 (the copy). | HC-621 |
| `ui-components/navbar` | AppShell phone menu: popover instead of details/summary | missed | AppShellMenu.tsx:89-120 is a details with a hand-written Escape handler at :97-104; popover gives top layer and light dismiss. | HC-622 |
| `ui-components/progress` | A progress bar exposes role, name and value | met | `ProgressBar.tsx:105-111`: a div with `role=progressbar`, `aria-label` and `aria-valuemin`/`valuemax`/`valuenow`, the same outcome as native `<progress>`. |  |
| `ui-components/progress` | NavigationProgress: slow down under reduced motion instead of showing a full bar | missed | NavigationProgress.tsx:14 sets width:100%;animation:none under reduced motion, which reads as complete. | HC-626 |
| `ui-components/skeleton` | Bones keep the real content's shape, so nothing shifts when it loads | met | `skeleton.tsx:111-131` (`BoneLines` takes the line-height space). |  |
| `ui-components/skeleton` | Bones are hidden from assistive tech, and the region carries one busy label | met | `skeleton.tsx:86-94` (`aria-hidden` bones) and `64-80` (`aria-busy` plus an sr-only "Loading"). |  |
| `ui-components/skeleton` | The pulse stops under reduced motion | met | `skeleton.tsx:91` (`motion-safe:animate-pulse`). |  |
| `ui-components/spinner` | A busy control says it is busy to assistive tech | met | `Button.tsx:122,368`: `aria-busy` plus disabled, with `cursor-progress opacity-85`. |  |
| `ui-components/spinner` | Spinner animation honours reduced motion and forced colors | n/a | The library has no spinner. No component uses `animate-spin`. |  |
| `ui-components/tabs` | Tab semantics, roving tabindex and arrow keys | met | `switcher.tsx:223-231` (`role=tab`, `aria-selected`, roving `tabIndex`) and `150-163` (arrow keys). |  |
| `ui-components/tabs` | Tabs that navigate are links in a `nav` with `aria-current` | met | `switcher.tsx:180-191` and `140`. |  |
| `ui-components/tabs` | Tabs: render the tabpanel and wire aria-controls by default | missed | switcher.tsx:230 sets aria-controls only if the caller passes controls; Tabs.tsx:72-73 ships no tabpanel. | HC-615 |
| `ui-components/tabs` | Tabs: keep a selected tab's width fixed instead of swapping font weight | missed | Tabs.tsx:11: ON adds font-medium, so the row reflows on selection. | HC-616 |
| `ui-components/tabs` | Tabs pill: a selection cue that is not colour alone | missed | Tabs.tsx:36 marks the selected pill with bg-slate-100 only, which forced colours removes. | HC-617 |
| `ui-components/tabs` | Tabs: scroll or fold an overflowing row instead of wrapping | missed | Tabs.tsx:100: UNDERLINE_ROW is flex flex-wrap. | HC-618 |
## Tickets

Every missed row above names its ticket. Filed from this audit:

HC-565, HC-566, HC-567, HC-568, HC-569, HC-570, HC-571, HC-572, HC-573, HC-574, HC-575, HC-576, HC-577, HC-578, HC-579, HC-580, HC-581, HC-582, HC-583, HC-584, HC-585, HC-586, HC-587, HC-588, HC-589, HC-590, HC-591, HC-592, HC-593, HC-594, HC-595, HC-596, HC-597, HC-598, HC-599, HC-600, HC-601, HC-602, HC-603, HC-604, HC-605, HC-606, HC-607, HC-608, HC-609, HC-610, HC-611, HC-612, HC-613, HC-614, HC-615, HC-616, HC-617, HC-618, HC-619, HC-620, HC-621, HC-622, HC-623, HC-624, HC-625, HC-626, HC-627, HC-628, HC-629, HC-630, HC-631, HC-632, HC-633, HC-634, HC-635, HC-636, HC-637, HC-638, HC-639, HC-640.

Already open, cited instead of filed again: HC-554, HC-321, HC-269.
