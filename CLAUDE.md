# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project type

Pure static site — HTML + CSS + vanilla JS. No `package.json`, no build step, no test framework, no linter. All third-party libraries (Tailwind, Font Awesome, Prism, SortableJS) load from CDNs in `index.html`.

## Running locally

```powershell
npx serve .
```

Opening `index.html` directly via `file://` works for most things but `localStorage` and URL-share features behave more reliably when served over HTTP.

## Deployment

`.github/workflows/pages.yml` deploys to GitHub Pages on every push to `master`. PRs build but do not deploy. There is no preview environment.

## Architecture

Four ES6 classes are instantiated as globals on `window` (`templateManager`, `storageManager`, `commandGenerator`, `panelManager`) by their respective files, then `app.js` orchestrates them. Script load order in `index.html` is significant — `app.js` must come last:

1. `templates.js` → `TemplateManager` — hard-coded preset panel configurations.
2. `storage.js` → `StorageManager` — localStorage persistence, JSON import/export, URL-param share encoding.
3. `generator.js` → `CommandGenerator` — produces the three output formats.
4. `panels.js` → `PanelManager` — renders/edits the panel cards, owns the canonical `panels` array, dispatches `panelsChanged`.
5. `app.js` → `WindowsTerminalGenerator` — top-level controller, theme, keyboard shortcuts, toasts.

Inter-module communication is through a single custom DOM event: `panelManager` fires `document.dispatchEvent(new Event('panelsChanged'))` and `app.js` listens for it to refresh the output panel and the shareable URL. Don't add direct cross-class calls when the event suffices.

### Output format quirk

PowerShell output has **two** generators that must stay in sync:

- `generatePowerShellCommandForDisplay()` — multi-line, used for the on-screen preview.
- `generatePowerShellCommandForClipboard()` — single-line, used by the Copy button.

`app.copyCurrentOutput()` (`app.js`) intentionally bypasses the DOM and re-generates the clipboard variant from the panel data. Editing only one of the two will cause display/clipboard to drift.

### Panel model

The shape stored in `panels[]` and persisted to localStorage:

```js
{ title, directory, commands, color, profile, split, size }
```

`split` is `null` for the first panel (it becomes `wt new-tab`); subsequent panels use `"vertical"` or `"horizontal"` (rendered as `split-pane -V|-H`). `size` is a fraction 0.1–0.9. Max 6 panels (`PanelManager.maxPanels`).

## When making changes

- Match existing style — vanilla JS classes, no modules, no TypeScript, no framework.
- Don't introduce a build step or `package.json` unless the user explicitly asks; the static-deploy workflow assumes the repo root is directly servable.
- When changing PowerShell output, update both display and clipboard generators in `generator.js`.
- When adding a new panel field, it must round-trip through `StorageManager.sanitizePanels`/`validateConfiguration` and the URL-share encoder, or it will be silently dropped on reload.
