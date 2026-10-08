import { Registration } from "@prisma/client";
import { createServerFn } from "@tanstack/react-start";
import CompetitionService from "~/lib/api/competitions/competition.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { registrationCompetitionSchema } from "~/schemas/competition.schema";
import { CompetitionTypeSchema } from "~/schemas/general.schema";
import { CompetitionWithActiveBatch } from "~/types/competition.type";
import { z } from "zod";
import { requireTeamSession, requireAdminSession } from "~/lib/utils/server-auth";

const competitionService = new CompetitionService()

export const getCompetition = createServerFn({ method: "GET" })
  .inputValidator(CompetitionTypeSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<CompetitionWithActiveBatch>> => {
      const result = await competitionService.findOneByName(data)
      return successResponse<CompetitionWithActiveBatch>(result.data, result.message)
    })
  )

export const registrationCompetition = createServerFn({ method: 'POST' })
  .inputValidator(registrationCompetitionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<Registration>> => {
      await requireTeamSession(data.teamId)
      const result = await competitionService.registrationCompetition(data)
      return successResponse<Registration>(result.data, result.message)
    })
  )

export const getAllCompetitionsWithBatches = createServerFn({ method: 'GET' })
  .handler(
    withErrorHandling(async (): Promise<ApiSuccess<any>> => {
      const result = await competitionService.getAllCompetitionsWithBatches()
      return successResponse(result.data)
    })
  )

// `new Date("garbage")` is an Invalid Date that Prisma rejects with a 500, so reject it here.
const dateString = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Tanggal tidak valid')

const price = z.number().min(0, 'Harga tidak boleh negatif').max(1_000_000_000)

const endNotBeforeStart = (d: { startDate?: string; endDate?: string }) =>
  !d.startDate || !d.endDate || Date.parse(d.endDate) >= Date.parse(d.startDate)

const endDateIssue = { message: 'Tanggal selesai tidak boleh sebelum tanggal mulai', path: ['endDate'] }

const batchUpdateSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100).optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    price: price.optional(),
    module_bacth: z.string().optional(),
  })
  .refine(endNotBeforeStart, endDateIssue)

const batchCreateSchema = z
  .object({
    competitionId: z.string().uuid(),
    name: z.string().min(1).max(100),
    startDate: dateString,
    endDate: dateString,
    price,
    module_bacth: z.string(),
  })
  .refine(endNotBeforeStart, endDateIssue)

export const updateBatch = createServerFn({ method: 'POST' })
  .inputValidator(batchUpdateSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const { id, startDate, endDate, ...rest } = data
      const result = await competitionService.updateBatch(id, {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      })
      return successResponse(result.data, result.message)
    })
  )

export const createBatch = createServerFn({ method: 'POST' })
  .inputValidator(batchCreateSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      await requireAdminSession()
      const result = await competitionService.createBatch(data.competitionId, {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: data.price,
        module_bacth: data.module_bacth,
      })
      return successResponse(result.data, result.message)
    })
  )

export const deleteBatch = createServerFn({ method: 'POST' })
  .inputValidator(z.string().uuid())
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<null>> => {
      await requireAdminSession()
      const result = await competitionService.deleteBatch(data)
      return successResponse(result.data, result.message)
    })
  )