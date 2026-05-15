import { Prisma } from "@prisma/client"

export type TeamWithRelations =
  Prisma.TeamGetPayload<{
    include: {
      members: true
      registration: {
        include: {
          batch: true
          competition: {
            include: { stages: true }
          }
        }
      }
      currentStage: true
      mentor: true
    }
  }>

export type SafeTeam = Omit<TeamWithRelations, 'password'>

export type TeamsResponse = {
  teams: any[]
  meta: MetaData
}