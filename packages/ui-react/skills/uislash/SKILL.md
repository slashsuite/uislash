---
name: uislash
description: Builds React pages with UISlash (@slashsuite/ui-react). Use whenever a project has @slashsuite/ui-react installed or the user mentions UISlash.
---

# Build with UISlash

UISlash is a strict React component library. Every component has one right way to use it, and a page is built only from its components configured through props: no `className`, no `style`, no raw `<button>`, `<input>`, `<label>` or `<table>`, no custom CSS.

## Read first

The docs for the installed version ship in the package, as Markdown, under `node_modules/@slashsuite/ui-react/`:

- `agent-docs/llms.txt` is the index: install, the themes and one line per component page. Read it first.
- Then read only the pages your task needs, each at `agent-docs/components/<slug>.md`, like `agent-docs/components/table.md`.
- Don't read `README.md` or the compiled JavaScript in `dist/`. The docs pages and the `.d.ts` types are the API.

## When you're done

Typecheck with `npx tsc --noEmit` and fix what it reports.
