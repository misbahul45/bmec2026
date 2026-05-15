import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { ExamEventType } from '@prisma/client'
import { withErrorHandling } from '~/lib/utils/server-wrapper'
import { successResponse, ApiSuccess } from '~/lib/utils/api-response'
import ExamAttemptService from '~/lib/api/exam-attempts/exam-attempt.service'

const service = new ExamAttemptService()

const startExamSchema = z.object({
  teamId: z.string().uuid(),
  examId: z.string().uuid(),
  deviceId: z.string().default(''),
  ipAddress: z.string().default(''),
  userAgent: z.string().default(''),
})

const verifyDeviceSchema = z.object({
  attemptId: z.string().uuid(),
  deviceId: z.string().min(1),
  ipAddress: z.string().default(''),
  userAgent: z.string().default(''),
})

const saveAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.string().default(''),
  teamId: z.string().uuid(),
})

const logEventSchema = z.object({
  attemptId: z.string().uuid(),
  type: z.nativeEnum(ExamEventType),
  metadata: z.record(z.unknown()).optional(),
})

const sessionSchema = z.object({
  teamId: z.string().uuid(),
  examId: z.string().uuid(),
})

export const startExam = createServerFn({ method: 'POST' })
  .inputValidator(startExamSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.startExam(data)
      return successResponse(result.data, result.alreadyStarted ? 'Sesi ujian dilanjutkan' : 'Ujian berhasil dimulai')
    }),
  )

export const verifyDevice = createServerFn({ method: 'POST' })
  .inputValidator(verifyDeviceSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.verifyDevice(data)
      return successResponse(result)
    }),
  )

export const getExamSession = createServerFn({ method: 'GET' })
  .inputValidator(sessionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.getExamSession(data.teamId, data.examId)
      return successResponse(result.data, 'Sesi ujian berhasil dimuat')
    }),
  )

export const saveAnswer = createServerFn({ method: 'POST' })
  .inputValidator(saveAnswerSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.saveAnswer(data)
      return successResponse(result, 'Jawaban disimpan')
    }),
  )

export const finishExam = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ attemptId: z.string().uuid() }))
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.finishExam(data.attemptId)
      return successResponse(result, result.alreadyFinished ? 'Ujian sudah selesai' : 'Ujian berhasil diselesaikan')
    }),
  )

export const getExamResult = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ attemptId: z.string().uuid() }))
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.getResult(data.attemptId)
      return successResponse(result.data, 'Hasil ujian berhasil dimuat')
    }),
  )

export const logExamEvent = createServerFn({ method: 'POST' })
  .inputValidator(logEventSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await service.logEvent(data)
      return successResponse(null, 'Event dicatat')
    }),
  )

export const getExamReview = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ examId: z.string(), teamId: z.string() }))
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result = await service.getExamReview(data.examId, data.teamId)
      return successResponse(result.data, result.message)
    }),
  )
