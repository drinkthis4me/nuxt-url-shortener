import { userIdSchema } from '#shared/schemas/user'
import { userUpdateSchema, type UserUpdateSchema } from '#shared/schemas/user'
import { prismaClient } from '#server/utils/prisma'
import { Prisma } from '@@/prisma/generated/client'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const paramResult = await getValidatedRouterParams(event, userIdSchema.safeParse)
  const bodyResult = await readValidatedBody(event, userUpdateSchema.safeParse)

  if (!paramResult.success || !bodyResult.success || Object.keys(bodyResult?.data || {}).length === 0) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
    })
  }

  const userId = paramResult.data.id
  const body = bodyResult.data

  const dataToUpdate: UserUpdateSchema = { ...body }
  if (body.password) {
    dataToUpdate.password = await hashPassword(body.password)
  }

  try {
    const updatedUser = await prismaClient.user.update({
      where: {
        id: userId,
        isActive: true,
      },
      data: dataToUpdate,
      omit: {
        password: true,
      },
    })

    return updatedUser
  }
  catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw createError({
        ...HTTP_STATUS.NOT_FOUND,
        message: 'User not found or inactive',
      })
    }

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
