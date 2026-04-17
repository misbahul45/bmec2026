import { Prisma } from "@prisma/client"

export type TeamWithRelations =
  Prisma.TeamGetPayload<{
    include: {
      members: true
      abstract: true
      registration: true
    }
  }>

export type SafeTeam = Omit<
  TeamWithRelations,
  "password"
>

export type TeamsResponse = {
  teams: TeamWithRelations[]
  meta: MetaData
}