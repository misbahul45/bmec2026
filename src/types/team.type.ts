import { Prisma, Team } from "@prisma/client"

export type SafeTeam = Omit<Team, "password">

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
  Prisma.TeamGetPayload<{
    include: {
      members: true
    }
  }>