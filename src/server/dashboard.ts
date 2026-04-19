import { createServerFn } from '@tanstack/react-start'
import { withErrorHandling } from '~/lib/utils/server-wrapper'
import { successResponse, ApiSuccess } from '~/lib/utils/api-response'
import DashboardService from '~/lib/api/dashboard/dashboard.service'

const dashboardService = new DashboardService()

export const getDashboardSummary = createServerFn({ method: 'GET' }).handler(
  withErrorHandling(async (): Promise<ApiSuccess<any>> => {
    const result = await dashboardService.getSummary()
    return successResponse(result, 'Dashboard summary fetched')
  })
)
