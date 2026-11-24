## Steps

Group: Content

When to use: The way into a product: install, log in, run.

### Use instead
- BulletList (bullet-list.md): The items have no order.
- Timeline (timeline.md): The items already happened: a history, each with its time.

### The one right way
`Steps` numbers itself: give each `Step` a `title` and a line of detail, in the order they are done.
```tsx
import { Code, Step, Steps } from "@slashsuite/ui-react";

<Steps aria-label="Get started">
  <Step title="Install the CLI">
    Run <Code>bun add -d pixelslash</Code> in your repo.
  </Step>
  <Step title="Upload a build">
    Run <Code>pixelslash upload</Code>.
  </Step>
</Steps>
```

### Do
- Give each `Step` a `title` and, as its children, one line of detail. A step with only a `title` is fine.
- For things done in order only. Nothing here is done or current, so it is not a progress indicator.
- A list with no order is a `BulletList`.
- In an empty view, put `Steps` inside the `EmptyState` as the "get started" list.
- `size="lg"` is a landing page's way in: two to four steps side by side from `md`, each number at feature size, stacked on a phone. `Step` takes its size from its `Steps`.

### Don't
- Do not type the numbers: `Steps` counts them, so a step can sit behind a condition and the rest still run 1, 2, 3.

Typed numbers double up with the ones `Steps` draws, and drift when a step is added. Leave the numbering to `Steps`.
```tsx
import { Step, Steps } from "@slashsuite/ui-react";

<Steps aria-label="Get started">
  <Step title="1. Install the CLI">Run bun add -d pixelslash in your repo.</Step>
  <Step title="2. Upload a build">Run pixelslash upload.</Step>
</Steps>
```

Numbering features that have no order tells the reader there is a sequence to follow. Use a `BulletList`.
```tsx
import { Step, Steps } from "@slashsuite/ui-react";

<Steps>
  <Step title="Light and dark themes" />
  <Step title="Keyboard shortcuts" />
  <Step title="Email digests" />
</Steps>
```

### Accessibility
- `Steps` is an `<ol role="list">` and each `Step` an `<li>`, so a screen reader announces the list and each step's position.
- The drawn number is `aria-hidden`, so it is not read twice.
- Name the list with `aria-label`.

### Props
### Steps
A numbered list of things to do, in order: a `title` and, under it, a line of `children`. The numbers are counted by CSS, so `Step`s can sit in a fragment or behind a condition and still run 1, 2, 3. For the way into a product ("install, log in, run"), not for progress: nothing here is done or current. A wizard's progress indicator is a different part. `size="lg"` is the steps across a landing page: from `md` they sit side by side in equal columns, each number at feature size over a large title; below `md` they stack. Use it for two to four steps.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- size: "md" | "lg" (default md). `md` a small list down a column; `lg` the steps across a landing page from `md` (two to four).

### Step
One step of `Steps`: a `title` and the `children` as the detail under it, at its `Steps`' size.
- id: string. The root element's `id`: an anchor, or the target of a `for` or an `aria-describedby`.
- title: ReactNode (required). What to do; `children` is the detail under it.

### Types
- StepsSize: `"md" | "lg"`. A `Steps` scale: `md` the small list down a column, `lg` the steps across a landing page.
