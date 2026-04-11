// lib/utils/handle-error.ts
import { errorResponse } from "./api-response"
import { AppError } from "./app-error"
import { notFound } from "@tanstack/react-router"

export function handleError(error: any) {
  console.error("ERROR:", error)

  // TanStack notFound passthrough
  if (error?.status === 404 || error?.response?.status === 404) {
    throw notFound()
  }

  if (error instanceof AppError) {
    return {
      body: errorResponse(
        error.message,
        process.env.NODE_ENV === "development" ? error : undefined,
        error.code
      ),
      status: error.statusCode,
    }
  }

  return {
    body: errorResponse(
      error?.message ?? "Internal Server Error",
      process.env.NODE_ENV === "development" ? error : undefined,
      "INTERNAL_SERVER_ERROR"
    ),
    status: 500,
  }
}