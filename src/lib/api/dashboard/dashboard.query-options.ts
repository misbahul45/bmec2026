import { queryOptions } from '@tanstack/react-query'
import { getDashboardSummary } from '~/server/dashboard'

export const dashboardQueryOptions = () =>
  queryOptions({
    queryKey: ['dashboard-summary'],
    queryFn: () => getDashboardSummary(),
    staleTime: 30_000,
  })
