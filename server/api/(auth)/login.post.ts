import { z } from 'zod'
import { prismaClient } from '#server/utils/prisma'
import { verifyPassword } from '#imports'
import { userLoginSchema } from '#shared/schemas/user'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, userLoginSchema.safeParse)

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
      data: z.flattenError(result.error),
    })
  }

  const body = result.data

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: body.email,
        isActive: true,
      },
    })

    if (
      !user
      || !await verifyPassword(user.password, body.password)
    ) {
      throw createError({
        ...HTTP_STATUS.UNAUTHORIZED,
        message: 'Bad credentials',
      })
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      loggedInAt: new Date(),
    })

    return { success: true }
  }
  catch (err) {
    console.log(err)

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
