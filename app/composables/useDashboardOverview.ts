import type { DashboardOverview } from '#shared/types/response/dashboardOverview'

const fetchedAt = useState('dashboard-overview-fetchedAt', () => Date.now())

export const useDashboardOverview = () => {
  const requestFetch = useRequestFetch()

  const { status, data } = useAsyncData(
    'dashboard-overview',
    () => requestFetch<DashboardOverview>('/api/dashboard/overview', {
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
        const isExpired = Date.now() - fetchedAt.value > 10 * 1000
        if (isExpired) return

        return data
      },
    },
  )

  return {
    status,
    data,
  }
}
