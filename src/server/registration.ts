import { createServerFn } from "@tanstack/react-start";
import CompetitionService from "~/lib/api/competitions/competition.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { registrationActionSchema } from "~/schemas/competition.schema";

const competitionService = new CompetitionService();

export const approveRegistration = createServerFn({ method: "POST" })
  .inputValidator(registrationActionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result =
        await competitionService.approveRegistration(data);

      return successResponse(
        result.data,
        result.message
      );
    })
  );

export const rejectRegistration = createServerFn({ method: "POST" })
  .inputValidator(registrationActionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<any>> => {
      const result =
        await competitionService.rejectRegistration(data);

      return successResponse(
        result.data,
        result.message
      );
    })
  );