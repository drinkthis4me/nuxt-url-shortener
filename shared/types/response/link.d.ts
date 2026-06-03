import type { Link as PrismaLink } from '~~/prisma/generated/client'

export interface Link extends Omit<PrismaLink, 'createdAt' | 'expiresAt' | 'password'> {
  createdAt: string
  expiresAt: string | null
  passwordProtected: boolean
}

export interface LinkWithShortUrl extends Link {
  shortUrl: string
}
