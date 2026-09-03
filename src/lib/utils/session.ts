import { useSession } from "@tanstack/react-start/server"
import { requireEnv } from "./env"

type SessionRole = "ADMIN" | "TEAM"

export type SessionData = {
  userId?: string;
  email?: string;
  role?: SessionRole;
}

export type AuthenticatedUser = SessionData & {
  userId: string
  role: SessionRole
  redirect: string
}

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: requireEnv("AUTH_SECRET"),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    },
  })
}
