import { createSerializationAdapter } from "@tanstack/react-router"
import { AppError } from "./app-error"

/**
 * Server functions serialize thrown errors down to `message` only, which drops
 * `code`, `statusCode` and `field`. The UI reads those (e.g. FormSessionDialog
 * highlights `error.field`, the exam page maps `error.code` to a screen), so
 * carry them across the wire explicitly.
 */
export const appErrorAdapter = createSerializationAdapter({
  key: "AppError",
  test: (value): value is AppError => value instanceof AppError,
  toSerializable: (error) => ({
    message: error.message,
    statusCode: error.statusCode,
    code: error.code,
    field: error.field,
  }),
  fromSerializable: (data) =>
    new AppError(data.message, data.statusCode, data.code, data.field),
})
