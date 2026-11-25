# @slashsuite/core

What the UISlash renderers share, so the web components (`@slashsuite/ui-react`) and the native
ones draw the same thing from the same data. Pure TypeScript with no runtime dependencies.

- **Token tables**: each component's class tables (Button's box per size, its look per variant and
  tone). `@slashsuite/ui-react` builds its classes from them, and the native renderer maps the same
  tokens to style objects.
- **Prop types**: the variant, size and tone unions both renderers accept.
- **Story fixtures**: a story as data (`buttonFixtures.Variants`), with the story id both renderers
  shoot it under (`storyId`).
- **The parity manifest** (`parity.json`): the box every renderer must draw for each component and
  size, in logical px, read from the token tables. Its test fails when the file is stale.
- **The native theme generator** (`nativeTheme`): reads a theme's CSS file and writes the
  `<id>.native.json` that `@slashsuite/themes` ships beside it.

`@slashsuite/ui-react` vendors the parts it uses into its own `dist`, so an app on the web does not
install this package. It is for a renderer, not for an app, and is private: it is not published.

License: MIT.
