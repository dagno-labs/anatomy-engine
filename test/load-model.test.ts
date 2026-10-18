import { afterEach, test } from 'node:test'
import assert from 'node:assert/strict'

import { createModel } from './model-fixture.ts'
import loadModel from '../src/load-model.ts'
import AnatomyEngineError from '../src/anatomy-engine-error.ts'

const MANIFEST_URL = 'https://cdn.example.com/anatomy/models/atlas.json'
const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

function serve(response: Response) {
  globalThis.fetch = async () => response
}

test('resolves chunk urls against the manifest url', async () => {
  serve(Response.json(createModel()))

  const model = await loadModel(MANIFEST_URL)

  assert.deepEqual(model.chunks, [
    {
      url: 'https://cdn.example.com/anatomy/models/body-0.bin',
      bytes: 48,
      gzip: 'https://cdn.example.com/anatomy/models/body-0.bin.gz',
    },
  ])
})

test('rejects a manifest that cannot be loaded', async () => {
  serve(new Response(null, { status: 404 }))

  await assert.rejects(
    loadModel(MANIFEST_URL),
    (error) =>
      error instanceof AnatomyEngineError && error.code === 'model-unavailable',
  )
})
