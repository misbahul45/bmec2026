import { Registration } from "@prisma/client";
import { createServerFn } from "@tanstack/react-start";
import CompetitionService from "~/lib/api/competitions/competition.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { registrationCompetitionSchema } from "~/schemas/competition.schema";
import { CompetitionTypeSchema } from "~/schemas/general.schema";
import { CompetitionWithActiveBatch } from "~/types/competition.type";
import { z } from "zod";

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

const batchUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  price: z.number().optional(),
  module_bacth: z.string().optional(),
})

const batchCreateSchema = z.object({
  competitionId: z.string().uuid(),
  name: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  price: z.number(),
  module_bacth: z.string(),
})

export const updateBatch = createServerFn({ method: 'POST' })
  .inputValidator(batchUpdateSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
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
      const result = await competitionService.deleteBatch(data)
      return successResponse(result.data, result.message)
    })
  )