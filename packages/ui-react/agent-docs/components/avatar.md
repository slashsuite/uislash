## Avatar

Group: Content

When to use: Marking who did something or who owns something, next to their name.

### Use instead
- Image (image.md): The picture is not a person: a photo, a screenshot or an illustration.

### The one right way
Give the person's full name every time: the same name gets the same colour and initials in every list and header.
```tsx
import { Avatar, Cluster } from "@slashsuite/ui-react";

<Cluster>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Ada Lovelace" size="lg" />
  <Avatar name="Grace Hopper" />
</Cluster>
```

### Do
- Pass the person's full `name`, the same string everywhere: the colour and the initials are worked out from it, so one person looks the same in every list and header.
- `size` is `xs` (16px, for an inline mention in a line of text), `sm`, `md` (default), `lg`, `xl`, `2xl` (64px) or `3xl` (96px); use `sm` or `md` in a row and a larger one at the head of a profile.
- `src` is the person's photo, as a path your app serves. It replaces the initials, and the Avatar never loads an image from another server on its own, so use your own local image. If the photo fails to load, the initials show instead.
- `shape="square"` is for an org, a team or a project, not a person: rounded corners that scale with the size. Round (the default) is a person.
- `onClick` makes the whole Avatar one button, for a profile or an account menu: it is named by `name`, keeps its shape and takes the focus ring. Without it the Avatar is a mark, and a click handler on it would be one no keyboard can reach.
- Several people as one group is an `AvatarStack`, not a row of Avatars.
- Put the person's name beside the Avatar as text; the Avatar is a mark, not a label.

### Don't
The colour comes from the name, so "Ada" in one place and "A. Lovelace" in another read as two different people.
```tsx
import { Avatar, Cluster } from "@slashsuite/ui-react";

<Cluster>
  <Avatar name="Ada" />
  <Avatar name="A. Lovelace" />
</Cluster>
```

An initials Avatar on its own is `aria-hidden`: it names no one to a screen reader. Put the name beside it.
```tsx
import { Avatar } from "@slashsuite/ui-react";

<Avatar name="Ada Lovelace" />

```

### Accessibility
- Initials are drawn in a `<span>` with `aria-hidden="true"` and a `title` of the name, so a screen reader skips them: the name has to be on the page as text.
- With `src` the Avatar is an `<img>` whose `alt` and `title` are the name.
- With `onClick` the Avatar is a `<button type="button">` whose `aria-label` is the name, so the initials need no text beside them to name the button. `onError` still reports a photo that fails to load while the page is live, and the initials take its place; a photo that already failed before the page hydrated shows the initials too, without calling `onError`.
- `aria-*` and `data-*` props go on the root element.

### Props
### Avatar
A person as a round badge of initials, or as their photo when `src` is given; `shape="square"` marks an org or a team instead. It never loads a remote image on its own: that is a request to another server for decoration, and it makes a screenshot depend on the network. `src` is the app's own local path. With `onClick` the whole Avatar is one button, with `href` one link. A row of overlapping avatars is an `AvatarStack`. While `loading` with an empty `name` it is a bone of its size and shape.
- external: boolean. Opens in a new tab: adds `target="_blank"` and `rel="noreferrer"`.
- href: string. Makes the Avatar one link, named by `name`; an in-app path goes through `LinkProvider`.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- loading: boolean. The data is not here yet: an empty slot draws a bone of its shape, a filled one draws as usual.
Left out, the part takes the nearest loading layout's or part's; `false` opts it out inside one.
- loadingLabel: string (default Loading). What a screen reader hears while this part is loading, when its own `loading` is set.
- name: string (required). Whose avatar: its initials, its colour (a hash of the name) and its title or `alt`.
- onClick: MouseEventHandler<HTMLButtonElement>. Makes the Avatar one button, named by `name`: a person who opens their profile or a menu.
Without it (or `href`) the Avatar is a plain mark.
- shape: "round" | "square" (default round). `round` for a person; `square` (rounded corners) for an org or a team, so the two never read
as each other.
- size: "sm" | "md" | "lg" | "xs" | "xl" | "2xl" | "3xl" (default md). `xs` 16px, `sm` 24px, `md` 32px, `lg` 40px, `xl` 56px, `2xl` 64px or `3xl` 96px.
- src: string. The person's photo, a local path. It replaces the initials and is announced as `name`. If it
fails to load, the initials show instead.

### Types
- AvatarShape: `"round" | "square"`. `round` for a person, `square` (rounded corners that grow with the size) for an org or a team.
- AvatarSize: `"sm" | "md" | "lg" | "xs" | "xl" | "2xl" | "3xl"`. An Avatar's size: `xs` 16px, `sm` 24px, `md` 32px, `lg` 40px, `xl` 56px, `2xl` 64px, `3xl` 96px.
