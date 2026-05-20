<div align="center">
  <h1>Windows Terminal Multi-Panel Setup Generator</h1>
  <p>Visual editor for Windows Terminal multi-pane setups — drag splitters, edit panes, export as PowerShell, settings.json action, or batch.</p>
  <br>
  <a href="https://ugurcandede.github.io/windows-terminal-multi-panel-setup-generator/"><img src="https://img.shields.io/badge/live%20app-3b82f6?style=flat-square&logo=githubpages&logoColor=white" alt="Live"></a>
  <a href="https://github.com/ugurcandede/windows-terminal-multi-panel-setup-generator/actions/workflows/pages.yml"><img src="https://img.shields.io/github/actions/workflow/status/ugurcandede/windows-terminal-multi-panel-setup-generator/pages.yml?style=flat-square" alt="Build"></a>
  <br>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind 4">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License: MIT"></a>
</div>

## What it solves

Authoring a `wt new-tab … `;` split-pane …` invocation by hand is a chore:
quoting paths, remembering `-V`/`-H`, `--size`, escape rules, and keeping
the equivalent `settings.json` action or `.bat` wrapper in sync. This app
edits the layout visually — drag splitters in a live preview, fill panes
from an inspector, and three output formats stay in sync as you type.

## Live app

[ugurcandede.github.io/windows-terminal-multi-panel-setup-generator](https://ugurcandede.github.io/windows-terminal-multi-panel-setup-generator/)

No install needed — it's a single-page app served from GitHub Pages.
Auto-saves to local storage; share a setup via the URL button.

## Features

- **Visual splitter editor** — drag handles between panes to rebalance
  sizes; right-click a pane to split vertical/horizontal or delete it.
- **Three output formats, kept in sync** — PowerShell (display + single-
  line clipboard variants), Windows Terminal `settings.json` action,
  and a `.bat` file with `wt` PATH detection.
- **Inline validation** — Windows path regex, hex color check, and a
  dangerous-command linter (`rm -rf /`, fork bombs, `curl | bash`, etc.).
- **Templates** — six presets (Full-Stack, DevOps, Testing, Game Dev,
  Data Ops, Mobile) plus user-saved templates in local storage.
- **Undo / redo** — `Ctrl+Z` / `Ctrl+Shift+Z`, 50-step history.
- **Theme + accent** — light/dark/system with six accent colors.
- **Share & roundtrip** — URL share link, JSON file import/export.
- **`settings.json` inject wizard** — 3-step walkthrough with the
  generated action and a copy button.

## Local development

```bash
# 1. Install dependencies (Node 18+).
npm install

# 2. Start the dev server. Vite opens http://localhost:5173.
npm run dev

# 3. Run the unit suite (escape rules, output generators, linter).
npm test
```

## Commands

```bash
npm run dev          # Vite dev server with HMR
npm run build        # tsc -b && vite build → dist/
npm run preview      # Serve the production build locally
npm test             # vitest run — generator + validation unit tests
npm run test:watch   # vitest in watch mode
npm run typecheck    # tsc --noEmit, no build artifacts
```

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite 6 + TypeScript |
| UI | React 18 + Tailwind v4 (CSS-first config) |
| Primitives | `@radix-ui/react-*` (Dialog, Tabs, Select, ContextMenu, Slider) |
| State | Zustand + zundo (undo/redo middleware, partialized to panels) |
| Drag-drop | `@dnd-kit/sortable` (rail reorder) |
| Splitter | `react-resizable-panels` v2 (canvas resize) |
| Syntax | `prism-react-renderer` (theme-aware: dracula / vsLight) |
| Tests | Vitest (`lib/generator/*`, `lib/validation/*`) |
| Deploy | GitHub Pages via `actions/deploy-pages@v4` |

## Layout

```
windows-terminal-multi-panel-setup-generator/
├── .github/workflows/pages.yml          # CI: install → test → typecheck → build → deploy
├── index.html                            # Vite entry — single <div id="root">
├── vite.config.ts                        # base: '/windows-terminal-multi-panel-setup-generator/'
├── vitest.config.ts                      # node env, '@' alias to src/
├── src/
│   ├── main.tsx, App.tsx, index.css     # entry, hook composition, Tailwind tokens
│   ├── types/panel.ts                    # Panel, Profile, SplitDirection + constants
│   ├── components/
│   │   ├── layout/                       # AppShell, TopBar, Footer, ValidationBadge
│   │   ├── editor/                       # LayoutCanvas, PaneNode, PaneContextMenu, useLayoutTree
│   │   ├── inspector/                    # InspectorPanel, Field, ColorPicker, ProfileSelect, SplitControls
│   │   ├── panels-rail/                  # PanelList (dnd-kit Sortable), PanelListItem
│   │   ├── output/                       # OutputTabs, CodeBlock (Prism), CopyButton, ShareUrlButton
│   │   ├── templates/                    # TemplateDrawer, SaveAsTemplateDialog
│   │   ├── modals/                       # InjectWizardDialog, SettingsDialog, ShortcutsDialog, ImportExportButtons
│   │   └── ui/                           # Radix wrappers: Dialog, Tabs, Select, Slider, ContextMenu, Button
│   ├── lib/                              # pure TS — no React/DOM deps, vitest-friendly
│   │   ├── generator/                    # powershell + json + batch + escape utilities
│   │   ├── validation/                   # panel rules + dangerous-command linter
│   │   ├── storage/                      # localStorage (config, settings, user templates) + sanitizer
│   │   ├── share/                        # base64-url panel encoding + file roundtrip
│   │   └── data/                         # preset colors, accents, default templates, common dirs/commands
│   ├── store/                            # editorStore (zundo), settingsStore, templatesStore (persisted)
│   └── hooks/                            # useTheme, useAccent, useAutoSave, useInitialLoad, useKeyboardShortcuts, useValidation
└── tests/                                # vitest — generator/* and validation/* suites
```

## Output samples

```powershell
# PowerShell (clipboard — single line; display variant adds line breaks)
wt new-tab --title "Frontend" --suppressApplicationTitle --startingDirectory "D:\\MyProjects\\frontend" --tabColor "#4ecdc4" pwsh -Command "npm run dev" `; split-pane -V --title "Backend" --suppressApplicationTitle --startingDirectory "D:\\MyProjects\\backend" --tabColor "#ff6b6b" pwsh -Command "npm run start:dev"
```

```json
{
  "command": {
    "action": "multipleActions",
    "actions": [
      { "action": "newTab", "commandline": "pwsh -Command \"cd 'D:\\MyProjects\\frontend'; npm run dev\"", "startingDirectory": "D:\\\\MyProjects\\\\frontend", "tabTitle": "Frontend", "tabColor": "#4ecdc4", "suppressApplicationTitle": true },
      { "action": "splitPane", "split": "vertical", "commandline": "pwsh -Command \"cd 'D:\\MyProjects\\backend'; npm run start:dev\"", "startingDirectory": "D:\\\\MyProjects\\\\backend", "tabTitle": "Backend", "tabColor": "#ff6b6b", "suppressApplicationTitle": true },
      { "action": "moveFocus", "direction": "first" }
    ]
  },
  "name": "Frontend + Backend",
  "icon": "🚀"
}
```

## Keyboard shortcuts

| Keys | Action |
|---|---|
| `Ctrl + N` | Add new panel |
| `Del` | Delete selected panel |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo |
| `Ctrl + S` | Export configuration as JSON |
| `?` | Show shortcuts dialog |
| `Esc` | Close dialog |

## Deploying your own

The workflow at `.github/workflows/pages.yml` runs on every push to
`master`: it installs, tests, typechecks, builds with `npm run build`,
and uploads `dist/` to GitHub Pages.

If you fork to a different repo name, update the `base` in
`vite.config.ts` to match the new repo slug so asset URLs resolve under
the GitHub Pages subpath.

## Notes and limitations

- **Generator preserves the original escape rules** exactly: PowerShell
  quotes double, backticks double, paths get `\\\\` (path normalize +
  JSON.stringify), single-quoted commands inside `pwsh -Command "cd '…'"`
  use `''` doubling.
- **No backwards compatibility with v1 local storage.** v2 uses
  `wt-gen-v2-*` keys; v1 data (`wt-generator-config`, etc.) is left
  untouched but not migrated.
- **`react-resizable-panels` pinned to v2** — v4 renamed exports and
  changed the layout callback shape; v2's `(sizes: number[])` fits the
  panel-id-keyed resize handler cleanly.

## License

MIT — see [LICENSE](LICENSE).
