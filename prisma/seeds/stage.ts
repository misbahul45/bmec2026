import { prisma } from "~/lib/utils/prisma"

export async function seedStage() {
  const competitions = await prisma.competition.findMany()

  const stages = [
    { name: "PENYISIHAN", order: 1 },
    { name: "SEMIFINAL", order: 2 },
    { name: "FINAL", order: 3 },
  ] as const

  for (const competition of competitions) {
    for (const stage of stages) {
      await prisma.stage.upsert({
        where: {
          name_competitionId: {
            name: stage.name,
            competitionId: competition.id,
          },
        },
        update: {
          order: stage.order,
        },
        create: {
          name: stage.name,
          order: stage.order,
          competitionId: competition.id,
        },
      })
    }
  }

  console.log("✅ Stage seeded successfully")
}