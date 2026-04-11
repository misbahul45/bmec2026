import { createServerFn } from "@tanstack/react-start";
import CompetitionService from "~/lib/api/competitions/competition.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
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