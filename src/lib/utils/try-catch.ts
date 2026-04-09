import { errorResponse } from "./api-response"
import { AppError } from "./app-error"

export const tryCatch = <T extends (...args: any[]) => Promise<any>>(
  handler: T
) => {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (error: any) {

      console.error("API ERROR:", error)

      if (error instanceof AppError) {
        return Response.json(
          errorResponse(
            error.message,
            process.env.NODE_ENV === "development" ? error : undefined,
            error.code
          ),
          { status: error.statusCode }
        )
      }

      return Response.json(
        errorResponse(
          error?.message ?? "Internal Server Error",
          process.env.NODE_ENV === "development" ? error : undefined,
          "INTERNAL_SERVER_ERROR"
        ),
        { status: 500 }
      )
    }
  }
}