import { test } from 'node:test'
import assert from 'node:assert/strict'

import { createPart } from './model-fixture.ts'
import createExplodeLayout from '../src/create-explode-layout.ts'

const parts = [
  createPart('a', [0, 0, 0], [0.4, 0.9, 0.1]),
  createPart('b', [0, 0, 0], [0.2, 0.2, 0.1]),
  createPart('c', [0, 0, 0], [0.01, 0.01, 0.01]),
  createPart('d', [0, 0, 0], [0.3, 0.5, 0.1]),
]

test('gives every part its own cell', () => {
  const layout = createExplodeLayout(parts)

  assert.deepEqual([...layout.cells.keys()].sort(), ['a', 'b', 'c', 'd'])
})

test('keeps cells from overlapping', () => {
  const cells = [...createExplodeLayout(parts).cells.values()]

  for (const [index, cell] of cells.entries()) {
    for (const other of cells.slice(index + 1)) {
      const apart =
        Math.abs(cell.x - other.x) * 2 >= cell.width + other.width - 1e-9 ||
        Math.abs(cell.y - other.y) * 2 >= cell.height + other.height - 1e-9

      assert.ok(apart)
    }
  }
})

test('centres the layout on the origin', () => {
  const layout = createExplodeLayout(parts)
  const cells = [...layout.cells.values()]
  const left = Math.min(...cells.map((cell) => cell.x - cell.width / 2))
  const right = Math.max(...cells.map((cell) => cell.x + cell.width / 2))
  const top = Math.max(...cells.map((cell) => cell.y + cell.height / 2))

  assert.ok(Math.abs(left + right) < 1e-9)
  assert.ok(Math.abs(top - layout.height / 2) < 1e-9)
})

test('gives a tiny part the minimum cell size', () => {
  const cell = createExplodeLayout(parts).cells.get('c')

  assert.ok(cell)
  assert.ok(cell.width > 0.07)
  assert.ok(cell.height > 0.07)
})
