import { createServerFn } from '@tanstack/react-start'
import { withErrorHandling } from '~/lib/utils/server-wrapper'
import { successResponse, ApiSuccess } from '~/lib/utils/api-response'
import AttemptService from '~/lib/api/exam-attempts/attempt.service'
import { z } from 'zod'

const attemptService = new AttemptService()

const attemptQuerySchema = z.object({
  examId: z.string().uuid(),
  search: z.string().optional(),
  sortBy: z.enum(['totalScore', 'createdAt', 'teamName', 'cheatCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  finished: z.boolean().optional(),
  flagged: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
})

export const getExamAttempts = createServerFn({ method: 'GET' })
  .inputValidator(attemptQuerySchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await attemptService.findByExam(data)
      return successResponse(result.data, result.message)
    })
  )

export const getAttemptDetail = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ attemptId: z.string().uuid() }))
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await attemptService.findDetail(data.attemptId)
      return successResponse(result.data, result.message)
    })
  )

export const getExamLeaderboard = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ examId: z.string().uuid() }))
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await attemptService.getLeaderboard(data.examId)
      return successResponse(result.data, result.message)
    })
  )
