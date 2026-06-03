import type { TrendDataPoint } from '#shared/types/response/dashboardOverview'
import type { CreationTrendQuerySchema } from '#shared/schemas/dashboard'
import { today, getLocalTimeZone } from '@internationalized/date'

const fetchedAt = useState('creation-trend-fetchedAt', () => Date.now())

export const useDashboardLinkCreationTrend = () => {
  const timezone = getLocalTimeZone()
  const endDate = today(timezone).toString()
  const startDate = today(timezone).subtract({ days: 30 }).toString()

  const query = reactive<CreationTrendQuerySchema>({
    from: startDate,
    to: endDate,
    timezone: timezone,
  })
  const requestFetch = useRequestFetch()

  const { status, data, refresh } = useAsyncData(
    'dashboard-creation-trend',
    () => requestFetch<TrendDataPoint[]>('/api/dashboard/creation-trend', {
      query,
      onResponse() {
        fetchedAt.value = Date.now()
      },
    }),
    {
      lazy: true,
      getCachedData(key, nuxtApp) {
        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]

        if (!data) return

        // TTL: 30 sec
        const isExpired = Date.now() - fetchedAt.value > 30 * 1000
        if (isExpired) return

        return data
      },
    },
  )

  return {
    query,
    status,
    data,

    refresh,
  }
}
