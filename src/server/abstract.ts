import { AbstractSubmission } from "@prisma/client"
import { createServerFn } from "@tanstack/react-start"
import AbstractService from "~/lib/api/abstracts/abstract.service"
import { ApiSuccess, successResponse } from "~/lib/utils/api-response"
import { withErrorHandling } from "~/lib/utils/server-wrapper"
import { approveAbstractSchema, createAbstractSchema, rejectAbstractSchema } from "~/schemas/abstract.schema"

const abstractService = new AbstractService();

export const createAbstract = createServerFn({ method: "POST" })
  .inputValidator(createAbstractSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<AbstractSubmission>> => {
      const result = await abstractService.create(data)
      return successResponse<AbstractSubmission>(result.data, result.message)
    })
  )

export const approveAbstract = createServerFn({ method: "POST" })
  .inputValidator(approveAbstractSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<AbstractSubmission>> => {
      const result = await abstractService.approve(data.id, data.adminId)
      return successResponse<AbstractSubmission>(result.data, result.message)
    })
  )

export const rejectAbstract = createServerFn({ method: "POST" })
  .inputValidator(rejectAbstractSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<AbstractSubmission>> => {
      const result = await abstractService.reject(data.id, data.adminId)
      return successResponse<AbstractSubmission>(result.data, result.message)
    })
  )