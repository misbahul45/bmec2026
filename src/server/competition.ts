import { Registration } from "@prisma/client";
import { createServerFn } from "@tanstack/react-start";
import CompetitionService from "~/lib/api/competitions/competition.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { registrationCompetitionSchema } from "~/schemas/competition.schema";
import { CompetitionTypeSchema } from "~/schemas/general.schema";
import { CompetitionWithActiveBatch } from "~/types/competition.type";


const competitionService = new CompetitionService()

export const getCompetition=createServerFn({ method:"GET" })
.inputValidator(CompetitionTypeSchema)
.handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<CompetitionWithActiveBatch>> => {
      const result = await competitionService.findOneByName(data)
      return successResponse<CompetitionWithActiveBatch>(result.data, result.message)
    })
)

export const registrationCompetition=createServerFn({ method:'POST' })
.inputValidator(registrationCompetitionSchema)
.handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<Registration>> => {
      const result = await competitionService.registrationCompetition(data)
      return successResponse<Registration>(result.data, result.message)
    })
)