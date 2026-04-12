import { errorResponse } from "./api-response"
import { AppError } from "./app-error"
import { notFound, isNotFound, isRedirect } from "@tanstack/react-router"

type ErrorResult = {
  body: unknown
  status: number
}

export function handleError(error: unknown): ErrorResult {
  console.error("ERROR:", error)

  if (isNotFound(error)) {
    throw error
  }

  if (isRedirect(error)) {
    throw error
  }

  if (error instanceof AppError) {
    if (error.statusCode === 404) {
      throw notFound()
    }

    return {
      status: error.statusCode,
      body: errorResponse(
        error.message,
        process.env.NODE_ENV === "development" ? error : undefined,
        error.code,
      ),
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: errorResponse(
        error.message,
        process.env.NODE_ENV === "development" ? error : undefined,
        "INTERNAL_SERVER_ERROR",
      ),
    }
  }

  return {
    status: 500,
    body: errorResponse(
      "Internal Server Error",
      process.env.NODE_ENV === "development" ? error : undefined,
      "INTERNAL_SERVER_ERROR",
    ),
  }
}