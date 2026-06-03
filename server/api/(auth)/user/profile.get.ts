import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      ...HTTP_STATUS.UNAUTHORIZED,
      message: 'Unauthorized',
    })
  }

  return { user: session.user }
})
