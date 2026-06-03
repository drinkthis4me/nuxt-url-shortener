import { linkBulkDeleteSchema } from '~~/shared/schemas/link'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) throw createError({ ...HTTP_STATUS.UNAUTHORIZED })

  const result = await readValidatedBody(event, linkBulkDeleteSchema.safeParse)

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
      data: z.flattenError(result.error),
    })
  }

  const body = result.data

  try {
    const deletedLinks = await prismaClient.link.updateMany({
      data: {
        isActive: false,
      },
      where: {
        id: { in: body.ids },
        userId: session.user.id,
        isActive: true,
      },
    })

    if (deletedLinks.count === 0) {
      throw createError({
        ...HTTP_STATUS.NOT_FOUND,
        message: 'No active links found to delete',
      })
    }

    return {
      count: deletedLinks.count,
    }
  }
  catch (err) {
    console.error(err)

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Failed to process bulk deletion',
    })
  }
})
