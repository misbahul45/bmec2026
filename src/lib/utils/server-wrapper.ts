import { AppError } from "./app-error"
import { handleError } from "./handle-error"
import { isNotFound, isRedirect } from "@tanstack/react-router"

type Handler<TContext, TOutput> = (ctx: TContext) => Promise<TOutput>

export function withErrorHandling<TContext, TOutput>(
  handler: Handler<TContext, TOutput>,
): Handler<TContext, TOutput> {
  return async (ctx) => {
    try {
      return await handler(ctx)
    } catch (error) {
      if (isNotFound(error) || isRedirect(error)) {
        throw error
      }

      const { body, status } = handleError(error)

      throw new AppError(
        (body as any).message,
        status,
        (body as any).code
      )
    }
  }
}
