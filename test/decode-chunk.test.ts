import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gzipSync } from 'node:zlib'

import decodeChunk from '../src/decode-chunk.ts'
import AnatomyEngineError from '../src/anatomy-engine-error.ts'

const BYTES = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])

test('returns an uncompressed chunk as is', async () => {
  const buffer = await decodeChunk(new Response(BYTES), BYTES.length, false)

  assert.deepEqual(new Uint8Array(buffer), BYTES)
})

test('decompresses a chunk served as gzip bytes', async () => {
  const buffer = await decodeChunk(
    new Response(gzipSync(BYTES)),
    BYTES.length,
    true,
  )

  assert.deepEqual(new Uint8Array(buffer), BYTES)
})

test('rejects a chunk of the wrong size', async () => {
  await assert.rejects(
    decodeChunk(new Response(BYTES), BYTES.length + 1, false),
    (error) =>
      error instanceof AnatomyEngineError && error.code === 'chunk-incomplete',
  )
})

test('rejects a failed response', async () => {
  await assert.rejects(
    decodeChunk(new Response(null, { status: 404 }), BYTES.length, false),
    (error) =>
      error instanceof AnatomyEngineError && error.code === 'chunk-unavailable',
  )
})
