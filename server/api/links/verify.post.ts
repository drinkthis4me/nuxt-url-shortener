import { linkVerifySchema } from '#shared/schemas/link'
import { z } from 'zod'
import { HTTP_STATUS } from '#server/utils/httpStatus'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, linkVerifySchema.safeParse)

  if (!result.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
      data: z.flattenError(result.error),
    })
  }

  const body = result.data

  const intendedSlug = getCookie(event, 'auth_slug')
  if (!intendedSlug || intendedSlug !== body.shortCode) {
    throw createError({
      ...HTTP_STATUS.FORBIDDEN,
      message: 'Invalid access attempt',
    })
  }

  let link

  try {
    link = await prismaClient.link.findUnique({
      where: { shortCode: body.shortCode },
    })
  }
  catch (err) {
    console.error('Link lookup error:', err)

    throw createError({
      ...HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }

  if (!link) {
    throw createError({
      ...HTTP_STATUS.NOT_FOUND,
      message: 'Link not found',
    })
  }

  if (!link.password) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Link does not require password',
    })
  }

  const isMatch = await verifyPassword(link.password, body.password)

  if (!isMatch) {
    throw createError({
      ...HTTP_STATUS.UNAUTHORIZED,
      message: 'Invalid password',
    })
  }

  setCookie(event, `authorized_${body.shortCode}`, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return { success: true }
})
