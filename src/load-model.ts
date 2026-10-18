import type { Model } from './model.ts'
import AnatomyEngineError from './anatomy-engine-error.ts'
import parseModel from './parse-model.ts'

export type LoadModelOptions = {
  signal?: AbortSignal
}

export default async function loadModel(
  url: string | URL,
  { signal }: LoadModelOptions = {},
): Promise<Model> {
  const response = await fetch(url, { signal: signal ?? null })

  if (!response.ok) {
    throw new AnatomyEngineError(
      'model-unavailable',
      `The model manifest could not be loaded (HTTP ${response.status}).`,
    )
  }

  const model = parseModel(await response.json())
  const base = response.url || String(url)

  return {
    ...model,
    chunks: model.chunks.map((chunk) => ({
      ...chunk,
      url: new URL(chunk.url, base).href,
      ...(chunk.gzip === undefined
        ? {}
        : { gzip: new URL(chunk.gzip, base).href }),
    })),
  }
}
