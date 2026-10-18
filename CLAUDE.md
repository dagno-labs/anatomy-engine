# CLAUDE.md

`@dagno/anatomy-engine`, a framework-agnostic 3D engine for human anatomy on the web, built on Three.js. The engine renders and reports; the application that embeds it owns every panel, label and line of copy. Read `README.md` for the API and `docs/model-format.md` for the model it loads.

## Critical rules

- **No interface in the engine.** No DOM besides the canvas, no user-facing copy, no CSS. The engine emits events and positions; the application draws tooltips, labels and panels. Errors carry an `AnatomyEngineError` code, and their messages are for developers.
- **No model data in the repository or the package.** The application serves the model files and their CC BY 4.0 attribution. The playground reads them from `ANATOMY_MODEL_DIR`.
- **Never present the engine as clinical.** It is an educational and visual reference, not a diagnostic or clinical tool.
- **The MIT notice of Human Atlas stays in `LICENSE`.** The engine started from its code.
- **Never auto-commit or auto-stage.** Show changes first.

## Code

- TypeScript in strict mode with `noUncheckedIndexedAccess` and erasable syntax only, so Node runs the sources directly in tests. Relative imports end in `.ts`; the build rewrites them to `.js`.
- No `any`, no `as` except `as const`, no non-null `!`, no suppression comments, no `console.*`. Named constants instead of magic numbers.
- `type`, never `interface`. Files are `kebab-case`; a file named for a function or a class exports it as its default.
- Imports in four groups (vendor, `@dagno/*`, `@/*`, relative), and within a group in the order the code first uses them, not alphabetically.
- No comments by default. A comment stays only for a workaround, a choice that looks like a mistake, a rule nothing enforces, or a directive a tool reads.
- Block statements always, and a blank line around every multi-line block.

## Commands

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
ANATOMY_MODEL_DIR=/path/to/model pnpm dev
```

## Layout

```text
.github/workflows/  CI: lint, type-check, test and build
docs/               The model format
playground/         A development page that drives the engine with plain controls
src/                The engine; index.ts is the public entry point
test/               Node test runner tests of the parts that need no WebGL
```
