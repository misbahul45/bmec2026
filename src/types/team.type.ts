import { Prisma, User } from "@prisma/client"

export type SafeTeam = Omit<User, "password">

export type TeamsResponse = {
  teams: SafeTeam[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TeamWithMembers =
  Prisma.UserGetPayload<{
    include: {
      members: true
    }
  }>