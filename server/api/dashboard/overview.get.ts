import { prismaClient } from '#server/utils/prisma'
import type { DashboardOverview } from '#shared/types/response/dashboardOverview'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) throw createError({
    ...HTTP_STATUS.UNAUTHORIZED,
  })

  const config = useRuntimeConfig()

  try {
    const [totalLinks, totalClicks, topLink, expiringCount] = await Promise.all([
      // Total link count
      prismaClient.link.count({
        where: {
          userId: session.user.id,
          isActive: true,
        },
      }),
      // Total click count
      prismaClient.link.aggregate({
        where: {
          userId: session.user.id,
          isActive: true,
        },
        _sum: { hitCount: true },
      }),
      // Top clicked link
      prismaClient.link.findFirst({
        where: {
          userId: session.user.id,
          isActive: true,
        },
        orderBy: { hitCount: 'desc' },
      }),
      // Expiring count
      prismaClient.link.count({
        where: {
          userId: session.user.id,
          expiresAt: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
          },
          isActive: true,
        },
      }),
    ])

    return {
      totalLinks,
      totalClicks: totalClicks._sum.hitCount || 0,
      topLink: topLink ? `${config.public.appUrl}/${topLink.shortCode}` : null,
      expiringCount,
    } satisfies DashboardOverview
  }
  catch (err) {
    console.error(err)

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
