import { prismaClient } from '#server/utils/prisma'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) throw createError({
    ...HTTP_STATUS.UNAUTHORIZED,
  })

  try {
    const links = await prismaClient.link.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return links.map(({ password, ...rest }) => ({
      ...rest,
      passwordProtected: !!password,
    }))
  }
  catch (err: unknown) {
    console.error('Error creating link:', err)

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
