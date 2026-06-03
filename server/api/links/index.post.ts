import { linkSchema } from '#shared/schemas/link'
import { z } from 'zod'
import { prismaClient } from '#server/utils/prisma'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, linkSchema.safeParse)

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
      data: z.flattenError(result.error),
    })
  }

  const body = result.data

  const session = await getUserSession(event)
  const { encodeId } = useSqids(event)

  let hashedPassword: null | string = null

  try {
    if (body.password) {
      hashedPassword = await hashPassword(body.password)
    }
    const payload = {
      longUrl: body.longUrl,
      expiresAt: body.expiresAt || null,
      userId: session.user?.id || null,
      password: hashedPassword,
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // Create link entity
      const link = await tx.link.create({
        data: payload,
      })
      // Generate short code by id
      const shortCode = encodeId(link.id)

      // Update entity with generated shortCode
      return await tx.link.update({
        where: { id: link.id },
        data: { shortCode },
        omit: { password: true },
      })
    })

    return {
      ...result,
      passwordProtected: !!hashedPassword,
    }
  }
  catch (err: unknown) {
    console.error(err)

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
})
