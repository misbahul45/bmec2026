import { createMiddleware } from "@tanstack/react-start"
import { UnauthorizedError } from "~/lib/utils/app-error"
import { useAppSession } from "~/lib/utils/session"

export const authMiddleware = createMiddleware({ type: "function" })
  .server(async ({ next }) => {
    const session = await useAppSession()

    const { userId, role } = session.data

    if (!userId || !role) {
      throw new UnauthorizedError("Login required")
    }

    return next({
      context: {
        session: session.data,
      },
    })
  })