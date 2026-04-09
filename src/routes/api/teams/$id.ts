import { createFileRoute } from '@tanstack/react-router'
import { successResponse } from '~/lib/utils/api-response'
import { tryCatch } from '~/lib/utils/try-catch'
import TeamService from '~/lib/services/team.service'
import { validationMiddleware } from '~/middlewares/validation.middleware'
import { registerSchema } from '~/schemas/auth.schema'

const teamService = new TeamService()

export const Route = createFileRoute('/api/teams/$id')({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: tryCatch(async ({ params }) => {

          const result = await teamService.findOne(
            params.id
          )

          return Response.json(
            successResponse(
              result.data,
              result.message
            )
          )
        }),

        PATCH: {
          middleware: [
            validationMiddleware(registerSchema.partial())
          ],
          handler: tryCatch(async ({ params, context }) => {

            const result = await teamService.update(
              params.id,
              context.validatedBody
            )

            return Response.json(
              successResponse(
                result.data,
                result.message
              )
            )
          }),
        },

        // DELETE
        DELETE: tryCatch(async ({ params }) => {

          const result = await teamService.delete(
            params.id
          )

          return Response.json(
            successResponse(
              result.data,
              result.message
            )
          )
        }),

      }),
  },
})