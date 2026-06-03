import { z } from 'zod'

function isValidTimeZone(tz: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz })
    return true
  }
  catch {
    return false
  }
}

export const creationTrendQuerySchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  timezone: z.string().refine(isValidTimeZone, 'Invalid IANA timezone'),
})
export type CreationTrendQuerySchema = z.output<typeof creationTrendQuerySchema>
