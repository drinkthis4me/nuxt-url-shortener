import { linkDeleteSchema } from '#shared/schemas/link'
import { prismaClient } from '#server/utils/prisma'
import { Prisma } from '~~/prisma/generated/client'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) throw createError({
    ...HTTP_STATUS.UNAUTHORIZED,
  })

  const result = await getValidatedRouterParams(event, linkDeleteSchema.safeParse)

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
    })
  }

  const linkId = result.data.id

  try {
    await prismaClient.link.update({
      data: {
        isActive: false,
      },
      where: {
        userId: session.user.id,
        id: linkId,
        isActive: true,
      },
    })

    return {
      success: true,
    }
  }
  catch (err: unknown) {
    console.error(err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw createError({
          ...HTTP_STATUS.NOT_FOUND,
          message: 'Link not found',
        })
      }
    }

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
