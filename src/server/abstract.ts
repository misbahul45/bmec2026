import { AbstractSubmission } from "@prisma/client"
import { createServerFn } from "@tanstack/react-start"
import AbstractService from "~/lib/api/abstracts/abstract.service"
import { ApiSuccess, successResponse } from "~/lib/utils/api-response"
import { withErrorHandling } from "~/lib/utils/server-wrapper"
import { createAbstractSchema } from "~/schemas/abstract.schema"

const abstractService = new AbstractService();

export const createAbstract=createServerFn({ method:"GET" })
.inputValidator(createAbstractSchema)
.handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<AbstractSubmission>> => {
      const result = await abstractService.create(data)
      return successResponse<AbstractSubmission>(result.data, result.message)
    })
)