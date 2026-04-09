import { createMiddleware } from "@tanstack/react-start"
import { ZodSchema } from "zod"
import { errorResponse } from "~/lib/utils/api-response"

export const queryMiddleware = <T>(schema: ZodSchema<T>) =>
  createMiddleware().server(async ({ next, request }) => {
    const url = new URL(request.url)

    const query = Object.fromEntries(
      url.searchParams.entries()
    )

    const result = schema.safeParse(query)

    if (!result.success) {
      return Response.json(
        errorResponse(
          "Invalid query params",
          result.error.flatten(),
          "INVALID_QUERY"
        ),
        { status: 400 }
      )
    }

    return next({
      context: {
        validatedQuery: result.data
      }
    })
  })