import { slugRegex } from '#shared/schemas/link'
import { parsePath } from 'ufo'
import { prismaClient } from '#server/utils/prisma'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const { pathname } = parsePath(event.path)
  const parts = pathname.split('/').filter(Boolean)

  if (parts.length !== 1) return

  const slug = parts[0]!

  if (!slugRegex.test(slug)) return

  const { reservedSlug } = useAppConfig(event)
  const reservedSlugSet = new Set(reservedSlug as string[])
  const isReserved = reservedSlugSet.has(slug.toLowerCase())

  if (isReserved) return

  const { decodeId } = useSqids(event)
  const decoded = decodeId(slug)

  if (decoded === null) return

  let link: { id: number, longUrl: string, password: string | null } | null = null

  try {
    link = await prismaClient.link.findFirst({
      where: {
        id: decoded,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      select: {
        longUrl: true,
        id: true,
        password: true,
      },
    })
  }
  catch (err) {
    console.error('Link lookup error:', err)
    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }

  if (!link) {
    // `invalidShortUrl` custom field tells client to render a special
    // 404 page with short link not found hint.
    throw createError({
      ...HTTP_STATUS.NOT_FOUND,
      data: {
        invalidShortUrl: true,
      },
    })
  }

  if (link.password) {
    const isAuthorized = getCookie(event, `authorized_${slug}`) === 'true'

    if (!isAuthorized) {
      // Stop user from guessing slog
      // See: server/api/links/verify.post.ts
      setCookie(event, 'auth_slug', slug, {
        httpOnly: true,
        maxAge: 5 * 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })

      await sendRedirect(event, `/protect/${slug}`, 302)
      return
    }
  }

  prismaClient.link.update({
    where: { id: link.id },
    data: { hitCount: { increment: 1 } },
  }).catch(console.error)

  await sendRedirect(event, link.longUrl, 302)
})
