// lib/utils/server-wrapper.ts
import { handleError } from "./handle-error"
import { isNotFound, isRedirect } from "@tanstack/react-router"

type Handler<TInput, TOutput> = (ctx: { data: TInput }) => Promise<TOutput>
export function withErrorHandling<TInput, TOutput>(
  handler: Handler<TInput, TOutput>,
): Handler<TInput, TOutput> {
  return async (ctx) => {
    try {
      return await handler(ctx)
    } catch (error) {

      if (isNotFound(error) || isRedirect(error)) {
        throw error
      }

      const { body, status } = handleError(error)

      throw body 
    }
  }
}