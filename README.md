<h1><img align="texttop" alt="Dagno Logo" height="40" src="https://raw.githubusercontent.com/dagno-labs/.github/main/assets/logo.svg"> — Anatomy Engine</h1>

Anatomy Engine is a 3D engine for human anatomy on the web, built with Three.js. It loads and renders the BodyParts3D adult male reference model by anatomical system, and gives the application that embeds it control over what is shown: visible systems, selection, isolation, the separation of the model into its pieces, and the camera. It reports what happens in the scene, such as loading progress and the structure under the pointer, and draws no interface of its own: panels, search and labels belong to the application. It is in early development, and nothing is published yet.

It is an educational and visual reference. It is not a diagnostic or clinical tool, and it does not replace the judgment of a healthcare professional.

The model data is not part of the engine. The application serves the [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/) files, © The Database Center for Life Science, with the attribution their [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license requires. Their layout is in [Model format](docs/model-format.md).

## Usage

The engine renders into a container the application sizes, and `three` is a peer dependency.

```ts
import { AnatomyEngine, loadModel } from '@dagno/anatomy-engine'

const model = await loadModel('/anatomy/atlas.json')
const engine = new AnatomyEngine(container, { model, label: 'Human anatomy in 3D' })

engine.on('select', (part) => engine.setSelection([part.id]))
engine.on('error', (error) => console.error(error.code))

engine.setVisibleSystems(['skeletal', 'muscular'])
engine.setExplode(0.5)
engine.setInsets({ left: 320 })
```

- **State:** `setVisibleSystems`, `setSelection`, `setIsolated`, `setExplode` (0 assembled, 1 every piece apart), `setView` (`three-quarter`, `front`, `side`, `back`), `resetView`, `setAutoRotate` and `setInsets`, the space the application's interface covers, which the camera frames around.
- **Events:** `progress`, `ready`, `error`, `select`, `hover` (the part and the pointer position, for a tooltip), `focus` (the part brought forward in the exploded view) and `render`, after each frame, with `projectPart` to place a label on a part.
- **Data:** `findConcepts` searches the model's named concepts, and `SYSTEM_IDS` lists the anatomical systems.
- **Errors:** `AnatomyEngineError` carries a `code`, so the application writes its own messages.
- **Theme:** the background, stage, lights, selection, hover and system colours, through the `theme` option.

`dispose` stops the engine, frees its GPU resources and removes the canvas.

## Development

Node.js 24 and pnpm 12, as pinned in `package.json`.

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
ANATOMY_MODEL_DIR=/path/to/model pnpm dev
```

`pnpm dev` starts the playground in `playground/` with the model in `ANATOMY_MODEL_DIR`, a folder with `atlas.json` and its chunks.

Anatomy Engine is maintained by [Dagno](https://github.com/dagno-labs), a healthcare SaaS platform that helps healthcare professionals deliver intelligent, preventive, and personalized care.
