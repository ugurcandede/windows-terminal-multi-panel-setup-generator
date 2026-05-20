# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project type

Vite + React 18 + TypeScript SPA, deployed to GitHub Pages from `dist/`. Tailwind v4 (CSS-first via `@theme` in `src/index.css`). No backend.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build
npm run preview      # serve dist locally
npm test             # vitest run
npm run typecheck    # tsc --noEmit
```

`npm run build` is the gate the GitHub Actions workflow uses; both typecheck and tests must pass first (see `.github/workflows/pages.yml`).

## Architecture

### Layering (one-way dependency: ui → store → lib)

- `src/lib/` — pure TypeScript. No React, no DOM. Tested directly by Vitest. The generator (`lib/generator/*`) and validators (`lib/validation/*`) live here.
- `src/store/` — Zustand stores. Talk to `lib/` and own all mutable state.
- `src/hooks/` — React-only glue: subscribes to stores, applies side effects (theme class on `<html>`, autosave to localStorage, etc.).
- `src/components/` — purely render layer. Pull from stores via hooks; no direct LS / fetch / window writes.

If a feature can be tested without a DOM, it belongs in `lib/`.

### Editor state (zundo)

`editorStore` is wrapped with `temporal` and partialized to `{ panels }`. Selected pane, modal visibility, and other transient UI state stay out of the history — otherwise opening a dialog would get caught by an undo. The 50-step `limit` is hardcoded in the store.

### Layout tree

Panels are stored as a flat array. `src/components/editor/useLayoutTree.ts` derives a binary tree at render time:

- `panels[0]` is the root leaf (the `new-tab`).
- Every later panel wraps the current "last leaf" in a split node whose `children[1]` is always the new leaf. That invariant is what lets `LayoutCanvas` map an rrp `onLayout(sizes)` callback straight to `resizePane(node.panelId, sizes[1] / 100)`.

There is a deliberate naming inversion documented inside `useLayoutTree.ts`: wt `split-pane -V` (panes side by side) corresponds to `react-resizable-panels` `direction="horizontal"` (panels laid out horizontally). When touching either side, keep the comment in sync — this is the project's #1 bug magnet.

### Generator (display ↔ clipboard parity)

`lib/generator/powershell.ts` exposes a single function that returns both `display` (multi-line, with backtick line continuations) and `clipboard` (single-line). They share the same token builder, so they cannot drift — this was a recurring bug in the v1 codebase that the parity test in `tests/generator/powershell.test.ts` now guards.

Magic defaults are intentional and load-bearing:

- `color === '#64748b'` → omit `--tabColor`.
- `size === 0.5` on a split panel → omit `--size`.
- `commands.trim() === ''` → omit `-Command` (an empty `-Command ""` is a syntax error in `pwsh`).

### Storage versioning

Local storage uses `wt-gen-v2-*` keys. There is no migration from v1; v1 data is left in place but not read. If you change the on-disk shape, bump `SCHEMA_VERSION` in `src/lib/storage/keys.ts` — `loadConfig` and friends ignore payloads with a mismatched version, so users will silently get a fresh default rather than a crashed app.

### Validation vs sanitization

These are distinct:

- `lib/storage/sanitize.ts` is for *machine-trusted-but-shape-shaky* input (LS, share URL, import JSON). It coerces values to a valid `Panel` (clamps size, defaults color/profile/split). Never throws.
- `lib/validation/` is for *user-facing* feedback. It returns `Issue[]` with errors and warnings. The UI uses it for inline borders and the topbar badge; it does not block output generation.

### GitHub Pages base path

`vite.config.ts` sets `base: '/windows-terminal-multi-panel-setup-generator/'`. All asset references must go through Vite's import pipeline or `import.meta.env.BASE_URL` — absolute `/favicon.svg`-style hrefs will 404 in production.

If you fork to a different repo, change `base` to match the new slug.

## When changing things

- Touching the generator? Add a vitest case under `tests/generator/`. The escape rules and magic defaults all have explicit coverage; preserve it.
- Adding a panel field? Update three things in lockstep: `types/panel.ts`, `lib/storage/sanitize.ts` (so LS + URL share + file import round-trip), and `lib/share/urlShare.ts` compactPanel/expandPanel (otherwise the field silently disappears through shared URLs).
- Adding a Radix primitive? Wrap it under `src/components/ui/` and re-export — never use `@radix-ui/*` directly from feature components, so the Tailwind class composition stays consistent.
- Bundle is currently around 160KB gzipped. `prism-react-renderer` is the biggest chunk; if you replace it, keep the theme-swap behavior (`useResolvedTheme` → dracula/vsLight) intact.

## Things to avoid

- Don't re-introduce two parallel PowerShell generators (display + clipboard). One token builder, two render passes.
- Don't subscribe to `editorStore` outside `src/store` and `src/hooks`. Components should read via the existing hooks/selectors so we keep the dependency direction one-way.
- Don't add a build step on top of Vite (PostCSS configs, custom Babel). Tailwind v4 is configured CSS-first via `@theme` in `src/index.css`; everything else is Vite defaults.
