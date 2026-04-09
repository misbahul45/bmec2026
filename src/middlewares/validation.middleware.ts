import { createMiddleware } from "@tanstack/react-start"
import { ZodSchema } from "zod"
import { errorResponse } from "~/lib/utils/api-response"

export const validationMiddleware = <T>(schema: ZodSchema<T>) =>
  createMiddleware().server(async ({ next, request, context }) => {
    try {
      const body = await request.json()

      const result = schema.safeParse(body)

      if (!result.success) {
        return Response.json(
          errorResponse(
            "Validation Error",
            result.error.flatten(),
            "VALIDATION_ERROR"
          ),
          { status: 400 }
        )
      }

      return next({
        context: {
          ...(context ?? {}),
          validatedBody: result.data,
        },
      })
    } catch (error) {
      return Response.json(
        errorResponse(
          "Invalid request body",
          error,
          "INVALID_BODY"
        ),
        { status: 400 }
      )
    }
  })