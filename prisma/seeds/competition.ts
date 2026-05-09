import { prisma } from "~/lib/utils/prisma"

export async function seedCompetition() {
  const competitionConfig = {
    OLIMPIADE: [90000, 120000, 150000],
    INFOGRAFIS: [60000, 75000, 90000],
    LKTI: [125000, 150000],
  } as const

  const baseStartDate = new Date()

  for (const [compName, prices] of Object.entries(competitionConfig)) {
    const competition = await prisma.competition.upsert({
      where: {
        name: compName,
      },
      update: {},
      create: {
        name: compName,
      },
    })

    for (let i = 0; i < prices.length; i++) {
      const startDate = new Date(baseStartDate)
      startDate.setDate(baseStartDate.getDate() + i * 10)

      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 5)

      await prisma.batch.upsert({
        where: {
          name_competitionId: {
            name: `Batch ${i + 1}`,
            competitionId: competition.id,
          },
        },
        update: {
          startDate,
          endDate,
          price: prices[i],
          module_bacth: `module-${compName.toLowerCase()}-${i + 1}`,
        },
        create: {
          name: `Batch ${i + 1}`,
          startDate,
          endDate,
          price: prices[i],
          module_bacth: `module-${compName.toLowerCase()}-${i + 1}`,
          competitionId: competition.id,
        },
      })
    }
  }

  console.log("✅ Competition + Batch seeded")
}