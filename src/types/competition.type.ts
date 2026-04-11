import { Prisma } from "@prisma/client"

export const competitionWithActiveBatch =
  Prisma.validator<Prisma.CompetitionDefaultArgs>()({
    include: {
      batches: true,
    },
  })

  export type CompetitionWithActiveBatch = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    batches: {
        id: string
        name: string
        startDate: Date
        endDate: Date
        price: number
        module_bacth: string
        competitionId: string
        createdAt: Date
        updatedAt: Date
    }[]
    }