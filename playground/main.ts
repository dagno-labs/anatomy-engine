import {
  type View,
  loadModel,
  type SystemId,
  DEFAULT_VISIBLE_SYSTEMS,
  AnatomyEngine,
  SYSTEM_IDS,
} from '../src/index.ts'

const MANIFEST_URL = '/atlas.json'
const TOOLTIP_OFFSET = 14
const VIEWS: readonly View[] = ['three-quarter', 'front', 'side', 'back']

function element<T extends HTMLElement>(id: string, type: new () => T): T {
  const found = document.getElementById(id)

  if (!(found instanceof type)) {
    throw new Error(`The playground is missing #${id}.`)
  }

  return found
}

function isView(value: string): value is View {
  return VIEWS.some((view) => view === value)
}

const status = element('status', HTMLOutputElement)
const model = await loadModel(MANIFEST_URL)
const visible = new Set<SystemId>(DEFAULT_VISIBLE_SYSTEMS)
const engine = new AnatomyEngine(element('stage', HTMLDivElement), {
  model,
  label: 'Human anatomy in 3D',
})
const controls = element('controls', HTMLFormElement)
const tooltip = element('tooltip', HTMLDivElement)
const systems = element('systems', HTMLFieldSetElement)

for (const system of SYSTEM_IDS) {
  const label = document.createElement('label')
  const checkbox = document.createElement('input')

  checkbox.type = 'checkbox'
  checkbox.checked = visible.has(system)
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      visible.add(system)
    } else {
      visible.delete(system)
    }

    engine.setVisibleSystems([...visible])
  })
  label.append(checkbox, ` ${system}`)
  systems.append(label)
}

engine.on('progress', ({ loaded, total }) => {
  status.value = `Loaded ${loaded} of ${total} chunks`
})
engine.on('ready', () => {
  status.value = `${model.parts.length} parts ready`
})
engine.on('error', (error) => {
  status.value = `${error.code}: ${error.message}`
})
engine.on('select', (part) => {
  engine.setSelection([part.id])
  status.value = `Selected ${part.name} (${part.system})`
})
engine.on('focus', (part) => {
  status.value = part ? `Focused ${part.name}` : 'Focus released'
})
engine.on('hover', (detail) => {
  tooltip.hidden = !detail

  if (detail) {
    tooltip.textContent = detail.part.name
    tooltip.style.left = `${detail.x + TOOLTIP_OFFSET}px`
    tooltip.style.top = `${detail.y + TOOLTIP_OFFSET}px`
  }
})

new ResizeObserver(() => {
  engine.setInsets({ left: controls.getBoundingClientRect().right })
}).observe(controls)

element('explode', HTMLInputElement).addEventListener('input', (event) => {
  if (event.currentTarget instanceof HTMLInputElement) {
    engine.setExplode(event.currentTarget.valueAsNumber)
  }
})
element('view', HTMLSelectElement).addEventListener('change', (event) => {
  if (
    event.currentTarget instanceof HTMLSelectElement &&
    isView(event.currentTarget.value)
  ) {
    engine.setView(event.currentTarget.value)
  }
})
element('isolate', HTMLInputElement).addEventListener('change', (event) => {
  if (event.currentTarget instanceof HTMLInputElement) {
    engine.setIsolated(event.currentTarget.checked)
  }
})
element('rotate', HTMLInputElement).addEventListener('change', (event) => {
  if (event.currentTarget instanceof HTMLInputElement) {
    engine.setAutoRotate(event.currentTarget.checked)
  }
})
element('reset', HTMLButtonElement).addEventListener('click', () => {
  engine.resetView()
})
