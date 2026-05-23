import { prisma } from "~/lib/utils/prisma"

export async function seedCompetition() {
  const competitionConfig = {
    OLIMPIADE: [90000, 120000, 150000],
    INFOGRAFIS: [60000, 75000, 90000],
    LKTI: [125000, 150000],
  } as const

  const olimpiadeModules = [
    "https://drive.google.com/drive/folders/1xeZjjKWAJrmDzA7b4J5nirM2agHWcYAu",
    "https://drive.google.com/drive/folders/1AOkcD3gp3DNkf-6bN5SfziqQmvmmQ2XK",
    "https://drive.google.com/drive/folders/1_TgPcaJ-vps_6iU-Uz472ttE5SBaiUQx",
  ] as const

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

      const moduleBatch =
        compName === "OLIMPIADE"
          ? olimpiadeModules[i]
          : ""

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
          module_bacth: moduleBatch,
        },
        create: {
          name: `Batch ${i + 1}`,
          startDate,
          endDate,
          price: prices[i],
          module_bacth: moduleBatch,
          competitionId: competition.id,
        },
      })
    }
  }

  console.log("✅ Competition + Batch seeded")
}