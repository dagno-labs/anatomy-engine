import { test } from 'node:test'
import assert from 'node:assert/strict'

import AnatomyEngineError from '../src/anatomy-engine-error.ts'
import { createModel } from './model-fixture.ts'
import parseModel from '../src/parse-model.ts'

function isInvalid(error: unknown) {
  return error instanceof AnatomyEngineError && error.code === 'model-invalid'
}

test('accepts a valid manifest', () => {
  const model = createModel()

  assert.deepEqual(parseModel(JSON.parse(JSON.stringify(model))), model)
})

test('rejects a manifest that is not an object', () => {
  assert.throws(() => parseModel([]), isInvalid)
})

test('rejects a part of an unknown system', () => {
  const model = {
    ...createModel(),
    parts: [{ ...createModel().parts[0], system: 'magic' }],
  }

  assert.throws(() => parseModel(model), isInvalid)
})

test('rejects a part in a chunk the model does not have', () => {
  const model = {
    ...createModel(),
    parts: [{ ...createModel().parts[0], chunk: 3 }],
  }

  assert.throws(() => parseModel(model), isInvalid)
})

test('rejects a concept that names a missing part', () => {
  const model = {
    ...createModel(),
    concepts: [{ id: 'FMA1', name: 'missing', elements: ['nowhere'] }],
  }

  assert.throws(() => parseModel(model), isInvalid)
})
