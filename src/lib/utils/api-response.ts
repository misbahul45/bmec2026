export type ApiSuccess<T = unknown> = {
  success: true
  message?: string
  data?: T
  meta?: Record<string, unknown>
}

export type ApiError = {
  success: false
  message: string
  errors?: unknown
  code?: string
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export const successResponse = <T>(
  data?: T,
  message = 'Success',
  meta?: Record<string, unknown>
): ApiSuccess<T> => ({
  success: true,
  message,
  data,
  meta,
})

export const errorResponse = (
  message = 'Something went wrong',
  errors?: unknown,
  code?: string
): ApiError => ({
  success: false,
  message,
  errors,
  code,
})