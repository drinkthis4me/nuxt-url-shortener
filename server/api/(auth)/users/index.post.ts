import { userCreateSchema } from '#shared/schemas/user'
import { z } from 'zod'
import { prismaClient } from '#server/utils/prisma'
import { Prisma } from '@@/prisma/generated/client'
import { hashPassword } from '#imports'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => userCreateSchema.safeParse(body))

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
      data: z.flattenError(result.error),
    })
  }

  const body = result.data

  try {
    const hashedPassword = await hashPassword(body.password)

    const user = await prismaClient.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name ?? null,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      loggedInAt: new Date(),
    })

    return user
  }
  catch (err: unknown) {
    console.log(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw createError({
        ...HTTP_STATUS.CONFLICT,
        statusText: 'Email already registered',
      })
    }

    // For any other unexpected errors
    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
