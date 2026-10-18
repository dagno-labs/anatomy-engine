import { test } from 'node:test'
import assert from 'node:assert/strict'

import findConcepts from '../src/find-concepts.ts'
import { createModel } from './model-fixture.ts'

test('finds concepts by name, shortest first', () => {
  const names = findConcepts(createModel(), 'Heart').map(
    (concept) => concept.name,
  )

  assert.deepEqual(names, ['heart', 'wall of heart'])
})

test('finds concepts by identifier', () => {
  const ids = findConcepts(createModel(), 'fma9611').map(
    (concept) => concept.id,
  )

  assert.deepEqual(ids, ['FMA9611'])
})

test('returns nothing for a blank query', () => {
  assert.deepEqual(findConcepts(createModel(), '   '), [])
})

test('stops at the limit', () => {
  assert.equal(findConcepts(createModel(), 'heart', 1).length, 1)
})
