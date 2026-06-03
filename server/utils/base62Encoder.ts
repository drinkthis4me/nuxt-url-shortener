const CHARSET = 'Gf8FIqkPUSHCTsWDcxMZV7mQOl1w63JhrRgaAu9iBvNoKXpnjdz4te0b5Y2LEy'
const BASE = CHARSET.length
const FIXED_length = 6

/**
 * Encodes an ID (Number) to a Base62 string.
 */
export function base62Encode(n: number): string {
  if (n === 0) return CHARSET[0]!

  let result = ''

  while (n > 0) {
    result = CHARSET[n % BASE] + result
    n = Math.floor(n / BASE)
  }

  if (result.length < 6) {
    result = CHARSET[0]!.repeat(FIXED_length - result.length) + result
  }
  return result
}

/**
 * Decodes a Base62 string back to a number.
 */
export function base62Decode(str: string): number {
  let result = 0
  for (const char of str) {
    result = result * BASE + CHARSET.indexOf(char)
  }
  return result
}
