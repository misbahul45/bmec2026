import { createMiddleware } from "@tanstack/react-start"
import { authMiddleware } from "./auth.middleware"
import { ForbiddenError } from "~/lib/utils/app-error"

export const adminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.session.role !== "ADMIN") {
      throw new ForbiddenError("Akses ditolak: halaman ini hanya untuk admin.")
    }

    return next()
  })