# Model format

The engine loads a model in two parts: a JSON manifest that describes every part, and binary chunks that hold their geometry. `loadModel` fetches and validates the manifest; `AnatomyEngine` fetches the chunks.

## Manifest

```json
{
  "version": "BodyParts3D 4.0",
  "chunks": [{ "url": "body-0.bin", "bytes": 4019496, "gzip": "body-0.bin.gz" }],
  "parts": [
    {
      "id": "FJ1252",
      "name": "Gingiva of upper jaw",
      "conceptId": "FMA59763",
      "system": "skeletal",
      "chunk": 0,
      "positions": 0,
      "normals": 10596,
      "indices": 15896,
      "vertexCount": 883,
      "indexCount": 4272,
      "bounds": [[-0.035, 1.539, 0.027], [0.034, 1.557, 0.081]]
    }
  ],
  "concepts": [{ "id": "FMA59763", "name": "gingiva of upper jaw", "elements": ["FJ1252"] }]
}
```

- `chunks`: one entry per binary file, with `url`, the uncompressed file, `gzip`, a gzip copy, or both. The engine downloads the gzip copy when the browser has `DecompressionStream`, and otherwise the uncompressed file; a model with only gzip copies fails with `decompression-unavailable` in a browser without it. Both resolve against the manifest URL, so relative names keep a model movable. `bytes` is the uncompressed size, checked after download.
- `parts`: one entry per mesh. `system` is one of `SYSTEM_IDS`. `chunk` indexes `chunks`. `positions`, `normals` and `indices` are byte offsets into the uncompressed chunk. `bounds` is the axis-aligned box of the mesh, `[min, max]`.
- `concepts`: named anatomical concepts. `elements` lists the part ids a concept covers, and a part may belong to several concepts.

Other keys in the manifest are ignored.

## Geometry

Coordinates are in metres, Y up, with the feet at the stage (`y = 0`). For each part, starting at its byte offsets in the uncompressed chunk:

| Data | Type | Count |
| --- | --- | --- |
| Positions | `Float32Array`, x, y, z | `vertexCount × 3` |
| Normals | `Int16Array`, x, y, z, normalized to −1…1 | `vertexCount × 3` |
| Indices | `Uint32Array`, triangles | `indexCount` |

## Systems

`skeletal`, `muscular`, `cardiac`, `sensory`, `arterial`, `venous`, `nervous`, `respiratory`, `digestive`, `urinary`, `lymphatic`, `endocrine`, `reproductive`, `integumentary` and `connective`. The engine hides `integumentary`, the body surface, by default, and does not pick it while any other system is visible.
