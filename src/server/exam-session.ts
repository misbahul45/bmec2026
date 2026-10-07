import { createServerFn } from '@tanstack/react-start'
import { withErrorHandling } from '~/lib/utils/server-wrapper'
import { successResponse, ApiSuccess } from '~/lib/utils/api-response'
import { requireAdminSession } from '~/lib/utils/server-auth'
import ExamSessionService from '~/lib/api/exam-sessions/exam-session.service'
import {
  assignTeamsToSessionSchema,
  createExamSessionSchema,
  examSessionIdSchema,
  examSessionsQuerySchema,
  removeTeamFromSessionSchema,
  setTeamsByNamesSchema,
  updateExamSessionSchema,
} from '~/schemas/exam-session.schema'

const service = new ExamSessionService()

export const getExamSessions = createServerFn({ method: 'GET' })
  .inputValidator(examSessionsQuerySchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const result = await service.list(data.examId)
      return successResponse(result.data, result.message)
    }),
  )

export const createExamSession = createServerFn({ method: 'POST' })
  .inputValidator(createExamSessionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const result = await service.create(data)
      return successResponse(result.data, result.message)
    }),
  )

export const updateExamSession = createServerFn({ method: 'POST' })
  .inputValidator(updateExamSessionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const result = await service.update(data)
      return successResponse(result.data, result.message)
    }),
  )

export const deleteExamSession = createServerFn({ method: 'POST' })
  .inputValidator(examSessionIdSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<null>> => {
      await requireAdminSession()
      const result = await service.remove(data.id)
      return successResponse<null>(result.data, result.message)
    }),
  )

export const assignTeamsToSession = createServerFn({ method: 'POST' })
  .inputValidator(assignTeamsToSessionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const result = await service.assign(data)
      return successResponse(result.data, result.message)
    }),
  )

export const removeTeamFromSession = createServerFn({ method: 'POST' })
  .inputValidator(removeTeamFromSessionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<null>> => {
      await requireAdminSession()
      const result = await service.removeTeam(data)
      return successResponse<null>(result.data, result.message)
    }),
  )

export const setTeamsByNames = createServerFn({ method: 'POST' })
  .inputValidator(setTeamsByNamesSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const result = await service.setTeamsByNames(data)
      return successResponse<any>(result.data, result.message)
    }),
  )
