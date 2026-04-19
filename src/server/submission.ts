import { createServerFn } from '@tanstack/react-start'
import { withErrorHandling } from '~/lib/utils/server-wrapper'
import { successResponse, ApiSuccess } from '~/lib/utils/api-response'
import SubmissionService from '~/lib/api/submissions/submission.service'
import { z } from 'zod'

const submissionService = new SubmissionService()

const submissionQuerySchema = z.object({
  search: z.string().optional(),
  stageId: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ALL']).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
})

const reviewSchema = z.object({
  id: z.string().uuid(),
  adminId: z.string().uuid(),
})

const updateScoreSchema = z.object({
  id: z.string().uuid(),
  score: z.number().min(0),
  feedback: z.string().nullable().optional(),
  adminId: z.string().uuid(),
})

const leaderboardSchema = z.object({
  competitionType: z.string(),
  stageType: z.string().optional(),
})

export const getSubmissions = createServerFn({ method: 'GET' })
  .inputValidator(submissionQuerySchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await submissionService.findAll(data)
      return successResponse(result.data, result.message)
    })
  )

export const approveSubmission = createServerFn({ method: 'POST' })
  .inputValidator(reviewSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await submissionService.approve(data.id, data.adminId)
      return successResponse(result.data, result.message)
    })
  )

export const rejectSubmission = createServerFn({ method: 'POST' })
  .inputValidator(reviewSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await submissionService.reject(data.id, data.adminId)
      return successResponse(result.data, result.message)
    })
  )

export const updateSubmissionScore = createServerFn({ method: 'POST' })
  .inputValidator(updateScoreSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await submissionService.updateScore(data.id, data.score, data.feedback ?? null, data.adminId)
      return successResponse(result.data, result.message)
    })
  )

export const getSubmissionLeaderboard = createServerFn({ method: 'GET' })
  .inputValidator(leaderboardSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await submissionService.getLeaderboard(data.competitionType, data.stageType)
      return successResponse(result.data, result.message)
    })
  )
