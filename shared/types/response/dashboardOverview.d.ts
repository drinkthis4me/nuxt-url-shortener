export interface DashboardOverview {
  totalLinks: number
  totalClicks: number
  topLink: string | null
  expiringCount: number
}

export interface TrendDataPoint {
  date: string
  count: number
}
