import { useSession } from "@tanstack/react-start/server"

type SessionRole = "ADMIN" | "TEAM"

export type SessionData = {
  userId?: string;
  email?: string;
  role?: SessionRole;
}

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: process.env.AUTH_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  })
}