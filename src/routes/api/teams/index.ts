import { createFileRoute } from '@tanstack/react-router'
import { successResponse } from '~/lib/utils/api-response'
import { validationMiddleware } from '~/middlewares/validation.middleware'
import { registerSchema } from '~/schemas/auth.schema'
import { tryCatch } from '~/lib/utils/try-catch'
import TeamService from '~/lib/services/team.service'
import { queryMiddleware } from '~/middlewares/query.middleware'
import { queryTeam } from '~/schemas/team.schema'

const teamService = new TeamService()

export const Route = createFileRoute('/api/teams/')({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
       GET: {
        middleware: [
          queryMiddleware(queryTeam)
        ],
        handler: tryCatch(async ({ context }) => {

          const { page, limit } = context.validatedQuery

          const result = await teamService.findAll(context.validatedQuery)

          return Response.json(
            successResponse(
              result.data,
              result.message
            )
          )
        }),
      },

        POST: {
          middleware: [
            validationMiddleware(registerSchema)
          ],
          handler: tryCatch(async ({ context }) => {
            const result = await teamService.create(
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

      }),
  },
})