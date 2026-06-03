import type { CalendarDate } from '@internationalized/date'
import type { TrendDataPoint } from '~~/shared/types/response/dashboardOverview'

import { CalendarDateTime, fromDate, parseDate, toCalendarDate, toZoned } from '@internationalized/date'
import { z } from 'zod'
import { prismaClient } from '#server/utils/prisma'
import { HTTP_STATUS } from '#server/utils/httpStatus'
import { creationTrendQuerySchema } from '#shared/schemas/dashboard'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) throw createError({
    ...HTTP_STATUS.UNAUTHORIZED,
  })

  const parsedQuery = await getValidatedQuery(event, creationTrendQuerySchema.safeParse)
  if (!parsedQuery.success) {
    throw createError({
      ...HTTP_STATUS.BAD_REQUEST,
      message: 'Validation Error',
      data: z.flattenError(parsedQuery.error),
    })
  }

  const { from, to, timezone } = parsedQuery.data

  const parsedFrom = parseDate(from)
  const parsedTo = parseDate(to)
  const startLocal = new CalendarDateTime(parsedFrom.year, parsedFrom.month, parsedFrom.day, 0, 0, 0)
  const endLocal = new CalendarDateTime(parsedTo.year, parsedTo.month, parsedTo.day, 23, 59, 59, 999)
  const queryFrom = toZoned(startLocal, timezone).toDate()
  const queryTo = toZoned(endLocal, timezone).toDate()

  const links = await prismaClient.link.findMany({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: queryFrom,
        lte: queryTo,
      },
      isActive: true,
    },
    select: { createdAt: true },
  })

  const counts = new Map<string, number>()
  for (const { createdAt } of links) {
    // JS Date (UTC instant) -> CalendarDate -> local date string in user's timezone
    const localDate = toCalendarDate(fromDate(createdAt, timezone))
    const key = localDate.toString()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const trend: TrendDataPoint[] = []
  let cursor: CalendarDate = parsedFrom
  while (cursor.compare(parsedTo) <= 0) {
    const key = cursor.toString()
    trend.push({ date: key, count: counts.get(key) ?? 0 })
    cursor = cursor.add({ days: 1 })
  }

  return trend
})
