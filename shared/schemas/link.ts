import { z } from 'zod'

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

// Atomic fields
const shortCode = z.string()
  .trim()
  .min(6, 'Must be at least 6 characters')
  .regex(slugRegex, 'Alphanumeric characters only')
const longUrl = z.url({
  protocol: /^https{0,1}$/, // "http" or "https"
  error: 'Must be a valid URL',
})
const expiresAt = z.coerce.date()
  .min(new Date(), 'Expiration must be in the future')
  .nullable()
  .optional()
const userId = z.number().nullable().optional()
const password = z.string().trim()

// Shared logic for both API and Frontend
export const linkSchema = z.object({
  longUrl,
  shortCode: shortCode.optional(),
  expiresAt,
  userId,
  password: password.optional(),
})
export type LinkSchema = z.output<typeof linkSchema>

// Schema for soft delete
export const linkDeleteSchema = z.object({
  id: z.coerce.number().int().positive(),
})

// Schema for bulk soft delete
export const linkBulkDeleteSchema = z.object({
  ids: z.array(z.number()),
})

// Schema for verify password
export const linkVerifySchema = z.object({
  shortCode,
  password: password.min(1, 'Required'),
})
export type LinkVerifySchema = z.output<typeof linkVerifySchema>
