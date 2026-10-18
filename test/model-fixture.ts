import type { Point, Part, Model } from '../src/model.ts'

export function createPart(id: string, min: Point, max: Point): Part {
  return {
    id,
    name: `Structure ${id}`,
    conceptId: `FMA-${id}`,
    system: 'skeletal',
    chunk: 0,
    positions: 0,
    normals: 0,
    indices: 0,
    vertexCount: 3,
    indexCount: 3,
    bounds: [min, max],
  }
}

export function createModel(): Model {
  return {
    version: 'Test 1.0',
    chunks: [{ url: 'body-0.bin', bytes: 48, gzip: 'body-0.bin.gz' }],
    parts: [
      createPart('femur', [0, 0, 0], [0.05, 0.45, 0.05]),
      createPart('heart', [0, 1.2, 0], [0.12, 1.32, 0.1]),
    ],
    concepts: [
      { id: 'FMA9611', name: 'femur', elements: ['femur'] },
      { id: 'FMA7088', name: 'heart', elements: ['heart'] },
      { id: 'FMA7101', name: 'wall of heart', elements: ['heart'] },
    ],
  }
}
