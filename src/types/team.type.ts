import { Prisma } from "@prisma/client"

export type TeamWithRelations =
  Prisma.TeamGetPayload<{
    include: {
      members: true
      abstract: true
      registration: {
        include: {
          competition: {
            include: { stages: true }
          }
        }
      }
      currentStage: true
      mentor: true
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