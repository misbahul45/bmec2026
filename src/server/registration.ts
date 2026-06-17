import { createServerFn } from "@tanstack/react-start";
import CompetitionService from "~/lib/api/competitions/competition.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { AppError } from "~/lib/utils/app-error";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { authMiddleware } from "~/middleware/auth.middleware";
import { registrationActionSchema } from "~/schemas/competition.schema";

const competitionService = new CompetitionService();

export const approveRegistration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(registrationActionSchema)
  .handler(
    withErrorHandling(async ({ data, context }): Promise<ApiSuccess<any>> => {
      if (context.session.role !== "ADMIN" || !context.session.userId) {
        throw AppError.forbidden("Admin only");
      }

      const result =
        await competitionService.approveRegistration({
          ...data,
          adminId: context.session.userId,
        });

      return successResponse(
        result.data,
        result.message
      );
    })
  );

export const rejectRegistration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(registrationActionSchema)
  .handler(
    withErrorHandling(async ({ data, context }): Promise<ApiSuccess<any>> => {
      if (context.session.role !== "ADMIN" || !context.session.userId) {
        throw AppError.forbidden("Admin only");
      }

      const result =
        await competitionService.rejectRegistration({
          ...data,
          adminId: context.session.userId,
        });

      return successResponse(
        result.data,
        result.message
      );
    })
  );
