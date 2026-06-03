import { userIdSchema } from '#shared/schemas/user'
import { prismaClient } from '#server/utils/prisma'
import { Prisma } from '~~/prisma/generated/client'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const result = await getValidatedRouterParams(event, userIdSchema.safeParse)

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error.',
    })
  }

  const userId = result.data.id

  try {
    const user = await prismaClient.user.update({
      data: {
        isActive: false,
      },
      where: {
        id: userId,
        isActive: true,
      },
    })

    return {
      success: true,
      message: `User with id ${user.id} has been deleted.`,
    }
  }
  catch (err: unknown) {
    console.error(err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw createError({
          ...HTTP_STATUS.NOT_FOUND,
          message: 'User not found',
        })
      }
    }

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
