In this React + TypeScript project, write `src/SettingsPage.tsx` that exports a `SettingsPage` component: a project settings page built with `@slashsuite/ui-react` (already installed; Tailwind and the theme are already wired in `src/index.css`).

The page has:
- a "Project name" text field, with the hint "Shown on the dashboard.";
- a "Save" button and a "Cancel" button;
- a "Members" table with the columns Name, Email, Role and Projects (a count), and these rows:
  Ada Lovelace, ada@example.com, Owner, 12; Grace Hopper, grace@example.com, Admin, 7; Alan Turing, alan@example.com, Member, 3.

Use the library's components the way its documentation says. Do not write any styling of your own. Do not change any other file. When it is written, run `npx tsc --noEmit` and make sure it passes.
