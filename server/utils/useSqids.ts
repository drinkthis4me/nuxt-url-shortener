import type { H3Event } from 'h3'

import Sqids from 'sqids'

export const useSqids = (e: H3Event) => {
  const config = useRuntimeConfig(e)
  const runtimeConfig = useAppConfig(e)

  const sqidsInstance = new Sqids({
    alphabet: config.sqidsAlphabet,
    minLength: 6,
    blocklist: new Set((runtimeConfig.reservedSlug as string[]) || []),
  })

  const encodeId = (id: number): string => {
    if (typeof id !== 'number' || isNaN(id) || id < 0) {
      throw new Error(`[Sqids Error] Invalid ID provided for encoding: ${id}`)
    }

    const result = sqidsInstance.encode([id])

    if (!result) {
      throw new Error(`[Sqids Error] Failed to encode ID: ${id}`)
    }

    return result
  }

  const decodeId = (code: string): number | null => {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return null
    }

    const decoded = sqidsInstance.decode(code.trim())

    if (!decoded || decoded.length === 0) {
      return null
    }

    return decoded[0]!
  }

  return {
    encodeId,
    decodeId,
  }
}
